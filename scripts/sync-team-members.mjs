// Pushes src/content/team.ts's roster into the `team-members` collection so
// the team page is actually editable from the dashboard.
//
//   npm run sync-team-members
//
//   NODE_ENV=production DATABASE_URI="<prod postgres uri>" npm run sync-team-members
//
// 2026-08-28 brief: "check this whole page is editable in the system, photos
// and text". It was not. `getTeamMembers()` reads the collection and falls
// back to the static fixture only when the collection is EMPTY - and in
// production it was empty, so the live page was rendering the fixture and
// nothing in the dashboard could change it. Worse, that state is a trap:
// adding a single member through the dashboard would have made the
// collection non-empty and silently hidden every other person on the page.
//
// Unlike scripts/seed-content.mjs (create-only, skips anyone who already
// exists) this is a real sync: it updates existing people in place, so
// re-running after an edit to the fixture carries the change through. It
// matches on the Hebrew name, which is what seed-content.mjs used, so the
// two agree about identity.
//
// People dropped from the fixture are DEACTIVATED (active: false), never
// deleted: the page filters on `active`, so they disappear from the site
// while their record and photo stay recoverable in the dashboard.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { teamMembers } from '../src/content/team.ts'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
/*
 * Guard against the trap this script fell into on 2026-08-28.
 *
 * Payload's postgres adapter enables schema `push` whenever NODE_ENV isn't
 * 'production'. Run this against the production database without it and
 * Payload pushes, then records a `dev` row with batch -1 in
 * payload_migrations. From that point on EVERY production start and every
 * Vercel build stops on an interactive "you've run Payload in dev mode"
 * prompt (@payloadcms/drizzle/dist/migrate.js) and hangs forever with no
 * TTY to answer it. Two builds hung for 20+ minutes before anyone noticed,
 * and clearing it needs a manual DELETE against production.
 *
 * The header above has always said to set NODE_ENV=production. Saying so
 * is evidently not enough, so refuse instead.
 */
/*
 * THIS SCRIPT MAY NO LONGER TOUCH PRODUCTION.
 *
 * It was written to seed the roster into an empty collection so that the
 * team page could be edited in /admin at all. It did that job. But it
 * rewrites name, role, bio, category, order and active for every person in
 * the fixture on every run — so it silently reverts anything edited in the
 * dashboard since the last run.
 *
 * That is exactly what it did on 2026-08-28: a day's work on the team page
 * in /admin was overwritten by runs of this script. The collection is the
 * source of truth now, not `src/content/team.ts`, and the instruction is
 * that the team changes through the dashboard only.
 *
 * So it refuses against postgres outright, regardless of NODE_ENV. It stays
 * usable against the local sqlite database for development. If a production
 * seed is ever genuinely needed again, that must be a deliberate reviewed
 * one-off, not something this script can do just by being run.
 */
if (process.env.DATABASE_URI?.startsWith('postgres')) {
  console.error(
    [
      'Refusing to run against production.',
      '',
      'This script overwrites name, role, bio, category, order and active for every',
      'person in the fixture, so it reverts anything edited in /admin since the last',
      'run. The team-members collection is the source of truth — edit the team in the',
      'dashboard instead.',
    ].join('\n'),
  )
  process.exit(1)
}

const payload = await getPayload({ config })

/** Payload's richText wants Lexical JSON, not a string. */
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
        children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
      })),
    },
  }
}

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }

/** Uploads a photo from /public once, reusing it if a media doc already has that filename. */
async function uploadPhoto(relPath, altHe, altEn) {
  const absPath = path.join(projectRoot, 'public', relPath.replace(/^\//, ''))
  if (!fs.existsSync(absPath)) {
    console.warn(`  photo missing on disk, leaving unset: ${relPath}`)
    return null
  }
  const filename = path.basename(absPath)
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })
  if (existing.docs[0]) return existing.docs[0].id

  const data = fs.readFileSync(absPath)
  const mimetype = MIME[path.extname(absPath).toLowerCase()]
  if (!mimetype) {
    console.warn(`  unsupported image type, leaving unset: ${relPath}`)
    return null
  }

  try {
    const doc = await payload.create({
      collection: 'media',
      locale: 'he',
      context: { disableRevalidate: true },
      data: { alt: altHe },
      file: { data, name: filename, mimetype, size: data.length },
    })
    await payload.update({
      collection: 'media',
      id: doc.id,
      locale: 'en',
      context: { disableRevalidate: true },
      data: { alt: altEn },
    })
    return doc.id
  } catch (error) {
    // A few of the mirrored team photos are truncated on disk and Sharp
    // rejects them (seed-content.mjs hit the same thing). One bad image must
    // not abort the whole roster sync - that person just keeps the
    // placeholder, and the text still syncs.
    console.warn(`  photo upload failed for ${relPath}: ${error.message} — leaving photo unset.`)
    return null
  }
}

