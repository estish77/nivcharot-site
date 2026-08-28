import { elsewhereMediaText, type ElsewhereMediaItem } from '@/content/elsewhere-media'
import { archiveCategories, formatArchiveDate, type ArchivePost } from '@/content/media'
import {
  pressArchiveText,
  pressItemHref,
  type PressArchiveItem,
  type PressItemType,
} from '@/content/press-archive'
import { t, type Locale, type Localized } from '@/lib/i18n'

/**
 * One normalized row for the Media Desk (`/media`).
 *
 * The media page holds three genuinely different fixtures — outside press
 * coverage (`press-archive.ts`, 70+ items), podcast/video/talk appearances
 * (`elsewhere-media.ts`) and Nivcharot's own archive posts (`media.ts`) —
 * which used to render as three separate, independently-filtered, very
 * long stacked lists. The 2026-08-27 brief ("reorganize it into something
 * that looks great and is comfortable... one short-scrolling page") asks
 * for one explorer over all of it instead, so every source is mapped here
 * into a single shape the desk can search, facet, sort and paginate
 * uniformly. Nothing is dropped: every field each source carried still has
 * a home below (summaries, notes, body paragraphs, outlet, language badge,
 * embed id), it's just revealed progressively per row rather than printed
 * all at once.
 *
 * Strings are resolved to the ACTIVE locale here, on the server, rather
 * than shipping `{he,en}` pairs into the client desk — `search` keeps both
 * languages so a Hebrew visitor still finds an English-titled piece, which
 * is the only place the other locale was actually being used.
 */
export type MediaGroup = 'press' | 'watch' | 'archive'

export type MediaFacet = { slug: string; name: string }

export type MediaEntry = {
  id: string
  group: MediaGroup
  /** Drives the small line glyph (`PressTypeIcon`). */
  iconType: PressItemType
  /** Short editorial label — "ראיון", "פודקאסט", "בלוג"… */
  kindLabel: string
  title: string
  /** The lead paragraph, clamped when the row is collapsed. */
  summary: string
  /** Extra body paragraphs — archive posts only; press/elsewhere items have none. */
  paragraphs: string[]
  /** Outlet / show / channel name. Empty string when the source has none. */
  outlet: string
  dateLabel: string
  /** ISO, sort only. */
  sortDate: string
  year: number
  href: string
  external: boolean
  ctaLabel: string
  /** Set only when the piece's original language differs from the active locale. */
  langBadge: string | null
  /** YouTube id when the item can be embedded in the watch theater. */
  youtubeId: string | null
  note: string | null
  /** Every facet this row belongs to — a row matches a chip if ANY facet matches. */
  facets: MediaFacet[]
  /** Lowercased he+en haystack for the search box. */
  search: string
}

/**
 * Extracts a YouTube video id from any URL shape this content actually
 * uses (`watch?v=`, `youtu.be/`, `/shorts/`); `null` for everything else
 * (Spotify, Kan, Substack…), which then renders as a plain outbound item
 * rather than an embed. Moved here from `ElsewhereMediaCard` so the desk
 * and any future consumer share one implementation.
 */
export function youtubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1) || null
    if (!parsed.hostname.endsWith('youtube.com')) return null
    if (parsed.pathname === '/watch') return parsed.searchParams.get('v')
    const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/]+)/)
    return shortsMatch ? shortsMatch[1] : null
  } catch {
    return null
  }
}

function haystack(...values: Array<Localized<string> | string | undefined>): string {
  const parts: string[] = []
  for (const value of values) {
    if (!value) continue
    if (typeof value === 'string') parts.push(value)
    else parts.push(value.he, value.en)
  }
  return parts.join(' \n ').toLowerCase()
}

function pressEntry(item: PressArchiveItem, locale: Locale): MediaEntry {
  const { href, external } = pressItemHref(item.link, locale)
  return {
    id: `press:${item.slug}`,
    group: 'press',
    iconType: item.type,
    kindLabel: t(locale, pressArchiveText.categoryLabel[item.category]),
    title: t(locale, item.title),
    summary: t(locale, item.summary),
    paragraphs: item.body ? t(locale, item.body) : [],
    outlet: t(locale, item.outlet),
    dateLabel: t(locale, item.dateLabel),
    sortDate: item.sortDate,
    year: item.year,
    href,
    external,
    ctaLabel: t(locale, external ? pressArchiveText.outboundLabel : pressArchiveText.internalLabel),
    langBadge:
      item.sourceLanguage !== locale
        ? t(locale, pressArchiveText.originalLanguageBadge[item.sourceLanguage])
        : null,
    youtubeId: item.link.kind === 'external' ? youtubeVideoId(item.link.url) : null,
    note: item.note ? t(locale, item.note) : null,
    facets: [{ slug: item.category, name: t(locale, pressArchiveText.categoryFilter[item.category]) }],
    search: haystack(item.title, item.summary, item.outlet, item.note),
  }
}

