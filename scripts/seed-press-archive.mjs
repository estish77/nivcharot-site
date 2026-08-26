// Populates the `press-archive` collection with every real, researched
// press-coverage item in src/content/press-archive.ts's `pressArchiveItems`
// (currently ~70+ entries) — getPressArchiveItems() in src/lib/cms.ts reads
// from this collection first, falling back to the static fixture ONLY when
// the collection is completely empty. That "only when empty" behavior is
// exactly what surprised the site owner: adding ONE manual entry through
// the dashboard made the collection non-empty, which made the other ~70
// real (but not-yet-migrated) items disappear from the live site, since the
// fallback no longer applied. This script migrates all of them in, so nothing
// gets silently hidden again — the one manually-added entry stays untouched.
//
// Run via `npm run seed-press-archive` (payload run). MUST always be run
// with NODE_ENV=production against a production DATABASE_URI.
//
// No richText fields on this collection (title/summary/outlet/dateLabel/note
// are all plain text/textarea) — same two-pass locale-scoped write pattern
// as every other seed script in this project, just simpler.
//
// Idempotent by design (find-or-create by slug, not blind create): safe to
// re-run after a partial failure without needing to delete anything first.
// A slug collision with the manually-added entry (unlikely, since these are
// curated English slugs) just updates that one item in place instead of
// erroring.
import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { pressArchiveItems } from '../src/content/press-archive.ts'

const payload = await getPayload({ config })

let created = 0
let updated = 0
let failed = 0

for (const item of pressArchiveItems) {
  try {
    const existing = await payload.find({ collection: 'press-archive', where: { slug: { equals: item.slug } }, limit: 1 })
    const heData = {
      slug: item.slug,
      title: item.title.he,
      summary: item.summary.he,
      type: item.type,
      category: item.category,
      outlet: item.outlet.he,
      dateLabel: item.dateLabel.he,
      sortDate: item.sortDate,
      year: item.year,
      sourceLanguage: item.sourceLanguage,
      linkKind: item.link.kind,
      url: item.link.kind === 'external' ? item.link.url : undefined,
      note: item.note?.he,
      featured: item.featured ?? false,
      reviewStatus: 'keep',
    }
    const enData = {
      slug: item.slug,
      title: item.title.en,
      summary: item.summary.en,
      outlet: item.outlet.en,
      dateLabel: item.dateLabel.en,
      note: item.note?.en,
    }

    let id
    if (existing.docs.length > 0) {
      id = existing.docs[0].id
      await payload.update({ collection: 'press-archive', id, locale: 'he', context: { disableRevalidate: true }, data: heData })
      updated++
    } else {
      const doc = await payload.create({ collection: 'press-archive', locale: 'he', context: { disableRevalidate: true }, data: heData })
      id = doc.id
      created++
    }

    await payload.update({ collection: 'press-archive', id, locale: 'en', context: { disableRevalidate: true }, data: enData })

    console.log(`ok: ${item.slug}`)
  } catch (err) {
    failed++
    console.log(`FAILED ${item.slug}: ${err?.message ?? err}`)
  }
}

console.log(`\ncreated=${created} updated=${updated} failed=${failed}`)

const check = await payload.find({ collection: 'press-archive', locale: 'all', limit: 500 })
console.log(`verify: ${check.totalDocs} total in db`)

process.exit(0)
