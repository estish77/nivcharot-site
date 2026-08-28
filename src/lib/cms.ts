import config from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { NavLink } from '@/components/ui'
import { goalSection, heroContent, pillarCards, statTiles } from '@/content/home'
import { aboutContent } from '@/content/about'
import { storyContent, timelineMilestones, type TimelineMilestone } from '@/content/story'
import { activismFaqs, activismHero, activismHalachaSection } from '@/content/activism'
import { halachaHero } from '@/content/halacha'
import { mishpatFallbackBody, mishpatHero } from '@/content/mishpat'
import { podcastText } from '@/content/podcast'
import { hanivcheretAlumnaPlaceholder, hanivcheretHero, hanivcheretQuotes } from '@/content/hanivcheret'
import { donateHero } from '@/content/donate'
import { archivePosts as staticArchivePosts, type ArchivePost } from '@/content/media'
import { otherPodcasts as staticOtherPodcasts, talksAndConferences as staticTalksAndConferences, videoArticles as staticVideoArticles, type ElsewhereMediaItem } from '@/content/elsewhere-media'
import { pressArchiveItemsSorted as staticPressArchiveItemsSorted, sortPressItemsDesc, type PressArchiveItem } from '@/content/press-archive'
import { teamHero, teamMembers as staticTeamMembers, teamSectionIntro, type TeamMember } from '@/content/team'
import { navLinksFor } from '@/lib/nav'
import { type Locale, type Localized } from '@/lib/i18n'

export type PayloadHomeContent = {
  hero: typeof heroContent
  goalSection: typeof goalSection
  statTiles: Array<{ value: string; description: string }>
  pillarCards: typeof pillarCards
}

export type PayloadSiteSettings = {
  contactEmail: string
  social: {
    facebook?: string
    instagram?: string
    youtube?: string
    spotify?: string
    applePodcasts?: string
    podcastInstagram?: string
    hostInstagram?: string
    hostFacebook?: string
    hostX?: string
    hostTiktok?: string
  }
  donation: {
    standingOrderUrl?: string
    cardUrl?: string
  }
}

function resolveLocalizedValue(value: unknown, locale: Locale, fallback: string): string {
  if (typeof value === 'string') return value || fallback
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const localized = record[locale] ?? record.he ?? record.en
    if (typeof localized === 'string') return localized || fallback
  }
  return fallback
}

async function getPayloadInstance() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) {
    return null
  }

  try {
    return await getPayload({ config })
  } catch {
    return null
  }
}

/**
 * Every global/collection registers a `revalidateGlobal(tag)` /
 * `revalidateCollection(tag)` afterChange hook (src/payload/hooks/revalidate.ts)
 * that calls `revalidateTag(tag, ...)` whenever an editor saves a change —
 * but that only invalidates something if a Next.js cache entry was actually
 * tagged with it. Every getter in this file used to call the Payload Local
 * API directly with no cache tag attached, so those `revalidateTag` calls
 * had nothing to invalidate: public pages only ever picked up a dashboard
 * edit on the next full redeploy, when the static pages were rebuilt from
 * scratch. Wrapping each read below in `unstable_cache(fn, keyParts, {
 * tags: [tag] })` — this project doesn't set `cacheComponents` in
 * next.config.ts, so it's on Next 16's "previous" caching model, where
 * `unstable_cache` (not the newer `"use cache"` directive) is still how
 * non-fetch reads participate in the tag-based Data Cache — makes the two
 * halves finally meet: a save now busts exactly the right cache entry and
 * the next visitor gets the fresh content, no redeploy required.
 */
/*
 * The `revalidate` window is a backstop, not the main mechanism.
 *
 * Tag invalidation only fires from the afterChange hooks, which need a
 * request context — so a dashboard save is instant, but anything written
 * outside a request never busts its tag. Our own seed and sync scripts are
 * exactly that: they pass `context: { disableRevalidate: true }` because
 * `revalidateTag` throws outside a request. Without an expiry, entries live
 * forever, and Vercel's Data Cache survives redeploys — so content written
 * by a script stayed invisible on the live site indefinitely. That is how
 * the team bios synced on 2026-08-28 could be correct in Postgres and
 * absent from the page after a successful deploy.
 *
 * Five minutes keeps saves feeling immediate (the tag still busts them at
 * once) while guaranteeing every other write path self-heals.
 */
const CACHE_REVALIDATE_SECONDS = 300

function cachedPayloadRead<T>(tag: string, keyParts: string[], fn: () => Promise<T>): Promise<T> {
  return unstable_cache(fn, [tag, ...keyParts], { tags: [tag], revalidate: CACHE_REVALIDATE_SECONDS })()
}

