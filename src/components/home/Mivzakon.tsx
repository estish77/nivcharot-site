'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/components/ui'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { t, type Locale } from '@/lib/i18n'
import type { MivzakonItem } from '@/content/mivzakon'

const text = {
  label: { he: 'מבזקון', en: 'MIVZAKON' },
  sub: { he: 'הנצפים ביותר בחרדית מדוברת', en: 'MOST WATCHED ON HAREDIT MEDUBERET' },
  more: { he: 'עוד', en: 'More' },
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

  const arrowClass =
    'absolute top-1/2 z-20 flex h-[30px] w-[30px] -translate-y-1/2 items-center justify-center rounded-full border border-divider bg-white text-niv-slate transition-colors duration-200 ease-out hover:border-accent hover:bg-accent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

  return (
    <div
      className={cn('relative mb-9 mt-4 border-y-2 border-divider bg-tint-cream', className)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <span aria-hidden="true" className="absolute -top-[14px] z-20 text-accent start-[18px]">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" className="block">
          <path d="M12 22a2.4 2.4 0 0 0 2.4-2.4H9.6A2.4 2.4 0 0 0 12 22Zm7.2-5.6v-5.2c0-3.3-1.8-6-4.8-6.7v-.7a2.4 2.4 0 0 0-4.8 0v.7c-3 .7-4.8 3.4-4.8 6.7v5.2L3 18v1h18v-1l-1.8-1.6Z" />
        </svg>
      </span>

      {/* In RTL `start` is the right edge, so it takes the right-pointing chevron. */}
      <button type="button" aria-label={t(locale, text.prev)} onClick={() => step(-1)} className={cn(arrowClass, 'start-2')}>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="block rtl:hidden">
          <path d="m15 5-7 7 7 7" />
        </svg>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="hidden rtl:block">
          <path d="m9 5 7 7-7 7" />
        </svg>
      </button>
      <button type="button" aria-label={t(locale, text.next)} onClick={() => step(1)} className={cn(arrowClass, 'end-2')}>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="block rtl:hidden">
          <path d="m9 5 7 7-7 7" />
        </svg>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="hidden rtl:block">
          <path d="m15 5-7 7 7 7" />
        </svg>
      </button>

      <div className="overflow-hidden px-11 max-[860px]:px-[50px]">
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
                className="flex w-[306px] flex-none items-center border-s border-divider px-5 py-3.5 text-text no-underline transition-colors duration-200 ease-out hover:bg-white focus-visible:bg-white focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent max-[860px]:w-[252px] max-[860px]:px-4"
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

      <a
        href={`/${locale}/podcast#episodes`}
        className="absolute -bottom-[23px] z-20 inline-flex items-center rounded-full bg-accent px-3.5 py-1 font-heading text-[12px] font-extrabold text-white no-underline transition-colors duration-200 ease-out hover:bg-accent-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-niv-slate end-[26px]"
      >
        {t(locale, text.more)}
      </a>
    </div>
  )
}
