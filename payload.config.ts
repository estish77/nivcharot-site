import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { collections } from './src/payload/collections'
import { globals } from './src/payload/globals'
import { Users } from './src/payload/collections/Users'
import { migrations } from './src/migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseURI = process.env.DATABASE_URI || 'file:./payload.db'

/**
 * 2026-08-16 brief: "מערכת ניהול דשבורד... נגיש ונעים לעבודה" — local
 * development defaults to SQLite (zero external infrastructure, just a
 * local file) unless `DATABASE_URI` is a real Postgres connection string,
 * in which case a production deploy transparently gets the adapter that
 * actually persists — SQLite's local file doesn't survive most hosts'
 * ephemeral filesystem (e.g. Vercel serverless). One config that works
 * unchanged in both places; see .env.example.
 *
 * Postgres only auto-creates its schema in development (`pushDevSchema`,
 * inside @payloadcms/db-postgres's connect.js) — in production it's a
 * no-op unless `prodMigrations` is set, in which case that exact array is
 * applied on every cold connect. Without this, a fresh production
 * Postgres database never gets any tables at all: public pages still
 * "work" because every content-fetching function in src/lib/cms.ts
 * catches the resulting DB error and falls back to static content, but
 * /admin has no such fallback and fails outright. `src/migrations/`
 * is real, committed schema history (unlike gitignored payload-types.ts)
 * — regenerate with `payload migrate:create <name>` after schema changes.
 *
 * NEVER point a dev-mode process (`next dev`, or anything else that
 * doesn't set NODE_ENV=production) at a production DATABASE_URI — dev
 * mode's schema push writes a `batch: -1` marker into the
 * `payload_migrations` table, and every subsequent production start then
 * blocks forever on an interactive confirmation prompt no real server can
 * answer. See .env.example for the recovery step if this ever happens.
 */
const db = databaseURI.startsWith('file:')
  ? sqliteAdapter({ client: { url: databaseURI } })
  : postgresAdapter({ pool: { connectionString: databaseURI }, prodMigrations: migrations })

// NOTE: buildConfig only assembles/validates the config object below — it
// does not open a database connection. That only happens when Payload is
// actually initialized (e.g. by `next dev`/`next build` or the Payload CLI).
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: dirname,
    },
  },
  collections: [Users, ...collections],
  globals: [...globals],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: ['he', 'en'],
    defaultLocale: 'he',
    fallback: true,
  },
  db,
  sharp,
  plugins: [
    // Same local-dev-vs-production split as `db` above: with no
    // BLOB_READ_WRITE_TOKEN set (local dev, see .env.example) this plugin
    // disables itself and Media.ts's local `staticDir` upload keeps
    // working untouched; set the token in production and uploads persist
    // in Vercel Blob instead of a local disk that doesn't survive a deploy.
    vercelBlobStorage({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      collections: { media: true },
    }),
  ],
})
