import type { Localized } from '@/lib/i18n'
import type { YoutubeFeedEntry } from '@/lib/youtube'
import { fetchHareditMeduberetLongform, fetchHareditMeduberetShorts } from '@/lib/youtube'
import podcastArchive from './podcast-archive.json'

/**
 * Fixture data for /podcast (docs/Podcast.dc.html), shaped to match the
 * `podcast-episodes` Payload collection (src/payload/collections/PodcastEpisodes.ts):
 * `number`, `title` (localized), `guestName`, `description` (localized),
 * `publishedAt`, `appleId`/`spotifyUrl`/`youtubeUrl`/`appleUrl`, `featured`.
 *
 * The mockup fetches the show's episode list live from the iTunes Lookup API
 * on the client and falls back to a hardcoded 6-item array
 * (Podcast.dc.html:476-483) when that fetch fails/hasn't resolved yet. Per
 * the porting brief we never fetch client-side here — this fixture IS that
 * fallback array, kept as the page's only data source until a scheduled
 * server-side sync populates the real collection.
 *
 * `title`/`description` are `Localized<string>` (the Payload fields are
 * `localized: true`) but currently carry the SAME Hebrew text on `he`/`en`:
 * the podcast itself is Hebrew-only content (the English hero copy says so
 * explicitly — "The episodes are in Hebrew"), no English translation has
 * been authored yet, and Payload's localization config
 * (`fallback: true`) would serve the `he` value for an empty `en` field
 * anyway — so duplicating it here reproduces the exact runtime behavior an
 * untranslated field will have once this data lives in Payload.
 * `guestName` is intentionally NOT localized, matching the schema agent's
 * same call for `alumnae-quotes.name` — person names aren't translated.
 *
 * Per-episode `guestName` is stored as its own field (unlike the mockup,
 * which regex-parses it back out of the raw iTunes episode title at
 * runtime — see `__episodes()`/the `gm`/`label` locals in the mockup's
 * script block). Splitting it out here means the page components never
 * need to reimplement that regex; they just compose `title + guestName`.
 *
 * UPDATE (live data): the array below (`podcastEpisodes`) is now used only
 * as the FALLBACK. `getPodcastEpisodes()` at the bottom of this file is the
 * real data source every podcast section should call: it fetches the
 * show's actual YouTube channel over its public RSS feed (see
 * `src/lib/youtube.ts`) and maps real entries into this same
 * `PodcastEpisode` shape, falling back to the hardcoded array below only if
 * that live fetch fails or comes back empty. This keeps the "latest
 * episode" hero, the stories strip, and the archive all reading from one
 * real, current source instead of a hand-edited fixture that silently goes
 * stale.
 */

export type PodcastEpisode = {
  id: string
  /** Sequential episode number, oldest = 1. Not shown in the mockup UI (no visible numbering); inferred for the collection's required/unique field. */
  number: number
  /** Clean episode topic, WITHOUT the mockup's baked-in "- אסתי שושן מארחת את X" guest suffix (see file doc comment). */
  title: Localized<string>
  guestName: string
  description: Localized<string>
  /** ISO calendar date (YYYY-MM-DD), no time component. */
  publishedAt: string
  /** Apple Podcasts SHOW id, shared by every episode (docs/Podcast.dc.html links to podcasts.apple.com/il/podcast/id1767223746). */
  appleId: string
  /** Full per-episode deep link, e.g. `...id1767223746?i=<track id>` — matches the mockup's `e.href`/`e.hrefApple` (identical value there). */
  appleUrl: string
  /** Spotify SEARCH url (the mockup has no per-episode Spotify id from iTunes data, so it links to a search-by-title query — same as `e.hrefSp`). */
  spotifyUrl: string
  /** YouTube channel SEARCH url (same idea as `spotifyUrl` — matches `e.hrefYt`). For live-fetched episodes this is the REAL per-video watch/shorts URL instead (a strict upgrade — see `toLiveEpisode()` below). */
  youtubeUrl: string
  featured: boolean
  /** Real per-video thumbnail (`https://i.ytimg.com/vi/<id>/hqdefault.jpg`), set only on episodes sourced live from YouTube's RSS feed (see `src/lib/youtube.ts`). Undefined on the hardcoded fallback array below — components that render it (StoriesStrip) already fall back to the shared `ImageSlot` placeholder when it's absent. */
  thumbnailUrl?: string
  /** Real per-video view count from the RSS feed's `<media:statistics views="N">`, set only on live-fetched episodes. Undefined on the fallback array. Used by `sortForBinge()` (src/components/podcast/podcastUtils.ts) to rank the archive/"בינג'" list. */
  viewCount?: number
}

