/**
 * Single source of truth for the site's public base URL — used by
 * `sitemap.ts`, `robots.ts`, and the root layout's `metadataBase`.
 *
 * No production domain is declared anywhere else in the repo (`vercel.json`
 * doesn't exist; `package.json` has no `homepage` field). `NEXT_PUBLIC_SITE_URL`
 * lets deployment configure the real domain without a code change; the
 * fallback is the org's one confirmed real domain in this codebase — the
 * legacy WordPress site referenced by `content/team.ts`'s photo URLs and
 * `components/ui/Footer.tsx`'s social links — used only so sitemap/robots
 * output valid absolute URLs before that env var is set.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.nivcharot.co.il').replace(/\/$/, '')
