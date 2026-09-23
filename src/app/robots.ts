import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The Payload admin UI isn't scaffolded yet (see the scaffold agent's
      // report), but reserving its route now means this file doesn't need
      // to change the moment it lands.
      disallow: ['/admin'],
    },
    // The root sitemap covers everything; the /he and /en copies
    // ([locale]/sitemap.xml/route.ts) exist for Search Console properties
    // scoped to one locale's path — listing all three here costs nothing
    // and helps any crawler find whichever one it's looking for.
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/he/sitemap.xml`, `${siteUrl}/en/sitemap.xml`],
  }
}
