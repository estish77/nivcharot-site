'use client'

import { useState } from 'react'

import { Footer } from '@/components/ui/Footer'
import { Header } from '@/components/ui/Header'
import type { NavMenuTriggerVariant } from '@/components/ui/NavMenu'
import type { NavLink } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import type { PayloadSiteSettings } from '@/lib/cms'

const OPTIONS: { value: NavMenuTriggerVariant; label: { he: string; en: string } }[] = [
  { value: 'boxed', label: { he: 'היום (מסגרת)', en: 'Today (boxed)' } },
  { value: 'borderless-red', label: { he: 'בלי מסגרת · אדום', en: 'Borderless · red' } },
  { value: 'borderless-slate', label: { he: 'בלי מסגרת · כחול-אפור', en: 'Borderless · slate' } },
  { value: 'soft-hover', label: { he: 'רקע רך בהובר', en: 'Soft hover bg' } },
  { value: 'underline', label: { he: 'קו הדגשה', en: 'Underline accent' } },
]

/**
 * Throwaway comparison page (2026-08-29 lab brief: "תראה לי דוגמא פה קודם.
 * תן לי כמה אופציות") — NOT linked from nav. Renders the real `Header` (and
 * `Footer`, for real page weight) with a switcher over `NavMenu`'s new
 * `triggerVariant` prop, so the mobile hamburger's border can be compared
 * live, at any real viewport width, instead of from static screenshots.
 * Safe to delete once a variant is picked and made `Header`'s new default.
 */
export function HeaderLabPage({
  locale,
  navLinks,
  siteSettings,
}: {
  locale: Locale
  navLinks: NavLink[]
  siteSettings: PayloadSiteSettings
}) {
  const [variant, setVariant] = useState<NavMenuTriggerVariant>('borderless-red')

  return (
    <>
      <div className="sticky top-0 z-40 flex flex-wrap items-center gap-1.5 border-b-2 border-divider bg-niv-slate px-4 py-2.5 text-white">
        <span className="me-1.5 font-heading text-[11.5px] font-extrabold tracking-[0.06em] text-niv-cream">
          {t(locale, { he: 'מעבדת הדר — לא לשידור', en: 'Header lab — not for publishing' })}
        </span>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setVariant(opt.value)}
            className={`border-2 px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${
              variant === opt.value
                ? 'border-accent bg-accent text-white'
                : 'border-white/30 bg-transparent text-white/80 hover:border-white/60'
            }`}
          >
            {t(locale, opt.label)}
          </button>
        ))}
        <span className="ms-auto text-[11px] text-white/60">
          {t(locale, { he: 'כווצו את החלון לרוחב מובייל כדי לראות', en: 'Narrow the window to mobile width to see it' })}
        </span>
      </div>

      <Header locale={locale} navLinks={navLinks} bordered={false} navMenuTriggerVariant={variant} />
      <main id="main-content" className="flex-1">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-4 px-8 py-16 max-[860px]:px-[18px]">
          <h1 className="text-[clamp(28px,4vw,44px)] leading-[1.1]">
            {t(locale, { he: 'תוכן הדף היה כאן', en: 'Page content would go here' })}
          </h1>
          <p className="max-w-[560px] text-[16px] leading-[1.6] text-neutral-800">
            {t(locale, {
              he: 'הדר אמיתי, פוטר אמיתי — רק כדי לראות את הכפתור בהקשר האמיתי שלו.',
              en: 'A real header, a real footer — just here to see the button in its real context.',
            })}
          </p>
        </div>
      </main>
      <Footer
        locale={locale}
        donateHref={`/${locale}/donate`}
        contactEmail={siteSettings.contactEmail}
        social={siteSettings.social}
      />
    </>
  )
}
