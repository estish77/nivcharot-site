// Updates the `home` global's statTiles (the slate "numbers" band on the
// home page) to the 5-stat set given in the 2026-09-09 brief, replacing the
// previous 4. getHomeContent() in src/lib/cms.ts only falls back to the
// static src/content/home.ts fixture when this global's statTiles array is
// EMPTY — seed-home-global.mjs already populated it, so editing the fixture
// alone has no effect on the live site; this script is the one that does.
//
// Same two-pass, id-preserving pattern as seed-home-global.mjs and
// update-nechumi-yaffe-milestone.mjs: write locale 'he' first without ids
// (fresh rows), capture the ids Payload assigns, then write locale 'en'
// with those same ids so both locales land on the same array rows instead
// of the second call's write silently orphaning the first's.
//
// Run via: DATABASE_URI="$DATABASE_URI_DIRECT" NODE_ENV=production npx payload run scripts/update-home-stats.mjs
import { getPayload } from 'payload'
import config from '../payload.config.ts'

const payload = await getPayload({ config })

const heTiles = [
  { value: '78', label: 'שנים בלי אישה חרדית אחת בכנסת מטעם מפלגה חרדית, מ־1948 ועד היום' },
  { value: '18', label: 'מנדטים למפלגות החרדיות בכנסת ה־25' },
  { value: '13', label: 'שנות מאבק ציבורי, משפטי ותודעתי למען נשים חרדיות במוקדי קבלת החלטות' },
  { value: '250', label: 'נשים שעוברות הכשרה בתוכניות המנהיגות של נבחרות לאורך 9 שנים' },
  { value: '1', label: 'שובצה בימים אלה במקום השני ברשימה של מפלגה חרדית' },
]

const enTiles = [
  { value: '78', label: 'Years without a single Haredi woman in the Knesset from a Haredi party, 1948 to today' },
  { value: '18', label: 'Knesset seats held by the Haredi parties in the 25th Knesset' },
  { value: '13', label: 'Years of public, legal, and awareness-raising struggle for Haredi women in decision-making positions' },
  { value: '250', label: "Women trained through Nivcharot's leadership programs over 9 years" },
  { value: '1', label: "Woman placed second on a Haredi party's list this week" },
]

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
