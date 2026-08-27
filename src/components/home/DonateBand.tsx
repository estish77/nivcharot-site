import Link from 'next/link'

import { Breathe } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import { donateBand } from '@/content/home'

/**
 * The home page's donate banner (2026-08-13 brief, item 18): a focused
 * accent-red CTA linking straight to `/donate`. Used to also carry an
 * embedded newsletter form — that's now `NewsletterSection`, its own
 * separate spot on the page, so this section reads unambiguously as "the
 * donate banner" rather than a mixed donate/newsletter block.
 *
 * Uses `Breathe` (a continuous idle pulse) rather than `Reveal`'s one-shot
 * scroll-entrance — this banner should read as always "alive" on screen,
 * not just animate in once and go still.
 */
export function DonateBand({ locale }: { locale: Locale }) {
  return (
    <Breathe as="section" className="relative bg-accent text-white">
      <div className="mx-auto" style={{ maxWidth: 1240, paddingInline: '32px', paddingBlock: '68px' }}>
        <div className="flex flex-wrap items-center justify-between gap-9">
          <h2 className="m-0 text-white" style={{ maxWidth: 720, fontSize: 'clamp(30px, 4vw, 50px)', lineHeight: 1.08 }}>
            {t(locale, donateBand.title)}
          </h2>
          <Link
            href={`/${locale}/${donateBand.primaryCta.slug}`}
            className="btn whitespace-nowrap bg-white px-6 py-[13px] text-[15px] text-accent hover:bg-niv-slate hover:text-white focus-visible:bg-niv-slate focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t(locale, donateBand.primaryCta.label)}
          </Link>
        </div>
      </div>
    </Breathe>
  )
}
