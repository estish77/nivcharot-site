'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'

import { cn } from '@/components/ui'

type Seat = { cx: number; cy: number }

/** Same eight concentric arcs + per-arc seat count as docs/Hanivcheret.dc.html:337-343. */
const RADII = [140, 185, 230, 275, 320, 365, 410, 455]

function buildSeats(): Seat[] {
  const seats: Seat[] = []
  for (const r of RADII) {
    const n = Math.round((Math.PI * r) / 47)
    for (let i = 0; i < n; i++) {
      const a = Math.PI - (i / (n - 1)) * Math.PI
      seats.push({
        cx: +(500 + Math.cos(a) * r).toFixed(1),
        cy: +(470 - Math.sin(a) * r).toFixed(1),
      })
    }
  }
  return seats
}

/** 156 seats total (9+12+15+18+21+24+27+30) — matches the mockup's own `hint-placeholder-count="156"`. */
const SEATS = buildSeats()

/** Fixed, deterministic seed so server- and first-client-render markup match exactly (no hydration mismatch). */
const INITIAL_LIT = new Set<number>([6, 22, 41, 63, 88, 112, 137])

const LIT_CAP_RATIO = 0.5

export type SeatHallProps = {
  ariaLabel: string
  className?: string
}

/**
 * A lighter, purely decorative variant of Home's Knesset seat-hall visual
 * (docs/Hanivcheret.dc.html:120-127 + :335-368): 156 circles arranged in 8
 * concentric arcs — the exact seat-generation math from the mockup — with a
 * slow ambient "some seats light up, some go dark over time" animation.
 *
 * Per the porting brief ("this one is decorative rather than interactive,
 * keep it lighter than Home's"), this deliberately drops two pieces of the
 * mockup's own script: the pointermove handler that lights seats nearest
 * the cursor, and the letter-by-letter ring animation that spells out a
 * message using a subset of seats (`__hallVals`'s `ringLetterEls`). The
 * `cursor-crosshair` styling is kept as the visual cue the mockup uses,
 * without wiring up the interaction it implied.
 */
export function SeatHall({ ariaLabel, className }: SeatHallProps) {
  const [lit, setLit] = useState<Set<number>>(INITIAL_LIT)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return
    const cap = Math.floor(SEATS.length * LIT_CAP_RATIO)
    const id = setInterval(() => {
      setLit((prev) => {
        const next = new Set(prev)
        if (next.size >= cap) {
          const drain = 3 + Math.floor(Math.random() * 3)
          const keys = Array.from(next)
          for (let k = 0; k < drain && keys.length; k++) {
            const idx = Math.floor(Math.random() * keys.length)
            next.delete(keys[idx])
            keys.splice(idx, 1)
          }
        } else {
          const add = 1 + Math.floor(Math.random() * 3)
          for (let k = 0; k < add; k++) {
            next.add(Math.floor(Math.random() * SEATS.length))
          }
        }
        return next
      })
    }, 1100)
    return () => clearInterval(id)
  }, [shouldReduceMotion])

  return (
    <div className={cn('relative w-full cursor-crosshair', className)}>
      <svg
        viewBox="0 0 1000 500"
        role="img"
        aria-label={ariaLabel}
        className="block h-auto max-h-full w-full overflow-visible"
      >
        {SEATS.map((seat, i) => {
          const isLit = lit.has(i)
          return (
            <circle
              key={i}
              cx={seat.cx}
              cy={seat.cy}
              r={isLit ? 12 : 11}
              fill={isLit ? 'var(--color-accent)' : 'var(--niv-slate)'}
              style={
                shouldReduceMotion
                  ? undefined
                  : {
                      transition:
                        'fill 0.55s cubic-bezier(0.22,0.61,0.36,1), r 0.32s cubic-bezier(0.22,0.61,0.36,1)',
                    }
              }
            />
          )
        })}
      </svg>
    </div>
  )
}