export const PODCAST_APPLE_SHOW_ID = '1767223746'

/**
 * Spotify SHOW id used consistently by every Spotify link that actually
 * lives inside Podcast.dc.html — the hero "ספוטיפיי/Spotify" button, the
 * embedded player iframe (both locales), and the platform-links row under
 * the player. Verified by grepping the whole mockup file: every instance
 * uses this exact id, there is no discrepancy WITHIN this page.
 *
 * The brief for this assignment describes a real bug where the iframe and
 * the footer link show different ids (7HwVj9J7rnUFqoiUDtc1oL vs
 * 1n2xdgVAKlIhcJqBiVfHFY) — that mismatch is real, but it lives between
 * THIS page's iframe/on-page links (all 7HwVj9J7rnUFqoiUDtc1oL) and the
 * shared `Footer` component another agent already built
 * (src/components/ui/Footer.tsx, "Haredit Meduberet" social row), which
 * uses 1n2xdgVAKlIhcJqBiVfHFY. Full explanation in the page-agent report.
 */
export const PODCAST_SPOTIFY_SHOW_ID = '7HwVj9J7rnUFqoiUDtc1oL'

/**
 * Already percent-encoded in the mockup itself (`@` + the UTF-8 bytes of
 * "חרדיתמדוברת" escaped) — copied verbatim rather than re-derived through
 * `encodeURIComponent`, which would also escape the leading `@` into
 * `%40` and break the channel-handle path segment.
 */
export const PODCAST_YOUTUBE_CHANNEL_URL =
  'https://www.youtube.com/@%D7%97%D7%A8%D7%93%D7%99%D7%AA%D7%9E%D7%93%D7%95%D7%91%D7%A8%D7%AA'

const APPLE_SHOW_URL = `https://podcasts.apple.com/il/podcast/id${PODCAST_APPLE_SHOW_ID}`
const APPLE_URL = (trackId: string) => `${APPLE_SHOW_URL}?i=${trackId}`
const SPOTIFY_SEARCH_URL = (label: string) => `https://open.spotify.com/search/${encodeURIComponent(label)}/episodes`
const YOUTUBE_SEARCH_URL = (label: string) => `${PODCAST_YOUTUBE_CHANNEL_URL}/search?query=${encodeURIComponent(label)}`

type RawEpisode = {
  id: string
  publishedAt: string
  title: string
  guestName: string
  description: string
}

/**
 * The mockup's FALLBACK array (Podcast.dc.html:476-483) with the guest name
 * already split out of the raw title (see file doc comment) — this is the
 * exact same 6 episodes, same ids/dates/copy, just pre-parsed.
 */
