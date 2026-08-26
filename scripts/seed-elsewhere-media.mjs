// Populates the `elsewhere-media` collection with every real item across
// src/content/elsewhere-media.ts's three fixture arrays (otherPodcasts,
// videoArticles, talksAndConferences) — getElsewhereMediaItems() in
// src/lib/cms.ts reads from this collection first, falling back to the
// static fixtures only when it's completely empty. Same reasoning as
// seed-press-archive.mjs: seeded proactively now, before a single manual
// dashboard entry makes the collection non-empty and silently hides every
// real item that hasn't been migrated in yet.
//
// Run via `npm run seed-elsewhere-media` (payload run). MUST always be run
// with NODE_ENV=production against a production DATABASE_URI.
// Idempotent by design (find-or-create by slug) — safe to re-run without
// needing to delete anything first. See seed-press-archive.mjs's header
// comment for the full reasoning.
import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { otherPodcasts, talksAndConferences, videoArticles } from '../src/content/elsewhere-media.ts'

const payload = await getPayload({ config })
const allItems = [...otherPodcasts, ...videoArticles, ...talksAndConferences]

let created = 0
let updated = 0
let failed = 0

for (const item of allItems) {
  try {
    const existing = await payload.find({ collection: 'elsewhere-media', where: { slug: { equals: item.slug } }, limit: 1 })
    const heData = {
      slug: item.slug,
      title: item.title.he,
      summary: item.summary.he,
      kind: item.kind,
      host: item.host,
      dateLabel: item.dateLabel?.he,
      sortDate: item.sortDate,
      sourceLanguage: item.sourceLanguage,
      url: item.url,
      note: item.note?.he,
      reviewStatus: 'keep',
    }
    const enData = {
      slug: item.slug,
      title: item.title.en,
      summary: item.summary.en,
      dateLabel: item.dateLabel?.en,
      note: item.note?.en,
    }

    let id
    if (existing.docs.length > 0) {
      id = existing.docs[0].id
      await payload.update({ collection: 'elsewhere-media', id, locale: 'he', context: { disableRevalidate: true }, data: heData })
      updated++
    } else {
      const doc = await payload.create({ collection: 'elsewhere-media', locale: 'he', context: { disableRevalidate: true }, data: heData })
      id = doc.id
      created++
    }

    await payload.update({ collection: 'elsewhere-media', id, locale: 'en', context: { disableRevalidate: true }, data: enData })

    console.log(`ok: ${item.slug}`)
  } catch (err) {
    failed++
    console.log(`FAILED ${item.slug}: ${err?.message ?? err}`)
  }
}

console.log(`\ncreated=${created} updated=${updated} failed=${failed}`)

const check = await payload.find({ collection: 'elsewhere-media', locale: 'all', limit: 500 })
console.log(`verify: ${check.totalDocs} total in db`)

process.exit(0)
