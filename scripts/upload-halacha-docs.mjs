// Uploads the two halakhic source documents to the `media` collection and
// links them into the `halacha` global, which is what makes the download
// links appear on /halacha (see the page's `content.pamphletDocumentUrl` /
// `content.kroizerDocumentUrl` branch).
//
// Usage:
//   node --run  n/a - run through payload so the config and env are loaded:
//     npx payload run scripts/upload-halacha-docs.mjs <pamphlet.pdf> <kroizer.pdf>
//
//   Against production (uploads land in Vercel Blob, per payload.config.ts):
//     NODE_ENV=production DATABASE_URI="<prod postgres uri>" \
//       npx payload run scripts/upload-halacha-docs.mjs <pamphlet.pdf> <kroizer.pdf>
//
// Either argument may be omitted with "-" to upload only the other one.
//
// Idempotent by filename: re-running replaces the link rather than piling up
// duplicate media rows, so a corrected scan can be pushed with the same command.
import fs from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'
import config from '../payload.config.ts'

const [pamphletPath, kroizerPath] = process.argv.slice(2)

if (!pamphletPath && !kroizerPath) {
  console.error('Usage: payload run scripts/upload-halacha-docs.mjs <pamphlet.pdf> <kroizer.pdf>')
  process.exit(1)
}

const payload = await getPayload({ config })

/** Alt text doubles as the media item's label in the dashboard. */
const DOCS = [
  {
    arg: pamphletPath,
    field: 'pamphletDocument2015',
    alt: {
      he: 'קונטרס בירור הלכתי בעניין בחירת נשים למשרות ציבוריות, טבת תשע"ה',
      en: 'Halakhic clarification pamphlet on women standing for public office, Tevet 5775 (2015)',
    },
  },
  {
    arg: kroizerPath,
    field: 'kroizerRulingDocument',
    alt: {
      he: 'הרב רפאל קרויזר, בדין בחירת נשים לכהן כחברות כנסת, י"ח תמוז תשפ"ה',
      en: 'Rabbi Raphael Kreuzer, on women serving as members of Knesset, 18 Tammuz 5785',
    },
  },
]

const updates = {}

for (const doc of DOCS) {
  if (!doc.arg || doc.arg === '-') {
    console.log(`skip: ${doc.field} (no file given)`)
    continue
  }
  const file = path.resolve(doc.arg)
  if (!fs.existsSync(file)) {
    console.error(`missing file: ${file}`)
    process.exit(1)
  }

  const filename = path.basename(file)
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })

  let id
  if (existing.docs[0]) {
    id = existing.docs[0].id
    console.log(`reusing existing media #${id} (${filename})`)
  } else {
    const created = await payload.create({
      collection: 'media',
      locale: 'he',
      data: { alt: doc.alt.he },
      filePath: file,
    })
    id = created.id
    await payload.update({ collection: 'media', id, locale: 'en', data: { alt: doc.alt.en } })
    console.log(`uploaded media #${id} (${filename})`)
  }

  updates[doc.field] = id
}

if (Object.keys(updates).length > 0) {
  await payload.updateGlobal({ slug: 'halacha', data: updates })
  console.log('linked into the halacha global:', updates)
}

const check = await payload.findGlobal({ slug: 'halacha', depth: 1 })
for (const doc of DOCS) {
  const value = check?.[doc.field]
  const url = value && typeof value === 'object' ? value.url : value
  console.log(`${doc.field}:`, url || '(not set)')
}

process.exit(0)
