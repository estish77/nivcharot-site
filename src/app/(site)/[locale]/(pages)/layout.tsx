import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { Footer } from '@/components/ui/Footer'
import { Header } from '@/components/ui/Header'
import { getNavigationLinks, getSiteSettings } from '@/lib/cms'
import { isLocale } from '@/lib/i18n'

/**
 * Shared chrome for every route EXCEPT Home: a bordered `Header` (every
 * mockup page has a 2px divider under the header except Home — see
 * `Header`'s own `bordered` doc comment) + `<main>` + `Footer`.
 *
 * This lives in its own route group (rather than the root `[locale]/layout.tsx`)
 * specifically so Home — which needs `bordered={false}` and composes the
 * same chrome itself in `[locale]/page.tsx` — can render the borderless
 * variant without a client-side pathname check, keeping every route
 * statically prerenderable (`generateStaticParams` + SSG, no `headers()`
 * dynamic-API opt-out).
 */
export default async function PagesLayout({
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
  const [navLinks, siteSettings] = await Promise.all([getNavigationLinks(locale), getSiteSettings()])

  return (
    <>
      <Header locale={locale} navLinks={navLinks} bordered />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer locale={locale} donateHref={`/${locale}/donate`} contactEmail={siteSettings.contactEmail} social={siteSettings.social} />
    </>
  )
}