const RAW_EPISODES: RawEpisode[] = [
  {
    id: '1000779519370',
    publishedAt: '2026-08-02',
    title: 'אבא מסתכל מלמעלה ותמיד אוהב אותי',
    guestName: 'אופיר טובול',
    description:
      '"אבא מסתכל מלמעלה" הייתה סיסמת הבחירות של ש"ס, "השם יתברך תמיד אוהב אותי" הפך להמנון המלחמה. שיחה עם אופיר טובול, חוקר תרבות ומוזיקה, משפטן וראש בית כולנא, על המאבק על הקול המסורתי־מזרחי לקראת הבחירות.',
  },
  {
    id: '1000778389982',
    publishedAt: '2026-07-26',
    title: 'בסביבה שלי לא רוצים לדעת מה אני עושה',
    guestName: 'ציפי הורביץ',
    description:
      'ציפי הורביץ, אישה חרדית שעובדת באגף השיקום של משרד הביטחון ומלווה פצועי מלחמה, על מה זה להביט יום יום בעיניים של מי שחירף נפשו, ולחזור הביתה אל קהילה שמעדיפה לא לדעת.',
  },
  {
    id: '1000777411417',
    publishedAt: '2026-07-19',
    title: 'משחקי הכס באוליגרכיה החרדית',
    guestName: 'אלי ביתאן',
    description:
      'בפרק מסדרת "חרדית מדוברת בוחרת": הפרשן והעיתונאי אלי ביתאן על מגמות הבחירות ברחוב החרדי, הקרע בש"ס, השיתוק המנהיגותי הליטאי והחסידים שתופסים עצמאות מול המדינה.',
  },
  {
    id: '1000776445006',
    publishedAt: '2026-07-12',
    title: 'עזרת נשים באקדמיה',
    guestName: 'מלכי רוטנר',
    description:
      'על הצעת החוק שתרחיב את הלימודים בהפרדה באקדמיה גם לתארים מתקדמים. אסתי שושן ומלכי רוטנר לוקחות בחזרה דיון שתמיד נעשה מעל הראש של הנשים החרדיות.',
  },
  {
    id: '1000775503560',
    publishedAt: '2026-07-05',
    title: 'מאמינים במחלוקת',
    guestName: 'הרב ספי גלדצהלר',
    description:
      'מה מפריד בין החרדים לציונות הדתית, ומאיפה באים הרעיונות המשיחיים שמעצבים את שניהם. שיחה עם הרב ספי גלדצהלר, ראש בית המדרש "הרוח הגדולה".',
  },
  {
    id: '1000774532131',
    publishedAt: '2026-06-28',
    title: 'מסלול עוקף בית יעקב',
    guestName: 'יהודית יפרח',
    description:
      'יהודית יפרח לא למדה בבית יעקב וגם לא בעלת תשובה. שיחה על זהות, תרבות ואהבה שמנצחת, על מסע החיים שלה בתוך החברה החרדית ועל השאלות שבאו עם המלחמה.',
  },
]

function toEpisode(raw: RawEpisode, number: number): PodcastEpisode {
  // The mockup's compound label ("topic - עם guest"), used only to build
  // the search-query urls below — those are locale-invariant (Hebrew
  // search terms regardless of UI language), matching the mockup's own
  // `__episodes()`, which computes `label`/the href fields once, before
  // any language branching.
  const searchLabel = `${raw.title} - עם ${raw.guestName}`

  return {
    id: raw.id,
    number,
    title: { he: raw.title, en: raw.title },
    guestName: raw.guestName,
    description: { he: raw.description, en: raw.description },
    publishedAt: raw.publishedAt,
    appleId: PODCAST_APPLE_SHOW_ID,
    appleUrl: APPLE_URL(raw.id),
    spotifyUrl: SPOTIFY_SEARCH_URL(searchLabel),
    youtubeUrl: YOUTUBE_SEARCH_URL(searchLabel),
    featured: false,
  }
}

/** Newest-first (matches the mockup's raw `eps`/FALLBACK order and the collection's admin default sort). */
export const podcastEpisodes: PodcastEpisode[] = RAW_EPISODES.map((raw, i) =>
  toEpisode(raw, RAW_EPISODES.length - i),
)

/**
 * Maps one real, live-fetched YouTube RSS entry into the same
 * `PodcastEpisode` shape `toEpisode()` produces for the hardcoded fixture,
 * so every existing component can render either with zero changes.
 *
 * `guestName` is deliberately left `''` here, NOT regex-extracted from the
 * real title. The fallback fixture above can safely split "topic - עם
 * guest" back apart because every one of its 6 titles was hand-authored to
 * that exact pattern. Real channel titles aren't that uniform (some read
 * "... | אסתי שושן מארחת את X", others "... מתוך הפרק עם X ...", others
 * embed the name mid-sentence with trailing clauses after it) — a regex
 * confident enough to strip a real person's name back out of free text
 * without ever mis-cutting it isn't something to guess at. `episodeLabel()`
 * / `guestLine()` (src/components/podcast/podcastUtils.ts) already degrade
 * cleanly to showing the (real, complete, untouched) title alone when
 * `guestName` is empty, so nothing breaks — it just means live episodes
 * show their real title as one line instead of a separately styled guest
 * name.
 *
 * `appleUrl`/`spotifyUrl` also have no real per-episode id available from a
 * YouTube-only feed: `appleUrl` points at the real show page (there is no
 * honest per-episode substitute without a fabricated track id), and
 * `spotifyUrl` reuses the same real, working Spotify search-by-title URL
 * the fixture above already uses. `youtubeUrl`, by contrast, IS a real,
 * exact per-video link straight from the feed — a strict upgrade over the
 * fixture's YouTube search-url fallback.
 *
 * `description` uses `firstParagraph()` (below), not the raw
 * `<media:description>` verbatim: real YouTube descriptions on this
 * channel are multi-paragraph and end in a repeated block of social-link
 * boilerplate ("ערוץ יוטיוב / https://bit.ly/…", etc. — see the sample in
 * src/lib/youtube.ts's doc comment). `PodcastHeroSection`/`EpisodeDesk`
 * render this field in full, with no length cap, so passing the raw text
 * through would dump that entire link list into the page. Taking just the
 * first paragraph is the same "real lead, not a summary we invented" move
 * `ArchiveHighlightsSection` already makes for magazine posts (see its own
 * doc comment) — still the channel's real words, just not the trailing
 * boilerplate every entry repeats.
 */
