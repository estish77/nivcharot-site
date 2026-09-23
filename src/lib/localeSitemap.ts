import type { MetadataRoute } from 'next'

import { buildSitemapEntries } from '@/app/sitemap'
import { siteUrl } from '@/lib/site'
import type { Locale } from '@/lib/i18n'

/**
 * Shared by the two concrete route handlers at
 * `(site)/he/sitemap.xml/route.ts` and `(site)/en/sitemap.xml/route.ts` —
 * see that pair's doc comment for why they're two fixed routes and not one
 * `[locale]/sitemap.xml` dynamic route (which is what this used to be).
 */
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

export async function localeSitemapResponse(locale: Locale): Promise<Response> {
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
