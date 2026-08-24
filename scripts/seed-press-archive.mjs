import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { pressArchiveItems } from '../src/content/press-archive.ts'
import { otherPodcasts, videoArticles, talksAndConferences } from '../src/content/elsewhere-media.ts'

const payload = await getPayload({ config })

async function seedPressArchive() {
  let created = 0
  let skipped = 0
  for (const item of pressArchiveItems) {
    const existing = await payload.find({
      collection: 'press-archive',
      where: { slug: { equals: item.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      if (existing.docs[0].year !== item.year) {
        await payload.update({
          collection: 'press-archive',
          id: existing.docs[0].id,
          context: { disableRevalidate: true },
          data: { year: item.year },
        })
      }
      skipped++
      continue
    }

    const doc = await payload.create({
      collection: 'press-archive',
      locale: 'he',
      context: { disableRevalidate: true },
      data: {
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
        reviewStatus: 'keep',
      },
    })

    await payload.update({
      collection: 'press-archive',
      id: doc.id,
      locale: 'en',
      context: { disableRevalidate: true },
      data: {
        title: item.title.en,
        summary: item.summary.en,
        outlet: item.outlet.en,
        dateLabel: item.dateLabel.en,
        note: item.note?.en,
      },
    })
    created++
  }
  console.log(`press-archive: created ${created}, skipped ${skipped} (already existed)`)
}

async function seedElsewhereMedia() {
  const all = [...otherPodcasts, ...videoArticles, ...talksAndConferences]
  let created = 0
  let skipped = 0
  for (const item of all) {
    const existing = await payload.find({
      collection: 'elsewhere-media',
      where: { slug: { equals: item.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      skipped++
      continue
    }

    const doc = await payload.create({
      collection: 'elsewhere-media',
      locale: 'he',
      context: { disableRevalidate: true },
      data: {
        slug: item.slug,
        title: item.title.he,
        summary: item.summary.he,
        kind: item.kind,
        host: item.host,
        dateLabel: item.dateLabel.he || undefined,
        sortDate: item.sortDate,
        sourceLanguage: item.sourceLanguage,
        url: item.url,
        note: item.note?.he,
        reviewStatus: 'keep',
      },
    })

    await payload.update({
      collection: 'elsewhere-media',
      id: doc.id,
      locale: 'en',
      context: { disableRevalidate: true },
      data: {
        title: item.title.en,
        summary: item.summary.en,
        dateLabel: item.dateLabel.en || undefined,
        note: item.note?.en,
      },
    })
    created++
  }
  console.log(`elsewhere-media: created ${created}, skipped ${skipped} (already existed)`)
}

await seedPressArchive()
await seedElsewhereMedia()
process.exit(0)