function firstParagraph(text: string): string {
  const [lead] = text.split(/\n\s*\n/)
  return (lead ?? text).trim()
}

function toLiveEpisode(entry: YoutubeFeedEntry, number: number): PodcastEpisode {
  const description = firstParagraph(entry.description)
  return {
    id: `yt-${entry.videoId}`,
    number,
    title: { he: entry.title, en: entry.title },
    guestName: '',
    description: { he: description, en: description },
    publishedAt: entry.publishedDate,
    appleId: PODCAST_APPLE_SHOW_ID,
    appleUrl: APPLE_SHOW_URL,
    spotifyUrl: SPOTIFY_SEARCH_URL(entry.title),
    youtubeUrl: entry.videoUrl,
    featured: false,
    thumbnailUrl: entry.thumbnailUrl,
    viewCount: entry.viewCount ?? undefined,
  }
}

/**
 * The podcast page's real data source (item 9/10 of the live-data
 * follow-up brief) — every section (stories strip, latest-episode hero,
 * the episode desk) should call this instead of importing
 * `podcastEpisodes` directly, so they all read the exact same, current,
 * newest-first list. Falls back to the hardcoded `podcastEpisodes` fixture
 * whenever the live fetch fails or returns nothing; never throws.
 *
 * This is also what keeps the "latest episode" hero
 * (`PodcastHeroSection`, `episodes[0]`) honest against the Spotify
 * embed next to it: that iframe embeds the whole SHOW
 * (`open.spotify.com/embed/show/<id>`), not a single pinned episode — there
 * is no real per-episode Spotify id in this data to point it at instead —
 * so Spotify itself decides what plays at the top of that embed, always
 * whatever the show's actual newest episode is. The only way our hero TEXT
 * can't silently disagree with that is if it also always reflects the true
 * newest episode, rather than a hand-maintained fixture that goes stale
 * the moment a new episode ships. Fetching live here is the fix.
 */
export async function getPodcastEpisodes(): Promise<PodcastEpisode[]> {
  /*
   * Two sources, merged (2026-08-27 brief: "a lot of full episodes are
   * missing, bring the whole YouTube channel"):
   *
   *   1. `podcast-archive.json` — the FULL back catalogue, ~100 episodes,
   *      produced offline by `npm run sync-podcast-archive`. YouTube's
   *      public RSS feeds are hard capped at 15 entries, which is exactly
   *      why the page used to show only the newest sixth of the show. The
   *      walk that produces this file cannot run in a render: it costs ~105
   *      requests, which is 4s in plain Node but 61 minutes inside Next,
   *      whose data cache buffers every response (see
   *      src/lib/youtubeChannel.ts).
   *   2. The long-form RSS playlist, live — the newest 15. This is what
   *      keeps a freshly published episode on the page without anyone
   *      re-running the sync, and its entries win on conflict since they
   *      carry the more current view counts.
   *
   * Both sources are long-form only, so no Short can leak into the archive,
   * the card grid or the latest-episode hero (2026-08-13 brief, item 32).
   * The hardcoded fixture below remains the last resort.
   */
  const archiveEntries = podcastArchive.episodes as YoutubeFeedEntry[]
  const liveEntries = await fetchHareditMeduberetLongform()

  const byVideoId = new Map<string, YoutubeFeedEntry>()
  for (const entry of archiveEntries) byVideoId.set(entry.videoId, entry)
  for (const entry of liveEntries) byVideoId.set(entry.videoId, entry)

  const merged = [...byVideoId.values()]
  if (merged.length === 0) return podcastEpisodes

  // Compared as real instants, not as strings: these timestamps carry
  // timezone offsets ("2026-08-23T03:07:35-07:00"), and comparing those
  // lexicographically can order two uploads wrongly. The hero shows
  // episodes[0], so this is what decides which episode is "the latest".
  const newestFirst = merged.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
  return newestFirst.map((entry, i) => toLiveEpisode(entry, newestFirst.length - i))
}

