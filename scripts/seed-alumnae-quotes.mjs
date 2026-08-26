// Populates the `alumnae-quotes` collection with the HaNivcheret page's six
// existing quote entries (src/content/hanivcheret.ts's `hanivcheretQuotes`).
// `name` is seeded with the SAME placeholder text the static fixture uses
// ("שם הבוגרת · בוגרת מחזור N" — see that file's own comment: every
// attribution there is an explicit, honest "name TBD" placeholder, never an
// invented real name). It's a normal editable field going forward — replace
// it with a real name via the dashboard whenever one is available.
//
// Run via `npm run seed-alumnae-quotes` (payload run). MUST always be run
// with NODE_ENV=production against a production DATABASE_URI.
import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { hanivcheretAlumnaPlaceholder, hanivcheretQuotes } from '../src/content/hanivcheret.ts'

const payload = await getPayload({ config })

for (const [i, entry] of hanivcheretQuotes.entries()) {
  const created = await payload.create({
    collection: 'alumnae-quotes',
    locale: 'he',
    context: { disableRevalidate: true },
    data: {
      quote: entry.quote.he,
      name: hanivcheretAlumnaPlaceholder.he(entry.cohort),
      cohort: entry.cohort,
      order: i,
    },
  })

  await payload.update({
    collection: 'alumnae-quotes',
    id: created.id,
    locale: 'en',
    context: { disableRevalidate: true },
    data: {
      quote: entry.quote.en,
    },
  })

  console.log(`quote ${entry.id}: written (id=${created.id})`)
}

const check = await payload.find({ collection: 'alumnae-quotes', locale: 'all', sort: 'order' })
console.log(`verify: ${check.totalDocs} quotes total`)
console.log('verify quote:', JSON.stringify(check.docs[0]?.quote))
console.log('verify name:', JSON.stringify(check.docs[0]?.name))

process.exit(0)
