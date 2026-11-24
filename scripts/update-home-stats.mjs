// Run via: DATABASE_URI="$DATABASE_URI_DIRECT" NODE_ENV=production npx payload run scripts/update-home-stats.mjs
import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { statTiles } from '../src/content/home.ts'

const payload = await getPayload({ config })

const heTiles = statTiles.he.map(({ value, description }) => ({ value, label: description }))
const enTiles = statTiles.en.map(({ value, description }) => ({ value, label: description }))

const heDoc = await payload.updateGlobal({
  slug: 'home',
  locale: 'he',
  context: { disableRevalidate: true },
  data: { statTiles: heTiles },
})
console.log('home.statTiles: he written')

const ids = heDoc.statTiles.map((t) => t.id)

await payload.updateGlobal({
  slug: 'home',
  locale: 'en',
  context: { disableRevalidate: true },
  data: { statTiles: enTiles.map((tile, i) => ({ ...tile, id: ids[i] })) },
})
console.log('home.statTiles: en written')

const check = await payload.findGlobal({ slug: 'home', locale: 'all' })
console.log('verify statTiles:', JSON.stringify(check.statTiles, null, 2))

process.exit(0)
