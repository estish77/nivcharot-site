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
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
