/**
 * Single source of truth for the site's public base URL — used by
 * `sitemap.ts`, `robots.ts`, `lib/seo.ts` (canonical, hreflang and social
 * card URLs) and the root layout's `metadataBase`.
 *
 * No production domain is declared anywhere else in the repo (`vercel.json`
 * doesn't exist; `package.json` has no `homepage` field), so
 * `NEXT_PUBLIC_SITE_URL` is how a deploy names the real domain without a
 * code change. See .env.example.
 *
 * THE FALLBACK IS THE LIVE DOMAIN, not a legacy one. An earlier version of
 * this comment described `www.nivcharot.co.il` as "the legacy WordPress
 * site", which was true when it was written and stopped being true once
 * this app took the domain over — `components/ui/PodcastIcon.tsx` records
 * a 2026-08-31 bug reproduced on that exact host, against this app, and a
 * fetch of it on 2026-09-11 served this app's own `/he` redirect and
 * wordmark. Corrected here because the stale wording made the fallback
 * look like an SEO hazard (canonical tags pointing at a dying WordPress
 * install) when it is in fact the correct production value.
 *
 * Setting the env var is still worthwhile: it is what lets a preview or
 * staging deploy describe itself honestly instead of claiming to be
 * production in its own canonical tags.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.nivcharot.co.il').replace(/\/$/, '')
