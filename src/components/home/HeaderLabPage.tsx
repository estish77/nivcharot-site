'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Footer } from '@/components/ui/Footer'
import { Header } from '@/components/ui/Header'
import type { NavMenuTriggerVariant } from '@/components/ui/NavMenu'
import { Logo, PodcastIcon, LanguageToggle, HeaderDonateHeart, Button, HeartIcon, NavMenu, type NavLink } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import type { PayloadSiteSettings } from '@/lib/cms'
import { CompactLanguageToggle } from './CompactLanguageToggle'

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

      {/*
        The actual requested draft (2026-08-31 brief: "דראפט מקומי של ההדר
        כפי שהוא עכשיו, רק בלי מסגרת בהמבורגר, לפי הסדר: משמאל לימין,
        המבורגר, לב, אייקון סאונד, בוררי השפה") — everything above is the
        pre-existing hamburger-border comparison; this is the header ROW
        ITSELF, reassembled from the same real sub-components in the
        requested order (today's DOM order is podcast/language/heart/menu;
        the request swaps the first two — logical start→end becomes
        language, podcast, heart, menu, which in RTL reads right-to-left as
        language nearest the logo then podcast then heart then the
        hamburger at the far LEFT edge — "hamburger, heart, sound, language"
        reading left to right, exactly as asked).
      */}
      <div className="border-b-2 border-divider bg-bg px-8 py-[18px] max-[640px]:px-4 max-[640px]:py-3">
        <p className="mx-auto mb-3 max-w-[1080px] font-heading text-[12px] font-extrabold tracking-[0.06em] text-accent-700">
          {t(locale, { he: 'הדראפט המבוקש — לפי הסדר: המבורגר · לב · סאונד · שפה', en: 'The requested draft — order: hamburger · heart · sound · language' })}
        </p>
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-6 max-[640px]:gap-3">
          <Link href={`/${locale}`} className="inline-flex items-center rounded-sm text-text no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            <Logo locale={locale} />
          </Link>
          <nav className="flex items-center gap-5 max-[640px]:gap-2 max-[519px]:gap-1" aria-label={t(locale, { he: 'ניווט — דראפט', en: 'Navigation — draft' })}>
            <LanguageToggle locale={locale} />
            <Link
              href={`/${locale}/podcast`}
              className="group flex items-center text-accent-700 hover:text-accent focus-visible:rounded-sm focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={t(locale, { he: 'הפודקאסט של נבחרות', en: "Nivcharot's podcast" })}
            >
              <PodcastIcon className="max-[640px]:h-[18px] max-[640px]:w-[18px] transition-transform duration-300 ease-out group-hover:scale-110" />
            </Link>
            <HeaderDonateHeart locale={locale} className="hidden max-[519px]:flex" />
            <Button
              href={`/${locale}/donate`}
              variant="primary"
              size="sm"
              className="hidden items-center gap-1.5 whitespace-nowrap max-[640px]:px-[12px] max-[640px]:py-[8px] max-[640px]:text-[13px] min-[520px]:flex"
            >
              <HeartIcon />
              {t(locale, { he: 'תרמו', en: 'Donate' })}
            </Button>
            <NavMenu locale={locale} links={navLinks} triggerVariant="borderless-red" />
          </nav>
        </div>
      </div>

      {/*
        2026-08-31 follow-up #2: "אני רוצה לראות אותו בתצוגת מובייל משתלב,
        עם בורר השפות המצומצם" — the requested-order row above still uses
        the REGULAR `LanguageToggle`; this is the same row again with
        `CompactLanguageToggle` swapped in, so both pieces are seen combined
        in one header. Real responsive classes (same as the site's actual
        header), not a fake fixed-width box — Tailwind's breakpoints read
        the BROWSER's own width, so a box merely narrower than the page
        can't force mobile sizing on its own at a wide viewport; only
        actually narrowing the window (or a real mobile viewport
        screenshot) shows the true mobile version.
      */}
      <div className="border-b-2 border-divider bg-bg px-8 py-[18px] max-[640px]:px-4 max-[640px]:py-3">
        <p className="mx-auto mb-3 max-w-[1080px] font-heading text-[12px] font-extrabold tracking-[0.06em] text-accent-700">
          {t(locale, {
            he: 'שילוב מלא: הסדר המבוקש + בורר שפה מצומצם (כווצו את החלון לרוחב מובייל)',
            en: 'Full integration: the requested order + compact language selector (narrow the window to mobile width)',
          })}
        </p>
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-6 max-[640px]:gap-3">
          <Link href={`/${locale}`} className="inline-flex items-center rounded-sm text-text no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            <Logo locale={locale} />
          </Link>
          <nav className="flex items-center gap-5 max-[640px]:gap-2 max-[519px]:gap-1" aria-label={t(locale, { he: 'ניווט — דראפט משולב', en: 'Navigation — combined draft' })}>
            <CompactLanguageToggle locale={locale} />
            <Link
              href={`/${locale}/podcast`}
              className="group flex items-center text-accent-700 hover:text-accent focus-visible:rounded-sm focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label={t(locale, { he: 'הפודקאסט של נבחרות', en: "Nivcharot's podcast" })}
            >
              <PodcastIcon className="max-[640px]:h-[18px] max-[640px]:w-[18px] transition-transform duration-300 ease-out group-hover:scale-110" />
            </Link>
            <HeaderDonateHeart locale={locale} className="hidden max-[519px]:flex" />
            <Button
              href={`/${locale}/donate`}
              variant="primary"
              size="sm"
              className="hidden items-center gap-1.5 whitespace-nowrap max-[640px]:px-[12px] max-[640px]:py-[8px] max-[640px]:text-[13px] min-[520px]:flex"
            >
              <HeartIcon />
              {t(locale, { he: 'תרמו', en: 'Donate' })}
            </Button>
            <NavMenu locale={locale} links={navLinks} triggerVariant="borderless-red" />
          </nav>
        </div>
      </div>

      {/*
        2026-08-31 follow-up #3: "F12 מפעיל מצב טיסה" — window-resizing
        (imprecise) and DevTools' own device-mode shortcut (remapped to a
        hardware key on this keyboard) were both ruled out as ways to see
        the row above at genuine mobile width. An `<iframe>` has its own
        real, independent viewport — no resizing or shortcut needed — sized
        to 390px here (an iPhone-ish width) so this always renders every
        breakpoint-gated piece (the heart/Button toggle, icon sizes, gaps)
        exactly as a real phone would, permanently. Points at
        `/header-lab/mobile-preview`, a separate minimal route with no
        iframe of its own — embedding THIS page inside itself would nest
        infinitely.
      */}
      <div className="border-b-2 border-divider bg-bg px-8 py-4 max-[640px]:px-4">
        <div className="mx-auto max-w-[1080px]">
          <p className="mb-3 font-heading text-[12px] font-extrabold tracking-[0.06em] text-accent-700">
            {t(locale, {
              he: 'תצוגת מובייל אמיתית ותמידית (390px) — בלי לכווץ שום דבר',
              en: 'Real, permanent mobile view (390px) — nothing to resize',
            })}
          </p>
          <iframe
            src={`/${locale}/header-lab/mobile-preview`}
            title={t(locale, { he: 'תצוגה מקדימה של ההדר במובייל', en: 'Mobile header preview' })}
            width={390}
            height={150}
            className="mx-auto block max-w-full border-2 border-divider"
          />
        </div>
      </div>

      {/*
        2026-08-31 follow-up: "אין שם את העיצוב למובייל עם הלב החלול" — the
        hollow-heart mobile link (`HeaderDonateHeart`) was already correctly
        in both header rows above, but only actually VISIBLE below the
        max-[519px] breakpoint — easy to miss inside a full header row at
        desktop width, and not something the two static screenshots sent
        back made obvious either. Shown here on its own, at every width, so
        it's unmistakable rather than something to have to resize the
        window to notice.
      */}
      <div className="border-b-2 border-divider bg-bg px-8 py-4 max-[640px]:px-4">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-4">
          <p className="font-heading text-[12px] font-extrabold tracking-[0.06em] text-accent-700">
            {t(locale, { he: 'תזכורת: הלב החלול של המובייל (זה כבר קיים למעלה, רק מוצג כאן תמיד כדי שיהיה ברור)', en: "Reminder: the mobile hollow heart (already above, just always shown here so it's unmistakable)" })}
          </p>
          <HeaderDonateHeart locale={locale} />
          <p className="text-[12.5px] leading-[1.5] text-neutral-700">
            {t(locale, {
              he: 'ריק/חלול במנוחה, ממלא באדום עם אנימציית "פופ" בלחיצה — אותו לב ואותה אנימציה בדיוק כמו כפתור השכוייח בדף הצוות.',
              en: 'Empty/outlined at rest, fills red with a "pop" animation on click — the exact same heart and animation as the שכוייח button on the Team page.',
            })}
          </p>
        </div>
      </div>

      <div className="border-b-2 border-divider bg-tint-cream px-8 py-4 max-[640px]:px-4">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center gap-4">
          <p className="font-heading text-[12px] font-extrabold tracking-[0.06em] text-accent-700">
            {t(locale, { he: 'דוגמה: בורר שפה קומפקטי (סגור/פתוח)', en: 'Example: compact language selector (closed/open)' })}
          </p>
          <CompactLanguageToggle locale={locale} />
          <p className="text-[12.5px] leading-[1.5] text-neutral-700">
            {t(locale, {
              he: 'לוחצים כדי לראות אותו נפתח. ברוחב מנוחה הוא תופס רק תווית אחת + חץ, לעומת "עב | EN" הקבוע.',
              en: 'Click to see it open. At rest it takes only one label + a caret, instead of the always-visible "EN | עב".',
            })}
          </p>
        </div>
      </div>

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
