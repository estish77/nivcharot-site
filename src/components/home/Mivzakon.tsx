'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { cn, PodcastIcon } from '@/components/ui'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { t, type Locale } from '@/lib/i18n'
import type { MivzakonItem } from '@/content/mivzakon'

const text = {
  label: { he: 'מבזקון', en: 'MIVZAKON' },
  sub: { he: 'הנצפים ביותר בחרדית מדוברת', en: 'MOST WATCHED ON HAREDIT MEDUBERET' },
  headline: { he: 'מה קורה בחרדית מדוברת', en: "What's happening on Haredit Meduberet" },
  prev: { he: 'המבזק הקודם', en: 'Previous flash' },
  next: { he: 'המבזק הבא', en: 'Next flash' },
  region: { he: 'מבזקון, מתוך השורטס של הערוץ', en: 'Mivzakon, from the channel shorts' },
}

/**
 * 2026-09-06 brief: the strip read as unrelated content with no visible
 * source ("לא ברור מאיפה התוכן") — `text.label`/`text.sub` above were
 * always defined but never actually rendered anywhere in the bar, so the
 * only place that named the podcast was an aria-label screen readers alone
 * could hear. `variant` compares ways to put that context back where a
 * sighted visitor can see it, laid out in `/mivzakon-lab`. `'none'` is
 * today's exact shipped markup (still the default so the real Home page is
 * unaffected until one variant is picked and wired in directly).
 *
 * Follow-up round: "אהבתי את האייקון, עדיין חסר לי המקור... כותרת שתגיד
 * מה קורה בחרדית מדוברת שתהיה קשורה עיצובית למבזקון" — a real headline
 * (not a small caption line) that's visually ATTACHED to the ticker as one
 * frame, not just floating text sitting above a separate box. The three
 * `header*` variants share one outer border with the scrolling track (no
 * gap between title row and cards); `cornerTab` instead overlaps the box's
 * own top edge like a folder tab, so it reads as labeling the box beneath
 * it without taking a full row.
 */
export type MivzakonVariant =
  | 'none'
  | 'leadingCell'
  | 'caption'
  | 'inlineBadge'
  | 'headerBar'
  | 'headerBarSlate'
  | 'cornerTab'
  | 'cornerTabFused'
  | 'cornerTabFolder'
  | 'cornerTabBrowser'

/** Pixels per millisecond. Slow enough to read a headline as it passes. */
const DRIFT = 0.042
const STEP_MS = 400

