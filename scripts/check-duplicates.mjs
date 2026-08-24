import { getPayload } from 'payload'
import config from '../payload.config.ts'

const payload = await getPayload({ config })

const press = await payload.find({ collection: 'press-archive', limit: 500, locale: 'he', depth: 0 })
console.log(`press-archive: ${press.totalDocs} docs`)

const byOutletDate = new Map()
for (const doc of press.docs) {
  const key = `${doc.outlet}__${doc.sortDate}`
  if (!byOutletDate.has(key)) byOutletDate.set(key, [])
  byOutletDate.get(key).push(doc.slug)
}
for (const [key, slugs] of byOutletDate) {
  if (slugs.length > 1) console.log('SAME outlet+date:', key, slugs)
}

const byTitle = new Map()
for (const doc of press.docs) {
  const norm = doc.title.trim().toLowerCase()
  if (!byTitle.has(norm)) byTitle.set(norm, [])
  byTitle.get(norm).push(doc.slug)
}
for (const [key, slugs] of byTitle) {
  if (slugs.length > 1) console.log('SAME title:', key, slugs)
}

const elsewhere = await payload.find({ collection: 'elsewhere-media', limit: 500, locale: 'he', depth: 0 })
console.log(`\nelsewhere-media: ${elsewhere.totalDocs} docs`)
const byUrl = new Map()
for (const doc of elsewhere.docs) {
  if (!byUrl.has(doc.url)) byUrl.set(doc.url, [])
  byUrl.get(doc.url).push(doc.slug)
}
for (const [url, slugs] of byUrl) {
  if (slugs.length > 1) console.log('SAME url:', url, slugs)
}

const posts = await payload.find({ collection: 'posts', limit: 500, locale: 'he', depth: 0 })
console.log(`\nposts: ${posts.totalDocs} docs`)
const byPostTitle = new Map()
for (const doc of posts.docs) {
  const norm = doc.title.trim().toLowerCase()
  if (!byPostTitle.has(norm)) byPostTitle.set(norm, [])
  byPostTitle.get(norm).push(doc.slug)
}
for (const [key, slugs] of byPostTitle) {
  if (slugs.length > 1) console.log('SAME post title:', key, slugs)
}

const team = await payload.find({ collection: 'team-members', limit: 500, locale: 'he', depth: 0 })
console.log(`\nteam-members: ${team.totalDocs} docs`)
const byName = new Map()
for (const doc of team.docs) {
  const norm = doc.name.trim().toLowerCase()
  if (!byName.has(norm)) byName.set(norm, [])
  byName.get(norm).push(doc.id)
}
for (const [key, ids] of byName) {
  if (ids.length > 1) console.log('SAME team member name:', key, ids)
}

console.log('\ndone')
process.exit(0)
