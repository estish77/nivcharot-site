import type { YoutubeFeedEntry } from './youtube'
import { HAREDIT_MEDUBERET_CHANNEL_ID } from './youtube'

/**
 * The channel's COMPLETE long-form catalogue, without an API key.
 *
 * 2026-08-27 brief: "a lot of full episodes are missing, bring the whole
 * YouTube channel." They were missing for a structural reason, not a bug —
 * `src/lib/youtube.ts` reads YouTube's public RSS feeds, and those are hard
 * capped at the 15 most recent entries per feed. The channel actually has
 * ~100 long-form videos, so the site was showing roughly the newest sixth
 * of the show and nothing older.
 *
 * There is no keyless RSS endpoint that returns more, so this reads the
 * same data the channel's own /videos page renders from:
 *
 *   1. GET the /videos tab and pull `ytInitialData` out of the HTML, along
 *      with the page's own InnerTube API key and client version.
 *   2. Collect the video ids on that first page (30 of them) plus the
 *      continuation token, then POST that token to `youtubei/v1/browse`
 *      repeatedly for the rest. This is the very same request the page
 *      makes as you scroll, with the same public credentials.
 *   3. Ask `youtubei/v1/player` for each id's real metadata — exact publish
 *      timestamp, full description, view count, duration. The listing pages
 *      only carry relative dates ("a year ago"), which are useless for the
 *      exact per-episode dates the archive prints.
 *
 * Step 3 is one request per video, run through a concurrency pool: measured
 * end to end at ~3.7s for this channel's 104 videos.
 *
 * THIS RUNS OFFLINE, from `scripts/sync-podcast-archive.mjs`, never inside a
 * render. That is not a stylistic choice. The walk takes ~3.7s in plain
 * Node, but the same code inside a Next request took 61 MINUTES for one
 * render: Next patches `fetch` and buffers every response for its data
 * cache, and these are ~105 megabyte-sized JSON payloads. `cache:
 * 'no-store'` did not avoid it either. Pages read the JSON this produces,
 * so a page render costs no network at all, and neither YouTube throttling
 * nor a layout change upstream can ever slow down or break the site.
 *
 * Every step is best-effort: any failure at any point resolves to `[]`, and
 * `getPodcastEpisodes()` then falls back to the RSS feed and finally to the
 * hardcoded fixture, exactly as before. Scraped endpoints do change shape,
 * so this must never be the only thing standing between the page and its
 * content.
 */

const CHANNEL_TAB_URL = (tab: 'videos' | 'shorts') =>
  `https://www.youtube.com/channel/${HAREDIT_MEDUBERET_CHANNEL_ID}/${tab}`

/** Matches the browser's own headers closely enough that YouTube serves the full, non-consent-walled page. */
const BROWSER_HEADERS: Record<string, string> = {
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'accept-language': 'he-IL,he;q=0.9,en;q=0.8',
  // Pre-accepted consent cookies; without them YouTube serves an interstitial
  // in some regions instead of the channel page.
  cookie: 'CONSENT=YES+cb; SOCS=CAI',
}

/** Runaway guards — this pages an external service in a loop. */
const MAX_PAGES = 30
const MAX_VIDEOS = 500
/** Concurrent `player` lookups. Enough to finish ~100 videos in seconds, low enough to stay polite. */
const METADATA_CONCURRENCY = 8
/**
 * The /videos tab already excludes Shorts (they have their own tab), so this
 * is only a backstop against YouTube reclassifying something: nothing under
 * a minute and a half is a full episode of this show.
 */
const MIN_EPISODE_SECONDS = 90

type Innertube = { apiKey: string; clientVersion: string }

function extractInitialData(html: string): { data: unknown; innertube: Innertube } | null {
  const dataMatch = html.match(/var ytInitialData = (\{[\s\S]+?\});<\/script>/)
  const keyMatch = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)
  const versionMatch = html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)
  if (!dataMatch || !keyMatch || !versionMatch) return null
  try {
    return {
      data: JSON.parse(dataMatch[1]),
      innertube: { apiKey: keyMatch[1], clientVersion: versionMatch[1] },
    }
  } catch {
    return null
  }
}

/**
 * Walks an InnerTube response for video ids and the next continuation token.
 *
 * Iterative rather than recursive: these payloads are megabytes of deeply
 * nested JSON, and a naive recursive walk risks blowing the stack. Video
 * Three shapes are read: `lockupViewModel` (the /videos tab today),
 * `shortsLockupViewModel` (the /shorts tab, which carries its id in
 * `entityId` instead), and the older `videoRenderer` — so neither tab nor a
 * layout rollback empties the walk.
 */
function collectVideoIds(root: unknown, into: Set<string>): string | null {
  let continuation: string | null = null
  const stack: unknown[] = [root]

  while (stack.length > 0) {
    const node = stack.pop()
    if (!node || typeof node !== 'object') continue
    const record = node as Record<string, unknown>

    const lockup = record.lockupViewModel as { contentId?: unknown } | undefined
    if (lockup && typeof lockup.contentId === 'string') into.add(lockup.contentId)

    const legacy = record.videoRenderer as { videoId?: unknown } | undefined
    if (legacy && typeof legacy.videoId === 'string') into.add(legacy.videoId)

    // The /shorts tab uses its own lockup, which carries no `contentId`;
    // the id is embedded in `entityId` as "shorts-shelf-item-<videoId>".
    const shortsLockup = record.shortsLockupViewModel as { entityId?: unknown } | undefined
    if (shortsLockup && typeof shortsLockup.entityId === 'string') {
      const id = shortsLockup.entityId.replace(/^shorts-shelf-item-/, '')
      if (id && id !== shortsLockup.entityId) into.add(id)
    }

    const cont = record.continuationItemRenderer as
      | { continuationEndpoint?: { continuationCommand?: { token?: unknown } } }
      | undefined
    const token = cont?.continuationEndpoint?.continuationCommand?.token
    if (typeof token === 'string') continuation = token

    for (const value of Array.isArray(node) ? node : Object.values(record)) {
      if (value && typeof value === 'object') stack.push(value)
    }
  }

  return continuation
}

