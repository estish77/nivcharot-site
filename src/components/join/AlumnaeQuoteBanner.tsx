'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { EqualizerDots } from '@/components/team/EqualizerDots'
import { joinAlumnaeQuotes } from '@/content/join'
import { useReducedMotion } from '@/lib/useReducedMotion'

/** 2026-08-29 brief: "קצת יותר מהר" — was 7000ms. */
const ROTATE_MS = 4500
const EASE = [0.22, 0.61, 0.36, 1] as const

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
 * Two stacks, one job each (2026-08-29 brief: faster rotation, a more
 * interesting transition, and manual paging):
 *
 * - A `visibility: hidden` ghost holding all seven quotes stacked in the
 *   same grid cell (`grid-area: 1 / 1`) sets the container's height to the
 *   tallest quote's natural height (165 characters, the longest) — no
 *   measured or hardcoded pixel min-height, and no layout jump switching
 *   between a one-line and a four-line quote.
 * - The real, visible quote sits absolutely positioned over that ghost and
 *   is swapped via `AnimatePresence` — the outgoing quote slides up and
 *   fades out while the incoming one slides up into place from below,
 *   overlapping rather than sequential, which is what makes it read as one
 *   continuous motion instead of a flat crossfade.
 *
 * The seven dots below the quote are real pagination, not decoration —
 * each jumps straight to that testimonial (which also re-arms the
 * auto-rotate timer, since it's keyed off `activeIndex`) — separate from
 * `EqualizerDots` in the corner, which stays purely decorative.
 */
export function AlumnaeQuoteBanner() {
  const quotes = joinAlumnaeQuotes
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const liveRegionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldReduceMotion || paused) return
    const id = setTimeout(() => {
      setActiveIndex((activeIndex + 1) % quotes.length)
    }, ROTATE_MS)
    return () => clearTimeout(id)
  }, [activeIndex, shouldReduceMotion, paused, quotes.length])

  const variant = VARIANTS[activeIndex % VARIANTS.length]
  const active = quotes[activeIndex]

  return (
    <section
      className="relative"
      style={{ background: variant.bg, transition: `background-color 500ms ease` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative mx-auto max-w-[1080px] px-8 py-[72px] max-[860px]:px-[18px] max-[860px]:py-9">
        <div className="absolute top-8 end-8 leading-none max-[860px]:end-[18px]">
          <EqualizerDots tone={variant.dots} />
        </div>

        <div className="relative">
          {/* Sizing ghost — see comment above. Never announced or focusable. */}
          <div aria-hidden="true" className="invisible grid">
            {quotes.map((quote) => (
              <div key={quote.name + quote.cohort} style={{ gridArea: '1 / 1' }}>
                <blockquote className="m-0 max-w-[26ch] text-[clamp(21px,2.8vw,30px)] font-extrabold leading-[1.3]">
                  {quote.text}
                </blockquote>
                <cite className="mt-4 block text-[14px] font-bold not-italic">
                  {quote.name} · {quote.cohort}
                </cite>
              </div>
            ))}
          </div>

          {/* Live, visible, animated quote — overlaid on the ghost above. */}
          <div ref={liveRegionRef} className="absolute inset-0" aria-live="polite" aria-atomic="true">
            <AnimatePresence initial={false}>
              <motion.div
                key={activeIndex}
                className="absolute inset-0"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -22 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: EASE }}
              >
                <blockquote
                  className="m-0 max-w-[26ch] text-[clamp(21px,2.8vw,30px)] font-extrabold leading-[1.3]"
                  style={{ color: variant.text }}
                >
                  {active.text}
                </blockquote>
                <cite className="mt-4 block text-[14px] font-bold not-italic" style={{ color: variant.cite }}>
                  {active.name} · {active.cohort}
                </cite>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 flex gap-1" role="group" aria-label="עדויות בוגרות">
          {quotes.map((quote, i) => (
            <button
              key={quote.name + quote.cohort}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`עדות ${i + 1} מתוך ${quotes.length}, ${quote.name}`}
              aria-current={i === activeIndex}
              // p-[7px]/-m-[7px]: an 8px visual dot with a ~22px tap target,
              // without the padding eating into the dot itself under
              // border-box sizing (see LanguageToggle for the same trick).
              className="flex-none cursor-pointer rounded-full p-[7px] -m-[7px] transition-transform duration-200 ease-out hover:scale-125 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: variant.text }}
            >
              <span
                className="block h-2 w-2 rounded-full transition-opacity duration-200"
                style={{ backgroundColor: variant.text, opacity: i === activeIndex ? 1 : 0.4 }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
