import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { archiveCategories, archivePosts, eventGalleries } from '../src/content/media.ts'
import { teamMembers } from '../src/content/team.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

const payload = await getPayload({ config })

const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

function textToLexical(paragraphs, direction = 'rtl') {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction,
        children: [
          { type: 'text', format: 0, style: '', mode: 'normal', detail: 0, version: 1, text },
        ],
      })),
    },
  }
}

async function findByField(collection, field, value) {
  const res = await payload.find({ collection, where: { [field]: { equals: value } }, limit: 1 })
  return res.docs[0]
}

async function seedCategories() {
  const map = {}
  let created = 0
  for (const cat of archiveCategories) {
    const existing = await findByField('categories', 'slug', cat.slug)
    if (existing) {
      map[cat.slug] = existing.id
      continue
    }
    const doc = await payload.create({
      collection: 'categories',
      locale: 'he',
      context: { disableRevalidate: true },
      data: { name: cat.name, slug: cat.slug },
    })
    map[cat.slug] = doc.id
    created++
  }
  console.log(`categories: created ${created}, total ${Object.keys(map).length}`)
  return map
}

async function seedPosts(categoryMap) {
  let created = 0
  let skipped = 0
  for (const post of archivePosts) {
    const existing = await findByField('posts', 'slug', post.slug)
    if (existing) {
      skipped++
      continue
    }
    await payload.create({
      collection: 'posts',
      locale: 'he',
      context: { disableRevalidate: true },
      data: {
        slug: post.slug,
        title: post.title,
        date: post.date,
        body: textToLexical(post.body, 'rtl'),
        categories: (post.categories || []).map((slug) => categoryMap[slug]).filter(Boolean),
        sourceLinks: post.sourceLinks,
        featured: post.featured || false,
        reviewStatus: 'keep',
      },
    })
    created++
  }
  console.log(`posts: created ${created}, skipped ${skipped} (already existed)`)
}

async function uploadMediaFile(filePathRelativeToPublic, altHe, altEn) {
  const absPath = path.join(projectRoot, 'public', filePathRelativeToPublic)
  if (!fs.existsSync(absPath)) {
    console.warn(`  missing file, skipping upload: ${filePathRelativeToPublic}`)
    return null
  }
  const ext = path.extname(absPath).toLowerCase()
  const mimetype = MIME_BY_EXT[ext]
  if (!mimetype) {
    console.warn(`  unknown extension ${ext}, skipping upload: ${filePathRelativeToPublic}`)
    return null
  }
  const data = fs.readFileSync(absPath)
  const name = path.basename(absPath)

  const existing = await findByField('media', 'filename', name)
  if (existing) return existing.id

  try {
    const doc = await payload.create({
      collection: 'media',
      locale: 'he',
      context: { disableRevalidate: true },
      data: { alt: altHe },
      file: { data, mimetype, name, size: data.length },
    })
    await payload.update({
      collection: 'media',
      id: doc.id,
      locale: 'en',
      context: { disableRevalidate: true },
      data: { alt: altEn },
    })
    return doc.id
  } catch (err) {
    console.warn(`  FAILED to upload ${filePathRelativeToPublic}: ${err.message} — source file on disk appears corrupted/truncated, leaving photo empty.`)
    return null
  }
}

async function seedTeamMembers() {
  let created = 0
  let skipped = 0
  for (const member of teamMembers) {
    const existing = await findByField('team-members', 'name', member.name.he)
    if (existing) {
      skipped++
      continue
    }

    let photoId = null
    if (member.photo) {
      const relPath = member.photo.src.replace(/^\//, '')
      photoId = await uploadMediaFile(relPath, member.photo.alt.he, member.photo.alt.en)
    }

    const doc = await payload.create({
      collection: 'team-members',
      locale: 'he',
      context: { disableRevalidate: true },
      data: {
        name: member.name.he,
        role: member.role.he,
        bio: member.bio ? textToLexical([member.bio.he], 'rtl') : undefined,
        photo: photoId || undefined,
        order: member.order,
        active: member.active,
      },
    })

    await payload.update({
      collection: 'team-members',
      id: doc.id,
      locale: 'en',
      context: { disableRevalidate: true },
      data: {
        name: member.name.en,
        role: member.role.en,
        bio: member.bio ? textToLexical([member.bio.en], 'ltr') : undefined,
      },
    })
    created++
  }
  console.log(`team-members: created ${created}, skipped ${skipped} (already existed)`)
}

async function seedEvents() {
  let created = 0
  let skipped = 0
  for (const gallery of eventGalleries) {
    const existing = await findByField('events', 'slug', gallery.slug)
    if (existing) {
      skipped++
      continue
    }
    await payload.create({
      collection: 'events',
      locale: 'he',
      context: { disableRevalidate: true },
      data: {
        slug: gallery.slug,
        title: gallery.title,
        year: gallery.year,
        credit: gallery.credit,
        // No real photo files exist for these galleries yet (fixture only
        // has alt-text placeholders) — leaving `photos` empty rather than
        // fabricating image uploads. Add real photos through the dashboard
        // once real files are sourced.
        reviewStatus: 'keep',
      },
    })
    created++
  }
  console.log(`events: created ${created}, skipped ${skipped} (already existed)`)
  console.log('  note: event photo galleries were NOT seeded — no real image files exist yet for them (see script comment).')
}

const categoryMap = await seedCategories()
await seedPosts(categoryMap)
await seedTeamMembers()
await seedEvents()
process.exit(0)
