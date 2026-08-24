// Run via `npm run import-content` (payload run), pointed at a *fresh,
// empty* target DB (temporarily set DATABASE_URI to the new Postgres
// connection string, and BLOB_READ_WRITE_TOKEN if migrating media into
// Vercel Blob, for this one command). Pairs with export-content.mjs, which
// must be run first (against the source DB) to produce content-export.json.
//
// If you dry-run this against a second *local* DATABASE_URI (a temp
// SQLite file) to sanity-check it before touching production — do that,
// it's what this script was validated with — set a throwaway
// BLOB_READ_WRITE_TOKEN too, or the media uploads will land in this same
// checkout's local media/ folder (Payload's local-storage `staticDir`
// isn't parameterized per-DB) and Payload will silently rename them
// (`photo-1.jpg`, `photo-2.jpg`, ...) to avoid colliding with the real
// files already there — harmless but leaves duplicate junk to clean up
// (`git status` / `ls media/` afterward and delete anything with a
// trailing `-<N>` before its extension that you didn't expect).
//
// Real document ids are NOT preserved as-is — the target DB assigns its
// own — so every relationship/upload field is remapped through an id map
// built as each collection is imported. That map is derived generically
// by reading each collection's actual field config at runtime
// (payload.collections[slug].config.fields) rather than hardcoding which
// fields are relationships, so this keeps working if the schema changes.
// Only plain top-level and one-level-array-nested relationship/upload
// fields are supported — the only shapes this schema currently uses (see
// the field-type audit in this session's notes); a `tabs`/`row`/
// `collapsible` field would need collectRefFields extended.
//
// Each doc is written with one scoped create(locale:'he') plus, only when
// there's real English content to write, one scoped update(locale:'en') —
// verified empirically that Payload validates ALL configured locales at
// once when no `locale` is passed (so a `required`+`localized` field with
// no English translation yet — common in this legacy-imported content —
// fails as "required" even though Hebrew is fully present), so every
// write must be scoped to one locale. The English update is skipped
// entirely (not sent with fields omitted) whenever any required+localized
// field lacks English content for that doc — Payload's required check on
// a scoped locale write still fails if that locale has no value yet for a
// required field, so a partial write would still crash; the doc simply
// stays Hebrew-only, exactly matching its state in the source DB, and the
// site's `fallback: true` locale config already renders that correctly.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { collections } from '../src/payload/collections/index.ts'
import { globals } from '../src/payload/globals/index.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const exportFile = path.join(__dirname, 'content-export.json')
const force = process.argv.includes('--force')

const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
}
// Media fields Payload/sharp recompute from the actual uploaded bytes —
// never copy these from the export, only the real editorial ones (alt,
// focalX/focalY — an editor's deliberate choice, not derived from pixels).
const MEDIA_COMPUTED_FIELDS = new Set([
  'id', 'createdAt', 'updatedAt', 'url', 'thumbnailURL',
  'filename', 'filesize', 'mimeType', 'width', 'height', 'sizes',
])
const META_FIELDS = new Set(['id', 'createdAt', 'updatedAt'])

if (!fs.existsSync(exportFile)) {
  console.error(`Missing ${exportFile} — run \`npm run export-content\` against the source DB first.`)
  process.exit(1)
}
const { collections: exportedCollections, globals: exportedGlobals } = JSON.parse(fs.readFileSync(exportFile, 'utf8'))

const payload = await getPayload({ config })

// ---- Safety check: refuse to run against a DB that already has content,
// so a re-run (or pointing at the wrong DATABASE_URI) can't duplicate or
// collide with real data. ----
if (!force) {
  const nonEmpty = []
  for (const slug of Object.keys(exportedCollections)) {
    const { totalDocs } = await payload.count({ collection: slug, overrideAccess: true })
    if (totalDocs > 0) nonEmpty.push(`${slug} (${totalDocs} docs)`)
  }
  if (nonEmpty.length) {
    console.error(
      `Target DB already has content in: ${nonEmpty.join(', ')}.\n` +
      `Refusing to import into a non-empty DB (ids would collide/duplicate).\n` +
      `Re-run with --force only if you're certain that's what you want.`,
    )
    process.exit(1)
  }
}

// ---- Generic field introspection: find every relationship/upload field
// path in a collection's config, so ids can be remapped without hardcoding
// per-collection knowledge. ----
function collectRefFields(fields, pathPrefix = []) {
  const refs = []
  for (const field of fields ?? []) {
    if (field.type === 'upload' || field.type === 'relationship') {
      refs.push({ path: [...pathPrefix, field.name], relationTo: field.relationTo, hasMany: !!field.hasMany })
    } else if (field.type === 'array') {
      refs.push(...collectRefFields(field.fields, [...pathPrefix, field.name, '[]']))
    } else if (field.type === 'group') {
      refs.push(...collectRefFields(field.fields, [...pathPrefix, field.name]))
    }
  }
  return refs
}

