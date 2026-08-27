import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
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