export type MivzakonProps = { locale: Locale; items: MivzakonItem[]; className?: string; variant?: MivzakonVariant }

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
 * off the top and bottom edges, which left page background showing around
 * them; both are gone, as is the red "more" block that replaced the pill
 * (2026-08-28). The headlines are the only content, and each links to its
 * own Short.
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
export function Mivzakon({ locale, items, className, variant = 'none' }: MivzakonProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Refs, not state: these change every animation frame and must never
  // trigger a React render.
  const offsetRef = useRef(0)
  const halfRef = useRef(0)
  const pausedRef = useRef(false)
  const steppingRef = useRef(false)
  const [paused, setPaused] = useState(false)

  /*
   * Which way the track has to slide depends on the writing direction, and
   * getting it wrong doesn't just mirror the motion — it breaks the loop.
   *
   * The track holds two copies. Under RTL the first sits on the RIGHT, so
   * sliding right pulls the second copy in from the left. Under LTR the
   * first copy sits on the LEFT, so sliding right drags the whole track off
   * into empty space and the strip runs out of content partway through.
   * That is why the English home page stalled while the Hebrew one looped.
   *
   * The offset itself stays positive in [0, half) either way; only the sign
   * it is applied with flips.
   */
  const sign = locale === 'he' ? 1 : -1

  const apply = useCallback(() => {
    const track = trackRef.current
    if (track) track.style.transform = `translateX(${sign * offsetRef.current}px)`
  }, [sign])

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
    <>
      {variant === 'caption' ? (
        <div className="flex items-center gap-2 bg-tint-cream px-8 pt-3 max-[640px]:px-4">
          <PodcastIcon className="h-[16px] w-[16px] text-accent-700" />
          <span className="font-heading text-[12px] font-extrabold tracking-wide text-niv-slate">
            {t(locale, text.label)} <span className="text-neutral-600">· {t(locale, text.sub)}</span>
          </span>
        </div>
      ) : null}
      {variant === 'cornerTabFused' ? (
        /*
         * 2026-09-07: the bar itself carries no border at all anymore
         * ("תוריד לגמרי את הקו שעל הבאנר, שיהיה בלי קו" — remove the line on
         * the banner entirely). The tab still has none of its own either,
         * just the bar's own background and rounded top corners, so it
         * reads as a plain bump of the same material rising out of the bar.
         */
        <div className="flex justify-start ps-5">
          <div className="z-30 -mb-[2px] flex items-center gap-1.5 rounded-t-md bg-tint-cream-deep px-3 py-1.5">
            <PodcastIcon className="h-[13px] w-[13px] text-accent-700" />
            <span className="font-heading text-[11.5px] font-extrabold leading-none text-niv-slate">{t(locale, text.headline)}</span>
          </div>
        </div>
      ) : null}
      <div
        className={cn('relative bg-tint-cream-deep', className)}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {variant === 'headerBar' || variant === 'headerBarSlate' ? (
          <div
            className={cn(
              'flex items-center gap-2 border-b-2 px-5 py-2.5 max-[640px]:px-4',
              variant === 'headerBarSlate' ? 'border-niv-slate bg-niv-slate text-niv-cream' : 'border-divider bg-tint-cream text-niv-slate',
            )}
          >
            <PodcastIcon className="h-[18px] w-[18px]" />
            <span className="font-heading text-[15px] font-extrabold leading-none">{t(locale, text.headline)}</span>
          </div>
        ) : null}

        {variant === 'cornerTab' ? (
          <div className="absolute -top-[23px] z-30 flex items-center gap-1.5 rounded-t-md border-2 border-b-0 border-divider bg-bg px-2.5 py-1 start-5">
            <PodcastIcon className="h-[13px] w-[13px] text-accent-700" />
            <span className="font-heading text-[11.5px] font-extrabold leading-none text-niv-slate">{t(locale, text.headline)}</span>
          </div>
        ) : null}

        {/*
         * 2026-09-06 second follow-up: "צריך לשפר את העיצוב שייראה ממש כמו
         * טאב, כרטיסיה" — the original cornerTab used the page's own
         * background (not the bar's), so it read as a separate floating
         * label rather than a tab growing out of the box beneath it.
         * `cornerTabFused` itself now renders as a normal-flow sibling
         * above this box (see just above the box's own opening tag) rather
         * than an absolutely-positioned child in here, so its border can't
         * land on a sub-pixel offset and leak past the seam; folder/browser
         * below keep the original absolute approach, since neither one
         * tries to fuse its bottom edge flush against the bar's border the
         * way the fused variant does.
         */}
        {variant === 'cornerTabFolder' ? (
          <div
            className="absolute -top-[24px] z-30 flex items-center gap-1.5 border-2 border-b-0 border-divider bg-tint-cream px-6 py-2 start-5"
            style={{ clipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 100%, 0 100%)' }}
          >
            <PodcastIcon className="h-[13px] w-[13px] text-accent-700" />
            <span className="font-heading text-[11.5px] font-extrabold leading-none text-niv-slate">{t(locale, text.headline)}</span>
          </div>
        ) : null}

        {variant === 'cornerTabBrowser' ? (
          <div className="absolute -top-[26px] z-30 flex items-center gap-1.5 rounded-t-2xl bg-niv-slate px-4 py-2 start-5 text-niv-cream">
            <PodcastIcon className="h-[13px] w-[13px]" />
            <span className="font-heading text-[11.5px] font-extrabold leading-none">{t(locale, text.headline)}</span>
          </div>
        ) : null}

        {variant === 'leadingCell' ? (
          <div className="absolute inset-y-0 z-20 flex w-[112px] flex-none flex-col items-start justify-center gap-0.5 border-e border-divider bg-tint-cream px-3.5 start-0 max-[640px]:w-[86px] max-[640px]:px-2.5">
            <PodcastIcon className="mb-0.5 h-[15px] w-[15px] text-accent-700" />
            <span className="font-heading text-[12px] font-extrabold leading-[1.2] text-niv-slate">{t(locale, text.label)}</span>
            <span className="text-[9.5px] font-semibold leading-[1.3] text-neutral-600">{t(locale, text.sub)}</span>
          </div>
        ) : null}

        {/*
         * The track runs the FULL width of the bar and is clipped by it, while
         * the arrow cell sits on top at the far end. That is what makes
         * headlines slide underneath it and vanish, rather than stopping short
         * at a padded edge. The cell is `inset-y-0`, so it meets the bar's top
         * and bottom rules exactly with no background showing between.
         */}
        <div
          className={cn(
            'relative overflow-hidden pe-[74px] max-[860px]:pe-[62px]',
            variant === 'leadingCell' && 'ps-[112px] max-[640px]:ps-[86px]',
          )}
        >
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
                    {variant === 'inlineBadge' ? (
                      <PodcastIcon className="me-1 inline-block h-[12px] w-[12px] align-middle text-accent-700" />
                    ) : null}
                    <span className="text-accent-700">{t(locale, item.speaker)}: </span>
                    {t(locale, item.headline)}
                  </span>
                </a>
              )),
            )}
          </div>
        </div>

        {/* Arrows get their own cell at the far end, opaque so headlines vanish behind it too. */}
        <div className="absolute inset-y-0 z-20 flex items-center gap-0.5 border-s border-divider bg-tint-cream-deep px-2 end-0 max-[860px]:px-1.5">
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
    </>
  )
}
