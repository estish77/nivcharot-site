import { Reveal, Section, cn } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import { transparencyEyebrow, transparencyHeading, transparencyItems } from '@/content/donate'

export type TransparencyGridProps = { locale: Locale }

/**
 * The "שקיפות" / "TRANSPARENCY" block (docs/Shop.dc.html): dark-slate
 * section, four stat-style items with a divider between them. The mockup's
 * divider is 4 columns wide with no responsive rule of its own (it just
 * force-collapses via the fake `[style*=...]` layer); real breakpoints
 * are 4→2→1 at 860/560px, with the divider re-computed per breakpoint so
 * it never dangles at the right edge of a row.
 */
export function TransparencyGrid({ locale }: TransparencyGridProps) {
  return (
    <Reveal as="section">
      <Section as="div" tint="niv-slate" paddingBlockStart="56px" paddingBlockEnd="60px">
        {/*
          A plain styled <p> rather than the shared `Eyebrow`, which hard-
          codes --color-accent-700: that token is the a11y fix for small red
          text on the LIGHT --color-bg, and on this section's dark
          --niv-slate ground it measures about 2:1 and is genuinely hard to
          read (2026-08-27 redesign pass). Going darker makes a dark ground
          worse, so this uses --color-accent-300, the light tint the design
          tokens define for exactly this case (5.23:1 on --niv-slate).
          `cn` is a plain joiner, not tailwind-merge, so passing a competing
          text-* class to `Eyebrow` would leave both in the class list and
          let stylesheet order decide - hence a <p> instead of an override.
        */}
        <p className="m-0 mb-2.5 font-heading text-[13px] font-extrabold tracking-[0.08em] text-accent-300">
          {t(locale, transparencyEyebrow)}
        </p>
        <h2 className="mb-[30px] text-niv-cream max-[860px]:text-[clamp(24px,7vw,34px)]">
          {t(locale, transparencyHeading)}
        </h2>
        <div className="grid grid-cols-4 max-[860px]:grid-cols-2 max-[560px]:grid-cols-1">
          {transparencyItems.map((item, i, all) => {
            const isLastOfFour = i === all.length - 1
            const isRightOfPair = i % 2 === 1
            return (
              <div
                key={t(locale, item.title)}
                className={cn(
                  'px-6 py-1.5',
                  !isLastOfFour && 'border-e-2 border-[rgba(249,218,187,0.28)]',
                  isRightOfPair && 'max-[860px]:border-e-0',
                  'max-[560px]:border-e-0',
                )}
              >
                <h3 className="mb-2 text-[19px] text-niv-cream">{t(locale, item.title)}</h3>
                <p className="m-0 text-sm leading-[1.7] text-[rgba(227,222,215,0.86)]">{t(locale, item.body)}</p>
              </div>
            )
          })}
        </div>
      </Section>
    </Reveal>
  )
}
