import { notFound } from 'next/navigation'

import { HeaderLabPage } from '@/components/home/HeaderLabPage'
import { getNavigationLinks, getSiteSettings } from '@/lib/cms'
import { isLocale } from '@/lib/i18n'

/**
 * Throwaway route (2026-08-29 lab brief) — deliberately outside the
 * `(pages)` route group, not linked from nav or the sitemap. See
 * `HeaderLabPage.tsx`'s own doc comment. Safe to delete once a trigger
 * variant is picked and made `NavMenu`'s new default.
 */
export default async function HeaderLabRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()
  const locale = rawLocale

  const [navLinks, siteSettings] = await Promise.all([getNavigationLinks(locale), getSiteSettings()])

  return <HeaderLabPage locale={locale} navLinks={navLinks} siteSettings={siteSettings} />
}
