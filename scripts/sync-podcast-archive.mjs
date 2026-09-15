// Walks the whole "חרדית מדוברת" YouTube channel and writes every long-form
// episode to src/content/podcast-archive.json, which the podcast page reads
// as its back catalogue. Also translates any episode missing from
// src/content/podcastTranslations.ts (see that file's doc comment) so the
// English podcast page never silently falls back to Hebrew text for an
// episode this sync just added.
//
//   npm run sync-podcast-archive
//
// Why a script and not a live fetch: YouTube's public RSS feeds are capped
// at 15 entries, so the site only ever showed the newest sixth of a
// ~100-episode show. Reading the channel itself needs ~105 requests, which
// is fine here (~4s) but catastrophic inside a Next render - the same code
// in a request took 61 minutes, because Next buffers every fetch response
// for its data cache. See src/lib/youtubeChannel.ts.
//
// The site still reads the live RSS feed on top of this file, so episodes
// published after the last sync appear on their own (untranslated, same as
// any other archive gap, until the next sync catches them up); re-run this
// when you want the older catalogue refreshed (or after a batch of uploads).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { firstParagraph } from '../src/content/podcast.ts'
import { podcastTranslations } from '../src/content/podcastTranslations.ts'
import { translateBatch } from '../src/payload/utils/translate.ts'
import {
  fetchHareditMeduberetChannelShorts,
  fetchHareditMeduberetChannelVideos,
} from '../src/lib/youtubeChannel.ts'

const OUT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/content/podcast-archive.json',
)
const TRANSLATIONS_OUT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/content/podcastTranslations.ts',
)

const started = Date.now()
const entries = await fetchHareditMeduberetChannelVideos()
// Shorts feed the stories strip. Fetched here for the same reason the
// episodes are: the Shorts RSS feed is the endpoint YouTube rate-limits
// hardest, and when it 404s the strip renders empty with nothing to fall
// back on.
const shorts = await fetchHareditMeduberetChannelShorts()

if (entries.length === 0) {
  console.error(
    'No episodes came back. Nothing was written - the existing archive file is left as it is,\n' +
      'so a bad run can never empty the page. Check whether YouTube changed the channel layout\n' +
      '(see collectVideoIds in src/lib/youtubeChannel.ts).',
  )
  process.exit(1)
}

const previous = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { episodes: [], shorts: [] }
const previousIds = new Set(previous.episodes?.map((e) => e.videoId) ?? [])
const added = entries.filter((e) => !previousIds.has(e.videoId))

// A failed Shorts walk keeps whatever was already on file rather than
// wiping the strip; the episodes above are what gate the write.
const nextShorts = shorts.length > 0 ? shorts : (previous.shorts ?? [])
if (shorts.length === 0) {
  console.warn('Shorts walk returned nothing - keeping the %d already on file.', nextShorts.length)
}

// `syncedAt` is deliberately absent: it would rewrite the file on every run
// even when nothing changed, turning a no-op sync into a commit.
fs.writeFileSync(OUT, `${JSON.stringify({ episodes: entries, shorts: nextShorts }, null, 2)}\n`, 'utf8')

const oldest = entries[entries.length - 1]
const newest = entries[0]
console.log(
  `wrote ${entries.length} episodes + ${nextShorts.length} shorts to ${path.relative(process.cwd(), OUT)} in ${Date.now() - started}ms`,
)
console.log(`  range: ${oldest.publishedDate} … ${newest.publishedDate}`)
console.log(`  new since last sync: ${added.length}`)
if (added.length > 0) {
  for (const entry of added.slice(0, 10)) console.log(`    + ${entry.publishedDate}  ${entry.title.slice(0, 70)}`)
  if (added.length > 10) console.log(`    … and ${added.length - 10} more`)
}

// Any archive episode with no row in podcastTranslations.ts is one
// `toLiveEpisode()` (src/content/podcast.ts) will silently show Hebrew text
// for on the English page - not just ones `added` this run, so a gap left
// by a past run without ANTHROPIC_API_KEY set still gets picked up here.
const untranslated = entries.filter((e) => !(e.videoId in podcastTranslations))
if (untranslated.length > 0) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn(
      `${untranslated.length} episode(s) have no English translation and ANTHROPIC_API_KEY is not set - ` +
        'leaving them for the next sync. They will show Hebrew text as their English fallback until then.',
    )
  } else {
    const flat = untranslated.flatMap((e) => [e.title, firstParagraph(e.description)])
    const translated = await translateBatch(flat)
    const newRows = untranslated
      .map((e, i) => {
        const title = translated[i * 2]
        const description = translated[i * 2 + 1]
        return `  ${JSON.stringify(e.videoId)}: { title: ${JSON.stringify(title)}, description: ${JSON.stringify(description)} },\n`
      })
      .join('')

    const src = fs.readFileSync(TRANSLATIONS_OUT, 'utf8')
    const marker = '\nexport function translatedTitle'
    const markerIndex = src.indexOf(marker)
    const closeBraceIndex = markerIndex === -1 ? -1 : src.lastIndexOf('}', markerIndex)
    if (closeBraceIndex === -1) {
      console.error(
        `podcastTranslations.ts doesn't match the expected shape (no closing "}" found before "${marker.trim()}") - ` +
          'skipping the translation write so a format change never gets corrupted by this script. Update it by hand.',
      )
    } else {
      const updated = src.slice(0, closeBraceIndex) + newRows + src.slice(closeBraceIndex)
      fs.writeFileSync(TRANSLATIONS_OUT, updated, 'utf8')
      console.log(`translated ${untranslated.length} episode(s) into ${path.relative(process.cwd(), TRANSLATIONS_OUT)}`)
    }
  }
}
