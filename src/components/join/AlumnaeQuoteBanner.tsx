'use client'

import { useEffect, useRef, useState } from 'react'

import { EqualizerDots } from '@/components/team/EqualizerDots'
import { joinAlumnaeQuotes } from '@/content/join'
import { useReducedMotion } from '@/lib/useReducedMotion'

const ROTATE_MS = 7000
const FADE_MS = 500

/**
 * Three background/text treatments the banner cycles through — index into
 * this by `activeIndex % 3`, independent of which quote is showing, so the
 * seven quotes land on blue/red/cream/blue/red/cream/blue in a fixed,
 * predictable order (2026-08-29 brief: "רקע מתחלף במחזור של שלושה").
 *
 * "כחול הלוגו" is `--niv-slate` (#314451) — the logo has no literal blue,
 * but this dark slate is the color used for its line-work, and the only
 * other candidate ("אדום הלוגו") is unambiguously `--color-accent`.
 * Citation color is plain `#fff` on both dark variants (not a translucent
 * white) — a translucent citation measured at only 4.99:1 against the red,
 * per the brief.
 */
const VARIANTS = [
  { bg: 'var(--niv-slate)', text: '#fff', cite: '#fff', dots: 'dark' as const },
  { bg: 'var(--color-accent)', text: '#fff', cite: '#fff', dots: 'accent' as const },
  { bg: 'var(--niv-cream)', text: 'var(--niv-slate)', cite: 'var(--niv-slate)', dots: 'light' as const },
]

/**
 * Rotating alumnae-quote banner — replaces the Hebrew Join page's old
 * single static pull-quote (English keeps that one; these are real,
 * Hebrew-only testimonials, see `joinAlumnaeQuotes`).
 *
 * Sizing: every quote is stacked in the same grid cell (`grid-area: 1 / 1`)
 * so the container's height is always the tallest quote's natural height —
 * no measured or hardcoded pixel min-height, and no layout jump as shorter
 * quotes cycle in. The outgoing quote stays `visibility: visible` for the
 * `FADE_MS` crossfade and only then flips to `visibility: hidden`, so a
 * screen reader's accessibility tree — and therefore the `aria-live`
 * announcement — updates once the swap is visually complete, not mid-fade.
 *
 * Rotation is a `setTimeout` re-armed by its own effect on every
 * `activeIndex` change (not a `setInterval` read via an update callback) —
 * scheduling the next step is itself a side effect that belongs in the
 * effect body, not folded into `setActiveIndex`'s updater function (React
 * updaters must stay pure; a second `setState` call inside one runs more
 * than once under the dev double-invoke and silently breaks the sequence).
 */
export function AlumnaeQuoteBanner() {
  const quotes = joinAlumnaeQuotes
  const [activeIndex, setActiveIndex] = useState(0)
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (shouldReduceMotion || paused) return
    const id = setTimeout(() => {
      setOutgoingIndex(activeIndex)
      setActiveIndex((activeIndex + 1) % quotes.length)
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
      fadeTimeout.current = setTimeout(() => setOutgoingIndex(null), FADE_MS)
    }, ROTATE_MS)
    return () => clearTimeout(id)
  }, [activeIndex, shouldReduceMotion, paused, quotes.length])

  useEffect(() => () => {
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
  }, [])

  const variant = VARIANTS[activeIndex % VARIANTS.length]

  return (
    <section
      className="relative"
      style={{ background: variant.bg, transition: `background-color ${FADE_MS}ms ease` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative mx-auto max-w-[1080px] px-8 py-[72px] max-[860px]:px-[18px] max-[860px]:py-9">
        <div className="absolute top-8 end-8 leading-none max-[860px]:end-[18px]">
          <EqualizerDots tone={variant.dots} />
        </div>

        <div className="relative grid" aria-live="polite" aria-atomic="true">
          {quotes.map((quote, i) => {
            const isActive = i === activeIndex
            const isVisible = isActive || i === outgoingIndex
            return (
              <div
                key={quote.name + quote.cohort}
                style={{
                  gridArea: '1 / 1',
                  opacity: isActive ? 1 : 0,
                  visibility: isVisible ? 'visible' : 'hidden',
                  transition: `opacity ${FADE_MS}ms ease`,
                }}
              >
                <blockquote
                  className="m-0 max-w-[26ch] text-[clamp(21px,2.8vw,30px)] font-extrabold leading-[1.3]"
                  style={{ color: variant.text, transition: `color ${FADE_MS}ms ease` }}
                >
                  {quote.text}
                </blockquote>
                <cite
                  className="mt-4 block text-[14px] font-bold not-italic"
                  style={{ color: variant.cite, transition: `color ${FADE_MS}ms ease` }}
                >
                  {quote.name} · {quote.cohort}
                </cite>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
