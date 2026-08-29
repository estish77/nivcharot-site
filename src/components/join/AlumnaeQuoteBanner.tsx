'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

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
  { bg: 'var(--niv-slate)', text: '#fff', cite: '#fff' },
  { bg: 'var(--color-accent)', text: '#fff', cite: '#fff' },
  { bg: 'var(--niv-cream)', text: 'var(--niv-slate)', cite: 'var(--niv-slate)' },
]

/** Large decorative double-quote mark — hand-drawn to match this codebase's own icon vocabulary (see SocialLinks.tsx's socialIconPaths comment), not an icon-package import. */
function QuoteMark({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 48 36"
      width="52"
      height="39"
      aria-hidden="true"
      className="flex-none"
      style={{ color, transition: `color 500ms ease` }}
    >
      <path
        fill="currentColor"
        d="M0 20.5C0 9.18 8.95 0 20 0v7.2c-6.63 0-10.9 4.6-10.9 9.9v1.1h8.2c4.03 0 7.3 3.32 7.3 7.4v6.2c0 4.09-3.27 7.4-7.3 7.4H7.3c-4.03 0-7.3-3.31-7.3-7.4V20.5Z"
      />
      <path
        fill="currentColor"
        d="M24 20.5C24 9.18 32.95 0 44 0v7.2c-6.63 0-10.9 4.6-10.9 9.9v1.1h8.2c4.03 0 7.3 3.32 7.3 7.4v6.2c0 4.09-3.27 7.4-7.3 7.4H31.3c-4.03 0-7.3-3.31-7.3-7.4V20.5Z"
      />
    </svg>
  )
}

/**
 * Rotating alumnae-quote banner — replaces the Hebrew Join page's old
 * single static pull-quote (English keeps that one; these are real,
 * Hebrew-only testimonials, see `joinAlumnaeQuotes`).
 *
 * Layout (2026-08-29 follow-up brief): a fixed side column — the large
 * quote-mark glyph plus a "במילותיהן" label, stretched to the quote
 * column's own height — beside the quote itself, rather than stacked
 * above it; that side-by-side arrangement plus tighter outer padding is
 * most of how the banner got shorter despite the quote's own line-height
 * opening up.
 *
 * Two stacks in the quote column, one job each:
 * - A `visibility: hidden` ghost holding all seven quotes stacked in the
 *   same grid cell (`grid-area: 1 / 1`) sets the column's height to the
 *   tallest quote's natural height (165 characters, the longest) — no
 *   measured or hardcoded pixel min-height, and no layout jump switching
 *   between a one-line and a four-line quote.
 * - The real, visible quote sits absolutely positioned over that ghost,
 *   clipped by an `overflow-hidden` wrapper, and is swapped via
 *   `AnimatePresence`: a side wipe (translateX only, no opacity fade) —
 *   the outgoing quote slides fully out one side while the incoming one
 *   slides in from the other, which the clipping is what makes read as a
 *   clean wipe rather than the two texts crossing through each other.
 *
 * The seven dots below the quote are real pagination, not decoration —
 * each jumps straight to that testimonial (which also re-arms the
 * auto-rotate timer, since it's keyed off `activeIndex`). The decorative
 * `EqualizerDots` corner motif from the first pass is gone — the brief
 * asked for it removed, pagination dots are the only dots now.
 */
export function AlumnaeQuoteBanner() {
  const quotes = joinAlumnaeQuotes
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const shouldReduceMotion = useReducedMotion()

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
      <div className="mx-auto max-w-[1080px] px-8 py-10 max-[860px]:px-[18px] max-[860px]:py-7">
        <div className="flex items-stretch gap-10 max-[720px]:flex-col max-[720px]:gap-5">
          <div className="flex flex-none flex-col items-start gap-3 max-[720px]:flex-row max-[720px]:items-center">
            <QuoteMark color={variant.text} />
            <p
              className="m-0 font-heading text-[11px] font-extrabold tracking-[0.14em]"
              style={{ color: variant.text, opacity: 0.75, transition: `color 500ms ease` }}
            >
              במילותיהן
            </p>
          </div>

          <div className="relative flex-1 overflow-hidden">
            {/* Sizing ghost — see comment above. Never announced or focusable. */}
            <div aria-hidden="true" className="invisible grid">
              {quotes.map((quote) => (
                <div key={quote.name + quote.cohort} style={{ gridArea: '1 / 1' }}>
                  <blockquote className="m-0 max-w-[26ch] text-[clamp(20px,2.6vw,28px)] font-extrabold leading-[1.45]">
                    {quote.text}
                  </blockquote>
                  <cite className="mt-4 block text-[14px] font-bold not-italic">
                    {quote.name} · {quote.cohort}
                  </cite>
                </div>
              ))}
            </div>

            {/* Live, visible, wipe-animated quote — overlaid on the ghost above. */}
            <div className="absolute inset-0" aria-live="polite" aria-atomic="true">
              <AnimatePresence initial={false}>
                <motion.div
                  key={activeIndex}
                  className="absolute inset-0"
                  initial={shouldReduceMotion ? false : { x: '100%' }}
                  animate={{ x: 0 }}
                  exit={shouldReduceMotion ? undefined : { x: '-100%' }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: EASE }}
                >
                  <blockquote
                    className="m-0 max-w-[26ch] text-[clamp(20px,2.6vw,28px)] font-extrabold leading-[1.45]"
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
        </div>

        <div className="mt-6 flex justify-end gap-1 max-[720px]:justify-start" role="group" aria-label="עדויות בוגרות">
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
