'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'

import { cn } from '@/components/ui'

export type EqualizerDotsProps = {
  /**
   * `'light'` (default): dim dots are slate, lit dots are the accent red —
   * for the widget's usual placement on cream/white section backgrounds.
   * `'accent'`: dim dots are slate, lit dots are white — for placement on
   * the solid accent-red CTA band, where a red "lit" dot would disappear.
   */
  tone?: 'light' | 'accent'
  className?: string
}

const DOT_COUNT = 6
const LIT_COUNT = 3

function randomLitSet(): Set<number> {
  const idx = [0, 1, 2, 3, 4, 5]
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return new Set(idx.slice(0, LIT_COUNT))
}

/**
 * Purely decorative "equalizer" dot cluster — a faithful, simplified port
 * of the mockups' `__eqEl`/`__eqInit` random-relight widget that sits in
 * the top corner of a handful of sections (Schenirer bio on About; the CTA
 * band and archive strip on Story). Reshuffles which 3 of 6 dots are "lit"
 * every 2.5s, and on hover/focus. `aria-hidden` — it carries no content.
 *
 * Honours prefers-reduced-motion by freezing the interval and dropping the
 * hover scale-up (the color relight itself is a discrete, non-positional
 * change and is left on, same as the rest of the project's colour/border
 * transitions).
 */
export function EqualizerDots({ tone = 'light', className }: EqualizerDotsProps) {
  const [lit, setLit] = useState<Set<number>>(() => new Set([0, 2, 4]))
  const [hot, setHot] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (shouldReduceMotion) return
    timerRef.current = setInterval(() => setLit(randomLitSet()), 2500)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [shouldReduceMotion])

  const dimClass = 'bg-niv-slate'
  const litClass = tone === 'accent' ? 'bg-white' : 'bg-accent'

  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex flex-none items-center gap-[10px] leading-none', className)}
      onMouseEnter={() => {
        setHot(true)
        setLit(randomLitSet())
      }}
      onMouseLeave={() => setHot(false)}
    >
      {Array.from({ length: DOT_COUNT }, (_, i) => (
        <span
          key={i}
          className={cn(
            'block h-2 w-2 flex-none rounded-full transition-[transform,background-color] ease-out',
            lit.has(i) ? litClass : dimClass,
            !shouldReduceMotion && hot && (lit.has(i) ? 'scale-[2.05] duration-100' : 'scale-[0.72] duration-300'),
            !(hot && !shouldReduceMotion) && 'scale-100 duration-500',
          )}
        />
      ))}
    </span>
  )
}