function remapAtPath(node, path, mapOne) {
  if (node == null) return node
  const [head, ...rest] = path
  if (head === '[]') {
    if (!Array.isArray(node)) return node
    return node.map((item) => remapAtPath(item, rest, mapOne))
  }
  if (rest.length === 0) {
    const value = node[head]
    if (value == null) return node
    node[head] = Array.isArray(value) ? value.map(mapOne) : mapOne(value)
    return node
  }
  if (node[head] == null) return node
  node[head] = remapAtPath(node[head], rest, mapOne)
  return node
}

function remapDoc(data, refFields, idMaps) {
  for (const ref of refFields) {
    const relationTo = Array.isArray(ref.relationTo) ? ref.relationTo : [ref.relationTo]
    remapAtPath(data, ref.path, (oldId) => {
      // Polymorphic relationships ({relationTo, value}) aren't used in this
      // schema, but handled defensively in case one is added later.
      const isPolymorphic = oldId && typeof oldId === 'object' && 'relationTo' in oldId
      const targetSlug = isPolymorphic ? oldId.relationTo : relationTo[0]
      const rawId = isPolymorphic ? oldId.value : oldId
      const newId = idMaps[targetSlug]?.[rawId]
      if (newId === undefined) {
        console.warn(`  WARNING: no id-map entry for ${targetSlug}#${rawId} (ref field ${ref.path.join('.')}) — leaving as-is, this will likely be a broken reference.`)
        return oldId
      }
      return isPolymorphic ? { relationTo: targetSlug, value: newId } : newId
    })
  }
  return data
}

function omit(obj, keys) {
  const out = {}
  for (const [k, v] of Object.entries(obj)) if (!keys.has(k)) out[k] = v
  return out
}

const LOCALES = ['he', 'en']

// A field is localized iff, after a locale:'all' fetch, its value is a
// plain object whose keys are all locale codes — NOT necessarily both:
// content that was never translated omits the missing locale's key
// entirely rather than including it as null (verified against real
// export data — a Hebrew-only post's `body` has only an `he` key).
function isLocaleWrapper(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false
  const keys = Object.keys(value)
  return keys.length > 0 && keys.every((k) => LOCALES.includes(k))
}

function splitLocale(value, locale) {
  if (Array.isArray(value)) return value.map((item) => splitLocale(item, locale))
  if (isLocaleWrapper(value)) return locale in value ? splitLocale(value[locale], locale) : undefined
  if (value !== null && typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      const split = splitLocale(v, locale)
      if (split !== undefined) out[k] = split
    }
    return out
  }
  return value
}

// Every `required: true, localized: true` field path in a collection/
// global's config (same traversal depth as collectRefFields — top-level
// and one array level, matching this schema's actual field usage).
function collectRequiredLocalizedPaths(fields, pathPrefix = []) {
  const paths = []
  for (const field of fields ?? []) {
    if (field.localized && field.required && (field.type === 'text' || field.type === 'textarea' || field.type === 'richText' || field.type === 'email' || field.type === 'select' || field.type === 'number')) {
      paths.push([...pathPrefix, field.name])
    }
    if (field.type === 'array') {
      paths.push(...collectRequiredLocalizedPaths(field.fields, [...pathPrefix, field.name, '[]']))
    } else if (field.type === 'group') {
      paths.push(...collectRequiredLocalizedPaths(field.fields, [...pathPrefix, field.name]))
    }
  }
  return paths
}

// Whether the raw (locale:'all'-shaped) doc has `locale` content at every
// point `path` reaches — an absent array/group simply has nothing to
// require and doesn't block the check.
function hasLocaleAtPath(node, path, locale) {
  if (node == null) return true
  const [head, ...rest] = path
  if (head === '[]') {
    if (!Array.isArray(node)) return true
    return node.every((item) => hasLocaleAtPath(item, rest, locale))
  }
  const value = node[head]
  if (rest.length === 0) {
    if (value == null) return false
    return isLocaleWrapper(value) ? locale in value : true
  }
  return hasLocaleAtPath(value, rest, locale)
}

// Builds the locale:'en' data payload for a doc, or null if this doc has
// no English content worth writing (either genuinely none, or an English
// write would itself fail required-field validation because some
// required+localized field's English side is missing).
function buildEnData(remapped, requiredLocalizedPaths, computedFields) {
  if (!requiredLocalizedPaths.every((p) => hasLocaleAtPath(remapped, p, 'en'))) return null
  const enData = omit(splitLocale(remapped, 'en'), computedFields)
  return Object.keys(enData).length > 0 ? enData : null
}

