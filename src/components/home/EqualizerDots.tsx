'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/components/ui'

/**
 * Ported from "Home copy.dc.html"'s `__eqEl`/`__eqVals` (source lines
 * ~679-746): the small 6-dot "equalizer" decoration pinned to the top
 * corner of several sections (`{{ eq0 }}`..`{{ eq7 }}`). 3 of 6 dots are
 * "lit" at any time, reshuffling every 900ms (or instantly on hover), with
 * a snappier flip + punchier scale while hovered. `aria-hidden` — purely
 * decorative, same as the mockup.
 *
 * `tone="accent"` is used on the one section with an accent-red background
 * (the donate band): lit dots go white-on-slate-base instead of
 * red-on-slate-base, matching the mockup's per-instance tone table.
 */

const DOT_COUNT = 6
const LIT_COUNT = 3
const INTERVAL_MS = 900

function pickLit(): number[] {
  const idx = [0, 1, 2, 3, 4, 5]
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const t = idx[i]
    idx[i] = idx[j]
    idx[j] = t
  }
  return idx.slice(0, LIT_COUNT).sort((a, b) => a - b)
}

export type EqualizerDotsProps = {
  /** @default 'light' */
  tone?: 'light' | 'accent'
  className?: string
}

export function EqualizerDots({ tone = 'light', className }: EqualizerDotsProps) {
  const base = 'var(--niv-slate)'
  const on = tone === 'accent' ? '#fff' : 'var(--color-accent)'
  const [lit, setLit] = useState<number[]>([0, 2, 4])
  const [hot, setHot] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setLit(pickLit())
    const id = window.setInterval(() => setLit(pickLit()), INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span
      aria-hidden="true"
      onPointerEnter={() => {
        setHot(true)
        setLit(pickLit())
      }}
      onPointerLeave={() => setHot(false)}
      className={cn('inline-flex flex-none cursor-crosshair items-center gap-[10px]', className)}
    >
      {Array.from({ length: DOT_COUNT }, (_, k) => {
        const isLit = lit.includes(k)
        return (
          <span
            key={k}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              flex: '0 0 auto',
              display: 'block',
              backgroundColor: isLit ? on : base,
              transform: hot ? (isLit ? 'scale(2.05)' : 'scale(0.72)') : 'scale(1)',
              transition: `background-color ${hot ? '0.09s' : '0.5s'} ease-out, transform 0.3s cubic-bezier(0.22,0.61,0.36,1)`,
            }}
          />
        )
      })}
    </span>
  )
}