export async function getHomeContent(locale: Locale): Promise<PayloadHomeContent> {
  const fallback: PayloadHomeContent = {
    hero: heroContent,
    goalSection,
    statTiles: statTiles[locale],
    pillarCards,
  }

  const payload = await getPayloadInstance()
  if (!payload) {
    return fallback
  }

  try {
    const doc = await cachedPayloadRead('home', [locale], () => payload.findGlobal({ slug: 'home', locale }))

    if (!doc) {
      return fallback
    }

    const hero = doc.hero ?? {}
    const rawTiles = Array.isArray(doc.statTiles) ? doc.statTiles : []
    const rawCards = Array.isArray(doc.pillarCards) ? doc.pillarCards : []

    const nextHero = {
      eyebrow: { he: resolveLocalizedValue(hero.eyebrow, 'he', heroContent.eyebrow.he), en: resolveLocalizedValue(hero.eyebrow, 'en', heroContent.eyebrow.en) },
      title: { he: resolveLocalizedValue(hero.title, 'he', heroContent.title.he), en: resolveLocalizedValue(hero.title, 'en', heroContent.title.en) },
      lead: { he: resolveLocalizedValue(hero.body, 'he', heroContent.lead.he), en: resolveLocalizedValue(hero.body, 'en', heroContent.lead.en) },
      primaryCta: heroContent.primaryCta,
      secondaryCta: heroContent.secondaryCta,
    }

    const nextTiles = rawTiles.length
      ? rawTiles.map((tile) => ({
        value: String(tile?.value ?? ''),
        description: String(tile?.label ?? tile?.source ?? ''),
      }))
      : statTiles[locale]

    const nextCards = rawCards.length
      ? rawCards.map((card, index) => ({
        id: String(card?.number ?? `card-${index + 1}`),
        number: String(card?.number ?? `${index + 1}`.padStart(2, '0')),
        title: {
          he: resolveLocalizedValue(card?.title, 'he', pillarCards[index]?.title.he ?? ''),
          en: resolveLocalizedValue(card?.title, 'en', pillarCards[index]?.title.en ?? ''),
        } satisfies Localized,
        // `card.body` is richText: at this getter's specific-locale query
        // (not `locale: 'all'`), it comes back as one resolved Lexical doc
        // for the current locale, not a `{he, en}` pair — resolveLocalizedValue
        // (built for plain-string fields) can't read a locale key off that
        // shape and was silently falling through to the static fallback on
        // every render. Same bug class as the Story timeline's body field
        // (already fixed) — flatten via lexicalToParagraphs instead. Both
        // `he`/`en` slots get the same extracted text, matching how `title`/
        // `linkLabel` above already behave at this same specific-locale query
        // (each getHomeContent(locale) call only ever populates the slot
        // matching its own `locale` correctly; the other slot is never read).
        body: (() => {
          const text = lexicalToParagraphs(card?.body).join(' ')
          return {
            he: text || pillarCards[index]?.body.he || '',
            en: text || pillarCards[index]?.body.en || '',
          } satisfies Localized
        })(),
        linkLabel: {
          he: resolveLocalizedValue(card?.linkLabel, 'he', pillarCards[index]?.linkLabel.he ?? ''),
          en: resolveLocalizedValue(card?.linkLabel, 'en', pillarCards[index]?.linkLabel.en ?? ''),
        } satisfies Localized,
        slug: typeof card?.linkHref === 'string' && card.linkHref.length > 0 ? card.linkHref.replace(/^\/+/, '').replace(/\/$/, '') : pillarCards[index]?.slug ?? 'story',
      }))
      : pillarCards

    const rawIntros = Array.isArray(doc.sectionIntros) ? doc.sectionIntros : []
    const goalIntro = rawIntros.find((intro) => intro?.key === 'goal')

    return {
      hero: nextHero,
      // `goalSection` ("Our purpose") used to be built from `doc.hero`'s
      // fields — a copy/paste bug: it silently duplicated the Hero section
      // instead of reading its own content. Fixed to read the
      // `sectionIntros` entry keyed `'goal'` (already in the Home global's
      // schema, previously unused for this), matching how every other
      // page's section-intro is modeled.
      goalSection: {
        eyebrow: {
          he: resolveLocalizedValue(goalIntro?.eyebrow, 'he', goalSection.eyebrow.he),
          en: resolveLocalizedValue(goalIntro?.eyebrow, 'en', goalSection.eyebrow.en),
        },
        titleLines: {
          he: [resolveLocalizedValue(goalIntro?.title, 'he', goalSection.titleLines.he[0] ?? '')],
          en: [resolveLocalizedValue(goalIntro?.title, 'en', goalSection.titleLines.en[0] ?? '')],
        },
        lead: {
          he: resolveLocalizedValue(goalIntro?.body, 'he', goalSection.lead.he),
          en: resolveLocalizedValue(goalIntro?.body, 'en', goalSection.lead.en),
        },
      },
      statTiles: nextTiles,
      pillarCards: nextCards,
    }
  } catch {
    return fallback
  }
}

/** Plain, single-locale eyebrow/title/body text — the shape shared by every page-copy global's `hero` group. */
export type SimpleHeroContent = { eyebrow: string; title: string; body: string }

/**
 * Partial dashboard wiring for the six remaining page-copy globals (About,
 * Story, Activism, Podcast, HaNivcheret, Donate) — each shares `home`'s
 * schema (heroField/statTilesField/pillarCardsField/sectionIntrosField, see
 * src/payload/fields/globalSections.ts) but only the fields below actually
 * fit each page's real content without forcing richer material (About's
 * sourced stat tiles and "means" bullet lists, Story's 20-entry timeline,
 * Activism's four pillar blocks and FAQ accordion, Hanivcheret's curriculum
 * grid and alumnae quotes) into a shape that would silently drop it. Same
 * try/fall-back-to-static-fixture pattern as `getHomeContent` above.
 */
export async function getAboutContent(
  locale: Locale,
): Promise<{ hero: SimpleHeroContent; purpose: SimpleHeroContent }> {
  const fallback = {
    hero: {
      eyebrow: aboutContent.hero.eyebrow[locale],
      title: aboutContent.hero.title[locale],
      body: aboutContent.hero.lead[locale],
    },
    purpose: {
      eyebrow: aboutContent.purpose.eyebrow[locale],
      title: aboutContent.purpose.title[locale],
      body: aboutContent.purpose.lead[locale],
    },
  }

  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const doc = await cachedPayloadRead('about', [locale], () => payload.findGlobal({ slug: 'about', locale }))
    const hero = (doc?.hero ?? {}) as Record<string, unknown>
    const intros = Array.isArray(doc?.sectionIntros) ? (doc.sectionIntros as Record<string, unknown>[]) : []
    const purposeIntro = intros.find((intro) => intro?.key === 'purpose')

    return {
      hero: {
        eyebrow: resolveLocalizedValue(hero.eyebrow, locale, fallback.hero.eyebrow),
        title: resolveLocalizedValue(hero.title, locale, fallback.hero.title),
        body: resolveLocalizedValue(hero.body, locale, fallback.hero.body),
      },
      purpose: purposeIntro
        ? {
            eyebrow: resolveLocalizedValue(purposeIntro.eyebrow, locale, fallback.purpose.eyebrow),
            title: resolveLocalizedValue(purposeIntro.title, locale, fallback.purpose.title),
            body: resolveLocalizedValue(purposeIntro.body, locale, fallback.purpose.body),
          }
        : fallback.purpose,
    }
  } catch {
    return fallback
  }
}

