import Link from 'next/link'

import { Reveal } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import { donateBand } from '@/content/home'
import { EqualizerDots } from './EqualizerDots'

/**
 * The home page's donate banner (2026-08-13 brief, item 18): a focused
 * accent-red CTA linking straight to `/donate`. Used to also carry an
 * embedded newsletter form — that's now `NewsletterSection`, its own
 * separate spot on the page, so this section reads unambiguously as "the
 * donate banner" rather than a mixed donate/newsletter block.
 */
export function DonateBand({ locale }: { locale: Locale }) {
  return (
    <Reveal as="section" className="relative bg-accent text-white">
      <div className="absolute leading-none" style={{ insetBlockStart: '32px', insetInlineEnd: '32px' }}>
        <EqualizerDots tone="accent" />
      </div>
      <div className="mx-auto" style={{ maxWidth: 1240, paddingInline: '32px', paddingBlock: '68px' }}>
        <div className="flex flex-wrap items-center justify-between gap-9">
          <div style={{ maxWidth: 620 }}>
            <h2 className="m-0 mb-3 text-white" style={{ fontSize: 'clamp(30px, 4vw, 50px)', lineHeight: 1.08 }}>
              {t(locale, donateBand.title)}
            </h2>
            <p className="m-0 text-[15.5px] leading-[1.65]" style={{ color: 'rgba(255,255,255,0.92)' }}>
              {t(locale, donateBand.lead)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/${donateBand.primaryCta.slug}`}
              className="btn whitespace-nowrap bg-white px-6 py-[13px] text-[15px] text-accent hover:bg-niv-slate hover:text-white focus-visible:bg-niv-slate focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t(locale, donateBand.primaryCta.label)}
            </Link>
            <Link
              href={`/${locale}/${donateBand.secondaryCta.slug}`}
              className="btn whitespace-nowrap border-white bg-transparent px-6 py-[13px] text-[15px] text-white hover:bg-niv-slate hover:border-niv-slate hover:text-white focus-visible:bg-niv-slate focus-visible:border-niv-slate focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {t(locale, donateBand.secondaryCta.label)}
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