export type PodcastShort = {
  id: string
  videoId: string
  title: string
  /** First paragraph of the Short's own description, real text from the channel (see `firstParagraph()`). */
  summary: string
  publishedAt: string
  thumbnailUrl: string
  videoUrl: string
  /** Real view count from YouTube, used to rank the most-watched feed. */
  viewCount?: number
}

/**
 * Real Shorts only, from the channel's auto-generated Shorts playlist (see
 * `fetchHareditMeduberetShorts()`'s own comment for how that's verified
 * reliable) — the dedicated Shorts area the site owner asked for
 * (2026-08-13 brief, item 32), separate from the full-episode Binge list.
 * No hardcoded fallback array exists for Shorts (unlike `podcastEpisodes`)
 * — there's no mockup data to fall back to for content that didn't exist
 * when this project's mockups were authored, so this simply returns `[]`
 * if the live fetch fails, and callers should treat an empty list as
 * "nothing to show" rather than an error.
 */
export async function getPodcastShorts(): Promise<PodcastShort[]> {
  /*
   * Same two-source merge as `getPodcastEpisodes()`, for the same reason.
   * The stories strip used to read the Shorts RSS feed and nothing else,
   * and that feed is the endpoint YouTube rate-limits hardest: once it
   * starts answering 404 the strip renders empty with nothing behind it.
   * `podcast-archive.json` now carries the full Shorts catalogue (synced by
   * `npm run sync-podcast-archive`), with the live feed layered on top so a
   * newly published Short still appears on its own.
   */
  const archived = (podcastArchive.shorts ?? []) as YoutubeFeedEntry[]
  const live = await fetchHareditMeduberetShorts()

  const byVideoId = new Map<string, YoutubeFeedEntry>()
  for (const entry of archived) byVideoId.set(entry.videoId, entry)
  for (const entry of live) byVideoId.set(entry.videoId, entry)

  const newestFirst = [...byVideoId.values()].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
  return newestFirst.map((entry) => ({
    id: `yt-short-${entry.videoId}`,
    videoId: entry.videoId,
    title: entry.title,
    summary: firstParagraph(entry.description),
    publishedAt: entry.publishedDate,
    thumbnailUrl: entry.thumbnailUrl,
    videoUrl: entry.videoUrl,
    viewCount: entry.viewCount ?? undefined,
  }))
}

/**
 * "מהארכיון · מגזין ווידאו" / "From the archive · magazine and video" strip.
 * The mockup pulls this live from `window.NIV_POSTS` (loaded by an external
 * `posts-data.js`, not present in this repo) filtered to the "כתבות וידאו"/
 * "מהמגזין שלנו" categories. That data isn't available here — the real
 * `posts` fixtures belong to the media/archive page agent
 * (`src/content/media.ts`'s `archivePosts`), which this page now reads
 * directly (the 4 most recent posts) rather than duplicating or inventing
 * placeholder content. `archivePosts`' own category taxonomy (press/
 * media-release/blog/newsletter/activity — see `archiveCategories` there)
 * doesn't include a "כתבות וידאו"/"מהמגזין שלנו" pair to filter by, so this
 * is "4 most recent" rather than a literal category-filtered match; see
 * `ArchiveHighlightsSection.tsx` and the final report for the full note.
 */

/**
 * Page-specific UI chrome (headings/eyebrows/labels) — not editorial
 * content, ships with the code, same `Localized<string>` shape as
 * `src/lib/i18n.ts`'s `dict`. Kept local to this page rather than added to
 * the shared `dict` since none of it is reused elsewhere.
 */
