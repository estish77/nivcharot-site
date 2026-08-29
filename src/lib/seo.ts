import type { Metadata } from 'next'

import { defaultLocale, type Locale } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'

/** Absolute URL for one locale + path (`path` starts with "/", or is "" for the locale root). */
export function urlFor(locale: Locale, path: string): string {
  return `${siteUrl}/${locale}${path}`
}

/** he/en (+ x-default pointing at the default locale) alternates for one logical path — shared by `sitemap.ts` and every page's `generateMetadata` so they can't drift apart. */
export function alternatesFor(path: string): Record<Locale | 'x-default', string> {
  return {
    he: urlFor('he', path),
    en: urlFor('en', path),
    'x-default': urlFor(defaultLocale, path),
  }
}

const siteName: Record<Locale, string> = { he: 'נבחרות', en: 'Nivcharot' }
const ogLocale: Record<Locale, string> = { he: 'he_IL', en: 'en_US' }

/**
 * The org has no dedicated 1200×630 social card asset yet, so every page
 * falls back to its wordmark logo — a real, on-brand image beats no image
 * (the previous state: no `openGraph`/`twitter` metadata existed anywhere,
 * so shared links showed no preview image at all).
 *
 * Per-locale (2026-08-29 fix): this used to be a single hardcoded English
 * logo regardless of which locale's URL was being shared — sharing a `/he/…`
 * link on WhatsApp showed the English wordmark. `nivcharot-logo-he.png` is
 * a new rasterization of the existing `nivcharot-logo-he.svg` (via `sharp`,
 * matching this file's own density/quality bar) — OG/Twitter card scrapers
 * don't reliably render SVG, so the SVG itself was never usable here the
 * way it is for `Logo.tsx`'s real `<img>`.
 */
const defaultOgImage: Record<Locale, { url: string; width: number; height: number }> = {
  he: { url: `${siteUrl}/assets/nivcharot-logo-he.png`, width: 1200, height: 554 },
  en: { url: `${siteUrl}/assets/nivcharot-logo-en.png`, width: 1339, height: 447 },
}

type PageMetadataInput = {
  locale: Locale
  /** Path under the locale root, e.g. `/about`, or `""` for the locale home. */
  path: string
  title: string
  description?: string
  /** Absolute or `siteUrl`-relative image URL for this specific page (an article's cover photo, an event gallery's cover, etc). Falls back to the site's default wordmark. */
  image?: string
  type?: 'website' | 'article'
}

/**
 * Every page's `generateMetadata` was returning just `{ title, description }`
 * — no `openGraph`/`twitter` (broken share previews sitewide), no
 * `alternates.canonical`, and no page-level `alternates.languages` (hreflang
 * was only ever in `sitemap.ts`, never in the rendered `<head>`). This is
 * the one place all of that gets built, from the same title/description
 * every page already computes, so every page stays consistent by construction.
 */
export function pageMetadata({ locale, path, title, description, image, type = 'website' }: PageMetadataInput): Metadata {
  const url = urlFor(locale, path)
  const ogImage = image ? { url: image } : defaultOgImage[locale]

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: alternatesFor(path),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteName[locale],
      locale: ogLocale[locale],
      type,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
  }
}
