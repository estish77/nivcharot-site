import type { PodcastShort } from '@/content/podcast'
import { localizedName } from '@/content/hebrewNames'
import { t, type Locale } from '@/lib/i18n'

/**
 * Best-effort guest-name extraction from the Short's freeform YouTube
 * title. Real titles from the channel follow several different shapes —
 * sampled 25 real Shorts titles while building this: about 10 match
 * "…מתוך הפרק (החדש) עם NAME[, more text]", 2 match the pipe-delimited
 * "חרדית מדוברת | NAME | … | SHORT" format, and the rest embed the name as
 * a plain sentence subject with no consistent marker at all (e.g. "יהודית
 * יפרח מספרת איך…") — those can't be told apart from ordinary prose by
 * regex without real risk of mis-cutting a person's name, so this only
 * extracts the two patterns confirmed reliable and returns `null`
 * otherwise, leaving the caller to fall back to the title itself.
 */
function guestNameFrom(title: string): string | null {
  const pipeParts = title
    .split('|')
    .map((p) => p.trim())
    .filter(Boolean)
  if (pipeParts.length >= 2 && /^short$/i.test(pipeParts[pipeParts.length - 1])) {
    return pipeParts[1] || null
  }

  // Stops at a comma, a period, " על " ("about" — several titles run
  // straight from the name into "X על TOPIC" with no punctuation between
  // them), or the end of the string.
  const match = title.match(/מתוך הפרק(?: החדש)? עם ([^.,]+?)(?:,|\.|\s+על\s|$)/)
  return match ? match[1].trim() : null
}

export function captionFor(short: PodcastShort, locale: Locale = 'he'): string {
  // Guest-name extraction only ever runs against the raw Hebrew title
  // (the regexes in guestNameFrom are Hebrew-specific) — never the
  // localized value.
  const guestName = guestNameFrom(short.title.he)
  // Transliterated for English: the caption is cut out of a Hebrew YouTube
  // title, so without this the English page printed Hebrew names. A name
  // with no known spelling stays Hebrew rather than being invented.
  if (guestName) return localizedName(guestName, locale)
  const title = t(locale, short.title)
  return title.length > 26 ? `${title.slice(0, 26).trim()}…` : title
}

/** Matches the widest column count below, so the row is always exactly full. */
const MAX_STORIES = 10

/**
 * The strip's story list: the channel's MOST-WATCHED Shorts, at most one
 * per guest, preferring the ones we can actually put a name to.
 *
 * Ranked by real YouTube view counts rather than by date (2026-08-28
 * brief) - the strip is the page's introduction to the show, so it should
 * lead with the conversations that actually travelled.
 *
 * 2026-08-27 brief ("more stories at the top, don't repeat the same name
 * twice"). Two things make that harder than a `slice`:
 *
 *   - The channel regularly cuts several Shorts from one episode, so the
 *     newest few routinely feature the same guest. The strip reads as a row
 *     of PEOPLE, and a repeated face looks broken.
 *   - `guestNameFrom` only recognises the two title shapes it can parse
 *     safely (see its comment), so some Shorts fall back to a truncated
 *     title as their caption. Deduplicating on the caption alone therefore
 *     missed real repeats: "אלי ביתאן" and "אלי ביתאן עושה לאסתי שושן…"
 *     are the same person but two different captions.
 *
 * So named Shorts are taken first, one per name; then, only if there is
 * still room, title-captioned ones — and those are skipped when an already
 * chosen guest's name appears anywhere in the title, which is what catches
 * the case above.
 */
/**
 * Shorts whose YouTube thumbnail frames the HOST rather than the named
 * guest (2026-08-28: "in the story, crop the interviewee, not me").
 *
 * This can't be fixed by cropping. YouTube picks the thumbnail frame, and
 * on these clips the guest is not in the frame at all — it is Esty alone,
 * mid-question. The circle then shows her under someone else's name, which
 * is the part that actually reads as wrong.
 *
 * So they're skipped, and that guest falls through to their next
 * most-watched Short. Nor can this be detected in code: nothing in the
 * data says who is on screen, so each entry here was checked by eye
 * against her photo. Add an id when a circle shows the wrong person.
 */
const HOST_FRAMED_SHORTS = new Set<string>([
  '5dckgt-xivA', // captioned "יעקב וידר"
  'j9PqsemL3iI', // captioned "מוישי ליפשיץ"
  'jLZWsPEluyQ', // captioned "מלכי רוטנר"
  '1EEB4ilJyVs', // captioned "אורי צייטלין"
  // 2026-08-29: these two's next-most-watched Short (the one that had been
  // showing after the entries above were added) turned out to be host-framed
  // too — same issue, a different clip.
  'AKgW4sj32CM', // captioned "רחלי סלומון"
  '71xHXg4qtfM', // captioned "מלכי רוטנר" (her second host-framed clip)
])

export function pickStories(shorts: PodcastShort[]): PodcastShort[] {
  const usedNames = new Set<string>()
  const picked: PodcastShort[] = []
  // Shorts with no view count sort last rather than being dropped: missing
  // data shouldn't outrank a real number, but it shouldn't hide a clip either.
  const byViews = [...shorts]
    .filter((short) => !HOST_FRAMED_SHORTS.has(short.videoId))
    .sort((a, b) => (b.viewCount ?? -1) - (a.viewCount ?? -1))

  for (const short of byViews) {
    const name = guestNameFrom(short.title.he)?.trim()
    if (!name || usedNames.has(name)) continue
    usedNames.add(name)
    picked.push(short)
    if (picked.length === MAX_STORIES) return picked
  }

  const usedCaptions = new Set(picked.map((s) => captionFor(s)))
  for (const short of byViews) {
    if (picked.includes(short)) continue
    if ([...usedNames].some((name) => short.title.he.includes(name))) continue
    const caption = captionFor(short).trim()
    if (!caption || usedCaptions.has(caption)) continue
    usedCaptions.add(caption)
    picked.push(short)
    if (picked.length === MAX_STORIES) break
  }

  return picked
}
