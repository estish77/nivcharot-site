/**
 * Minimal fetch-and-parse client for the "חרדית מדוברת" (Haredit Meduberet)
 * YouTube channel's public RSS feed. No API key, no new npm dependency —
 * Node has no DOMParser, but the handful of fields the podcast page needs
 * (video id, title, publish date, real video URL, thumbnail, description,
 * view count) sit in a flat, predictable per-`<entry>` shape, so a small
 * set of entry-scoped regexes does the job without pulling in an XML
 * library.
 *
 * Channel id resolution (already done, verified twice — see the project's
 * research report): the channel handle (@חרדיתמדוברת) only resolves via
 * YouTube's JS-rendered SPA, so the stable `UC…` channel id below was read
 * directly out of the channel page's `<link rel="canonical">` AND the
 * embedded JSON `externalId` (both agreed), then confirmed a third time by
 * this feed URL itself returning HTTP 200 with real, dated, Hebrew-titled
 * entries whose <author><name> matches the channel.
 */

export const HAREDIT_MEDUBERET_CHANNEL_ID = 'UCg-wvEot64Dqt113rIYtFfw'

export const HAREDIT_MEDUBERET_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${HAREDIT_MEDUBERET_CHANNEL_ID}`

/**
 * YouTube auto-generates a handful of system playlists per channel by
 * substituting the "UC" channel-id prefix for a different one — no API key
 * needed, same public `/feeds/videos.xml` endpoint as the main channel
 * feed, just `?playlist_id=` instead of `?channel_id=`. Verified live for
 * this channel (2026-08-13, site owner brief item 32 — "בינג'"/Binge must
 * be full episodes only, Shorts need their own separate area): the two
 * playlists below return genuinely disjoint video ids, with the "Short
 * videos" playlist's titles all matching the channel's real Shorts
 * ("מתוך הפרק עם X" clips) and the "Videos" playlist matching full episodes
 * ("אסתי שושן מארחת את X") — so unlike the main channel feed (which mixes
 * both with no way to tell them apart), these two give a reliable way to
 * fetch each kind on its own.
 */
export const HAREDIT_MEDUBERET_LONGFORM_PLAYLIST_ID = 'UULFg-wvEot64Dqt113rIYtFfw'
export const HAREDIT_MEDUBERET_SHORTS_PLAYLIST_ID = 'UUSHg-wvEot64Dqt113rIYtFfw'

const playlistFeedUrl = (playlistId: string) => `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`

/** One parsed `<entry>` from the channel's RSS feed — the real subset of fields the podcast page consumes. */
export type YoutubeFeedEntry = {
  videoId: string
  /** Raw entry title, entities decoded, otherwise untouched (see the "why guestName is left blank" comment in src/content/podcast.ts — this free-text title is shown as-is rather than algorithmically split). */
  title: string
  /** Full ISO 8601 timestamp straight from `<published>`, e.g. "2026-08-09T06:35:55+00:00". */
  publishedAt: string
  /** "YYYY-MM-DD" — the UTC calendar-date prefix of `publishedAt`, matching the no-time-component shape `PodcastEpisode.publishedAt` already uses everywhere else in this codebase. */
  publishedDate: string
  /** Real per-video watch/shorts URL, from the entry's `<link rel="alternate">` — an actual deep link, not a search query. */
  videoUrl: string
  /** `https://i.ytimg.com/vi/<id>/hqdefault.jpg` — confirmed HTTP 200 during research. Re-derived from the video id (rather than read off the feed's load-balanced `i1`-`i4` host prefix) so repeated fetches of the same video always produce the same, cacheable URL. */
  thumbnailUrl: string
  /** `<media:description>`, entities decoded, untouched (may be multi-paragraph and end in linktree-style boilerplate — real content, not reformatted here). */
  description: string
  /**
   * `<media:community><media:statistics views="N"/>`, parsed as a number
   * when present. NOTE: this directly contradicts the "public YouTube RSS
   * has no popularity data, would need a Data API key" assumption in the
   * follow-up brief this file was built for — the research this project
   * already did found real view counts ARE present on every entry, no API
   * key involved. Exposed here for exactly that reason; see
   * `sortForBinge()` in src/components/podcast/podcastUtils.ts for how the
   * archive/"בינג'" section actually uses it.
   */
  viewCount: number | null
}

