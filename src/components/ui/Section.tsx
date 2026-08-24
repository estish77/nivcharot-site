import type { ReactNode } from 'react'

import { cn } from './cn'

/**
 * Every call site hands `Section` a fixed desktop px value ("56px", "72px",
 * ...) for block padding — fine at 1240px, but stacked across a dozen
 * sections on a 375px phone those same fixed gaps read as loose, empty
 * space rather than rhythm (2026-08-17 brief: "גרסת מובייל... מהודקת").
 * Rather than touch every one of that prop's ~40 call sites, this scales
 * the value itself: a fluid `clamp()` that's ~55% of the desktop value at
 * a 375px viewport and grows linearly back to the full value by 860px —
 * the same mobile/desktop split already used throughout the codebase
 * (`max-[860px]:`/`min-[861px]:`), just expressed as a continuous curve
 * instead of a hard breakpoint jump.
 */
function fluidBlockPadding(px: string): string {
  const value = Number.parseFloat(px)
  if (Number.isNaN(value) || value <= 0) return px
  const MIN_VW = 375
  const MAX_VW = 860
  const min = Math.round(value * 0.55)
  const max = Math.round(value)
  if (min >= max) return px
  const slope = ((max - min) / (MAX_VW - MIN_VW)) * 100
  const intercept = min - (slope / 100) * MIN_VW
  return `clamp(${min}px, ${intercept.toFixed(2)}px + ${slope.toFixed(3)}vw, ${max}px)`
}

/** Background tint tokens used across the mockups' `<section>` wrappers. */
export type SectionTint = 'none' | 'bg' | 'tint-cream' | 'tint-slate' | 'niv-slate' | 'accent'

const TINT_CLASS: Record<SectionTint, string> = {
  none: '',
  bg: 'bg-bg',
  'tint-cream': 'bg-tint-cream',
  'tint-slate': 'bg-tint-slate',
  'niv-slate': 'bg-niv-slate',
  accent: 'bg-accent',
}

export type SectionProps = {
  /** Host element for the full-bleed outer wrapper. @default 'section' */
  as?: 'section' | 'div'
  /** Full-bleed background tint. @default 'none' (transparent, inherits page bg) */
  tint?: SectionTint
  /** Inner content max-width in px, centered. @default 1240 */
  maxWidth?: number
  /**
   * Inline (horizontal) padding — a single logical value applied to both
   * inline-start and inline-end (every mockup instance is symmetric here).
   * @default '32px'
   */
  paddingInline?: string
  /** Block-start (top) padding of the inner container. @default '48px' */
  paddingBlockStart?: string
  /** Block-end (bottom) padding of the inner container. @default '48px' */
  paddingBlockEnd?: string
  /** 2px divider border on both block edges (top + bottom) of the outer wrapper. */
  borderBlock?: boolean
  /** 2px divider border on the block-start (top) edge only. */
  borderBlockStart?: boolean
  /** 2px divider border on the block-end (bottom) edge only. */
  borderBlockEnd?: boolean
  /** Classes on the full-bleed outer element (background/border live here). */
  className?: string
  /** Classes on the max-width inner container (layout/flex/grid live here). */
  innerClassName?: string
  id?: string
  children: ReactNode
}

/**
 * The shared page-section shell: a full-bleed outer box (background tint,
 * top/bottom divider borders) wrapping a max-width-1240px, auto-centered
 * inner container that owns the padding. Matches the
 * `<section style="background:…"><div style="max-width:1240px;margin:0
 * auto;padding:…">` shape repeated on every mockup page.
 *
 * Top/bottom borders use physical `border-t`/`border-b` utilities
 * deliberately — the block axis doesn't flip under RTL, only the inline
 * axis does, so these are RTL-safe without logical variants.
 *
 * Doesn't include the scroll-reveal effect itself — compose with `Reveal`
 * when a section should animate in: `<Reveal as="section"><Section
 * as="div">…</Section></Reveal>` (Reveal owns the outer tag so the
 * IntersectionObserver/motion wrapper and this component's background
 * don't fight over the same element).
 */
export function Section({
  as = 'section',
  tint = 'none',
  maxWidth = 1240,
  paddingInline = '32px',
  paddingBlockStart = '48px',
  paddingBlockEnd = '48px',
  borderBlock = false,
  borderBlockStart = false,
  borderBlockEnd = false,
  className,
  innerClassName,
  id,
  children,
}: SectionProps) {
  const Tag = as

  return (
    <Tag
      id={id}
      className={cn(
        TINT_CLASS[tint],
        (borderBlock || borderBlockStart) && 'border-t-2 border-divider',
        (borderBlock || borderBlockEnd) && 'border-b-2 border-divider',
        className,
      )}
    >
      <div
        className={cn('mx-auto', innerClassName)}
        style={{
          maxWidth,
          paddingInline,
          paddingBlockStart: fluidBlockPadding(paddingBlockStart),
          paddingBlockEnd: fluidBlockPadding(paddingBlockEnd),
        }}
      >
        {children}
      </div>
    </Tag>
  )
}
