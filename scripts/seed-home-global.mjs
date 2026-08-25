// Populates the `home` global with the site's current static copy
// (src/content/home.ts), so it becomes editable in the dashboard instead
// of only existing in code — getHomeContent() in src/lib/cms.ts already
// reads from this global first, falling back to the static file only when
// the global is empty (which is why the dashboard fields were blank).
//
// Run via `npm run seed-home` (payload run). MUST always be run with
// NODE_ENV=production against a production DATABASE_URI — see
// .env.example's "dev-mode hazard" note for why running anything without
// NODE_ENV=production against a production database is dangerous.
//
// TWO-PASS, ID-PRESERVING PATTERN (verified empirically, use for every
// other page's seed script too): a locale-scoped updateGlobal call must
// use plain (unwrapped) per-locale values -- an unscoped call with
// {he,en}-wrapped values works for group fields (hero) but is unreliable
// for richText nested in an array (fails validation, or a raw SQL error
// depending on insert-vs-update state). But two separate locale-scoped
// calls on an ARRAY field normally don't merge -- the second call deletes
// and re-inserts fresh rows, losing the first locale's data entirely --
// UNLESS each array item carries the SAME `id` across both calls, in
// which case Payload correctly updates the existing rows in place and
// both locales' text survives. So: write locale 'he' first WITHOUT ids
// (creating fresh rows), capture the ids Payload assigns, then write
// locale 'en' including those same ids.
import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { goalSection, heroContent, pillarCards, statTiles } from '../src/content/home.ts'

const payload = await getPayload({ config })

function richText(text, direction) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction,
          children: [{ type: 'text', format: 0, style: '', mode: 'normal', detail: 0, version: 1, text }],
        },
      ],
    },
  }
}

function dataFor(locale, ids) {
  const dir = locale === 'he' ? 'rtl' : 'ltr'
  const id = (key, index) => (ids ? { id: ids[key][index] } : {})
  return {
    hero: { eyebrow: heroContent.eyebrow[locale], title: heroContent.title[locale], body: heroContent.lead[locale] },
    statTiles: statTiles.he.map((heTile, i) => {
      // statTiles is intentionally ordered differently per locale in the
      // static fixture (a real, deliberate mockup difference — see
      // home.ts's own comment), but this global's array has one shared
      // order across locales — Hebrew's order wins as canonical.
      const enTile = statTiles.en.find((t) => t.value === heTile.value) ?? statTiles.en[i]
      const tile = locale === 'he' ? heTile : enTile
      return { ...id('statTiles', i), value: tile.value, label: tile.description }
    }),
    sectionIntros: [
      {
        ...id('sectionIntros', 0),
        key: 'goal',
        eyebrow: goalSection.eyebrow[locale],
        title: goalSection.titleLines[locale].join(' '),
        body: goalSection.lead[locale],
      },
    ],
    pillarCards: pillarCards.map((card, i) => ({
      ...id('pillarCards', i),
      number: card.number,
      title: card.title[locale],
      body: richText(card.body[locale], dir),
      linkLabel: card.linkLabel[locale],
      linkHref: `/${card.slug}`,
    })),
  }
}

const heDoc = await payload.updateGlobal({ slug: 'home', locale: 'he', context: { disableRevalidate: true }, data: dataFor('he') })
console.log('home: he written')

const ids = {
  statTiles: heDoc.statTiles.map((t) => t.id),
  sectionIntros: heDoc.sectionIntros.map((s) => s.id),
  pillarCards: heDoc.pillarCards.map((c) => c.id),
}

await payload.updateGlobal({ slug: 'home', locale: 'en', context: { disableRevalidate: true }, data: dataFor('en', ids) })
console.log('home: en written')

const check = await payload.findGlobal({ slug: 'home', locale: 'all' })
console.log('verify hero.title:', JSON.stringify(check.hero?.title))
console.log('verify goal intro title:', JSON.stringify(check.sectionIntros?.[0]?.title))
console.log('verify statTiles[0].label:', JSON.stringify(check.statTiles?.[0]?.label))
console.log('verify pillarCards[0].title:', JSON.stringify(check.pillarCards?.[0]?.title))
console.log(
  'verify pillarCards[0].body.he:',
  JSON.stringify(check.pillarCards?.[0]?.body?.he?.root?.children?.[0]?.children?.[0]?.text),
)
console.log(
  'verify pillarCards[0].body.en:',
  JSON.stringify(check.pillarCards?.[0]?.body?.en?.root?.children?.[0]?.children?.[0]?.text),
)

process.exit(0)
