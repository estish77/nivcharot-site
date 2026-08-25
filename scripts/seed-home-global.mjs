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
// KNOWN LIMITATION (verified empirically, not guessed): for this global's
// array fields (statTiles/pillarCards/sectionIntros), Payload's Postgres/
// SQLite adapters do not merge per-locale writes across two separate
// updateGlobal calls the way they do for plain group fields (hero) — the
// second call's locale silently replaces the whole array's text for BOTH
// locales, and a single unscoped call with {he,en}-wrapped values is
// unreliable for richText nested in an array (validated then hits a raw
// SQL error depending on insert-vs-update state). Writing Hebrew LAST
// wins that overwrite, so English visitors will see Hebrew stat-tile
// labels, pillar-card text, and the "goal" section intro until a real
// fix lands — hero (a group field, not an array) is unaffected and reads
// correctly in both languages. Flagged, not silently accepted.
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

function dataFor(locale) {
  const dir = locale === 'he' ? 'rtl' : 'ltr'
  return {
    hero: { eyebrow: heroContent.eyebrow[locale], title: heroContent.title[locale], body: heroContent.lead[locale] },
    statTiles: statTiles[locale].map((tile) => ({ value: tile.value, label: tile.description })),
    sectionIntros: [
      { key: 'goal', eyebrow: goalSection.eyebrow[locale], title: goalSection.titleLines[locale].join(' '), body: goalSection.lead[locale] },
    ],
    pillarCards: pillarCards.map((card) => ({
      number: card.number,
      title: card.title[locale],
      body: richText(card.body[locale], dir),
      linkLabel: card.linkLabel[locale],
      linkHref: `/${card.slug}`,
    })),
  }
}

// Hebrew (defaultLocale, fallback:true) written last on purpose — see the
// KNOWN LIMITATION note above.
await payload.updateGlobal({ slug: 'home', locale: 'en', context: { disableRevalidate: true }, data: dataFor('en') })
console.log('home: en written')
await payload.updateGlobal({ slug: 'home', locale: 'he', context: { disableRevalidate: true }, data: dataFor('he') })
console.log('home: he written')

const check = await payload.findGlobal({ slug: 'home', locale: 'all' })
console.log('verify hero.title:', JSON.stringify(check.hero?.title))
console.log('verify goal intro title:', JSON.stringify(check.sectionIntros?.[0]?.title))
console.log('verify statTiles:', JSON.stringify(check.statTiles))
console.log('verify pillarCards count:', check.pillarCards?.length)

process.exit(0)
