// Run via `npm run export-content` (payload run) against whatever DB the
// current environment points at — normally the local SQLite dev DB — to
// dump every editorial doc to scripts/content-export.json. Pair with
// import-content.mjs to move real content onto a fresh production
// database (e.g. after switching DATABASE_URI to a new Postgres instance)
// without re-entering everything by hand. See docs on payload.config.ts's
// automatic SQLite-vs-Postgres adapter switch for why this is two scripts
// instead of one: a single process only ever holds one DB connection,
// picked from DATABASE_URI at startup.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { collections } from '../src/payload/collections/index.ts'
import { globals } from '../src/payload/globals/index.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outFile = path.join(__dirname, 'content-export.json')

// Transactional/auth data, not editorial content — never migrated. Users
// re-creates itself via Payload's normal "create first admin user" flow on
// an empty target DB; Inquiries starts fresh in production.
const SKIP_COLLECTIONS = new Set(['users', 'inquiries'])

const payload = await getPayload({ config })

const exportedCollections = {}
for (const { slug } of collections) {
  if (SKIP_COLLECTIONS.has(slug)) continue
  const { docs } = await payload.find({
    collection: slug,
    locale: 'all',
    limit: 0,
    depth: 0,
    overrideAccess: true,
  })
  docs.sort((a, b) => a.id - b.id)
  exportedCollections[slug] = docs
  console.log(`${slug}: ${docs.length} docs`)
}

const exportedGlobals = {}
for (const { slug } of globals) {
  exportedGlobals[slug] = await payload.findGlobal({ slug, locale: 'all', depth: 0, overrideAccess: true })
  console.log(`global ${slug}: exported`)
}

fs.writeFileSync(
  outFile,
  JSON.stringify({ exportedAt: new Date().toISOString(), collections: exportedCollections, globals: exportedGlobals }, null, 2),
)
console.log(`\nWrote ${outFile}`)
console.log('Media files themselves are not copied — import-content.mjs reads them straight from the local media/ folder by filename, so run both scripts from this same checkout.')
process.exit(0)