/**
 * Editable copy for the team page: the hero, and the intro above the member
 * lists.
 *
 * 2026-08-28 brief ("check the whole page is editable in the system"). The
 * member cards were already fully editable through the `team-members`
 * collection (name, role, bio, photo, category, order, active) but this
 * surrounding copy was hardcoded in `src/content/team.ts` with no way to
 * change it from the dashboard.
 *
 * It rides on the `about` global's existing `sectionIntros` array, which was
 * built for exactly this — its `key` field is documented as "a stable
 * identifier the page template matches, e.g. team, faq" — so this needs no
 * new collection and no database migration. Add a `team-hero` or `team`
 * entry under Pages -> About -> Section intros and it takes effect; leave
 * it out and the fixture text below is used unchanged.
 */
export async function getTeamPageContent(locale: Locale): Promise<{
  hero: SimpleHeroContent
  intro: { eyebrow: string; title: string }
}> {
  const fallback = {
    hero: {
      eyebrow: teamHero.eyebrow[locale],
      title: teamHero.title[locale],
      body: teamHero.lead[locale],
    },
    intro: {
      eyebrow: teamSectionIntro.eyebrow[locale],
      title: teamSectionIntro.title[locale],
    },
  }

  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const doc = await cachedPayloadRead('about', [locale], () => payload.findGlobal({ slug: 'about', locale }))
    const intros = Array.isArray(doc?.sectionIntros) ? (doc.sectionIntros as Record<string, unknown>[]) : []
    const heroIntro = intros.find((intro) => intro?.key === 'team-hero')
    const listIntro = intros.find((intro) => intro?.key === 'team')

    return {
      hero: heroIntro
        ? {
            eyebrow: resolveLocalizedValue(heroIntro.eyebrow, locale, fallback.hero.eyebrow),
            title: resolveLocalizedValue(heroIntro.title, locale, fallback.hero.title),
            body: resolveLocalizedValue(heroIntro.body, locale, fallback.hero.body),
          }
        : fallback.hero,
      intro: listIntro
        ? {
            eyebrow: resolveLocalizedValue(listIntro.eyebrow, locale, fallback.intro.eyebrow),
            title: resolveLocalizedValue(listIntro.title, locale, fallback.intro.title),
          }
        : fallback.intro,
    }
  } catch {
    return fallback
  }
}

export async function getStoryContent(locale: Locale): Promise<SimpleHeroContent> {
  const fallback: SimpleHeroContent = {
    eyebrow: storyContent.hero.eyebrow[locale],
    title: storyContent.hero.title[locale],
    body: storyContent.hero.lead[locale],
  }

  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const doc = await cachedPayloadRead('story', [locale], () => payload.findGlobal({ slug: 'story', locale }))
    const hero = (doc?.hero ?? {}) as Record<string, unknown>
    return {
      eyebrow: resolveLocalizedValue(hero.eyebrow, locale, fallback.eyebrow),
      title: resolveLocalizedValue(hero.title, locale, fallback.title),
      body: resolveLocalizedValue(hero.body, locale, fallback.body),
    }
  } catch {
    return fallback
  }
}

export async function getActivismContent(
  locale: Locale,
): Promise<{ hero: SimpleHeroContent; halakha: SimpleHeroContent }> {
  const fallback = {
    hero: {
      eyebrow: activismHero.eyebrow[locale],
      title: `${activismHero.titleLine1[locale]}\n${activismHero.titleLine2[locale]}`,
      body: activismHero.lead[locale],
    },
    halakha: {
      eyebrow: activismHalachaSection.eyebrow[locale],
      title: activismHalachaSection.title[locale],
      body: activismHalachaSection.lead[locale],
    },
  }

  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const doc = await cachedPayloadRead('activism', [locale], () => payload.findGlobal({ slug: 'activism', locale }))
    const hero = (doc?.hero ?? {}) as Record<string, unknown>
    const intros = Array.isArray(doc?.sectionIntros) ? (doc.sectionIntros as Record<string, unknown>[]) : []
    const halakhaIntro = intros.find((intro) => intro?.key === 'halakha')

    return {
      hero: {
        eyebrow: resolveLocalizedValue(hero.eyebrow, locale, fallback.hero.eyebrow),
        title: resolveLocalizedValue(hero.title, locale, fallback.hero.title),
        body: resolveLocalizedValue(hero.body, locale, fallback.hero.body),
      },
      halakha: halakhaIntro
        ? {
            eyebrow: resolveLocalizedValue(halakhaIntro.eyebrow, locale, fallback.halakha.eyebrow),
            title: resolveLocalizedValue(halakhaIntro.title, locale, fallback.halakha.title),
            body: resolveLocalizedValue(halakhaIntro.body, locale, fallback.halakha.body),
          }
        : fallback.halakha,
    }
  } catch {
    return fallback
  }
}

/** Hero copy + the two source-document URLs for `/halacha` — the write-up itself is always the hardcoded `halachaSections` in `src/content/halacha.ts`, never CMS-driven. */
export async function getHalachaContent(
  locale: Locale,
): Promise<{ hero: SimpleHeroContent; kroizerDocumentUrl?: string; pamphletDocumentUrl?: string }> {
  const fallback = {
    hero: {
      eyebrow: halachaHero.eyebrow[locale],
      title: halachaHero.title[locale],
      body: halachaHero.lead[locale],
    },
  }

  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const doc = await cachedPayloadRead('halacha', [locale], () => payload.findGlobal({ slug: 'halacha', locale }))
    const hero = (doc?.hero ?? {}) as Record<string, unknown>
    const kroizerDoc =
      doc?.kroizerRulingDocument && typeof doc.kroizerRulingDocument === 'object'
        ? (doc.kroizerRulingDocument as unknown as Record<string, unknown>)
        : null
    const pamphletDoc =
      doc?.pamphletDocument2015 && typeof doc.pamphletDocument2015 === 'object'
        ? (doc.pamphletDocument2015 as unknown as Record<string, unknown>)
        : null

    return {
      hero: {
        eyebrow: resolveLocalizedValue(hero.eyebrow, locale, fallback.hero.eyebrow),
        title: resolveLocalizedValue(hero.title, locale, fallback.hero.title),
        body: resolveLocalizedValue(hero.body, locale, fallback.hero.body),
      },
      kroizerDocumentUrl: kroizerDoc?.url ? String(kroizerDoc.url) : undefined,
      pamphletDocumentUrl: pamphletDoc?.url ? String(pamphletDoc.url) : undefined,
    }
  } catch {
    return fallback
  }
}

