import config from '@payload-config'
import { getPayload } from 'payload'

import type { NavLink } from '@/components/ui'
import { goalSection, heroContent, pillarCards, statTiles } from '@/content/home'
import { archivePosts as staticArchivePosts, type ArchivePost } from '@/content/media'
import { otherPodcasts as staticOtherPodcasts, talksAndConferences as staticTalksAndConferences, videoArticles as staticVideoArticles, type ElsewhereMediaItem } from '@/content/elsewhere-media'
import { pressArchiveItemsSorted as staticPressArchiveItemsSorted, sortPressItemsDesc, type PressArchiveItem } from '@/content/press-archive'
import { teamMembers as staticTeamMembers, type TeamMember } from '@/content/team'
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
    const doc = await payload.findGlobal({ slug: 'home', locale })

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
        body: {
          he: resolveLocalizedValue(card?.body, 'he', pillarCards[index]?.body.he ?? ''),
          en: resolveLocalizedValue(card?.body, 'en', pillarCards[index]?.body.en ?? ''),
        } satisfies Localized,
        linkLabel: {
          he: resolveLocalizedValue(card?.linkLabel, 'he', pillarCards[index]?.linkLabel.he ?? ''),
          en: resolveLocalizedValue(card?.linkLabel, 'en', pillarCards[index]?.linkLabel.en ?? ''),
        } satisfies Localized,
        slug: typeof card?.linkHref === 'string' && card.linkHref.length > 0 ? card.linkHref.replace(/^\/+/, '').replace(/\/$/, '') : pillarCards[index]?.slug ?? 'story',
      }))
      : pillarCards

    return {
      hero: nextHero,
      goalSection: {
        eyebrow: {
          he: resolveLocalizedValue(doc?.hero?.eyebrow, 'he', goalSection.eyebrow.he),
          en: resolveLocalizedValue(doc?.hero?.eyebrow, 'en', goalSection.eyebrow.en),
        },
        titleLines: {
          he: [resolveLocalizedValue(doc?.hero?.title, 'he', goalSection.titleLines.he[0] ?? '')],
          en: [resolveLocalizedValue(doc?.hero?.title, 'en', goalSection.titleLines.en[0] ?? '')],
        },
        lead: {
          he: resolveLocalizedValue(doc?.hero?.body, 'he', goalSection.lead.he),
          en: resolveLocalizedValue(doc?.hero?.body, 'en', goalSection.lead.en),
        },
      },
      statTiles: nextTiles,
      pillarCards: nextCards,
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
    const doc = await payload.findGlobal({ slug: 'navigation' })
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
    const doc = await payload.findGlobal({ slug: 'site-settings' })
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
    const res = await payload.find({
      collection: 'press-archive',
      locale: 'all',
      where: { reviewStatus: { equals: 'keep' } },
      sort: '-sortDate',
      limit: 500,
      depth: 0,
    })
    if (!res.docs.length) return fallback

    const items: PressArchiveItem[] = res.docs.map((doc) => {
      const d = doc as unknown as Record<string, unknown>
      const note = toLocalizedPair(d.note)
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
    const res = await payload.find({
      collection: 'elsewhere-media',
      locale: 'all',
      where: { reviewStatus: { equals: 'keep' } },
      sort: '-sortDate',
      limit: 500,
      depth: 0,
    })
    if (!res.docs.length) return fallback

    const items: ElsewhereMediaItem[] = res.docs.map((doc) => {
      const d = doc as unknown as Record<string, unknown>
      const note = toLocalizedPair(d.note)
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
    const res = await payload.find({
      collection: 'posts',
      locale: 'all',
      where: { reviewStatus: { equals: 'keep' } },
      sort: '-date',
      limit: 500,
      depth: 1,
    })
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
      return {
        slug: String(d.slug ?? ''),
        title: titlePair.he || titlePair.en,
        date: String(d.date ?? '').slice(0, 10),
        categories,
        body: lexicalToParagraphs(bodyLexical),
        cover: undefined,
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
    const res = await payload.find({
      collection: 'team-members',
      locale: 'all',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 200,
      depth: 1,
    })
    if (!res.docs.length) return fallback

    return res.docs.map((doc) => {
      const d = doc as unknown as Record<string, unknown>
      const photo = d.photo && typeof d.photo === 'object' ? (d.photo as Record<string, unknown>) : null
      const bioField = d.bio as Record<string, unknown> | undefined
      const bioHe = lexicalToParagraphs(bioField?.he).join(' ')
      const bioEn = lexicalToParagraphs(bioField?.en).join(' ')

      return {
        id: String(d.id ?? ''),
        name: toLocalizedPair(d.name),
        role: toLocalizedPair(d.role),
        bio: bioHe || bioEn ? { he: bioHe || bioEn, en: bioEn || bioHe } : undefined,
        photo: photo
          ? { src: String(photo.url ?? ''), alt: toLocalizedPair(photo.alt) }
          : null,
        order: Number(d.order ?? 0),
        active: Boolean(d.active),
      }
    })
  } catch {
    return fallback
  }
}
