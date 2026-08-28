import type { ElsewhereMediaItem } from './elsewhere-media'
import channel from './nivcharot-channel.json'

/**
 * Video coverage from Nivcharot's OWN media channel
 * (youtube.com/@מדיהנבחרות) — TV and radio interviews, Knesset committee
 * appearances, panels, and campaign pieces, ~104 of them.
 *
 * 2026-08-28 brief. The data is generated, not curated: `npm run
 * sync-nivcharot-channel` walks the channel and writes
 * `nivcharot-channel.json`, and this module only reshapes it into the same
 * `ElsewhereMediaItem` the hand-written fixtures use, so the media desk can
 * treat all video coverage identically.
 *
 * Titles and summaries are the channel's own text, untouched — they already
 * name the interviewee or speaker, which is exactly what the brief asked
 * for. The 18 videos the channel never gave a description get an empty
 * summary rather than an invented one; the desk simply shows their title
 * and date.
 *
 * Hebrew-only source material, rendered as-is under both locales — the same
 * convention `src/content/media.ts`'s archive posts already follow. The
 * `sourceLanguage: 'he'` marking means an English visitor sees the
 * "originally in Hebrew" badge rather than a silently untranslated string.
 */

type RawChannelItem = {
  slug: string
  kind: string
  videoId: string
  title: string
  summary: string
  /** Knesset items only, and only where the channel's own description named the person in full. */
  speaker?: string
  publishedDate: string
  url: string
  thumbnailUrl: string
}

const HE_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
]
const EN_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/** "2020-02-19" → { he: "19.2.2020", en: "Feb 19, 2020" }. */
function dateLabel(iso: string): { he: string; en: string } {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return { he: iso, en: iso }
  return {
    he: `${d}.${m}.${y}`,
    en: `${EN_MONTHS[m - 1]} ${d}, ${y}`,
  }
}

/** Kept for the Hebrew month names, which read better than a numeric date in prose. */
export function hebrewMonthName(month: number): string {
  return HE_MONTHS[month - 1] ?? ''
}

function isKind(value: string): value is ElsewhereMediaItem['kind'] {
  return value === 'podcast' || value === 'video' || value === 'talk' || value === 'knesset'
}

export const nivcharotChannelItems: ElsewhereMediaItem[] = (channel.items as RawChannelItem[]).map((item) => {
  const label = dateLabel(item.publishedDate)
  /*
   * 2026-08-28 brief: "include the surnames of the activists speaking" on
   * the Knesset videos. Several of those are titled with the topic alone
   * ("הציבור צריך שירות רווחה טוב יותר") while the description underneath
   * names the woman in full, so the name is put in front of the title here.
   * The channel's own wording is never edited - the two are just joined -
   * and the prefix is skipped when the title already names her, so
   * "ציפי לביא פעילת נבחרות…" doesn't become "ציפי לביא · ציפי לביא…".
   */
  const title = item.speaker && !item.title.includes(item.speaker) ? `${item.speaker} · ${item.title}` : item.title
  return {
    slug: item.slug,
    kind: isKind(item.kind) ? item.kind : 'video',
    title: { he: title, en: title },
    summary: { he: item.summary, en: item.summary },
    host: 'מדיה נבחרות',
    dateLabel: label,
    sortDate: item.publishedDate,
    sourceLanguage: 'he',
    url: item.url,
  }
})