/** Hero + body paragraphs for `/mishpat` — a placeholder page meant to be rewritten from `/admin` (a free-text richText field), unlike `/halacha`'s hardcoded write-up. */
export async function getMishpatContent(
  locale: Locale,
): Promise<{ hero: SimpleHeroContent; body: string[]; bodyRich: unknown | null }> {
  const fallback = {
    hero: {
      eyebrow: mishpatHero.eyebrow[locale],
      title: mishpatHero.title[locale],
      body: mishpatHero.lead[locale],
    },
    body: mishpatFallbackBody,
    // The fixture is plain prose; only Payload can supply rich text.
    bodyRich: null,
  }

  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const doc = await cachedPayloadRead('mishpat', [locale], () => payload.findGlobal({ slug: 'mishpat', locale }))
    const hero = (doc?.hero ?? {}) as Record<string, unknown>
    const paragraphs = lexicalToParagraphs(doc?.body)

    return {
      hero: {
        eyebrow: resolveLocalizedValue(hero.eyebrow, locale, fallback.hero.eyebrow),
        title: resolveLocalizedValue(hero.title, locale, fallback.hero.title),
        body: resolveLocalizedValue(hero.body, locale, fallback.hero.body),
      },
      body: paragraphs.length > 0 ? paragraphs : fallback.body,
      /*
       * The whole tree, so the page can render links, headings, lists and
       * emphasis. `paragraphs` above is kept only as the plain-text form
       * `generateMetadata` and the fallback path still want.
       */
      bodyRich: doc?.body ?? null,
    }
  } catch {
    return fallback
  }
}

export async function getPodcastHeroContent(locale: Locale): Promise<SimpleHeroContent> {
  const fallback: SimpleHeroContent = {
    eyebrow: podcastText.heroEyebrow[locale],
    title: podcastText.heroTitle[locale],
    body: podcastText.heroLead[locale],
  }

  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const doc = await cachedPayloadRead('podcast', [locale], () => payload.findGlobal({ slug: 'podcast', locale }))
    const hero = (doc?.hero ?? {}) as Record<string, unknown>
    return {
      eyebrow: resolveLocalizedValue(hero.eyebrow, locale, fallback.eyebrow),
      title: resolveLocalizedValue(hero.title, locale, fallback.title),
      body: resolveLocalizedValue(hero.body, locale, fallback.body),
    }
  } catch {
    return fallback
  }
}

export async function getHanivcheretContent(locale: Locale): Promise<SimpleHeroContent> {
  const fallback: SimpleHeroContent = {
    eyebrow: hanivcheretHero.eyebrow[locale],
    title: hanivcheretHero.title[locale],
    body: hanivcheretHero.bodyPrimary[locale],
  }

  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const doc = await cachedPayloadRead('hanivcheret', [locale], () => payload.findGlobal({ slug: 'hanivcheret', locale }))
    const hero = (doc?.hero ?? {}) as Record<string, unknown>
    return {
      eyebrow: resolveLocalizedValue(hero.eyebrow, locale, fallback.eyebrow),
      title: resolveLocalizedValue(hero.title, locale, fallback.title),
      body: resolveLocalizedValue(hero.body, locale, fallback.body),
    }
  } catch {
    return fallback
  }
}

export async function getDonateContent(locale: Locale): Promise<SimpleHeroContent> {
  const fallback: SimpleHeroContent = {
    eyebrow: donateHero.eyebrow[locale],
    title: donateHero.title[locale],
    body: donateHero.body[locale],
  }

  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const doc = await cachedPayloadRead('donate', [locale], () => payload.findGlobal({ slug: 'donate', locale }))
    const hero = (doc?.hero ?? {}) as Record<string, unknown>
    return {
      eyebrow: resolveLocalizedValue(hero.eyebrow, locale, fallback.eyebrow),
      title: resolveLocalizedValue(hero.title, locale, fallback.title),
      body: resolveLocalizedValue(hero.body, locale, fallback.body),
    }
  } catch {
    return fallback
  }
}

export async function getNavigationLinks(locale: Locale): Promise<NavLink[]> {
  const fallback = navLinksFor(locale)
  const payload = await getPayloadInstance()
  if (!payload) {
    return fallback
  }

  try {
    const doc = await cachedPayloadRead('navigation', [], () => payload.findGlobal({ slug: 'navigation', locale: 'all' }))
    if (!doc?.items?.length) {
      return fallback
    }

    return doc.items.map((item) => ({
      label: {
        he: resolveLocalizedValue(item.label, 'he', item.href ?? ''),
        en: resolveLocalizedValue(item.label, 'en', item.href ?? ''),
      },
      href: `/${locale}${String(item.href ?? '/').startsWith('/') ? String(item.href ?? '/') : `/${String(item.href ?? '/')}`}`,
    }))
  } catch {
    return fallback
  }
}

