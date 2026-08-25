// Seeds the `hero` group (+ one `sectionIntros` entry for About/Activism)
// of the six page-copy globals that were still empty in the dashboard:
// about, story, activism, podcast, hanivcheret, donate. `home` was already
// seeded by seed-home-global.mjs — this is the same partial-wiring pattern
// applied to the remaining pages, per src/lib/cms.ts's getAboutContent /
// getStoryContent / getActivismContent / getPodcastHeroContent /
// getHanivcheretContent / getDonateContent.
//
// Only the fields those getters actually read are written here — richer
// content (About's sourced stat tiles and "means" bullet lists, Story's
// 20-entry timeline, Activism's four pillar blocks and FAQ accordion,
// Hanivcheret's curriculum grid and alumnae quotes) intentionally stays in
// the static fixture files: the current `hero`/`pillarCards`/`statTiles`/
// `sectionIntros` schema shared by every page-copy global (see
// src/payload/fields/globalSections.ts) can't represent it without
// silently dropping real content, so it's left for a later schema change.
//
// Run via `npm run seed-remaining` (payload run). MUST always be run with
// NODE_ENV=production against a production DATABASE_URI — see
// .env.example's "dev-mode hazard" note for why running anything without
// NODE_ENV=production against a production database is dangerous.
//
// Uses seed-home-global.mjs's proven two-pass, ID-preserving pattern for
// every write (see that file's header comment for the full empirical
// explanation): locale 'he' is written first, its array-item ids are
// captured, then locale 'en' is written including those same ids so
// Payload updates the existing array rows in place instead of deleting and
// re-inserting fresh ones (which would lose the first locale's data).
// Applied here even to the hero-only pages, and even though none of these
// fields are richText, simply to reuse the one write path already verified
// safe rather than trust an untested unscoped-write shortcut.
import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { aboutContent } from '../src/content/about.ts'
import { storyContent } from '../src/content/story.ts'
import { activismHalachaSection, activismHero } from '../src/content/activism.ts'
import { podcastText } from '../src/content/podcast.ts'
import { hanivcheretHero } from '../src/content/hanivcheret.ts'
import { donateHero } from '../src/content/donate.ts'

const payload = await getPayload({ config })

const aboutHeroNorm = { eyebrow: aboutContent.hero.eyebrow, title: aboutContent.hero.title, body: aboutContent.hero.lead }
const aboutPurposeNorm = { eyebrow: aboutContent.purpose.eyebrow, title: aboutContent.purpose.title, body: aboutContent.purpose.lead }
const storyHeroNorm = { eyebrow: storyContent.hero.eyebrow, title: storyContent.hero.title, body: storyContent.hero.lead }
const activismHeroNorm = {
  eyebrow: activismHero.eyebrow,
  title: {
    he: `${activismHero.titleLine1.he}\n${activismHero.titleLine2.he}`,
    en: `${activismHero.titleLine1.en}\n${activismHero.titleLine2.en}`,
  },
  body: activismHero.lead,
}
const activismHalakhaNorm = { eyebrow: activismHalachaSection.eyebrow, title: activismHalachaSection.title, body: activismHalachaSection.lead }
const podcastHeroNorm = { eyebrow: podcastText.heroEyebrow, title: podcastText.heroTitle, body: podcastText.heroLead }
const hanivcheretHeroNorm = { eyebrow: hanivcheretHero.eyebrow, title: hanivcheretHero.title, body: hanivcheretHero.bodyPrimary }
const donateHeroNorm = { eyebrow: donateHero.eyebrow, title: donateHero.title, body: donateHero.body }

async function seedHeroOnly(slug, hero) {
  const dataFor = (locale) => ({
    hero: { eyebrow: hero.eyebrow[locale], title: hero.title[locale], body: hero.body[locale] },
  })
  await payload.updateGlobal({ slug, locale: 'he', context: { disableRevalidate: true }, data: dataFor('he') })
  await payload.updateGlobal({ slug, locale: 'en', context: { disableRevalidate: true }, data: dataFor('en') })
  console.log(`${slug}: hero written`)
}

async function seedHeroPlusIntro(slug, hero, introKey, intro) {
  const dataFor = (locale, ids) => ({
    hero: { eyebrow: hero.eyebrow[locale], title: hero.title[locale], body: hero.body[locale] },
    sectionIntros: [
      {
        ...(ids ? { id: ids[0] } : {}),
        key: introKey,
        eyebrow: intro.eyebrow[locale],
        title: intro.title[locale],
        body: intro.body[locale],
      },
    ],
  })
  const heDoc = await payload.updateGlobal({ slug, locale: 'he', context: { disableRevalidate: true }, data: dataFor('he') })
  const ids = (heDoc.sectionIntros ?? []).map((s) => s.id)
  await payload.updateGlobal({ slug, locale: 'en', context: { disableRevalidate: true }, data: dataFor('en', ids) })
  console.log(`${slug}: hero + ${introKey} intro written`)
}

await seedHeroPlusIntro('about', aboutHeroNorm, 'purpose', aboutPurposeNorm)
await seedHeroOnly('story', storyHeroNorm)
await seedHeroPlusIntro('activism', activismHeroNorm, 'halakha', activismHalakhaNorm)
await seedHeroOnly('podcast', podcastHeroNorm)
await seedHeroOnly('hanivcheret', hanivcheretHeroNorm)
await seedHeroOnly('donate', donateHeroNorm)

for (const slug of ['about', 'story', 'activism', 'podcast', 'hanivcheret', 'donate']) {
  const check = await payload.findGlobal({ slug, locale: 'all' })
  console.log(`verify ${slug}.hero.title:`, JSON.stringify(check.hero?.title))
  if (check.sectionIntros?.length) {
    console.log(`verify ${slug}.sectionIntros[0].title:`, JSON.stringify(check.sectionIntros[0]?.title))
  }
}

process.exit(0)
