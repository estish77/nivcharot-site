'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'
import type { ReactNode } from 'react'

import { dict, type Locale } from '@/lib/i18n'
import { cn } from './cn'

export type CarouselProps = {
  locale: Locale
  /** Accessible name for the scrolling track (`role="group"`). */
  ariaLabel: string
  /** One element per slide. */
  children: ReactNode[]
  /** CSS `flex-basis` for each slide. @default 'calc(33.333% - 16px)' (the mockups' 3-up quote carousel) */
  itemBasis?: string
  /** Gap between slides. @default '24px' */
  gap?: string
  /**
   * When set, auto-advances every `autoScrollMs` (matches the mockups'
   * quote carousels), pausing while the pointer is over the track and
   * looping back to the start at the end. Disabled entirely under
   * `prefers-reduced-motion`. Omit for a purely user-driven carousel.
   */
  autoScrollMs?: number
  className?: string
  itemClassName?: string
}

/**
 * Scroll-snap-x carousel with RTL-aware arrow controls. Advancing "next"
 * scrolls the track by `-step` in RTL and `+step` in LTR — the same rule
 * the mockups' own auto-scroll script uses (`el.scrollBy({ left: rtl ?
 * -step : step }`), needed because RTL scroll-origin conventions vary by
 * browser engine only in sign, not in which edge is "start".
 */
export function Carousel({
  locale,
  ariaLabel,
  children,
  itemBasis = 'calc(33.333% - 16px)',
  gap = '24px',
  autoScrollMs,
  className,
  itemClassName,
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const isRtl = locale === 'he'

  const stepWidth = useCallback(() => {
    const track = trackRef.current
    if (!track) return 0
    const first = track.firstElementChild as HTMLElement | null
    return first ? first.getBoundingClientRect().width + parseFloat(gap) : track.clientWidth
  }, [gap])

  const scrollByDir = useCallback(
    (dir: 1 | -1) => {
      const track = trackRef.current
      if (!track) return
      const delta = stepWidth() * dir
      track.scrollBy({ left: isRtl ? -delta : delta, behavior: shouldReduceMotion ? 'auto' : 'smooth' })
    },
    [isRtl, shouldReduceMotion, stepWidth],
  )

  useEffect(() => {
    if (!autoScrollMs || shouldReduceMotion) return
    const id = setInterval(() => {
      const track = trackRef.current
      if (!track || track.matches(':hover')) return
      const max = track.scrollWidth - track.clientWidth - 4
      const at = Math.abs(track.scrollLeft)
      if (at >= max) track.scrollTo({ left: 0, behavior: 'smooth' })
      else scrollByDir(1)
    }, autoScrollMs)
    return () => clearInterval(id)
  }, [autoScrollMs, shouldReduceMotion, scrollByDir])

  return (
    <div className={cn('relative', className)}>
      <div
        ref={trackRef}
        role="group"
        aria-label={ariaLabel}
        // A horizontally scrolling region must be reachable by keyboard, or
        // keyboard-only users can never reach content past the first slide.
        // tabIndex=0 makes the track focusable so arrow keys scroll it.
        tabIndex={0}
        className="flex overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-scrollbar]:hidden"
        style={{ gap, scrollSnapType: 'x mandatory' }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className={cn('flex-none', itemClassName)}
            style={{ flexBasis: itemBasis, scrollSnapAlign: 'start' }}
          >
            {child}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByDir(-1)}
          aria-label={dict.previous[locale]}
          className="flex h-9 w-9 items-center justify-center border-2 border-text text-text transition-colors duration-[250ms] ease-out hover:border-niv-slate hover:bg-niv-slate hover:text-white focus-visible:border-niv-slate focus-visible:bg-niv-slate focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <ChevronIcon flip />
        </button>
        <button
          type="button"
          onClick={() => scrollByDir(1)}
          aria-label={dict.next[locale]}
          className="flex h-9 w-9 items-center justify-center border-2 border-text text-text transition-colors duration-[250ms] ease-out hover:border-niv-slate hover:bg-niv-slate hover:text-white focus-visible:border-niv-slate focus-visible:bg-niv-slate focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <ChevronIcon />
        </button>
      </div>
    </div>
  )
}

/**
 * A single ">" chevron, mirrored per the RTL-rules exception for arrow
 * glyphs: the "next" (end-pointing) chevron flips under `rtl:`; the "prev"
 * (start-pointing, `flip`) chevron starts mirrored and flips back under `rtl:`.
 */
function ChevronIcon({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      className={flip ? '-scale-x-100 rtl:scale-x-100' : 'rtl:-scale-x-100'}
    >
      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
