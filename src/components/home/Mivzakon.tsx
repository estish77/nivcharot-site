'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/components/ui'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { t, type Locale } from '@/lib/i18n'
import type { MivzakonItem } from '@/content/mivzakon'

const text = {
  label: { he: 'מבזקון', en: 'MIVZAKON' },
  sub: { he: 'הנצפים ביותר בחרדית מדוברת', en: 'MOST WATCHED ON HAREDIT MEDUBERET' },
  more: { he: 'עוד בחרדית מדוברת', en: 'More on Haredit Meduberet' },
  prev: { he: 'המבזק הקודם', en: 'Previous flash' },
  next: { he: 'המבזק הבא', en: 'Next flash' },
  region: { he: 'מבזקון, מתוך השורטס של הערוץ', en: 'Mivzakon, from the channel shorts' },
}

/** Pixels per millisecond. Slow enough to read a headline as it passes. */
const DRIFT = 0.042
const STEP_MS = 400

export type MivzakonProps = { locale: Locale; items: MivzakonItem[]; className?: string }

/**
 * The news-ticker strip under the home page hero (2026-08-28 brief, with a
 * screenshot of ynet's). Structure follows that reference — cards with a
 * rule between them, arrows at both edges, a bell, a "more" pill — but the
 * skin is the site's own rather than ynet's grey.
 *
 * Headlines only: no thumbnail and no view count (2026-08-28 follow-up).
 * A row of images reads as a gallery rather than a ticker, and the number
 * competed with the sentence for the same glance.
 *
 * Everything lives INSIDE the bar. A bell and a "more" pill used to hang
 * off the top and bottom edges, which left the page background showing
 * around them; the pill is now a full-height red block at the leading edge
 * that the headlines slide under and disappear behind, and the bell is
 * gone.
 *
 * Motion is a transform on a track holding TWO copies of the list: the
 * track slides one copy's width and resets to 0, at which point the second
 * copy sits exactly where the first was, so the loop has no seam. The
 * second copy is `aria-hidden`, so a screen reader reads the ten items
 * once. Under `prefers-reduced-motion` the drift never starts and the strip
 * is a static row the arrows still page through.
 *
 * The whole strip is presentational chrome above `<main>`, so pausing on
 * hover and on focus matters: without it a keyboard user tabbing into a
 * moving row would be chasing a link across the screen.
 *
 * Not sticky, deliberately — it scrolls with the page like any other band.
 */
export function Mivzakon({ locale, items, className }: MivzakonProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Refs, not state: these change every animation frame and must never
  // trigger a React render.
  const offsetRef = useRef(0)
  const halfRef = useRef(0)
  const pausedRef = useRef(false)
  const steppingRef = useRef(false)
  const [paused, setPaused] = useState(false)

  const apply = useCallback(() => {
    const track = trackRef.current
    if (track) track.style.transform = `translateX(${offsetRef.current}px)`
  }, [])

  const wrap = useCallback((value: number) => {
    const half = halfRef.current
    if (!half) return value
    let next = value
    while (next >= half) next -= half
    while (next < 0) next += half
    return next
  }, [])

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      halfRef.current = track.scrollWidth / 2
    }
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(track)

    if (shouldReduceMotion) return () => observer.disconnect()

    let frame = 0
    let last = 0
    const tick = (now: number) => {
      if (!last) last = now
      const delta = now - last
      last = now
      if (!pausedRef.current && !steppingRef.current && halfRef.current > 0) {
        offsetRef.current = wrap(offsetRef.current + delta * DRIFT)
        apply()
      }
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [apply, shouldReduceMotion, wrap])

  const step = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current
      if (!track) return
      const first = track.firstElementChild
      const cardWidth = first ? first.getBoundingClientRect().width : 300

      steppingRef.current = true
      track.style.transition = `transform ${STEP_MS - 20}ms cubic-bezier(0.22,0.61,0.36,1)`
      offsetRef.current += direction * cardWidth
      apply()

      window.setTimeout(() => {
        track.style.transition = ''
        offsetRef.current = wrap(offsetRef.current)
        apply()
        steppingRef.current = false
      }, STEP_MS)
    },
    [apply, wrap],
  )

  if (items.length === 0) return null

  /*
   * Minimal chevrons: a hairline stroke, no circle and no fill, sitting in
   * their own cell inside the bar (2026-08-28 follow-up). The round white
   * buttons they replace floated over the headlines and read as a control
   * bolted on top of the strip rather than part of it.
   */
  const arrowClass =
    'flex h-7 w-7 items-center justify-center text-neutral-600 transition-colors duration-200 ease-out hover:text-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

  return (
    <div
      className={cn('relative overflow-hidden border-y-2 border-divider bg-tint-cream', className)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/*
       * The track runs the FULL width of the bar and is clipped by it, while
       * the red block and the arrow cell sit on top at either end. That is
       * what makes headlines slide underneath them and vanish, rather than
       * stopping short at a padded edge.
       *
       * Both overlays are `inset-y-0`, so they meet the bar's top and bottom
       * rules exactly and no page background shows through between them and
       * the strip.
       */}
      <div className="ps-[140px] pe-[74px] max-[860px]:ps-[112px] max-[860px]:pe-[62px]">
        <div
          ref={trackRef}
          role="list"
          aria-label={t(locale, text.region)}
          className="flex w-max items-stretch will-change-transform"
        >
          {[0, 1].map((copy) =>
            items.map((item) => (
              <a
                key={`${copy}-${item.videoId}`}
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                role="listitem"
                {...(copy === 1 ? { 'aria-hidden': true, tabIndex: -1 } : {})}
                className="flex w-[306px] flex-none items-center border-s border-divider px-5 py-3.5 text-text no-underline transition-colors duration-200 ease-out hover:bg-white focus-visible:bg-white focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent max-[860px]:w-[236px] max-[860px]:px-4"
              >
                <span className="line-clamp-3 block font-heading text-[14.5px] font-extrabold leading-[1.35] text-niv-slate">
                  <span className="text-accent-700">{t(locale, item.speaker)}: </span>
                  {t(locale, item.headline)}
                </span>
              </a>
            )),
          )}
        </div>
      </div>

      {/* The red block the headlines disappear behind. Opaque and above the track. */}
      <a
        href={`/${locale}/podcast#episodes`}
        className="absolute inset-y-0 z-20 flex w-[140px] items-center justify-center bg-accent px-3 text-center font-heading text-[13px] font-extrabold leading-[1.25] text-white no-underline transition-colors duration-200 ease-out hover:bg-accent-600 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-white start-0 max-[860px]:w-[112px] max-[860px]:px-2 max-[860px]:text-[11.5px]"
      >
        {t(locale, text.more)}
      </a>

      {/* Arrows get their own cell at the far end, opaque so headlines vanish behind it too. */}
      <div className="absolute inset-y-0 z-20 flex items-center gap-0.5 border-s border-divider bg-tint-cream px-2 end-0 max-[860px]:px-1.5">
        <button type="button" aria-label={t(locale, text.prev)} onClick={() => step(-1)} className={arrowClass}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="block rtl:hidden">
            <path d="m15 5-7 7 7 7" />
          </svg>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="hidden rtl:block">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
        <button type="button" aria-label={t(locale, text.next)} onClick={() => step(1)} className={arrowClass}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="block rtl:hidden">
            <path d="m9 5 7 7-7 7" />
          </svg>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="hidden rtl:block">
            <path d="m15 5-7 7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