export async function getSiteSettings(): Promise<PayloadSiteSettings> {
  const payload = await getPayloadInstance()

  if (!payload) {
    return {
      contactEmail: 'estish@nivcharot.com',
      social: {
        facebook: 'https://www.facebook.com/NoVoiceNoVote/',
        instagram: 'https://www.instagram.com/nivcharot/',
        youtube: 'https://www.youtube.com/@%D7%97%D7%A8%D7%93%D7%99%D7%AA%D7%9E%D7%93%D7%95%D7%91%D7%A8%D7%AA',
        spotify: 'https://open.spotify.com/show/7HwVj9J7rnUFqoiUDtc1oL',
        applePodcasts: 'https://podcasts.apple.com/il/podcast/id1767223746',
        podcastInstagram: 'https://www.instagram.com/haredit_meduberet/',
        hostInstagram: 'https://www.instagram.com/esty_shushan/',
        hostFacebook: 'https://www.facebook.com/profile.php?id=61565500745331',
        hostX: 'https://x.com/estyshushan',
        hostTiktok: 'https://www.tiktok.com/@estybittonshushan',
      },
      donation: {
        standingOrderUrl: 'https://mrng.to/WJUIrZs6F9',
        cardUrl: 'https://mrng.to/KPpOoC6rJ2',
      },
    }
  }

  try {
    const doc = await cachedPayloadRead('site-settings', [], () => payload.findGlobal({ slug: 'site-settings' }))
    return {
      contactEmail: String(doc?.contactEmail ?? 'estish@nivcharot.com'),
      social: {
        facebook: doc?.social?.facebook ?? 'https://www.facebook.com/NoVoiceNoVote/',
        instagram: doc?.social?.instagram ?? 'https://www.instagram.com/nivcharot/',
        youtube: doc?.social?.youtube ?? 'https://www.youtube.com/@%D7%97%D7%A8%D7%93%D7%99%D7%AA%D7%9E%D7%93%D7%95%D7%91%D7%A8%D7%AA',
        spotify: doc?.social?.spotify ?? 'https://open.spotify.com/show/7HwVj9J7rnUFqoiUDtc1oL',
        applePodcasts: doc?.social?.applePodcasts ?? 'https://podcasts.apple.com/il/podcast/id1767223746',
        podcastInstagram: doc?.social?.podcastInstagram ?? 'https://www.instagram.com/haredit_meduberet/',
        hostInstagram: doc?.social?.hostInstagram ?? 'https://www.instagram.com/esty_shushan/',
        hostFacebook: doc?.social?.hostFacebook ?? 'https://www.facebook.com/profile.php?id=61565500745331',
        hostX: doc?.social?.hostX ?? 'https://x.com/estyshushan',
        hostTiktok: doc?.social?.hostTiktok ?? 'https://www.tiktok.com/@estybittonshushan',
      },
      donation: {
        standingOrderUrl: doc?.donation?.standingOrderUrl ?? 'https://mrng.to/WJUIrZs6F9',
        cardUrl: doc?.donation?.cardUrl ?? 'https://mrng.to/KPpOoC6rJ2',
      },
    }
  } catch {
    return {
      contactEmail: 'estish@nivcharot.com',
      social: {
        facebook: 'https://www.facebook.com/NoVoiceNoVote/',
        instagram: 'https://www.instagram.com/nivcharot/',
        youtube: 'https://www.youtube.com/@%D7%97%D7%A8%D7%93%D7%99%D7%AA%D7%9E%D7%93%D7%95%D7%91%D7%A8%D7%AA',
        spotify: 'https://open.spotify.com/show/7HwVj9J7rnUFqoiUDtc1oL',
        applePodcasts: 'https://podcasts.apple.com/il/podcast/id1767223746',
        podcastInstagram: 'https://www.instagram.com/haredit_meduberet/',
        hostInstagram: 'https://www.instagram.com/esty_shushan/',
        hostFacebook: 'https://www.facebook.com/profile.php?id=61565500745331',
        hostX: 'https://x.com/estyshushan',
        hostTiktok: 'https://www.tiktok.com/@estybittonshushan',
      },
      donation: {
        standingOrderUrl: 'https://mrng.to/WJUIrZs6F9',
        cardUrl: 'https://mrng.to/KPpOoC6rJ2',
      },
    }
  }
}

/** Reads a Payload localized field (`{ he, en }`, fetched via `locale: 'all'`) or a plain string, always returning a full `Localized` pair. */
function toLocalizedPair(value: unknown, fallback: Localized = { he: '', en: '' }): Localized {
  if (typeof value === 'string' && value) return { he: value, en: value }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const he = typeof record.he === 'string' && record.he ? record.he : fallback.he
    const en = typeof record.en === 'string' && record.en ? record.en : he || fallback.en
    return { he, en }
  }
  return fallback
}

/** Same as {@link toLocalizedPair}, for a localized checkbox field. */
function toLocalizedBoolPair(value: unknown, fallback: { he: boolean; en: boolean }): { he: boolean; en: boolean } {
  if (typeof value === 'boolean') return { he: value, en: value }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const he = typeof record.he === 'boolean' ? record.he : fallback.he
    const en = typeof record.en === 'boolean' ? record.en : fallback.en
    return { he, en }
  }
  return fallback
}

/** Flattens a Lexical richText editor-state document into plain paragraph strings. */
function lexicalToParagraphs(value: unknown): string[] {
  if (!value || typeof value !== 'object') return []
  const root = (value as Record<string, unknown>).root as Record<string, unknown> | undefined
  const children = Array.isArray(root?.children) ? root.children : []
  const paragraphs: string[] = []
  for (const node of children as Record<string, unknown>[]) {
    if (node?.type === 'paragraph' && Array.isArray(node.children)) {
      const text = (node.children as Record<string, unknown>[])
        .map((c) => (typeof c?.text === 'string' ? c.text : ''))
        .join('')
      if (text) paragraphs.push(text)
    }
  }
  return paragraphs
}

/**
 * "בתקשורת" — real press coverage, edited/filtered from the dashboard's
 * PressArchive collection (`reviewStatus: 'keep'` gate = the "hide an
 * unwanted article" control the site owner asked for). Falls back to the
 * static, hand-curated fixture if Payload/the DB is unreachable, same
 * pattern as every other getter in this file.
 */