async function innertubePost(
  endpoint: 'browse' | 'player',
  innertube: Innertube,
  body: Record<string, unknown>,
): Promise<unknown | null> {
  const res = await fetch(
    `https://www.youtube.com/youtubei/v1/${endpoint}?key=${innertube.apiKey}&prettyPrint=false`,
    {
      method: 'POST',
      headers: { ...BROWSER_HEADERS, 'content-type': 'application/json' },
      body: JSON.stringify({
        context: { client: { clientName: 'WEB', clientVersion: innertube.clientVersion, hl: 'he', gl: 'IL' } },
        ...body,
      }),
      // See this module's header: Next's data cache must not touch these.
      cache: 'no-store',
    },
  )
  if (!res.ok) return null
  return res.json()
}

type VideoMetadata = {
  title: string
  publishedAt: string
  description: string
  viewCount: number | null
  lengthSeconds: number
}

function readMetadata(payload: unknown): VideoMetadata | null {
  if (!payload || typeof payload !== 'object') return null
  const root = payload as Record<string, unknown>
  const details = root.videoDetails as Record<string, unknown> | undefined
  const micro = (root.microformat as Record<string, unknown> | undefined)?.playerMicroformatRenderer as
    | Record<string, unknown>
    | undefined
  if (!details || !micro) return null

  const title = typeof details.title === 'string' ? details.title : ''
  const publishedAt = typeof micro.publishDate === 'string' ? micro.publishDate : ''
  if (!title || !publishedAt) return null

  const views = Number(details.viewCount)
  const length = Number(details.lengthSeconds)

  return {
    title,
    publishedAt,
    description: typeof details.shortDescription === 'string' ? details.shortDescription : '',
    viewCount: Number.isFinite(views) ? views : null,
    lengthSeconds: Number.isFinite(length) ? length : 0,
  }
}

/** Runs `worker` over `items` with a fixed number of workers in flight. */
async function mapPool<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let cursor = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const index = cursor++
      if (index >= items.length) return
      results[index] = await worker(items[index])
    }
  })
  await Promise.all(runners)
  return results
}

/**
 * Walks one channel tab and returns its videos, newest first.
 *
 * `minSeconds` separates the two catalogues: the /videos tab already
 * excludes Shorts and vice versa, so this is only a backstop against
 * YouTube reclassifying something.
 */
async function walkTab(tab: 'videos' | 'shorts', minSeconds: number): Promise<YoutubeFeedEntry[]> {
  try {
    const res = await fetch(CHANNEL_TAB_URL(tab), { headers: BROWSER_HEADERS, cache: 'no-store' })
    if (!res.ok) return []

    const extracted = extractInitialData(await res.text())
    if (!extracted) return []
    const { innertube } = extracted

    const ids = new Set<string>()
    let token = collectVideoIds(extracted.data, ids)

    for (let page = 1; token && page < MAX_PAGES && ids.size < MAX_VIDEOS; page++) {
      const before = ids.size
      const payload = await innertubePost('browse', innertube, { continuation: token })
      if (!payload) break
      token = collectVideoIds(payload, ids)
      // A continuation that adds nothing means the list is exhausted (or the
      // shape changed) — either way, stop rather than loop on the same token.
      if (ids.size === before) break
    }

    if (ids.size === 0) return []

    const entries = await mapPool<string, YoutubeFeedEntry | null>(
      [...ids].slice(0, MAX_VIDEOS),
      METADATA_CONCURRENCY,
      async (videoId) => {
        try {
          const meta = readMetadata(await innertubePost('player', innertube, { videoId }))
          if (!meta || meta.lengthSeconds < minSeconds) return null
          return {
            videoId,
            title: meta.title,
            publishedAt: meta.publishedAt,
            publishedDate: meta.publishedAt.slice(0, 10),
            videoUrl:
            tab === 'shorts'
              ? `https://www.youtube.com/shorts/${videoId}`
              : `https://www.youtube.com/watch?v=${videoId}`,
            thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            description: meta.description,
            viewCount: meta.viewCount,
          }
        } catch {
          return null
        }
      },
    )

    return entries
      .filter((entry): entry is YoutubeFeedEntry => entry !== null)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  } catch {
    return []
  }
}

/**
 * Every long-form episode on the channel, newest first. `[]` on any failure —
 * see this module's header for why that matters.
 */
export function fetchHareditMeduberetChannelVideos(): Promise<YoutubeFeedEntry[]> {
  return walkTab('videos', MIN_EPISODE_SECONDS)
}

/**
 * Every Short on the channel, newest first.
 *
 * The stories strip used to depend solely on the Shorts RSS feed, which is
 * the one endpoint YouTube rate-limits hardest: once it starts answering
 * 404 the strip renders empty, with nothing else to fall back on. Syncing
 * Shorts to the same archive file the episodes use removes that single
 * point of failure; the live feed still layers on top for freshness.
 *
 * No duration floor — a Short is short by definition.
 */
export function fetchHareditMeduberetChannelShorts(): Promise<YoutubeFeedEntry[]> {
  return walkTab('shorts', 0)
}
