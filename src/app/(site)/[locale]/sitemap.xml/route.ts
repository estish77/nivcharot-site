import type { MetadataRoute } from 'next'

import { buildSitemapEntries } from '@/app/sitemap'
import { isLocale, locales } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'

/**
 * A locale-scoped copy of the sitemap the root `sitemap.ts` already
 * generates, served at `/he/sitemap.xml` and `/en/sitemap.xml`.
 *
 * 2026-09-16 brief: Search Console is set up here as two separate
 * URL-prefix properties, `https://www.nivcharot.co.il/he/` and `.../en/`
 * (not one domain-level property), because that's what Search Console
 * offered when the site was verified. A URL-prefix property can only
 * accept a sitemap that lives at or below its own verified path — the
 * single sitemap at the site ROOT (`/sitemap.xml`) sits OUTSIDE both
 * prefixes, so neither property can necessarily claim it in the Sitemaps
 * report. Each locale gets its own copy, filtered to that locale's own
 * URLs, living inside the path its property actually owns.
 *
 * Same source data as `/sitemap.xml` (`buildSitemapEntries()`) — this
 * can't drift out of sync with it, it's the exact same entries, just
 * filtered down to one locale's `<url>` blocks. hreflang `<xhtml:link>`
 * alternates on each entry still point across both locales, same as the
 * root sitemap: that's a normal, correct cross-reference, not a claim
 * about where THIS sitemap file lives.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toXmlUrl(entry: MetadataRoute.Sitemap[number]): string {
  const alternates = Object.entries(entry.alternates?.languages ?? {})
    .map(([hreflang, href]) => `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(String(href))}" />`)
    .join('')
  const lastmod = entry.lastModified ? `<lastmod>${new Date(entry.lastModified).toISOString()}</lastmod>` : ''
  const changefreq = entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''
  const priority = entry.priority != null ? `<priority>${entry.priority}</priority>` : ''
  return `<url><loc>${escapeXml(entry.url)}</loc>${alternates}${lastmod}${changefreq}${priority}</url>`
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) return new Response('Not found', { status: 404 })

  const prefix = `${siteUrl}/${locale}`
  const entries = (await buildSitemapEntries()).filter(
    (entry) => entry.url === prefix || entry.url.startsWith(`${prefix}/`),
  )

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    entries.map(toXmlUrl).join('\n') +
    '\n</urlset>'

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
