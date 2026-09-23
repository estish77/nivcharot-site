// One-off / on-demand connectivity check for the Search Console service
// account (see src/lib/searchConsole.ts's doc comment for the setup this
// verifies). Deliberately plain Node, no Payload/DB involved — this only
// needs GOOGLE_SEARCH_CONSOLE_CREDENTIALS, so it can run as a standalone
// GitHub Actions job (see .github/workflows/check-search-console.yml)
// without the Preview-environment Payload wiring (PAYLOAD_SECRET,
// DATABASE_URI) that /api/admin/search-console's route depends on.
//
// Prints site visibility + 28-day totals — safe to print/log: aggregate
// SEO numbers and property URLs, never the credential itself.

import { JWT } from 'google-auth-library'

const raw = process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS
if (!raw) {
  console.error('GOOGLE_SEARCH_CONSOLE_CREDENTIALS is not set.')
  process.exit(1)
}

let key
try {
  key = JSON.parse(raw)
} catch {
  console.error('GOOGLE_SEARCH_CONSOLE_CREDENTIALS is not valid JSON.')
  process.exit(1)
}

if (!key.client_email || !key.private_key) {
  console.error('Parsed JSON is missing client_email/private_key — not a service account key.')
  process.exit(1)
}

const client = new JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
})

console.log(`Authenticating as ${key.client_email} ...`)

const sitesRes = await client.request({ url: 'https://www.googleapis.com/webmasters/v3/sites' })
const sites = sitesRes.data.siteEntry ?? []
console.log(`\nSites visible to this service account (${sites.length}):`)
for (const s of sites) console.log(`  - ${s.siteUrl}  [${s.permissionLevel}]`)

if (sites.length === 0) {
  console.log('\nNo sites visible — the service account may not have been added as a user on any property yet.')
  process.exit(0)
}

const end = new Date()
const start = new Date(end.getTime() - 28 * 24 * 60 * 60 * 1000)
const fmt = (d) => d.toISOString().slice(0, 10)

console.log(`\n28-day totals (${fmt(start)} to ${fmt(end)}):`)
for (const s of sites) {
  try {
    const res = await client.request({
      url: `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(s.siteUrl)}/searchAnalytics/query`,
      method: 'POST',
      data: { startDate: fmt(start), endDate: fmt(end) },
    })
    const row = res.data.rows?.[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 }
    console.log(`  ${s.siteUrl}: clicks=${row.clicks} impressions=${row.impressions} ctr=${(row.ctr * 100).toFixed(2)}% avgPosition=${row.position.toFixed(1)}`)
  } catch (err) {
    console.log(`  ${s.siteUrl}: query failed — ${err.message}`)
  }
}