const NAMED_XML_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
}

function decodeXmlEntities(input: string): string {
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, ent: string) => {
    if (ent[0] === '#') {
      const isHex = ent[1] === 'x' || ent[1] === 'X'
      const code = isHex ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10)
      return Number.isNaN(code) ? match : String.fromCodePoint(code)
    }
    return NAMED_XML_ENTITIES[ent] ?? match
  })
}

/** First `<tag>...</tag>` (non-greedy, allows attributes on the opening tag) found in `block`, entities decoded and trimmed. */
function extractTag(block: string, tag: string): string | null {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = block.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`))
  return match ? decodeXmlEntities(match[1].trim()) : null
}

function parseFeedEntry(block: string): YoutubeFeedEntry | null {
  const videoId = extractTag(block, 'yt:videoId')
  const title = extractTag(block, 'title')
  const publishedAt = extractTag(block, 'published')
  if (!videoId || !title || !publishedAt) return null

  const linkMatch = block.match(/<link\s+rel="alternate"\s+href="([^"]*)"/)
  const videoUrl = linkMatch ? decodeXmlEntities(linkMatch[1]) : `https://www.youtube.com/watch?v=${videoId}`

  const viewsMatch = block.match(/<media:statistics\s+views="(\d+)"/)
  const viewCount = viewsMatch ? parseInt(viewsMatch[1], 10) : null

  return {
    videoId,
    title,
    publishedAt,
    publishedDate: publishedAt.slice(0, 10),
    videoUrl,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    description: extractTag(block, 'media:description') ?? '',
    viewCount,
  }
}

/**
 * Fetches + parses the channel's public RSS feed. Entries come back in the
 * feed's own order, confirmed by prior research to be strictly
 * reverse-chronological (newest first) — this function doesn't re-sort.
 *
 * Never throws: any failure (network error, non-2xx response, empty/
 * unparseable feed) resolves to `[]` instead. This is a deliberate design
 * choice, not an oversight — the only caller (`getPodcastEpisodes()` in
 * src/content/podcast.ts) treats an empty array as "live fetch didn't work,
 * use the hardcoded fallback," so a broken feed can never turn into a
 * broken page.
 */
async function fetchFeed(url: string): Promise<YoutubeFeedEntry[]> {
  try {
    const res = await fetch(url, {
      // No live cron/deployment yet (per the brief) — this revalidate
      // window is the page's only real freshness mechanism until one
      // exists. An hour keeps new uploads showing up promptly without
      // hitting YouTube on every single request.
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []

    const xml = await res.text()
    const entryBlocks = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? []

    const entries: YoutubeFeedEntry[] = []
    for (const block of entryBlocks) {
      const entry = parseFeedEntry(block)
      if (entry) entries.push(entry)
    }
    return entries
  } catch {
    return []
  }
}

/** Never throws — see `fetchFeed`'s own comment; an empty array means "fetch didn't work," not "channel has no videos." */
export async function fetchHareditMeduberetEpisodes(): Promise<YoutubeFeedEntry[]> {
  return fetchFeed(HAREDIT_MEDUBERET_FEED_URL)
}

/** Full episodes only — the channel's auto-generated "Videos" (long-form) playlist, guaranteed not to include Shorts. */
export async function fetchHareditMeduberetLongform(): Promise<YoutubeFeedEntry[]> {
  return fetchFeed(playlistFeedUrl(HAREDIT_MEDUBERET_LONGFORM_PLAYLIST_ID))
}

/** Shorts only — the channel's auto-generated "Short videos" playlist, guaranteed not to include full episodes. */
export async function fetchHareditMeduberetShorts(): Promise<YoutubeFeedEntry[]> {
  return fetchFeed(playlistFeedUrl(HAREDIT_MEDUBERET_SHORTS_PLAYLIST_ID))
}
