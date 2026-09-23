// One-off deep-dive report, not a standing job (unlike
// check-search-console.mjs, this isn't meant to run on a schedule — it's
// for a manual "how are we doing" pass). Same plain-Node, no-Payload/DB
// setup, same GOOGLE_SEARCH_CONSOLE_CREDENTIALS secret, run via
// `gh workflow run search-console-report.yml`.
//
// For each locale property: totals for the last 28 and last 90 days (to
// see direction, not just a snapshot), top queries, top pages, and the
// registered sitemaps' indexing status.

import { JWT } from 'google-auth-library'

const raw = process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS
if (!raw) {
  console.error('GOOGLE_SEARCH_CONSOLE_CREDENTIALS is not set.')
  process.exit(1)
}

const key = JSON.parse(raw)
const client = new JWT({
  email: key.client_email,
  key: key.private_key,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
})

const PROPERTIES = ['https://www.nivcharot.co.il/he/', 'https://www.nivcharot.co.il/en/']
const fmt = (d) => d.toISOString().slice(0, 10)
const daysAgo = (n) => fmt(new Date(Date.now() - n * 24 * 60 * 60 * 1000))

async function query(siteUrl, body) {
  const res = await client.request({
    url: `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    method: 'POST',
    data: body,
  })
  return res.data.rows ?? []
}

async function sitemaps(siteUrl) {
  const res = await client.request({
    url: `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
  })
  return res.data.sitemap ?? []
}

for (const site of PROPERTIES) {
  console.log(`\n${'='.repeat(70)}`)
  console.log(site)
  console.log('='.repeat(70))

  const [last28] = await query(site, { startDate: daysAgo(28), endDate: daysAgo(0) })
  const [last90] = await query(site, { startDate: daysAgo(90), endDate: daysAgo(0) })

  console.log('\n-- Totals --')
  console.log(`  Last 28 days: clicks=${last28?.clicks ?? 0} impressions=${last28?.impressions ?? 0} ctr=${((last28?.ctr ?? 0) * 100).toFixed(2)}% avgPosition=${(last28?.position ?? 0).toFixed(1)}`)
  console.log(`  Last 90 days: clicks=${last90?.clicks ?? 0} impressions=${last90?.impressions ?? 0} ctr=${((last90?.ctr ?? 0) * 100).toFixed(2)}% avgPosition=${(last90?.position ?? 0).toFixed(1)}`)

  const queries = await query(site, { startDate: daysAgo(28), endDate: daysAgo(0), dimensions: ['query'], rowLimit: 20 })
  console.log(`\n-- Top queries (28d, ${queries.length}) --`)
  for (const r of queries) console.log(`  [${r.clicks}c / ${r.impressions}i / pos ${r.position.toFixed(1)}] ${r.keys[0]}`)

  const pages = await query(site, { startDate: daysAgo(28), endDate: daysAgo(0), dimensions: ['page'], rowLimit: 20 })
  console.log(`\n-- Top pages (28d, ${pages.length}) --`)
  for (const r of pages) console.log(`  [${r.clicks}c / ${r.impressions}i / pos ${r.position.toFixed(1)}] ${r.keys[0]}`)

  try {
    const maps = await sitemaps(site)
    console.log(`\n-- Sitemaps (${maps.length}) --`)
    for (const m of maps) {
      const submitted = m.contents?.reduce((sum, c) => sum + Number(c.submitted ?? 0), 0) ?? 0
      const indexed = m.contents?.reduce((sum, c) => sum + Number(c.indexed ?? 0), 0) ?? 0
      console.log(`  ${m.path} — last downloaded ${m.lastDownloaded ?? 'never'}, submitted=${submitted}, indexed=${indexed}${m.isPending ? ' (pending)' : ''}${m.errors ? ` errors=${m.errors}` : ''}`)
    }
  } catch (err) {
    console.log(`\n-- Sitemaps: query failed — ${err.message} --`)
  }
}
