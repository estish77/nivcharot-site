'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'

import { cn } from '@/components/ui'

const DOT_COUNT = 6
const DEFAULT_LIT = [0, 2, 4]

function pickRandomThree(): number[] {
  const idx = [0, 1, 2, 3, 4, 5]
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = idx[i]
    idx[i] = idx[j]
    idx[j] = tmp
  }
  return idx.slice(0, 3).sort((a, b) => a - b)
}

export type EqualizerDotsProps = {
  className?: string
}

/**
 * Purely decorative "equalizer" flourish from docs/Activism.dc.html
 * (`__eqEl` / the `{{ eq0 }}`/`{{ eq1 }}` slots pinned to the top-end corner
 * of the archive section): six small dots, three lit at random, ambiently
 * reshuffling every 900ms and snapping to a fresh random set with a
 * scale-up on hover. The source instantiates one of these per language
 * branch (`eq0` for the Hebrew copy, `eq1` for the English copy) — since
 * this port renders one locale at a time from a single component, only one
 * instance is needed here.
 *
 * `aria-hidden`, exactly like the mockup's own `'aria-hidden': 'true'` —
 * it carries no content.
 */
export function EqualizerDots({ className }: EqualizerDotsProps) {
  const [lit, setLit] = useState<number[]>(DEFAULT_LIT)
  const [hot, setHot] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return
    const id = setInterval(() => setLit(pickRandomThree()), 900)
    return () => clearInterval(id)
  }, [shouldReduceMotion])

  return (
    <span
      aria-hidden="true"
      onMouseEnter={() => {
        setHot(true)
        if (!shouldReduceMotion) setLit(pickRandomThree())
      }}
      onMouseLeave={() => setHot(false)}
      className={cn('inline-flex flex-none cursor-crosshair items-center gap-[10px] leading-none', className)}
    >
      {Array.from({ length: DOT_COUNT }, (_, i) => {
        const isLit = lit.includes(i)
        return (
          <span
            key={i}
            className="block h-2 w-2 flex-none rounded-full"
            style={{
              backgroundColor: isLit ? 'var(--color-accent)' : 'var(--niv-slate)',
              transform: hot ? (isLit ? 'scale(2.05)' : 'scale(0.72)') : 'scale(1)',
              transition: `background-color ${hot ? '0.09s' : '0.5s'} ease-out, transform 0.3s cubic-bezier(0.22,0.61,0.36,1)`,
            }}
          />
        )
      })}
    </span>
  )
}
