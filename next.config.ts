import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

import {
  ARCHIVED_POST_REDIRECTS,
  STATIC_PAGE_REDIRECTS,
  WIX_POST_REDIRECTS,
  WIX_STATIC_PAGE_REDIRECTS,
} from './src/legacyRedirects'

const nextConfig: NextConfig = {
  // Runs BEFORE src/proxy.ts in Next's routing order (config redirects,
  // then middleware) — see src/legacyRedirects.ts's doc comment for why
  // these exist and can't just rely on proxy's generic locale-prefix
  // redirect.
  async redirects() {
    return [
      ...STATIC_PAGE_REDIRECTS.map((r) => ({ ...r, permanent: true })),
      ...ARCHIVED_POST_REDIRECTS.map((r) => ({ ...r, permanent: true })),
      ...WIX_STATIC_PAGE_REDIRECTS.map((r) => ({ ...r, permanent: true })),
      ...WIX_POST_REDIRECTS.map((r) => ({ ...r, permanent: true })),
      // Catch-all for every other old WordPress post permalink
      // (`/YYYY/MM/DD/<hebrew-slug>/`) that has no specific match above —
      // the archive listing is a far better landing than a 404 for a
      // visitor following an old link or bookmark.
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug*',
        destination: '/he/media',
        permanent: true,
      },
      // Same idea for the old Wix site's blog posts (nivcharot.com/post/*,
      // see WIX_POST_REDIRECTS's doc comment) with no specific match above.
      {
        source: '/post/:slug*',
        destination: '/en/media',
        permanent: true,
      },
    ]
  },
  // Lets the dev server serve JS chunks/HMR to devices on the local network
  // (e.g. a real phone at `http://192.168.1.187:3000`) — without this,
  // Next 16 403s every `_next/static` request whose origin isn't `localhost`,
  // so the page's HTML shows up but no client JS ever runs (no hydration,
  // animations stuck at their initial state, nothing clickable).
  //
  // `allowedDevOrigins` only matches exact hostnames or DNS-style subdomain
  // wildcards (`*.example.com`) — it does NOT support CIDR ranges, so a
  // whole-subnet entry isn't expressible here. This is the machine's current
  // Wi-Fi IP; if it changes (different network, DHCP lease renewal), update
  // this list to match `ipconfig`'s new address.
  allowedDevOrigins: ['192.168.1.187'],
  // Root layout keys off a top-level dynamic `[locale]` segment, so there's
  // no single layout to compose a 404 from for a URL that matches no route
  // at all — see src/app/global-not-found.tsx.
  experimental: {
    globalNotFound: true,
  },
  // `next/image` hard-errors on any external host not listed here. Without
  // this, real YouTube thumbnails (src/lib/youtube.ts) and — once
  // BLOB_READ_WRITE_TOKEN is set in production — every Payload media upload
  // served from Vercel Blob would be unrenderable through next/image
  // sitewide. i.ytimg.com is already used today via a plain `<img>` as a
  // workaround (see src/components/podcast/StoriesStrip.tsx); this makes
  // next/image usable for that host too.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
