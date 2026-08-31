import { notFound } from 'next/navigation'

import { HeaderMobilePreview } from '@/components/home/HeaderMobilePreview'
import { getNavigationLinks } from '@/lib/cms'
import { isLocale } from '@/lib/i18n'

/**
 * Throwaway route (2026-08-31 follow-up) — renders ONLY the header row
 * (no toolbar, no other comparison rows, no iframe of its own), meant to be
 * embedded inside `/header-lab` via a fixed-width `<iframe>` so it always
 * shows true mobile sizing regardless of the outer browser window's real
 * width. Deliberately does NOT reuse `HeaderLabPage` here — embedding a
 * page that itself contains this same iframe would nest infinitely.
 * Delete alongside `/header-lab` once a design is picked.
 */
export default async function HeaderLabMobilePreviewRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()
  const locale = rawLocale

  const navLinks = await getNavigationLinks(locale)

  return <HeaderMobilePreview locale={locale} navLinks={navLinks} />
}