const idMaps = {}
const failures = []
for (const { slug } of collections) {
  const docs = exportedCollections[slug]
  if (!docs) continue // skipped at export time (users, inquiries)

  const collectionConfig = payload.collections[slug]?.config
  const refFields = collectRefFields(collectionConfig?.fields)
  const requiredLocalizedPaths = collectRequiredLocalizedPaths(collectionConfig?.fields)
  idMaps[slug] = {}
  let englishSkipped = 0
  let imported = 0

  for (const rawDoc of docs) {
    const oldId = rawDoc.id
    const remapped = remapDoc(structuredClone(rawDoc), refFields, idMaps)

    try {
      if (slug === 'media') {
        const filePath = path.join(projectRoot, 'media', rawDoc.filename)
        if (!fs.existsSync(filePath)) {
          console.warn(`  media#${oldId}: missing local file ${rawDoc.filename}, skipping upload`)
          failures.push({ collection: slug, oldId, reason: `missing local file ${rawDoc.filename}` })
          continue
        }
        const ext = path.extname(rawDoc.filename).toLowerCase()
        const mimetype = rawDoc.mimeType || MIME_BY_EXT[ext]
        const fileData = fs.readFileSync(filePath)
        const heData = omit(splitLocale(remapped, 'he'), MEDIA_COMPUTED_FIELDS)
        const doc = await payload.create({
          collection: 'media',
          locale: 'he',
          context: { disableRevalidate: true },
          data: heData,
          file: { data: fileData, mimetype, name: rawDoc.filename, size: fileData.length },
        })
        const enData = buildEnData(remapped, requiredLocalizedPaths, MEDIA_COMPUTED_FIELDS)
        if (enData) {
          await payload.update({ collection: 'media', id: doc.id, locale: 'en', context: { disableRevalidate: true }, data: enData })
        } else {
          englishSkipped++
        }
        idMaps.media[oldId] = doc.id
        imported++
        console.log(`  media#${oldId} -> #${doc.id} (${rawDoc.filename})`)
        continue
      }

      const heData = omit(splitLocale(remapped, 'he'), META_FIELDS)
      const doc = await payload.create({ collection: slug, locale: 'he', context: { disableRevalidate: true }, data: heData })
      const enData = buildEnData(remapped, requiredLocalizedPaths, META_FIELDS)
      if (enData) {
        await payload.update({ collection: slug, id: doc.id, locale: 'en', context: { disableRevalidate: true }, data: enData })
      } else {
        englishSkipped++
      }
      idMaps[slug][oldId] = doc.id
      imported++
    } catch (err) {
      const message = err.cause?.errors ? JSON.stringify(err.cause.errors) : err.message
      console.warn(`  ${slug}#${oldId}: FAILED, skipping — ${message}`)
      failures.push({ collection: slug, oldId, reason: message })
    }
  }
  console.log(`${slug}: imported ${imported}/${docs.length} docs${englishSkipped ? ` (${englishSkipped} without an English write — no/partial translation, same as the source)` : ''}`)
}

for (const { slug } of globals) {
  const rawDoc = exportedGlobals[slug]
  if (!rawDoc) continue
  const globalConfig = payload.globals.config.find((g) => g.slug === slug)
  const refFields = collectRefFields(globalConfig?.fields)
  const requiredLocalizedPaths = collectRequiredLocalizedPaths(globalConfig?.fields)
  const remapped = remapDoc(structuredClone(rawDoc), refFields, idMaps)

  try {
    const heData = omit(splitLocale(remapped, 'he'), META_FIELDS)
    await payload.updateGlobal({ slug, locale: 'he', context: { disableRevalidate: true }, data: heData })
    const enData = buildEnData(remapped, requiredLocalizedPaths, META_FIELDS)
    if (enData) {
      await payload.updateGlobal({ slug, locale: 'en', context: { disableRevalidate: true }, data: enData })
    }
    console.log(`global ${slug}: imported`)
  } catch (err) {
    const message = err.cause?.errors ? JSON.stringify(err.cause.errors) : err.message
    console.warn(`  global ${slug}: FAILED, skipping — ${message}`)
    failures.push({ global: slug, reason: message })
  }
}

if (failures.length) {
  console.log(`\n${failures.length} doc(s) failed to import — likely pre-existing gaps in the source content (e.g. a required field an editor never filled in), not necessarily this script's fault. Fix these in the source DB and re-run, or fill them in directly on the target once migrated:`)
  for (const f of failures) console.log(`  - ${f.global ? `global ${f.global}` : `${f.collection}#${f.oldId}`}: ${f.reason}`)
} else {
  console.log('\nNo failures.')
}
console.log('Done. Spot-check the target /admin before pointing production traffic at it.')
process.exit(0)
