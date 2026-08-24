import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { pressArchiveItems } from '../src/content/press-archive.ts'

const payload = await getPayload({ config })

const sourceSlugs = new Set(pressArchiveItems.map((i) => i.slug))

const existing = await payload.find({ collection: 'press-archive', limit: 500, depth: 0 })

let created = 0
let updated = 0
let deleted = 0

for (const doc of existing.docs) {
  if (!sourceSlugs.has(doc.slug)) {
    await payload.delete({ collection: 'press-archive', id: doc.id, context: { disableRevalidate: true } })
    deleted++
    console.log(`  deleted: ${doc.slug}`)
  }
}

for (const item of pressArchiveItems) {
  const found = await payload.find({
    collection: 'press-archive',
    where: { slug: { equals: item.slug } },
    limit: 1,
  })

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
    featured: Boolean(item.featured),
    reviewStatus: 'keep',
  }
  const enData = {
    title: item.title.en,
    summary: item.summary.en,
    outlet: item.outlet.en,
    dateLabel: item.dateLabel.en,
    note: item.note?.en,
  }

  if (found.docs.length > 0) {
    const id = found.docs[0].id
    await payload.update({ collection: 'press-archive', id, locale: 'he', context: { disableRevalidate: true }, data: heData })
    await payload.update({ collection: 'press-archive', id, locale: 'en', context: { disableRevalidate: true }, data: enData })
    updated++
  } else {
    const doc = await payload.create({ collection: 'press-archive', locale: 'he', context: { disableRevalidate: true }, data: heData })
    await payload.update({ collection: 'press-archive', id: doc.id, locale: 'en', context: { disableRevalidate: true }, data: enData })
    created++
  }
}

console.log(`press-archive sync: created ${created}, updated ${updated}, deleted ${deleted}`)
process.exit(0)
