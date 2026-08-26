// Populates the `faqs` collection with the Activism page's six existing
// Q&A entries (src/content/activism.ts's `activismFaqs`) — getActivismFaqs()
// in src/lib/cms.ts already reads from this collection first, falling back
// to the static fixture only when it's empty.
//
// Run via `npm run seed-faqs` (payload run). MUST always be run with
// NODE_ENV=production against a production DATABASE_URI — see
// .env.example's "dev-mode hazard" note.
//
// Same two-pass, locale-scoped write pattern as seed-home-global.mjs:
// create the document under locale 'he' first (plain, unwrapped values),
// then update the SAME document under locale 'en'. No array fields are
// involved here, but this keeps every seed script in the project using one
// verified-safe pattern instead of a second, untested shortcut.
import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { activismFaqs } from '../src/content/activism.ts'

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

for (const faq of activismFaqs) {
  const answerHe = faq.source ? `${faq.answer.he}\n\n${faq.source.he}` : faq.answer.he
  const answerEn = faq.source ? `${faq.answer.en}\n\n${faq.source.en}` : faq.answer.en

  const created = await payload.create({
    collection: 'faqs',
    locale: 'he',
    context: { disableRevalidate: true },
    data: {
      question: faq.question.he,
      answer: richText(answerHe, 'rtl'),
      page: 'activism',
      order: Number(faq.number),
    },
  })

  await payload.update({
    collection: 'faqs',
    id: created.id,
    locale: 'en',
    context: { disableRevalidate: true },
    data: {
      question: faq.question.en,
      answer: richText(answerEn, 'ltr'),
    },
  })

  console.log(`faq ${faq.id}: written (id=${created.id})`)
}

const check = await payload.find({ collection: 'faqs', locale: 'all', sort: 'order' })
console.log(`verify: ${check.totalDocs} faqs total`)
console.log('verify question:', JSON.stringify(check.docs[0]?.question))

process.exit(0)
