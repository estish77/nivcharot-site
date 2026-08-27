import { Reveal, Section } from '@/components/ui'
import type { Locale } from '@/lib/i18n'
import { statsFootnoteEn, statTiles } from '@/content/home'

/** The "350,000" tile alone renders at a smaller clamp so the longer number doesn't overflow its cell, and never wraps. */
const WIDE_VALUE = '350,000'

/**
 * A bespoke responsive grid (not the shared `CellGrid`): the divider here is
 * a translucent cream `rgba(249,218,187,0.28)` against the dark slate
 * background, not the shared `--color-divider` tan that `CellGrid` always
 * renders — `--color-divider` would read as a near-invisible, low-contrast
 * line on this background. `CellGrid` has no per-instance border-color
 * override, so this mirrors its exact 4→2→1 responsive technique (a scoped
 * `<style>` with real `@media` queries + `nth-child` divider rules) with
 * the one color swapped — see this agent's final report for the full note.
 */
const GRID_CSS = `
.niv-stats-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr))}
.niv-stats-grid>.niv-stat-cell{border-inline-end:2px solid rgba(249,218,187,0.28)}
.niv-stats-grid>.niv-stat-cell:nth-child(4n){border-inline-end:0}
.niv-stats-grid>.niv-stat-cell:hover{animation:nivCellBreathe 2.6s ease-in-out infinite}
@media (prefers-reduced-motion: reduce){.niv-stats-grid>.niv-stat-cell:hover{animation:none!important}}
@media (max-width:860px){
  .niv-stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .niv-stats-grid>.niv-stat-cell{border-inline-end:2px solid rgba(249,218,187,0.28)}
  .niv-stats-grid>.niv-stat-cell:nth-child(2n){border-inline-end:0}
}
@media (max-width:560px){
  .niv-stats-grid{grid-template-columns:minmax(0,1fr)}
  .niv-stats-grid>.niv-stat-cell{border-inline-end:0}
}
`

export function StatsBand({
  locale,
  tiles = statTiles[locale],
  footnote = statsFootnoteEn,
}: {
  locale: Locale
  tiles?: Array<{ value: string; description: string }>
  footnote?: string
}) {
  return (
    <Reveal as="section">
      <Section as="div" tint="niv-slate" paddingBlockStart="60px" paddingBlockEnd="64px">
        <style dangerouslySetInnerHTML={{ __html: GRID_CSS }} />
        <div className="niv-stats-grid">
          {tiles.map((tile) => (
            <div
              key={tile.description}
              className="niv-stat-cell transition-colors duration-[250ms] ease-out"
              style={{ paddingInline: '22px', paddingBlock: '6px' }}
            >
              <div
                className="font-heading font-extrabold leading-none text-niv-cream"
                style={{
                  fontSize: tile.value === WIDE_VALUE ? 'clamp(26px, 2.5vw, 36px)' : 'clamp(34px, 3.4vw, 48px)',
                  whiteSpace: tile.value === WIDE_VALUE ? 'nowrap' : undefined,
                }}
              >
                {tile.value}
              </div>
              <p className="mt-3 text-[13.5px] leading-[1.6]" style={{ color: '#e3ded7' }}>
                {tile.description}
              </p>
            </div>
          ))}
        </div>
        {locale === 'en' && footnote ? (
          <p className="mt-[26px] max-w-[640px] text-[13px] leading-[1.6]" style={{ color: 'rgba(227,222,215,0.72)' }}>
            {footnote}
          </p>
        ) : null}
      </Section>
    </Reveal>
  )
}
