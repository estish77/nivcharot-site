'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/components/ui'
import { alumnaYear, interleavedTestimonials, type AlumnaTestimonial } from '@/content/alumnae'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { t, type Locale } from '@/lib/i18n'

const text = {
  cohort: { he: 'מחזור', en: 'Cohort' },
}

/** Pixels per millisecond. Slow enough to read a full testimonial as it passes. */
const DRIFT = 0.018

/**
 * Column count per width. Narrower screens don't HIDE columns — they get
 * fewer, with the same twenty testimonials dealt across them. Hiding was
 * the first attempt and it silently dropped thirteen of the twenty on a
 * phone, which is the sort of bug that never shows up on a desktop.
 */
function columnsFor(width: number): number {
  if (width < 620) return 1
  if (width < 900) return 2
  return 3
}
const DEFAULT_COLUMNS = 3

/**
 * The graduates' feedback, as a wall of quietly drifting cards.
 *
 * Three columns, each scrolling on its own and the middle one against the
 * other two, so the block is always in motion without anything racing
 * (2026-08-29 brief: "somewhere nicely designed for the feedback, name and
 * cohort beside each one, mixed together, moving elegantly").
 *
 * Vertical rather than horizontal: these are real paragraphs, some of them
 * long, and a card sliding sideways is unreadable. Moving up, a card holds
 * its full width and stays legible the whole way. It pauses on hover and on
 * focus — otherwise a keyboard user tabbing through would be chasing a card
 * up the screen — and under `prefers-reduced-motion` it renders as a plain
 * static grid instead, with nothing clipped.
 *
 * The cohorts are interleaved rather than grouped, and deterministically so
 * (see `interleavedTestimonials`): a random shuffle would produce different
 * markup on the server and the client and break hydration.
 */
/**
 * How the drifting columns meet the wall's top/bottom edge (2026-08-31
 * follow-up: "אני רוצה תזוזה אוטומטית... אהבתי את מה שקיים, אבל השקיפות
 * שקורית בתזוזה לא קשורה לשפה הויזואלית של האתר" — the continuous drift
 * itself stays; only the soft gradient dissolve at the edges is up for
 * comparison, since the rest of the site favors crisp borders and hard
 * directional motion over opacity fades, e.g. `AlumnaeQuoteBanner` was
 * explicitly asked to use a side-wipe "not a fade" for its own rotation).
 *   - `fade`: today's exact treatment, a 64px soft gradient dissolve.
 *   - `hardCut`: no gradient at all — cards are simply clipped by the
 *     container's own edge, appearing/disappearing abruptly.
 *   - `accentLine`: a solid 2px accent-red border at the top/bottom instead
 *     of a gradient — same "framed by a hard line" language as every
 *     bordered `Cell`/card on the site, no dissolve at all.
 *   - `sharpFade`: still a gradient, but 8px instead of 64px — reads as a
 *     plain anti-aliased edge rather than a visible "dissolve" effect.
 */
export type AlumnaeWallEdgeTreatment = 'fade' | 'hardCut' | 'accentLine' | 'sharpFade'

