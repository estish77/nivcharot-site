// Populates the `timeline-milestones` collection with the Story page's 21
// existing entries (src/content/story.ts's `timelineMilestones`, already in
// newest-first display order). getStoryTimeline() in src/lib/cms.ts already
// reads from this collection first, falling back to the static fixture only
// when it's empty.
//
// Run via `npm run seed-timeline` (payload run). MUST always be run with
// NODE_ENV=production against a production DATABASE_URI.
//
// Two-pass, ID-preserving pattern for `externalArticles` (the one nested
// array field here, present on 3 of the 21 entries) — see
// seed-home-global.mjs's header comment for the full empirical explanation
// of why this is required for locale-scoped array writes. `year` is a
// single, non-localized field (see TimelineMilestones.ts's own comment) —
// seeded once from the Hebrew label, same accepted tradeoff documented in
// getStoryTimeline()'s own comment.
import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { timelineMilestones } from '../src/content/story.ts'

const payload = await getPayload({ config })

function richText(text, direction) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction,
          children: [{ type: 'text', format: 0, style: '', mode: 'normal', detail: 0, version: 1, text }],
        },
      ],
    },
  }
}

for (const [i, milestone] of timelineMilestones.entries()) {
  const articles = milestone.externalArticles ?? []

  const created = await payload.create({
    collection: 'timeline-milestones',
    locale: 'he',
    context: { disableRevalidate: true },
    data: {
      year: milestone.year.he,
      title: milestone.title.he,
      body: richText(milestone.body.he, 'rtl'),
      order: i,
      visible: milestone.visible.he,
      externalArticles: articles.map((a) => ({ label: a.label.he, outlet: a.outlet, url: a.url })),
    },
  })

  const articleIds = (created.externalArticles ?? []).map((a) => a.id)

  await payload.update({
    collection: 'timeline-milestones',
    id: created.id,
    locale: 'en',
    context: { disableRevalidate: true },
    data: {
      title: milestone.title.en,
      body: richText(milestone.body.en, 'ltr'),
      visible: milestone.visible.en,
      externalArticles: articles.map((a, j) => ({ id: articleIds[j], label: a.label.en, outlet: a.outlet, url: a.url })),
    },
  })

  console.log(`milestone ${milestone.id}: written (id=${created.id}, order=${i})`)
}

const check = await payload.find({ collection: 'timeline-milestones', locale: 'all', sort: 'order', limit: 200 })
console.log(`verify: ${check.totalDocs} milestones total`)
console.log('verify first title:', JSON.stringify(check.docs[0]?.title))
console.log('verify first visible:', JSON.stringify(check.docs[0]?.visible))
const withArticles = check.docs.find((d) => (d.externalArticles ?? []).length > 0)
console.log('verify one externalArticles entry:', JSON.stringify(withArticles?.externalArticles))

process.exit(0)