export async function getPressArchiveItems(): Promise<PressArchiveItem[]> {
  const fallback = staticPressArchiveItemsSorted
  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const res = await cachedPayloadRead('press-archive', [], () =>
      payload.find({
        collection: 'press-archive',
        locale: 'all',
        where: { reviewStatus: { equals: 'keep' } },
        sort: '-sortDate',
        limit: 500,
        depth: 0,
      }),
    )
    if (!res.docs.length) return fallback

    const items: PressArchiveItem[] = res.docs.map((doc) => {
      const d = doc as unknown as Record<string, unknown>
      const note = toLocalizedPair(d.note)
      const homeExcerpt = toLocalizedPair(d.homeExcerpt)
      return {
        slug: String(d.slug ?? ''),
        type: d.type as PressArchiveItem['type'],
        category: d.category as PressArchiveItem['category'],
        title: toLocalizedPair(d.title),
        summary: toLocalizedPair(d.summary),
        dateLabel: toLocalizedPair(d.dateLabel),
        sortDate: String(d.sortDate ?? '').slice(0, 10),
        year: Number(d.year ?? 0),
        outlet: toLocalizedPair(d.outlet),
        link: d.linkKind === 'internal' ? { kind: 'internal', slug: String(d.slug ?? '') } : { kind: 'external', url: String(d.url ?? '') },
        note: note.he || note.en ? note : undefined,
        sourceLanguage: (d.sourceLanguage as PressArchiveItem['sourceLanguage']) ?? 'he',
        featured: Boolean(d.featured),
        homeExcerpt: homeExcerpt.he || homeExcerpt.en ? homeExcerpt : undefined,
      }
    })
    return sortPressItemsDesc(items)
  } catch {
    return fallback
  }
}

/**
 * "עוד ברשת" — podcasts/video/talks from OTHER shows, same moderation gate
 * and fallback pattern as `getPressArchiveItems`.
 */
export async function getElsewhereMediaItems(): Promise<{
  podcasts: ElsewhereMediaItem[]
  videos: ElsewhereMediaItem[]
  talks: ElsewhereMediaItem[]
}> {
  const fallback = { podcasts: staticOtherPodcasts, videos: staticVideoArticles, talks: staticTalksAndConferences }
  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const res = await cachedPayloadRead('elsewhere-media', [], () =>
      payload.find({
        collection: 'elsewhere-media',
        locale: 'all',
        where: { reviewStatus: { equals: 'keep' } },
        sort: '-sortDate',
        limit: 500,
        depth: 1,
      }),
    )
    if (!res.docs.length) return fallback

    const items: ElsewhereMediaItem[] = res.docs.map((doc) => {
      const d = doc as unknown as Record<string, unknown>
      const note = toLocalizedPair(d.note)
      const image = d.image && typeof d.image === 'object' ? (d.image as Record<string, unknown>) : null
      const imageAlt = image ? toLocalizedPair(image.alt) : null
      return {
        slug: String(d.slug ?? ''),
        kind: d.kind as ElsewhereMediaItem['kind'],
        title: toLocalizedPair(d.title),
        summary: toLocalizedPair(d.summary),
        host: String(d.host ?? ''),
        dateLabel: toLocalizedPair(d.dateLabel),
        sortDate: String(d.sortDate ?? '').slice(0, 10),
        sourceLanguage: (d.sourceLanguage as ElsewhereMediaItem['sourceLanguage']) ?? 'he',
        url: String(d.url ?? ''),
        note: note.he || note.en ? note : undefined,
        image: image?.url ? { src: String(image.url), alt: imageAlt?.he || imageAlt?.en || String(d.host ?? '') } : undefined,
      }
    })
    return {
      podcasts: items.filter((i) => i.kind === 'podcast'),
      videos: items.filter((i) => i.kind === 'video'),
      talks: items.filter((i) => i.kind === 'talk'),
    }
  } catch {
    return fallback
  }
}

/**
 * The org's own archive posts (legacy nivcharot.co.il import). `title`/
 * `body` stay Hebrew-only here, matching the static fixture's convention
 * (see `src/content/media.ts`) — the `posts` collection's English locale
 * isn't populated by the seed script, since none of this content was ever
 * translated.
 */
export async function getArchivePosts(): Promise<ArchivePost[]> {
  const fallback = staticArchivePosts
  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const res = await cachedPayloadRead('posts', [], () =>
      payload.find({
        collection: 'posts',
        locale: 'all',
        where: { reviewStatus: { equals: 'keep' } },
        sort: '-date',
        limit: 500,
        depth: 1,
      }),
    )
    if (!res.docs.length) return fallback

    return res.docs.map((doc) => {
      const d = doc as unknown as Record<string, unknown>
      const titlePair = toLocalizedPair(d.title)
      const bodyField = d.body as Record<string, unknown> | undefined
      const bodyLexical = bodyField && typeof bodyField === 'object' && 'root' in bodyField ? bodyField : bodyField?.he
      const categories = Array.isArray(d.categories)
        ? (d.categories as unknown[])
          .map((c) => (c && typeof c === 'object' ? String((c as Record<string, unknown>).slug ?? '') : String(c ?? '')))
          .filter(Boolean)
        : []
      const coverImage = d.coverImage && typeof d.coverImage === 'object' ? (d.coverImage as Record<string, unknown>) : null
      const coverAlt = coverImage ? toLocalizedPair(coverImage.alt) : null
      return {
        slug: String(d.slug ?? ''),
        title: titlePair.he || titlePair.en,
        date: String(d.date ?? '').slice(0, 10),
        categories,
        body: lexicalToParagraphs(bodyLexical),
        cover: coverImage?.url ? { src: String(coverImage.url), alt: (coverAlt?.he || coverAlt?.en || titlePair.he || titlePair.en) } : undefined,
        sourceLinks: Array.isArray(d.sourceLinks)
          ? (d.sourceLinks as Record<string, unknown>[]).map((l) => ({ label: String(l.label ?? ''), url: String(l.url ?? '') }))
          : undefined,
        featured: Boolean(d.featured),
      }
    })
  } catch {
    return fallback
  }
}

