import type { Metadata } from 'next'

import '@/styles/globals.css'
import { fontVariables } from '@/lib/fonts'
import { NotFoundContent } from '@/components/ui'

export const metadata: Metadata = {
  title: 'הדף לא נמצא · Page not found | נבחרות',
}

/**
 * Handles URLs that don't match any route at all (Next 16 experimental
 * `global-not-found`, enabled via `experimental.globalNotFound` in
 * next.config.ts) — the site's root layout keys off a top-level dynamic
 * `[locale]` segment, so per Next's own docs there's no single layout to
 * compose a 404 from, and this file bypasses layout entirely: it must
 * import its own global styles/fonts and provide its own `<html>`/`<body>`.
 * Without this, an unmatched URL fell through to Next's bare unstyled
 * default 404 instead of the site's own branded page.
 */
export default function GlobalNotFound() {
  return (
    <html lang="he" dir="rtl" className={fontVariables}>
      <body className="flex min-h-screen flex-col items-center justify-center bg-bg text-text">
        <NotFoundContent />
      </body>
    </html>
  )
}
