'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'motion/react'

import { Reveal, Section } from '@/components/ui'
import { useReducedMotion } from '@/lib/useReducedMotion'
import type { Locale } from '@/lib/i18n'
import { statTiles } from '@/content/home'

/**
 * A bespoke responsive grid (not the shared `CellGrid`): the divider here is
 * a translucent cream `rgba(249,218,187,0.28)` against the dark slate
 * background, not the shared `--color-divider` tan that `CellGrid` always
 * renders — `--color-divider` would read as a near-invisible, low-contrast
 * line on this background. `CellGrid` has no per-instance border-color
 * override, so this mirrors its exact responsive technique (a scoped
 * `<style>` with real `@media` queries + `nth-child` divider rules) with
 * the one color swapped, scaled to 6 tiles (6→3→2→1 columns — each divides
 * evenly into 6, so every row fills with no orphaned trailing cell).
 */
const GRID_CSS = `
.niv-stats-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr))}
.niv-stats-grid>.niv-stat-cell{border-inline-end:2px solid rgba(249,218,187,0.28)}
.niv-stats-grid>.niv-stat-cell:nth-child(6n){border-inline-end:0}
.niv-stats-grid>.niv-stat-cell:hover{animation:nivCellBreathe 2.6s ease-in-out infinite}
@media (prefers-reduced-motion: reduce){.niv-stats-grid>.niv-stat-cell:hover{animation:none!important}}
@media (max-width:860px){
  .niv-stats-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
  .niv-stats-grid>.niv-stat-cell{border-inline-end:2px solid rgba(249,218,187,0.28)}
  .niv-stats-grid>.niv-stat-cell:nth-child(3n){border-inline-end:0}
}
@media (max-width:560px){
  .niv-stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .niv-stats-grid>.niv-stat-cell{border-inline-end:2px solid rgba(249,218,187,0.28)}
  .niv-stats-grid>.niv-stat-cell:nth-child(2n){border-inline-end:0}
}
@media (max-width:400px){
  .niv-stats-grid{grid-template-columns:minmax(0,1fr)}
  .niv-stats-grid>.niv-stat-cell{border-inline-end:0}
}
`

/**
 * Counts up from 0 to the tile's value once it scrolls into view. Every
 * current tile is a plain integer string ("78", "13"...); anything that
 * isn't (a future "%" or "+" suffix) just renders as-is, unanimated, rather
 * than mangling text mid-count.
 */
function AnimatedStatValue({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const shouldReduceMotion = useReducedMotion()
  const target = Number(value)
  const isPlainInteger = Number.isInteger(target) && String(target) === value
  const [display, setDisplay] = useState(isPlainInteger ? '0' : value)

  useEffect(() => {
    if (!isPlainInteger || shouldReduceMotion) {
      setDisplay(value)
      return
    }
    if (!isInView) return
    const controls = animate(0, target, {
      duration: 1.3,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    })
    return () => controls.stop()
  }, [isInView, isPlainInteger, shouldReduceMotion, target, value])

  return <div ref={ref}>{display}</div>
}

export function StatsBand({
  locale,
  tiles = statTiles[locale],
}: {
  locale: Locale
  tiles?: Array<{ value: string; description: string }>
}) {
  return (
    <Reveal as="section">
      <Section as="div" tint="niv-slate" paddingBlockStart="60px" paddingBlockEnd="64px">
        <style dangerouslySetInnerHTML={{ __html: GRID_CSS }} />
        <div className="niv-stats-grid">
          {tiles.map((tile) => (
            <div
              key={tile.description}
              className="niv-stat-cell flex flex-col items-center text-center transition-colors duration-[250ms] ease-out"
              style={{ paddingInline: '22px', paddingBlock: '6px' }}
            >
              <div
                className="font-heading font-extrabold leading-none text-niv-cream"
                style={{ fontSize: 'clamp(34px, 3.4vw, 48px)', fontVariantNumeric: 'tabular-nums' }}
              >
                <AnimatedStatValue value={tile.value} />
              </div>
              <p className="mt-3 max-w-[220px] text-[13.5px] leading-[1.6]" style={{ color: '#e3ded7' }}>
                {tile.description}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </Reveal>
  )
}