/** Staff/board/field-worker roster — `active: false` in the dashboard is how the site owner hides someone from the public Team page. */
export async function getTeamMembers(): Promise<TeamMember[]> {
  const fallback = staticTeamMembers
  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const res = await cachedPayloadRead('team-members', [], () =>
      payload.find({
        collection: 'team-members',
        locale: 'all',
        where: { active: { equals: true } },
        sort: 'order',
        limit: 200,
        depth: 1,
      }),
    )
    if (!res.docs.length) return fallback

    /*
     * Photo fallback, by Hebrew name.
     *
     * The team photos ship with the repo under /public/assets/team and were
     * never in the media library. Once the roster lives in the collection
     * (so it can be edited in the dashboard) a row with no uploaded photo
     * would otherwise render a placeholder, and the page would lose every
     * portrait it had been showing.
     *
     * So a row without its own photo borrows the bundled one. Uploading a
     * photo in the dashboard overrides it, which is the direction that
     * should win.
     */
    const bundledPhotoByName = new Map(
      fallback.filter((member) => member.photo).map((member) => [member.name.he, member.photo]),
    )

    return res.docs.map((doc) => {
      const d = doc as unknown as Record<string, unknown>
      const photo = d.photo && typeof d.photo === 'object' ? (d.photo as Record<string, unknown>) : null
      const names = toLocalizedPair(d.name)
      const bioField = d.bio as Record<string, unknown> | undefined
      const bioHe = lexicalToParagraphs(bioField?.he).join(' ')
      const bioEn = lexicalToParagraphs(bioField?.en).join(' ')

      return {
        id: String(d.id ?? ''),
        name: names,
        role: toLocalizedPair(d.role),
        bio: bioHe || bioEn ? { he: bioHe || bioEn, en: bioEn || bioHe } : undefined,
        photo: photo
          ? { src: String(photo.url ?? ''), alt: toLocalizedPair(photo.alt) }
          : (bundledPhotoByName.get(names.he) ?? null),
        order: Number(d.order ?? 0),
        active: Boolean(d.active),
        category: (d.category as TeamMember['category']) ?? 'staff',
      }
    })
  } catch {
    return fallback
  }
}

/**
 * The Story page's 2012-2026 timeline. Unlike the other collection
 * getters in this file, this one is NOT locale-scoped: `Timeline.tsx` is a
 * client component that filters `visible[locale]` and picks `year`/`title`/
 * `body` per-locale itself at render time, so the full bilingual shape
 * (matching the static `TimelineMilestone` fixture type exactly) has to
 * survive the round trip. `year` is a single, non-localized field on the
 * collection (see src/payload/collections/TimelineMilestones.ts's own
 * comment on why it's plain text) — both locales get the same value here,
 * same as every entry in the static fixture except the two whose Hebrew and
 * English year labels genuinely differ ("רקע"/"Origins", "2020/23"/
 * "2020-23"), which is an accepted, pre-existing schema limitation, not a
 * mapping bug introduced here.
 */
export async function getStoryTimeline(): Promise<TimelineMilestone[]> {
  const fallback = timelineMilestones
  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const res = await cachedPayloadRead('timeline-milestones', [], () =>
      payload.find({ collection: 'timeline-milestones', locale: 'all', sort: 'order', limit: 200, depth: 0 }),
    )
    if (!res.docs.length) return fallback

    return res.docs.map((doc, i) => {
      const d = doc as unknown as Record<string, unknown>
      const year = typeof d.year === 'string' ? d.year : ''
      const rawArticles = Array.isArray(d.externalArticles) ? (d.externalArticles as Record<string, unknown>[]) : []
      const externalArticles = rawArticles.map((a) => {
        const outlet = String(a.outlet ?? '')
        return {
          label: toLocalizedPair(a.label),
          outlet: TIMELINE_OUTLET_EN.get(outlet) ?? outlet,
          url: String(a.url ?? ''),
        }
      })

      // `body` is richText, not plain text: locale:'all' returns
      // { he: <Lexical doc>, en: <Lexical doc> }, which toLocalizedPair
      // (built for plain-string localized fields) can't read — it was
      // silently resolving to empty strings, dropping every milestone's
      // body text. Flatten each locale's Lexical doc to plain text instead.
      const bodyRecord = d.body as Record<string, unknown> | undefined
      const bodyHe = lexicalToParagraphs(bodyRecord?.he).join(' ')
      const bodyEn = lexicalToParagraphs(bodyRecord?.en).join(' ')

      return {
        id: String(d.id ?? `milestone-${i}`),
        year: { he: year, en: TIMELINE_YEAR_EN.get(year) ?? year },
        title: toLocalizedPair(d.title),
        body: { he: bodyHe, en: bodyEn || bodyHe },
        visible: toLocalizedBoolPair(d.visible, { he: true, en: true }),
        externalArticles: externalArticles.length ? externalArticles : undefined,
      }
    })
  } catch {
    return fallback
  }
}

/*
 * `timeline-milestones` stores `year` and each article's `outlet` as plain,
 * NON-localized strings, so the English timeline was rendering the Hebrew
 * value for both: "רקע" instead of "Origins", "ינואר 2018" instead of
 * "January 2018", "ערוץ 7" instead of "Arutz Sheva".
 *
 * Rather than migrate two fields to localized (and re-enter every English
 * value by hand in the dashboard), the pairs are read off the fixtures that
 * already hold them — `storyTimeline` for the year labels and the press
 * archive for outlet names. Anything with no pair maps to itself, which is
 * right for a bare year like "2015".
 */
const TIMELINE_YEAR_EN = new Map(
  timelineMilestones
    .filter((milestone) => milestone.year.he !== milestone.year.en)
    .map((milestone) => [milestone.year.he, milestone.year.en]),
)

const TIMELINE_OUTLET_EN = new Map<string, string>([
  ...staticPressArchiveItemsSorted
    .filter((item) => item.outlet.he !== item.outlet.en)
    .map((item) => [item.outlet.he, item.outlet.en] as const),
  // Only appears on the timeline, so the press archive has no pair for it.
  ['ערוץ 7', 'Arutz Sheva'],
])

export type ActivismFaqContent = { id: string; number: string; question: string; answerParagraphs: string[] }

/**
 * "מה שואלים אותנו" accordion on the Activism page. The `faqs` collection's
 * `answer` field folds a citation line straight into the rich text as its
 * own paragraph rather than a separate `source` field (see
 * src/payload/collections/Faqs.ts's own comment) — `answerParagraphs`
 * exposes every paragraph so the page can render each one, source line
 * included, without this file leaking richText internals to the caller.
 * `number` ("01", "02", ...) is derived from sort position, not stored —
 * the collection only has a numeric `order` field.
 */
