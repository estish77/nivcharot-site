// Walks Nivcharot's own media channel (youtube.com/@מדיהנבחרות) and writes
// every video to src/content/nivcharot-channel.json, which the media page
// reads as an additional source of video coverage.
//
//   npm run sync-nivcharot-channel
//
// 2026-08-28 brief: "collect video pieces from Nivcharot's media channel …
// add a category for Knesset committee discussions, and use the real
// descriptions and the names of the interviewees and speakers."
//
// Titles and summaries come straight off the channel - they already name
// who is speaking - so nothing here is written by hand or inferred. Videos
// with no description on the channel get an empty summary rather than an
// invented one.
//
// Runs offline for the same reason the podcast sync does: the walk costs
// ~105 requests, which is seconds in Node but minutes-to-hours inside a
// Next render. See src/lib/youtubeChannel.ts.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { walkTab } from '../src/lib/youtubeChannel.ts'

const CHANNEL_ID = 'UCJ37GGg4FVu3IoO6KiGyXTg' // youtube.com/@מדיהנבחרות ("מדיה נבחרות")

const OUT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/content/nivcharot-channel.json',
)

/*
 * Classification rules. Order matters - the first match wins - and two of
 * these are load-bearing in a way that is easy to get wrong:
 *
 *   - "ערוץ הכנסת" is the Knesset's TV channel. An interview broadcast
 *     there is an interview, not a committee session, so it has to be
 *     excluded before the committee test or every one of them is misfiled.
 *   - `כנס(?!ת)` needs the lookahead: without it, the "כנס" inside
 *     "בכנסת"/"הכנסת" matches and files Knesset-channel interviews as
 *     conference talks.
 */
const KNESSET_CHANNEL = /ערוץ הכנסת/
const COMMITTEE = /\bועד(?:ה|ת)\b|בוועד(?:ה|ת)|בועד(?:ה|ת)|הוועדה|דיון בכנסת|מליאת הכנסת|ישיבת הוועדה/
const BROADCAST =
  /ערוץ \d+|i24|כאן 11|כאן מורשת|גל"?צ|גלי צה"?ל|רשת ב|רדיו|קול ברמה|קול הגליל|לב המדינה|מתראיינת|בראיון|ראיון|אצל /
const PANEL = /כנס(?!ת)|פאנל|הרצאה|מושב|יום עיון/
const SPOKEN = /ספוקן וורד|שיר |טריילר/

function classify(video) {
  const hay = `${video.title} ${video.description}`
  if (SPOKEN.test(video.title)) return 'video'
  if (COMMITTEE.test(hay) && !KNESSET_CHANNEL.test(hay)) return 'knesset'
  if (BROADCAST.test(hay)) return 'video'
  if (PANEL.test(hay)) return 'talk'
  return 'video'
}

/**
 * Pulls the speaking activist's full name out of a Knesset item's own
 * description (2026-08-28 brief: "include the surnames of the activists
 * speaking"). Several of those videos are titled with the topic only, or
 * with a first name, while the description underneath names the person in
 * full.
 *
 * Only the phrasings the channel actually uses are matched, and only a
 * two-or-three word Hebrew name is accepted, so this cannot pick up a
 * sentence fragment and present it as somebody's name. Anything it isn't
 * sure about returns null and the title is left exactly as written.
 */
// Hebrew letters plus geresh/gershayim and hyphen \u2014 enough for every name
// the channel writes, and narrow enough that it cannot swallow punctuation
// and turn a clause into a "name".
const NAME = '[\u05d0-\u05ea\u05f3\u05f4-]+'
const SPEAKER_PATTERNS = [
  // "אפרת שוקרון בועדה לביטחון לאומי" / "יפעת חיים בועדת הרווחה"
  // `\\s` in a template literal, not `\s`: an unrecognised escape there is
  // silently dropped, which turns the pattern into a search for a literal "s".
  new RegExp(`^(${NAME}(?: ${NAME}){1,2})\\s+ב(?:ו?ועד)`),
  // "ציפי לביא, אקטיביסטית חרדית…" / "לאה שיינברום, עובדת סוציאלית…"
  new RegExp(`^(${NAME}(?: ${NAME}){1,2}),\\s`),
  // "…נציגת ארגון נבחרות, רעיה מרי והעלתה…" — exactly two words here, unlike
  // the patterns above: this one has no comma or "בוועדה" after the name to
  // stop at, so a looser bound runs straight on into the next verb
  // ("רעיה מרי והעלתה").
  new RegExp(`נציגת ארגון נבחרות,\\s+(${NAME} ${NAME})`),
]

/*
 * Speakers the channel itself never names in full, supplied by the site
 * owner. "רחלי בוועדת חינוך בנושא הממ\"ח" has no description and no
 * keywords, and seven different women named רחלי appear in this site's own
 * content, so nothing in the source could disambiguate her.
 */
const SPEAKER_OVERRIDES = {
  kFEN64vVnKo: 'רחלי סלומון',
}

function speakerFrom(description) {
  const text = (description || '').replace(/\s+/g, ' ').trim()
  if (!text) return null
  for (const pattern of SPEAKER_PATTERNS) {
    const match = text.match(pattern)
    const name = match?.[1]?.trim()
    // A single word is a first name, not the full name the brief asks for.
    if (name && name.split(' ').length >= 2) return name
  }
  return null
}

/** First paragraph only: channel descriptions often end in link boilerplate. */
function firstParagraph(text) {
  const [lead] = (text || '').split(/\n\s*\n/)
  return (lead || '').trim()
}

const started = Date.now()
const videos = await walkTab(CHANNEL_ID, 'videos', 0)

if (videos.length === 0) {
  console.error(
    'Nothing came back from the channel. Nothing was written, so the existing file stays as it is.\n' +
      'Check whether YouTube changed the channel layout (collectVideoIds in src/lib/youtubeChannel.ts).',
  )
  process.exit(1)
}

const items = videos.map((video) => {
  const kind = classify(video)
  const speaker = kind === 'knesset' ? (SPEAKER_OVERRIDES[video.videoId] ?? speakerFrom(video.description)) : null
  return {
    slug: `nivcharot-media-${video.videoId}`,
    kind,
    videoId: video.videoId,
    title: video.title.replace(/\s+/g, ' ').trim(),
    summary: firstParagraph(video.description),
    // Only set where the description named the person in full; the title
    // is left untouched and the two are joined at render time.
    ...(speaker ? { speaker } : {}),
    publishedDate: video.publishedDate,
    url: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl,
  }
})

const previous = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { items: [] }
const previousIds = new Set(previous.items?.map((i) => i.slug) ?? [])
const added = items.filter((i) => !previousIds.has(i.slug))

fs.writeFileSync(OUT, `${JSON.stringify({ items }, null, 2)}\n`, 'utf8')

const byKind = items.reduce((acc, i) => ({ ...acc, [i.kind]: (acc[i.kind] || 0) + 1 }), {})
const withSummary = items.filter((i) => i.summary.length > 0).length
console.log(`wrote ${items.length} videos to ${path.relative(process.cwd(), OUT)} in ${Date.now() - started}ms`)
console.log(`  by kind: ${JSON.stringify(byKind)}`)
console.log(`  with a real description: ${withSummary}/${items.length}`)
const named = items.filter((i) => i.speaker)
console.log(`  knesset items with a named speaker: ${named.length}`)
for (const i of named) console.log(`    · ${i.speaker} — ${i.title.slice(0, 60)}`)
console.log(`  new since last sync: ${added.length}`)
