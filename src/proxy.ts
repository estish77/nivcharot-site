import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { defaultLocale } from '@/lib/i18n'

/**
 * Redirects the bare "/" to "/{defaultLocale}".
 *
 * This can't be a plain `src/app/page.tsx`: `(site)/[locale]/layout.tsx`
 * owns the `<html lang dir>` tag (it needs the `locale` route param to set
 * those correctly), which requires Next's "multiple root layouts via route
 * groups" pattern — no `layout.tsx` directly in `src/app/`. A bare
 * `src/app/page.tsx` sitting outside every route group would then have no
 * root layout anywhere in its own ancestor chain (Next requires one), so
 * the redirect is handled here instead, before routing/layouts resolve at
 * all. See https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layouts
 */
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url))
}

export const config = {
  matcher: '/',
}
