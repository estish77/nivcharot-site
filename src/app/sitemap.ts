import type { MetadataRoute } from 'next'

import { archivePosts, eventGalleries } from '@/content/media'
import { defaultLocale, locales, type Locale } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'

type StaticEntry = {
  path: string
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>
  priority: number
}

/** Every top-level page route, mirrored 1:1 from `src/lib/nav.ts`. */
const STATIC_ENTRIES: StaticEntry[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/story', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/team', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/podcast', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/activism', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/hanivcheret', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/join', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/media', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/donate', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.5 },
]

function urlFor(locale: Locale, path: string): string {
  return `${siteUrl}/${locale}${path}`
}

/** he/en (+ x-default pointing at the default locale) alternates for one logical path — see `src/lib/i18n.ts`'s `defaultLocale`. */
function alternatesFor(path: string): Record<Locale | 'x-default', string> {
  return {
    he: urlFor('he', path),
    en: urlFor('en', path),
    'x-default': urlFor(defaultLocale, path),
  }
}

/**
 * Every public route, in both locales, with hreflang alternates —
 * `generateStaticParams` across the app is the source of truth for which
 * routes exist; the dynamic sections below are built from the same
 * fixtures those routes prerender from (`src/content/media.ts`) so this
 * can't drift out of sync with the actual build output.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const { path, changeFrequency, priority } of STATIC_ENTRIES) {
    const languages = alternatesFor(path)
    for (const locale of locales) {
      entries.push({
        url: urlFor(locale, path),
        lastModified: new Date(),
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

  return entries
}