let created = 0
let updated = 0
let deactivated = 0
const seenNames = new Set()

for (const member of teamMembers) {
  seenNames.add(member.name.he)

  const found = await payload.find({
    collection: 'team-members',
    where: { name: { equals: member.name.he } },
    limit: 1,
    locale: 'he',
  })
  const existing = found.docs[0]

  /*
   * Photos are only uploaded when blob storage is actually configured for
   * this process. Running against production from a laptop, it is not:
   * Vercel refuses to hand out production secrets, so `vercelBlobStorage`
   * disables itself and the bytes would land on the local disk while the
   * production row recorded a filename the blob store has never seen -
   * broken images on the live page.
   *
   * Skipping the upload is safe because `getTeamMembers()` falls back to
   * the photo bundled at /public/assets/team for any row that has none, so
   * the portraits keep rendering either way, and uploading through the
   * dashboard (which does have the token) overrides them.
   */
  const canUploadPhotos = Boolean(process.env.BLOB_READ_WRITE_TOKEN) || !process.env.DATABASE_URI?.startsWith('postgres')
  let photoId = existing?.photo ?? null
  if (member.photo && !photoId && canUploadPhotos) {
    photoId = await uploadPhoto(member.photo.src, member.photo.alt.he, member.photo.alt.en)
  }

  const he = {
    name: member.name.he,
    role: member.role.he,
    // `null`, not `undefined`: a member whose bio was deliberately removed
    // from the fixture (Reader-Indursky is meant to be title-only) must have
    // it cleared in the CMS too. `undefined` reads as "leave unchanged" and
    // would strand the old paragraph in the database forever.
    bio: member.bio ? textToLexical([member.bio.he], 'rtl') : null,
    photo: photoId ?? undefined,
    category: member.category ?? 'staff',
    order: member.order,
    active: member.active,
  }
  const en = {
    name: member.name.en,
    role: member.role.en,
    bio: member.bio ? textToLexical([member.bio.en], 'ltr') : null,
  }

  const id = existing
    ? (
        await payload.update({
          collection: 'team-members',
          id: existing.id,
          locale: 'he',
          context: { disableRevalidate: true },
          data: he,
        })
      ).id
    : (
        await payload.create({
          collection: 'team-members',
          locale: 'he',
          context: { disableRevalidate: true },
          data: he,
        })
      ).id
  await payload.update({
    collection: 'team-members',
    id,
    locale: 'en',
    context: { disableRevalidate: true },
    data: en,
  })

  if (existing) updated++
  else created++
  console.log(`  ok: ${member.name.he}`)
}

/*
 * Retiring people.
 *
 * This used to hide EVERY row the fixture didn't mention. That was fine
 * while the fixture was the only source of truth, but it stopped being safe
 * the moment the roster became editable in /admin: a person added through
 * the dashboard is, by definition, not in the fixture, so the next run of
 * this script quietly deactivated her. That is exactly what happened to
 * שני מונצ'ק, added at 08:17 and hidden by a sync at 11:30 the same day.
 *
 * So the sweep is now explicit. Only names listed here get retired, and a
 * row this script has never heard of is left exactly as the dashboard has
 * it. Add a name below when someone is deliberately taken off the roster.
 */
const RETIRED = ['מירי רוזן', 'מירה זוהר']

const all = await payload.find({ collection: 'team-members', limit: 500, locale: 'he', depth: 0 })
for (const doc of all.docs) {
  if (!RETIRED.includes(doc.name) || seenNames.has(doc.name) || doc.active === false) continue
  await payload.update({
    collection: 'team-members',
    id: doc.id,
    locale: 'he',
    context: { disableRevalidate: true },
    data: { active: false },
  })
  deactivated++
  console.log(`  deactivated (retired from the roster): ${doc.name}`)
}

console.log(`\ncreated=${created} updated=${updated} deactivated=${deactivated}`)
const verify = await payload.find({ collection: 'team-members', limit: 500, depth: 0 })
console.log(`verify: ${verify.totalDocs} in the collection`)
process.exit(0)