export function AlumnaeWall({
  locale,
  className,
  edgeTreatment = 'fade',
}: {
  locale: Locale
  className?: string
  edgeTreatment?: AlumnaeWallEdgeTreatment
}) {
  const shouldReduceMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)

  /*
   * Starts at the desktop count so the first client render matches the
   * server's, then settles to the real one after mount — measuring during
   * render would mean different markup on each side and a hydration error.
   */
  const [columnCount, setColumnCount] = useState(DEFAULT_COLUMNS)
  useEffect(() => {
    const measure = () => setColumnCount(columnsFor(window.innerWidth))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const columns = useMemo(() => {
    const ordered = interleavedTestimonials()
    const out: AlumnaTestimonial[][] = Array.from({ length: columnCount }, () => [])
    ordered.forEach((item, i) => out[i % columnCount].push(item))
    return out
  }, [columnCount])

  if (shouldReduceMotion) {
    return (
      <div className={cn('grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1', className)}>
        {columns.flat().map((item) => (
          <Card key={item.id} item={item} locale={locale} />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn('relative', className)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {edgeTreatment === 'fade' || edgeTreatment === 'sharpFade' ? (
        // Soft fade so cards enter and leave the wall instead of being
        // sliced off by a hard edge. `bg` is the page ground, so the
        // gradient dissolves into whatever sits behind the section.
        // `sharpFade` is the exact same technique, just an 8px band instead
        // of 64px — a barely-there edge softener rather than a visible fade.
        <>
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-bg to-transparent',
              edgeTreatment === 'fade' ? 'h-16' : 'h-2',
            )}
          />
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-bg to-transparent',
              edgeTreatment === 'fade' ? 'h-16' : 'h-2',
            )}
          />
        </>
      ) : null}
      {edgeTreatment === 'accentLine' ? (
        // No dissolve at all — a solid 2px line, the same "framed by a hard
        // border" language every bordered Cell/card on the site already uses.
        <>
          <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-[2px] bg-accent" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 z-10 h-[2px] bg-accent" />
        </>
      ) : null}

      <div
        className="grid h-[560px] gap-5 overflow-hidden max-[900px]:h-[520px]"
        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
      >
        {columns.map((items, i) => (
          <DriftColumn
            key={i}
            items={items}
            locale={locale}
            paused={paused}
            // Every other column runs against its neighbours.
            direction={i % 2 === 1 ? 1 : -1}
          />
        ))}
      </div>
    </div>
  )
}

function DriftColumn({
  items,
  locale,
  paused,
  direction,
  className,
}: {
  items: AlumnaTestimonial[]
  locale: Locale
  paused: boolean
  direction: 1 | -1
  className?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const halfRef = useRef(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      halfRef.current = track.scrollHeight / 2
      // Start the downward columns one copy up, so they have somewhere to
      // come from rather than snapping on the first frame.
      if (direction === 1 && offsetRef.current === 0) offsetRef.current = -halfRef.current
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)

    let frame = 0
    let last = 0
    const tick = (now: number) => {
      if (!last) last = now
      const delta = now - last
      last = now
      const half = halfRef.current
      if (!pausedRef.current && half > 0) {
        let next = offsetRef.current + direction * delta * DRIFT
        if (next <= -half) next += half
        if (next >= 0) next -= half
        offsetRef.current = next
        track.style.transform = `translateY(${next}px)`
      }
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [direction])

  return (
    <div className={cn('overflow-hidden', className)}>
      {/* Two copies, so the column can reset by exactly one copy's height with no seam. */}
      <div ref={trackRef} className="flex flex-col gap-5 will-change-transform">
        {[0, 1].map((copy) =>
          items.map((item) => (
            <Card key={`${copy}-${item.id}`} item={item} locale={locale} aria-hidden={copy === 1 || undefined} />
          )),
        )}
      </div>
    </div>
  )
}

function Card({
  item,
  locale,
  ...rest
}: {
  item: AlumnaTestimonial
  locale: Locale
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <figure className="m-0 border-2 border-divider bg-bg px-5 py-[18px]" {...rest}>
      <span aria-hidden="true" className="mb-2 block font-heading text-[30px] font-extrabold leading-none text-accent/35">
        &ldquo;
      </span>
      <blockquote className="m-0 text-[14.5px] leading-[1.7] text-neutral-800">{t(locale, item.quote)}</blockquote>
      <figcaption className="mt-3.5 border-t border-divider pt-2.5 font-heading text-[12px] font-extrabold text-neutral-700">
        <span className="text-accent-700">{t(locale, item.name)}</span>
        <span className="mx-1.5 text-divider">·</span>
        {t(locale, text.cohort)} {item.cohort}, {alumnaYear(item.cohort)}
      </figcaption>
    </figure>
  )
}
