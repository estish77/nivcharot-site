import { Eyebrow, Reveal, Section, cn } from '@/components/ui'
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
          Eyebrow always renders in --color-accent-700 (the project's a11y
          fix for small red text on --color-bg). That rule doesn't strictly
          apply on this section's dark --niv-slate background — the mockup
          uses the brighter --color-accent here — but overriding a Tailwind
          utility Eyebrow already sets isn't reliably winnable via class
          order, so this reuses Eyebrow as designed rather than fighting it.
        */}
        <Eyebrow className="mb-2.5">{t(locale, transparencyEyebrow)}</Eyebrow>
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
