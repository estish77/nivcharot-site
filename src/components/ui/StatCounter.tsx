'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'

export type StatCounterProps = {
  value: number
  /** Appended after the formatted number, inside and outside the animation (e.g. `'%'`). */
  suffix?: string
  /** Decimal places to display. @default auto — 1 if `value` isn't a whole number, else 0 (matches the mockups' own `data-count` parsing rule). */
  decimals?: number
  /** Animation duration in ms. @default 1300 */
  duration?: number
  className?: string
}

/**
 * Counts up from 0 to `value` over `duration`ms with a cubic ease-out
 * (`1 - (1-p)^3`, identical curve to the mockups' own counter script),
 * triggered once the element is 40% in view. Respects
 * `prefers-reduced-motion` by rendering the final value immediately.
 *
 * Renders two spans: an `aria-hidden` one that visually animates, and a
 * `sr-only` one holding the final value — so assistive tech reads the
 * correct number once, instead of the rapidly-changing intermediate values.
 */
export function StatCounter({ value, suffix = '', decimals, duration = 1300, className }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const startedRef = useRef(false)
  const [display, setDisplay] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  const dec = decimals ?? (Number.isInteger(value) ? 0 : 1)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (shouldReduceMotion || typeof IntersectionObserver === 'undefined') {
      setDisplay(value)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || startedRef.current) return
          startedRef.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - p, 3)
            setDisplay(value * eased)
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          io.unobserve(el)
        })
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value, duration, shouldReduceMotion])

  return (
    <span className={className}>
      <span aria-hidden="true" ref={ref}>
        {display.toFixed(dec)}
        {suffix}
      </span>
      <span className="sr-only">
        {value.toFixed(dec)}
        {suffix}
      </span>
    </span>
  )
}
