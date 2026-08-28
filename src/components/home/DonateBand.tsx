import Link from 'next/link'

import { Breathe } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import { donateBand } from '@/content/home'
import { joinCards } from '@/content/join'

/** Reuses the Join page's "newsletter" card as the single source of truth for the external signup URL/label — same fixture `NewsletterSection` (now merged into this component) used. */
const newsletterCard = joinCards.find((card) => card.id === 'newsletter')!
const newsletterLink = newsletterCard.links[0]

/**
 * The site's on-brand accent-red, matching the logo/Header's Donate CTA
 * (`Button`'s `btn-primary`) — but hand-rolled here rather than
 * `variant="primary"`, since `.btn-primary`'s hover state falls back to
 * `--niv-slate`, which would make the button vanish into this banner's own
 * niv-slate background. Darkens (`accent-600`) on hover/focus instead.
 */
const bandButtonClasses =
  'btn whitespace-nowrap bg-accent px-5 py-2 text-[14px] text-white hover:bg-accent-600 focus-visible:bg-accent-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

/**
 * The home page's single donate/newsletter banner — one dark-navy
 * (niv-slate) bar, one line, both CTAs as accent-red buttons matching the
 * logo. Used to be two separate stacked bands (`DonateBand` + a
 * `NewsletterSection` right below it, each its own full-width row with a
 * white button) per the site owner's 2026-08-27 feedback: merged into one
 * row here rather than kept as siblings, since two near-identical dark
 * bars back-to-back read as one broken/duplicated section, not two
 * distinct ones.
 *
 * Uses `Breathe` (a continuous idle pulse) rather than `Reveal`'s one-shot
 * scroll-entrance — this banner should read as always "alive" on screen,
 * not just animate in once and go still.
 *
 * The pulse is applied to the INNER container, not the full-bleed section,
 * and the section clips overflow on the x axis. `Breathe` animates `scale`
 * to 1.015: on the full-bleed section that meant 1280 x 1.015 = ~1299px,
 * i.e. an element wider than the viewport, which gave the whole page a
 * horizontal scrollbar at every width. Clipping alone doesn't fix that —
 * `overflow-x-clip` constrains an element's CHILDREN, never its own
 * transformed box — so the scaled element has to be one the section can
 * actually clip. `clip` rather than `hidden` so no scroll container is
 * created and the sticky header is unaffected.
 */
export function DonateBand({ locale }: { locale: Locale }) {
  const newsletterUrl = t(locale, newsletterLink.href)

  return (
    <section className="relative overflow-x-clip bg-niv-slate text-niv-cream">
      <Breathe className="mx-auto" style={{ maxWidth: 1240, paddingInline: '32px', paddingBlock: '22px' }}>
        {/*
          This row used to be `flex-nowrap` + `overflow-x-auto` with a
          `whitespace-nowrap` heading. One sentence and two buttons don't fit
          on one line much below a wide desktop, so the row became a
          horizontal scroller: the heading was cut off at BOTH ends, and the
          scrollbar gutter showed up as a faint empty strip under the buttons
          (2026-08-28 brief reported both). Nothing here needs to scroll — it
          wraps instead, and the heading is allowed to break.
        */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3.5 text-center">
          <h2 className="m-0 text-[19px] font-extrabold leading-[1.3] text-niv-cream max-[640px]:text-[17px]">
            {t(locale, donateBand.title)}
          </h2>
          <Link href={`/${locale}/${donateBand.primaryCta.slug}`} className={bandButtonClasses}>
            {t(locale, donateBand.primaryCta.label)}
          </Link>
          <Link href={newsletterUrl} target="_blank" rel="noopener noreferrer" className={bandButtonClasses}>
            {t(locale, newsletterLink.label)}
          </Link>
        </div>
      </Breathe>
    </section>
  )
}
