'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { dict, locales, type Locale } from '@/lib/i18n'

/** Swaps only the leading /he or /en path segment — same logic as `LanguageToggle`'s own private helper, not exported from there so duplicated here for this draft-only mock. */
function withLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split('/')
  segments[1] = locale
  return segments.join('/') || `/${locale}`
}

/**
 * Draft-only mock (2026-08-31 brief: "בורר שנפתח שפחות יתפוס מקום") — a
 * collapsed language button (just the current locale's label + a caret)
 * that opens a small popover with the OTHER locale to switch to, instead
 * of showing both "עב | EN" side by side at all times. Real navigation
 * (same href-swap as `LanguageToggle`), just laid out to take less resting
 * width. Not a reusable component — if this direction is picked, it should
 * fold into `LanguageToggle.tsx` itself rather than staying a copy here.
 *
 * Shared by `HeaderLabPage` and `HeaderMobilePreview` (the iframe-embedded
 * mobile view) — extracted here rather than duplicated between the two.
 */
export function CompactLanguageToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const other = locales.find((l) => l !== locale) as Locale

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-1 font-heading text-[12.5px] font-bold tracking-[0.05em] text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {dict.languageToggle[locale]}
        <svg viewBox="0 0 12 8" width="9" height="6" aria-hidden="true" className={open ? 'rotate-180' : ''}>
          <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <div className="absolute end-0 top-full z-10 mt-2 min-w-[64px] border-2 border-divider bg-bg py-1 shadow-[0_8px_20px_-8px_rgba(49,68,81,0.25)]">
          <Link
            href={withLocale(pathname, other)}
            onClick={() => setOpen(false)}
            className="block px-3 py-1.5 font-heading text-[12.5px] font-semibold text-text no-underline hover:bg-tint-cream"
          >
            {dict.languageToggle[other]}
          </Link>
        </div>
      ) : null}
    </div>
  )
}