export const podcastText = {
  storiesEyebrow: { he: 'אורחות ואורחים · הפרקים האחרונים', en: 'GUESTS · LATEST SHORTS' } satisfies Localized,
  allShorts: { he: 'לכל השורטס', en: 'All shorts' } satisfies Localized,
  allShortsHref: `${PODCAST_YOUTUBE_CHANNEL_URL}/shorts`,
  shortPlaceholder: { he: 'שורט', en: 'Short' } satisfies Localized,

  heroEyebrow: { he: 'הפודקאסט של נבחרות', en: 'THE NIVCHAROT PODCAST' } satisfies Localized,
  heroTitle: { he: 'חרדית מדוברת', en: 'Haredit Meduberet' } satisfies Localized,
  heroLead: {
    he: 'אסתי שושן בשיחות בגובה העיניים, בלי צנזורה, על העולם החרדי, על דת ומדינה, קונפליקטים והזדמנויות, עם מיטב אנשי ונשות רוח, אקטיביזם, תקשורת, משפט, הגות ותרבות מהעולם החרדי ובממשק אליו.',
    en: 'Esty Shushan in candid, uncensored conversations about the Haredi world, religion and state, conflicts and opportunities, with leading thinkers, activists, journalists, jurists and artists from Haredi society and its edges. The episodes are in Hebrew.',
  } satisfies Localized,
  heroCoverLabel: { he: 'עטיפת הפודקאסט / אסתי באולפן', en: 'Podcast cover / Esty in the studio' } satisfies Localized,
  ctaYoutube: { he: 'יוטיוב', en: 'YouTube' } satisfies Localized,
  ctaSpotify: { he: 'ספוטיפיי', en: 'Spotify' } satisfies Localized,
  ctaApple: { he: 'אפל פודקאסטס', en: 'Apple Podcasts' } satisfies Localized,
  youtubeShowUrl: PODCAST_YOUTUBE_CHANNEL_URL,
  spotifyShowUrl: `https://open.spotify.com/show/${PODCAST_SPOTIFY_SHOW_ID}`,
  appleShowUrl: APPLE_SHOW_URL,

  recentEyebrow: { he: 'ואל תשכחו לשים עוקב', en: 'AND DO FOLLOW US' } satisfies Localized,
  recentTitle: { he: 'חרדית מדוברת - מה קורה לאחרונה?', en: 'Haredit Meduberet, recently' } satisfies Localized,
  listen: { he: 'להאזנה', en: 'Listen' } satisfies Localized,

  latestEyebrow: { he: 'הפרק האחרון שעלה השבוע', en: 'THIS WEEK’S EPISODE' } satisfies Localized,
  playerTitle: { he: 'חרדית מדוברת, נגן ספוטיפיי', en: 'Haredit Meduberet, Spotify player' } satisfies Localized,
  instagramHostUrl: 'https://www.instagram.com/esty_shushan/',
  facebookHostUrl: 'https://www.facebook.com/profile.php?id=61565500745331',
  xHostUrl: 'https://x.com/estyshushan',
  tiktokHostUrl: 'https://www.tiktok.com/@estybittonshushan',

  archiveEyebrow: { he: 'כל הפרקים', en: 'ALL EPISODES' } satisfies Localized,
  /**
   * Renamed per the live-data follow-up brief (item 11): was "הארכיון" /
   * "The archive". `en` follows the same transliteration convention
   * `heroTitle` already uses for the show's own name ("Haredit Meduberet",
   * not a translation) rather than translating "בינג'" too literally.
   */
  archiveTitle: { he: "בינג' חרדית מדוברת", en: 'Binge Haredit Meduberet' } satisfies Localized,

  magazineTitle: { he: 'מהארכיון · מגזין ווידאו', en: 'From the archive · magazine and video' } satisfies Localized,
  fullArchive: { he: 'לארכיון המלא', en: 'Full archive' } satisfies Localized,

  guestConnector: { he: 'עם', en: 'with' } satisfies Localized,
  pageLabel: { he: 'עמוד', en: 'Page' } satisfies Localized,
  ofLabel: { he: 'מתוך', en: 'of' } satisfies Localized,
} as const