const ELSEWHERE_FACET_LABEL = {
  podcast: elsewhereMediaText.podcastsTitle,
  video: elsewhereMediaText.videoTitle,
  talk: elsewhereMediaText.talksTitle,
  knesset: elsewhereMediaText.knessetTitle,
} as const

const ELSEWHERE_KIND_LABEL = {
  podcast: { he: 'פודקאסט', en: 'Podcast' },
  video: { he: 'וידאו', en: 'Video' },
  talk: { he: 'הרצאה', en: 'Talk' },
  knesset: { he: 'דיון בוועדה', en: 'Committee session' },
} as const satisfies Record<ElsewhereMediaItem['kind'], Localized<string>>

function elsewhereEntry(item: ElsewhereMediaItem, locale: Locale): MediaEntry {
  return {
    id: `watch:${item.slug}`,
    group: 'watch',
    iconType: item.kind === 'podcast' ? 'podcast' : 'video',
    kindLabel: t(locale, ELSEWHERE_KIND_LABEL[item.kind]),
    title: t(locale, item.title),
    summary: t(locale, item.summary),
    paragraphs: [],
    outlet: item.host,
    dateLabel: t(locale, item.dateLabel),
    sortDate: item.sortDate,
    year: Number(item.sortDate.slice(0, 4)),
    href: item.url,
    external: true,
    ctaLabel: t(locale, item.kind === 'podcast' ? elsewhereMediaText.listenLabel : elsewhereMediaText.watchLabel),
    langBadge:
      item.sourceLanguage !== locale
        ? t(locale, elsewhereMediaText.originalLanguageBadge[item.sourceLanguage])
        : null,
    // Podcasts never get a video embed even when a YouTube upload exists —
    // 2026-08-16 brief: audio pieces keep their own, visually distinct
    // treatment (the waveform panel) rather than an iframe.
    youtubeId: item.kind === 'podcast' ? null : youtubeVideoId(item.url),
    note: item.note ? t(locale, item.note) : null,
    facets: [{ slug: item.kind, name: t(locale, ELSEWHERE_FACET_LABEL[item.kind]) }],
    search: haystack(item.title, item.summary, item.host, item.note),
  }
}

function archiveEntry(post: ArchivePost, locale: Locale): MediaEntry {
  const cats = post.categories
    .map((slug) => archiveCategories.find((c) => c.slug === slug))
    .filter((c): c is (typeof archiveCategories)[number] => Boolean(c))
  const [lead, ...rest] = post.body

  return {
    id: `archive:${post.slug}`,
    group: 'archive',
    iconType: 'article',
    kindLabel: cats[0]?.name ?? '',
    // Archive posts are real, never-translated Hebrew source material (see
    // src/content/media.ts) — rendered as-is under both locales, with the
    // language badge below telling an English reader so up front.
    title: post.title,
    summary: lead ?? '',
    paragraphs: rest,
    outlet: '',
    dateLabel: formatArchiveDate(post.date),
    sortDate: post.date,
    year: Number(post.date.slice(0, 4)),
    href: `/${locale}/media/${post.slug}`,
    external: false,
    ctaLabel: t(locale, { he: 'לרשומה המלאה', en: 'Read the full post' }),
    langBadge: locale === 'en' ? 'In Hebrew' : null,
    youtubeId: null,
    note: null,
    facets: cats.map((c) => ({ slug: c.slug, name: c.name })),
    search: haystack(post.title, ...post.body),
  }
}

export type MediaEntrySources = {
  press: PressArchiveItem[]
  podcasts: ElsewhereMediaItem[]
  videos: ElsewhereMediaItem[]
  talks: ElsewhereMediaItem[]
  /**
   * Nivcharot's own media channel (src/content/nivcharot-channel.ts) —
   * generated rather than curated, and carrying the `knesset` kind the
   * hand-written fixtures never use.
   */
  channel: ElsewhereMediaItem[]
  posts: ArchivePost[]
}

/** Every source folded into one newest-first list of desk rows. */
export function buildMediaEntries(sources: MediaEntrySources, locale: Locale): MediaEntry[] {
  const { press, podcasts, videos, talks, channel, posts } = sources
  return [
    ...press.map((item) => pressEntry(item, locale)),
    ...[...podcasts, ...videos, ...talks, ...channel].map((item) => elsewhereEntry(item, locale)),
    ...posts.map((post) => archiveEntry(post, locale)),
  ].sort((a, b) => b.sortDate.localeCompare(a.sortDate))
}
