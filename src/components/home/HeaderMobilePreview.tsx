'use client'

import Link from 'next/link'

import { Logo, PodcastIcon, HeaderDonateHeart, NavMenu, CompactLanguageToggle, type NavLink } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'

/**
 * Just the header row, nothing else — meant to be embedded via a fixed-width
 * `<iframe>` (see `/header-lab`'s own doc comment) so it always renders at
 * true mobile width regardless of the outer browser window's real size.
 * 2026-08-31 brief: "F12 מפעיל מצב טיסה" — DevTools' own device-mode
 * shortcut is remapped to a hardware key on this keyboard, so window
 * resizing (imprecise) and DevTools (inaccessible) were both ruled out;
 * an iframe's own width is a real, independent viewport no keyboard
 * shortcut or manual drag is needed for.
 */
export function HeaderMobilePreview({ locale, navLinks }: { locale: Locale; navLinks: NavLink[] }) {
  return (
    <div className="bg-bg px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <Link href={`/${locale}`} className="inline-flex items-center rounded-sm text-text no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          <Logo locale={locale} />
        </Link>
        <nav className="flex items-center gap-1" aria-label={t(locale, { he: 'ניווט — תצוגת מובייל', en: 'Navigation — mobile preview' })}>
          <CompactLanguageToggle locale={locale} />
          <Link
            href={`/${locale}/podcast`}
            className="group flex items-center text-accent-700 hover:text-accent focus-visible:rounded-sm focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label={t(locale, { he: 'הפודקאסט של נבחרות', en: "Nivcharot's podcast" })}
          >
            <PodcastIcon className="h-[18px] w-[18px]" />
          </Link>
          <HeaderDonateHeart locale={locale} />
          <NavMenu locale={locale} links={navLinks} triggerVariant="borderless-red" />
        </nav>
      </div>
    </div>
  )
}
