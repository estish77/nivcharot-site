import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { defaultLocale } from '@/lib/i18n'

/**
 * Redirects "/" and any URL with no `/{locale}` prefix to the same path
 * under "/{defaultLocale}" instead.
 *
 * This can't be a plain `src/app/page.tsx`: `(site)/[locale]/layout.tsx`
 * owns the `<html lang dir>` tag (it needs the `locale` route param to set
 * those correctly), which requires Next's "multiple root layouts via route
 * groups" pattern — no `layout.tsx` directly in `src/app/`. A bare
 * `src/app/page.tsx` sitting outside every route group would then have no
 * root layout anywhere in its own ancestor chain (Next requires one), so
 * the redirect is handled here instead, before routing/layouts resolve at
 * all. See https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layouts
 *
 * 2026-09-07 brief: a URL with no locale prefix at all (e.g. "/our-team",
 * a stale external link — real ones are always "/he/..." or "/en/...")
 * showed Next's own bare, unstyled fallback 404 instead of the site's
 * branded one. Root cause: `(site)/[locale]/layout.tsx` calls `notFound()`
 * for an invalid `locale` param BEFORE it ever returns `<html>` — and
 * since it's the one THAT layout that owns `<html>` (no layout.tsx sits
 * above it), Next has nothing to render `not-found.tsx` inside. That's
 * exactly the case `global-not-found.tsx` (see src/app/global-not-found.tsx)
 * is documented to exist for, but it doesn't fire in production even via a
 * plain local `next build && next start`, not just on Vercel — a real bug
 * in this experimental Next 16.3 feature, not a config mistake here.
 * Redirecting into a REAL locale first sidesteps it: `[locale]/layout.tsx`
 * now succeeds (valid locale → a real `<html>`), and `[locale]/not-found.tsx`
 * — confirmed working for an unmatched path *inside* a valid locale, e.g.
 * "/he/some-bad-slug" — renders normally from there.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const suffix = pathname === '/' ? '' : pathname
  return NextResponse.redirect(new URL(`/${defaultLocale}${suffix}`, request.url))
}

export const config = {
  // Excludes: /he, /en (real locale routes), /admin + /api (the (payload)
  // route group), /_next (framework internals), and the handful of
  // root-level static/metadata routes under src/app (icon.png,
  // apple-icon.png, robots.ts → robots.txt, sitemap.ts → sitemap.xml) plus
  // public/assets.
  matcher: ['/((?!(?:he|en|admin|api|_next|assets|icon\\.png|apple-icon\\.png|robots\\.txt|sitemap\\.xml)(?:/|$)).*)'],
}
