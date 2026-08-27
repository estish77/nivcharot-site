import Link from 'next/link'

import { Breathe } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import { donateBand } from '@/content/home'

/**
 * The home page's donate banner (2026-08-13 brief, item 18): a focused CTA
 * linking straight to `/donate`. A thin, single-line dark-navy (niv-slate)
 * bar — the brand's other core color, alongside the accent red — rather
 * than a tall accent-red block; the title stays on one line at any
 * reasonable desktop width (wraps only on narrow mobile).
 *
 * Uses `Breathe` (a continuous idle pulse) rather than `Reveal`'s one-shot
 * scroll-entrance — this banner should read as always "alive" on screen,
 * not just animate in once and go still.
 */
export function DonateBand({ locale }: { locale: Locale }) {
  return (
    <Breathe as="section" className="relative bg-niv-slate text-niv-cream">
      <div className="mx-auto" style={{ maxWidth: 1240, paddingInline: '32px', paddingBlock: '22px' }}>
        <div className="flex flex-nowrap items-center justify-center gap-5 overflow-x-auto max-[640px]:flex-wrap">
          <h2 className="m-0 whitespace-nowrap text-[19px] font-extrabold leading-[1.3] text-niv-cream">
            {t(locale, donateBand.title)}
          </h2>
          <Link
            href={`/${locale}/${donateBand.primaryCta.slug}`}
            className="btn whitespace-nowrap bg-white px-5 py-2 text-[14px] text-niv-slate hover:bg-accent-300 hover:text-niv-slate focus-visible:bg-accent-300 focus-visible:text-niv-slate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t(locale, donateBand.primaryCta.label)}
          </Link>
        </div>
      </div>
    </Breathe>
  )
}
