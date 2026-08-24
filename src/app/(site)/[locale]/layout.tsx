import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '@/styles/globals.css'
import { fontVariables } from '@/lib/fonts'
import { dict, dirOf, isLocale, locales } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'

/**
 * This layout is the ROOT layout for every `/{locale}/...` route — there is
 * intentionally no `layout.tsx` directly in `src/app/`, so this one owns
 * `<html>`/`<body>`. That's required to set `lang`/`dir` from the locale
 * param (a layout above `[locale]` in the tree can't see it). See
 * src/proxy.ts for why the bare "/" redirect lives there instead of
 * in a sibling `src/app/page.tsx`.
 *
 * `Header`/`Footer`/`<main>` are intentionally NOT rendered here — Home
 * needs a borderless `Header` (see its `bordered` doc comment) while every
 * other route needs the bordered variant, so that chrome is composed once
 * per branch instead: directly in `page.tsx` for Home, and in the sibling
 * `(pages)/layout.tsx` route group for everything else. That keeps the
 * distinction static (no client-side pathname check, no `headers()`
 * dynamic-API opt-out) so every route stays prerenderable.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'נבחרות | Nivcharot',
    template: '%s | נבחרות',
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }

  const locale = rawLocale

  return (
    <html lang={locale} dir={dirOf(locale)} className={fontVariables}>
      <head>
        {/*
         * Scroll-reveal sections render at opacity 0 and are animated in by
         * motion on the client. Without JavaScript that never happens, so the
         * page would come up blank below the fold. This restores them.
         */}
        <noscript>
          <style>{'[data-reveal]{opacity:1 !important;transform:none !important}'}</style>
        </noscript>
      </head>
      <body className="flex min-h-screen flex-col bg-bg text-text">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:start-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded focus-visible:bg-bg focus-visible:px-4 focus-visible:py-2 focus-visible:text-text focus-visible:outline-2 focus-visible:outline-accent"
        >
          {dict.skipToContent[locale]}
        </a>
        {children}
      </body>
    </html>
  )
}
