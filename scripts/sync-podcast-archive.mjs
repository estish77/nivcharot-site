// Walks the whole "חרדית מדוברת" YouTube channel and writes every long-form
// episode to src/content/podcast-archive.json, which the podcast page reads
// as its back catalogue.
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
// published after the last sync appear on their own; re-run this when you
// want the older catalogue refreshed (or after a batch of uploads).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  fetchHareditMeduberetChannelShorts,
  fetchHareditMeduberetChannelVideos,
} from '../src/lib/youtubeChannel.ts'

const OUT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/content/podcast-archive.json',
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
