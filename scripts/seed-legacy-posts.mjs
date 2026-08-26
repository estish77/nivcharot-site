// Populates the `posts` collection with the org's legacy archive (30 real
// items in src/content/media.ts's `archivePosts`) and the `categories`
// collection it references (5 items in `archiveCategories`).
//
// This is the exact same "empty collection -> fallback disappears the
// moment ONE real item exists" trap already hit (and fixed) for
// press-archive and elsewhere-media, just not yet applied here: with only
// the site owner's own 1-2 manually-added posts in the DB,
// getArchivePosts() (src/lib/cms.ts) stopped returning the ~29-item static
// fallback and the whole legacy archive vanished from /media's browse UI
// (though direct /media/[slug] links still worked, since generateStaticParams
// baked those specific slugs into the last build).
//
// Content is Hebrew-only by design (see media.ts's own comment: "rendered
// as-is under both locales" -- no English translation exists for this
// legacy material), so this seeds ONLY the 'he' locale, matching
// getArchivePosts()'s existing `titlePair.he || titlePair.en` /
// `bodyLexical ?? bodyField?.he` fallback handling.
//
// Idempotent (find-or-create by slug) -- safe to re-run.
//
// Run via `npm run seed-legacy-posts` (payload run). MUST always be run
// with NODE_ENV=production against a production DATABASE_URI.
import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { archiveCategories, archivePosts } from '../src/content/media.ts'

const payload = await getPayload({ config })

function richText(paragraphs) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'rtl',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'rtl',
        children: [{ type: 'text', format: 0, style: '', mode: 'normal', detail: 0, version: 1, text }],
      })),
    },
  }
}

// --- Categories ---
const categoryIdBySlug = {}
for (const cat of archiveCategories) {
  const existing = await payload.find({ collection: 'categories', where: { slug: { equals: cat.slug } }, limit: 1 })
  if (existing.docs.length > 0) {
    categoryIdBySlug[cat.slug] = existing.docs[0].id
    console.log(`category ${cat.slug}: exists (id=${existing.docs[0].id})`)
  } else {
    const doc = await payload.create({
      collection: 'categories',
      locale: 'he',
      context: { disableRevalidate: true },
      data: { name: cat.name, slug: cat.slug },
    })
    categoryIdBySlug[cat.slug] = doc.id
    console.log(`category ${cat.slug}: created (id=${doc.id})`)
  }
}

// --- Posts ---
let created = 0
let updated = 0
let failed = 0

for (const post of archivePosts) {
  try {
    const data = {
      slug: post.slug,
      title: post.title,
      date: post.date,
      body: richText(post.body),
      categories: post.categories.map((slug) => categoryIdBySlug[slug]).filter(Boolean),
      featured: post.featured ?? false,
      reviewStatus: 'keep',
    }

    const existing = await payload.find({ collection: 'posts', where: { slug: { equals: post.slug } }, limit: 1 })
    if (existing.docs.length > 0) {
      await payload.update({ collection: 'posts', id: existing.docs[0].id, locale: 'he', context: { disableRevalidate: true }, data })
      updated++
    } else {
      await payload.create({ collection: 'posts', locale: 'he', context: { disableRevalidate: true }, data })
      created++
    }
    console.log(`ok: ${post.slug}`)
  } catch (err) {
    failed++
    console.log(`FAILED ${post.slug}: ${err?.message ?? err}`)
  }
}

console.log(`\nposts: created=${created} updated=${updated} failed=${failed}`)

const check = await payload.find({ collection: 'posts', limit: 500 })
console.log(`verify: ${check.totalDocs} total in db`)

process.exit(0)
