import type { MetadataRoute } from 'next'

import { archivePostsVisible } from '@/content/media-visibility'
import { getArchivePosts, getEvents, getPressArchiveItems } from '@/lib/cms'
import { defaultLocale, locales } from '@/lib/i18n'
import { alternatesFor, urlFor } from '@/lib/seo'

type StaticEntry = {
  path: string
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>
  priority: number
}

/**
 * Every top-level page route, mirrored 1:1 from `src/lib/nav.ts` — plus
 * `/halacha` and `/mishpat`, which have their own routes
 * (`(pages)/halacha`, `(pages)/mishpat`) but aren't in the nav's `children`
 * as top-level `href`s, so they need listing here explicitly.
 */
const STATIC_ENTRIES: StaticEntry[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/story', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/team', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/podcast', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/activism', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/halacha', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/mishpat', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/hanivcheret', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/join', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/media', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/donate', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.5 },
]

/**
 * Every public route, in both locales, with hreflang alternates —
 * `generateStaticParams` across the app is the source of truth for which
 * routes exist; the dynamic sections below are built from the same
 * fixtures those routes prerender from (`src/content/media.ts`) so this
 * can't drift out of sync with the actual build output.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  // Hidden from the site (src/content/media-visibility.ts) means hidden
  // from the sitemap too - listing URLs that 404 is worse than omitting them.
  const archivePosts = archivePostsVisible ? await getArchivePosts() : []
  const eventGalleries = await getEvents(defaultLocale)
  const pressItems = await getPressArchiveItems()

  for (const { path, changeFrequency, priority } of STATIC_ENTRIES) {
    const languages = alternatesFor(path)
    for (const locale of locales) {
      entries.push({
        url: urlFor(locale, path),
        // No real "last modified" date exists for these static marketing
        // pages — `new Date()` here would just mean "now, every single
        // request", which is worse than omitting it (Next's sitemap type
        // makes this field optional).
        changeFrequency,
        priority,
        alternates: { languages },
      })
    }
  }

  for (const post of archivePosts) {
    const path = `/media/${post.slug}`
    const languages = alternatesFor(path)
    for (const locale of locales) {
      entries.push({
        url: urlFor(locale, path),
        lastModified: new Date(post.date),
        changeFrequency: 'yearly',
        priority: 0.5,
        alternates: { languages },
      })
    }
  }

  for (const gallery of eventGalleries) {
    const path = `/events/${gallery.slug}`
    const languages = alternatesFor(path)
    for (const locale of locales) {
      entries.push({
        url: urlFor(locale, path),
        lastModified: new Date(gallery.year, 0, 1),
        changeFrequency: 'yearly',
        priority: 0.4,
        alternates: { languages },
      })
    }
  }

  // Only `link.kind === 'internal'` items get a real `/press/[slug]` page
  // (see that route's `generateStaticParams`) — external items link straight
  // to the outlet, so listing them here would sitemap a URL that 404s.
  for (const item of pressItems.filter((i) => i.link.kind === 'internal')) {
    const path = `/press/${item.slug}`
    const languages = alternatesFor(path)
    for (const locale of locales) {
      entries.push({
        url: urlFor(locale, path),
        lastModified: new Date(item.sortDate),
        changeFrequency: 'yearly',
        priority: 0.4,
        alternates: { languages },
      })
    }
  }

  return entries
}