export async function getActivismFaqs(locale: Locale): Promise<ActivismFaqContent[]> {
  const fallback: ActivismFaqContent[] = activismFaqs.map((faq) => ({
    id: faq.id,
    number: faq.number,
    question: faq.question[locale],
    answerParagraphs: faq.source ? [faq.answer[locale], faq.source[locale]] : [faq.answer[locale]],
  }))

  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const res = await cachedPayloadRead('faqs', ['activism', locale], () =>
      payload.find({
        collection: 'faqs',
        locale,
        where: { page: { equals: 'activism' } },
        sort: 'order',
        limit: 100,
        depth: 0,
      }),
    )
    if (!res.docs.length) return fallback

    return res.docs.map((doc, i) => {
      const d = doc as unknown as Record<string, unknown>
      return {
        id: String(d.id ?? `faq-${i}`),
        number: String(i + 1).padStart(2, '0'),
        question: typeof d.question === 'string' ? d.question : '',
        answerParagraphs: lexicalToParagraphs(d.answer),
      }
    })
  } catch {
    return fallback
  }
}

export type AlumnaQuoteContent = { id: string; cohort: number; name: string; quote: string }

/**
 * "בוגרות מספרות" quote carousel on the HaNivcheret page. The static
 * fixture's six entries are explicit placeholders ("שם הבוגרת · בוגרת
 * מחזור N", never a real name — see src/content/hanivcheret.ts's own
 * comment), so the fallback below seeds `name` with that same placeholder
 * text rather than inventing one. Once a real quote is added via the
 * dashboard, `name` is a normal editable field — real names aren't
 * localized (a person's name doesn't translate), matching the collection
 * schema.
 */
export async function getHanivcheretQuotes(locale: Locale): Promise<AlumnaQuoteContent[]> {
  const fallback: AlumnaQuoteContent[] = hanivcheretQuotes.map((entry) => ({
    id: entry.id,
    cohort: entry.cohort,
    name:
      locale === 'he'
        ? hanivcheretAlumnaPlaceholder.he(entry.cohort)
        : hanivcheretAlumnaPlaceholder.en(entry.cohort),
    quote: entry.quote[locale],
  }))

  const payload = await getPayloadInstance()
  if (!payload) return fallback

  try {
    const res = await cachedPayloadRead('alumnae-quotes', [locale], () =>
      payload.find({ collection: 'alumnae-quotes', locale, sort: 'order', limit: 100, depth: 0 }),
    )
    if (!res.docs.length) return fallback

    return res.docs.map((doc, i) => {
      const d = doc as unknown as Record<string, unknown>
      const cohort = Number(d.cohort ?? 0)
      const stored = typeof d.name === 'string' ? d.name.trim() : ''
      /*
       * `alumnae-quotes.name` is not a localized field, and what was seeded
       * into it is the HEBREW placeholder text — so the English page was
       * printing "שם הבוגרת · בוגרת מחזור 4" under an English quote. Real
       * names (once anyone enters them) pass straight through; only a value
       * that still is the placeholder gets swapped for this locale's.
       */
      const isPlaceholder = !stored || stored === hanivcheretAlumnaPlaceholder.he(cohort)
      const placeholder =
        locale === 'he' ? hanivcheretAlumnaPlaceholder.he(cohort) : hanivcheretAlumnaPlaceholder.en(cohort)

      return {
        id: String(d.id ?? `quote-${i}`),
        cohort,
        name: isPlaceholder ? placeholder : stored,
        quote: typeof d.quote === 'string' ? d.quote : '',
      }
    })
  } catch {
    return fallback
  }
}

export type EventPhotoContent = { alt: string; url?: string }
export type EventGalleryContent = {
  slug: string
  title: string
  year: number
  summary?: string
  credit?: string
  coverImage: { url: string; alt: string } | null
  photos: EventPhotoContent[]
}

/**
 * "כנסים, הקרנות וגלריות" on the Activism page, and each event's own
 * `/events/[slug]` gallery. src/content/media.ts used to hold 5 entirely
 * fabricated events (an "annual conference" etc. that never happened) —
 * removed outright per the site owner's explicit instruction, the same
 * "don't invent content" standard already applied to posts/press-archive
 * elsewhere in this codebase. Unlike those getters, this one falls back to
 * an EMPTY array, never to invented placeholder events, when Payload has
 * nothing real yet — an empty gallery section is honest; a fabricated one
 * isn't.
 */
export async function getEvents(locale: Locale): Promise<EventGalleryContent[]> {
  const payload = await getPayloadInstance()
  if (!payload) return []

  try {
    const res = await cachedPayloadRead('events', [locale], () =>
      payload.find({
        collection: 'events',
        locale,
        where: { reviewStatus: { equals: 'keep' } },
        sort: '-year',
        limit: 200,
        depth: 1,
      }),
    )

    return res.docs.map((doc) => {
      const d = doc as unknown as Record<string, unknown>
      const title = typeof d.title === 'string' ? d.title : ''
      const cover = d.coverImage && typeof d.coverImage === 'object' ? (d.coverImage as Record<string, unknown>) : null
      const rawPhotos = Array.isArray(d.photos) ? (d.photos as Record<string, unknown>[]) : []

      return {
        slug: String(d.slug ?? ''),
        title,
        year: Number(d.year ?? 0),
        summary: typeof d.summary === 'string' && d.summary ? d.summary : undefined,
        credit: typeof d.credit === 'string' && d.credit ? d.credit : undefined,
        coverImage: cover ? { url: String(cover.url ?? ''), alt: title } : null,
        photos: rawPhotos.map((p) => {
          const img = p.image && typeof p.image === 'object' ? (p.image as Record<string, unknown>) : null
          return {
            alt: typeof p.alt === 'string' ? p.alt : title,
            url: img ? String(img.url ?? '') : undefined,
          }
        }),
      }
    })
  } catch {
    return []
  }
}
