import { notFound } from 'next/navigation'

import { AlumnaeWallLab } from '@/components/hanivcheret/AlumnaeWallLab'
import { Footer } from '@/components/ui/Footer'
import { Header } from '@/components/ui/Header'
import { getNavigationLinks, getSiteSettings } from '@/lib/cms'
import { isLocale } from '@/lib/i18n'

/**
 * Throwaway route (2026-08-31 lab brief) — deliberately outside the
 * `(pages)` route group, not linked from nav or the sitemap. See
 * `AlumnaeWallLab.tsx`'s own doc comment. Safe to delete once a direction
 * is picked and wired into the real `HanivcheretPage.tsx`.
 */
export default async function AlumnaeWallLabRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()
  const locale = rawLocale

  const [navLinks, siteSettings] = await Promise.all([getNavigationLinks(locale), getSiteSettings()])

  return (
    <>
      <Header locale={locale} navLinks={navLinks} />
      <main id="main-content" className="flex-1">
        <AlumnaeWallLab locale={locale} />
      </main>
      <Footer locale={locale} donateHref={`/${locale}/donate`} contactEmail={siteSettings.contactEmail} social={siteSettings.social} />
    </>
  )
}
