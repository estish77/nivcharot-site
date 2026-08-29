import { notFound } from 'next/navigation'

import { Mivzakon } from '@/components/home'
import { SeatLabHero } from '@/components/home/SeatLabHero'
import { Footer } from '@/components/ui/Footer'
import { Header } from '@/components/ui/Header'
import { getMivzakonItems } from '@/content/mivzakon'
import { getNavigationLinks, getSiteSettings } from '@/lib/cms'
import { isLocale } from '@/lib/i18n'

/**
 * Throwaway route (2026-08-29 lab brief) — deliberately outside the
 * `(pages)` route group (so it isn't picked up by anything that enumerates
 * real site pages) and not linked from nav or the sitemap. See
 * `SeatLabHero.tsx`'s own doc comment. Safe to delete once a hover mode is
 * picked and wired into the real `Hero.tsx` permanently.
 */
export default async function SeatLabPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()
  const locale = rawLocale

  const [navLinks, siteSettings] = await Promise.all([getNavigationLinks(locale), getSiteSettings()])

  return (
    <>
      <Header locale={locale} navLinks={navLinks} bordered={false} />
      <main id="main-content" className="flex-1">
        <SeatLabHero locale={locale} />
        <Mivzakon locale={locale} items={getMivzakonItems()} />
      </main>
      <Footer locale={locale} donateHref={`/${locale}/donate`} contactEmail={siteSettings.contactEmail} social={siteSettings.social} />
    </>
  )
}
