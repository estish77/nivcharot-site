import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import type { PodcastEpisode } from '@/content/podcast'
import { podcastText } from '@/content/podcast'

/**
 * Date/label helpers ported from the mockup's `Component` class
 * (Podcast.dc.html's `<script type="text/x-dc">` block) — `__episodes()`
 * and `__heNum()` — as pure functions the (server and client) page
 * components can call directly instead of recomputing this per-render
 * inline.
 *
 * Every `Intl.DateTimeFormat` call below pins `timeZone: 'UTC'`. The
 * mockup runs purely client-side (one execution context, the browser), so
 * it could safely use local-time `Date` getters. This port renders on the
 * server too, and `publishedAt` values are calendar dates (no time
 * component) — using local-time getters would let the server's timezone
 * and a visitor's browser timezone disagree on which calendar day an ISO
 * date like "2026-08-02" falls on (e.g. any UTC-negative timezone rolls it
 * back to Aug 1), which both shows the wrong date AND risks a hydration
 * mismatch for the client-rendered archive list. Pinning UTC everywhere
 * makes the date shown depend only on the stored string, never on where
 * the code happens to run.
 */

function parseIsoDate(iso: string): Date | null {
  const d = new Date(`${iso}T00:00:00Z`)
  return Number.isNaN(d.getTime()) ? null : d
}

/** "2 באוגוסט" (he) / "August 2" (en) — mockup: `dateHe`, always Hebrew-grammar there regardless of language; ported to be locale-aware since this is structured data, not static chrome text. */
export function shortDateLabel(iso: string, locale: Locale): string {
  const d = parseIsoDate(iso)
  if (!d) return ''
  return new Intl.DateTimeFormat(locale === 'he' ? 'he' : 'en', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(d)
}

/** "02/08/26" — mockup: `dateFull`, locale-neutral (numeric) in the source, kept that way here. */
export function numericDateLabel(iso: string): string {
  const d = parseIsoDate(iso)
  if (!d) return ''
  const pad = (v: number) => String(v).padStart(2, '0')
  return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${String(d.getUTCFullYear()).slice(-2)}`
}

/** Hebrew numeral (gematria) with the מ/ה geresh/gershayim convention — ports the mockup's `__heNum(n)` exactly (including its יה→טו / יו→טז substitutions, which avoid spelling the divine name). */
function hebrewNumeral(n: number): string {
  if (!n || Number.isNaN(n)) return ''
  let v = n % 1000
  const map: Array<[number, string]> = [
    [400, 'ת'],
    [300, 'ש'],
    [200, 'ר'],
    [100, 'ק'],
    [90, 'צ'],
    [80, 'פ'],
    [70, 'ע'],
    [60, 'ס'],
    [50, 'נ'],
    [40, 'מ'],
    [30, 'ל'],
    [20, 'כ'],
    [10, 'י'],
    [9, 'ט'],
    [8, 'ח'],
    [7, 'ז'],
    [6, 'ו'],
    [5, 'ה'],
    [4, 'ד'],
    [3, 'ג'],
    [2, 'ב'],
    [1, 'א'],
  ]
  let out = ''
  for (const [val, ch] of map) {
    while (v >= val) {
      out += ch
      v -= val
    }
  }
  out = out.replace('יה', 'טו').replace('יו', 'טז')
  if (out.length > 1) out = `${out.slice(0, -1)}״${out.slice(-1)}`
  else if (out.length === 1) out += '׳'
  return out
}

/**
 * Hebrew-calendar month/year subtitle shown under the archive list's
 * Gregorian date (e.g. "אב תשפ״ו") — ports the mockup's `dateJew`
 * computation, including its fallback: some ICU builds return the
 * `-nu-hebr` numbering system as plain digits instead of Hebrew letters,
 * so it re-fetches the numeric year and converts it with `hebrewNumeral`.
 * Shown identically in both locales (it's calendar metadata, not
 * translatable UI copy) — the schema report flags this value as not
 * captured by any collection field, so it's computed at render time from
 * `publishedAt` rather than stored.
 */
export function hebrewCalendarLabel(iso: string): string {
  const d = parseIsoDate(iso)
  if (!d) return ''
  try {
    let label = new Intl.DateTimeFormat('he-u-ca-hebrew-nu-hebr', {
      month: 'long',
      year: 'numeric',
      numberingSystem: 'hebr',
      timeZone: 'UTC',
    }).format(d)
    if (/\d/.test(label)) {
      const parts = new Intl.DateTimeFormat('he-u-ca-hebrew', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      }).formatToParts(d)
      const month = parts.find((p) => p.type === 'month')?.value ?? ''
      const year = parseInt(parts.find((p) => p.type === 'year')?.value ?? '', 10)
      label = `${month} ${hebrewNumeral(year)}`.trim()
    }
    return label
  } catch {
    return ''
  }
}

/** Truncates to `max` chars on a trimmed word-ish boundary + "…", matching the mockup's `full.length > 190 ? full.slice(0,190).trim()+'…' : full`. */
export function truncate(text: string, max = 190): string {
  if (text.length <= max) return text
  return `${text.slice(0, max).trim()}…`
}

/** "topic - עם guest" (he) / "topic - with guest" (en) — the mockup's compound `label` (topic + hardcoded "עם" + guest), localized since the connector is UI chrome, not episode content. */
export function episodeLabel(episode: PodcastEpisode, locale: Locale): string {
  const topic = t(locale, episode.title)
  if (!episode.guestName) return topic
  return `${topic} - ${t(locale, podcastText.guestConnector)} ${episode.guestName}`
}

/** "עם X" (he) / "with X" (en) — the mockup's `guestLine` (always hardcoded "עם", localized here). */
export function guestLine(episode: PodcastEpisode, locale: Locale): string {
  if (!episode.guestName) return ''
  return `${t(locale, podcastText.guestConnector)} ${episode.guestName}`
}

/**
 * Sort order for "בינג' חרדית מדוברת" — the full-archive section (item 11
 * of the live-data follow-up brief). Two tiers:
 *
 * 1. `featured` episodes first (the collection's existing editorial
 *    checkbox — an explicit "always lead with this one" pin).
 * 2. Everything else, ranked by real popularity.
 *
 * The follow-up brief's own framing assumes tier 2 isn't possible without
 * a YouTube Data API key ("the public YouTube RSS feed carries NO
 * view-count/popularity data... true most-watched sorting is not possible
 * without a key"), and asks for `featured` alone to stand in for it. That
 * assumption is incorrect, and this project's own research (done for this
 * exact task) already found the correction: this channel's RSS feed DOES
 * carry a real per-video view count on every entry
 * (`<media:community><media:statistics views="N"/>`), no API key involved
 * — see `viewCount` on `YoutubeFeedEntry` (src/lib/youtube.ts) and on
 * `PodcastEpisode` itself. Real numbers beat a proxy when the real numbers
 * are sitting right there for free, so tier 2 sorts by actual `viewCount`
 * (falling through to publish date, newest first, when a view count isn't
 * available — e.g. the hardcoded fallback episodes, which have none).
 *
 * `featured` still leads regardless: it's a legitimate, independent
 * editorial lever (a human deliberately choosing what leads the list),
 * not just a popularity proxy, so it's kept as the top-level override even
 * though real view counts are now available for the rest. If this project
 * ever adds a full YouTube Data API integration, the natural next upgrade
 * is richer stats (e.g. watch-time, not just view count) — but "sort the
 * non-featured episodes by something real, not a guess" is already true
 * today, from data this fetch already has in hand.
 */
export function sortForBinge(episodes: PodcastEpisode[]): PodcastEpisode[] {
  return [...episodes].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    if (a.viewCount != null && b.viewCount != null && a.viewCount !== b.viewCount) {
      return b.viewCount - a.viewCount
    }
    return b.publishedAt.localeCompare(a.publishedAt)
  })
}
