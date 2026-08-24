'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'

import { cn } from '@/components/ui/cn'

export type EqualizerDotsProps = {
  /**
   * Matches the mockups' per-instance tone: the accent-red quote banner
   * (Join, `{{ eq0 }}`/`{{ eq1 }}`) uses `'accent'` — slate base dots, white
   * lit dots. The cream/bg team section (Team, `{{ eq1 }}`/`{{ eq3 }}`) uses
   * `'light'` — slate base dots, accent-red lit dots. @default 'light'
   */
  tone?: 'accent' | 'light'
  className?: string
}

const DOT_COUNT = 6
const LIT_COUNT = 3
const CYCLE_MS = 900

function pickLit(): number[] {
  const idx = [0, 1, 2, 3, 4, 5]
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = idx[i]
    idx[i] = idx[j]
    idx[j] = tmp
  }
  return idx.slice(0, LIT_COUNT).sort((a, b) => a - b)
}

/**
 * Decorative `{{ eqN }}` equalizer-dot motif shared by docs/Team.dc.html
 * (the "who we are" section corner) and docs/Join.dc.html (the pull-quote
 * banner corner): 6 dots, 3 lit at random, reshuffling every 900ms.
 * Hovering (or focusing) the cluster goes "hot" — an instant fresh pick,
 * exaggerated scale (lit 2.05x / unlit 0.72x), and a snappier 90ms color
 * transition, matching the mockups' own `onMouseEnter`/`onMouseLeave`
 * script exactly.
 *
 * Purely decorative (`aria-hidden`). Reshuffling pauses under
 * `prefers-reduced-motion`, leaving a static lit pattern; hover still
 * re-picks once but skips the scale exaggeration.
 */
export function EqualizerDots({ tone = 'light', className }: EqualizerDotsProps) {
  const base = 'var(--niv-slate)'
  const lit = tone === 'accent' ? '#fff' : 'var(--color-accent)'
  const [litSet, setLitSet] = useState<number[]>([0, 2, 4])
  const [hot, setHot] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setLitSet(pickLit())
    if (shouldReduceMotion) return
    let tick = 0
    const id = setInterval(() => {
      tick += 1
      if (tick % 3 === 0) setLitSet(pickLit())
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [shouldReduceMotion])

  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex flex-none cursor-crosshair items-center gap-[10px]', className)}
      onMouseEnter={() => {
        setHot(true)
        setLitSet(pickLit())
      }}
      onMouseLeave={() => setHot(false)}
      onFocus={() => {
        setHot(true)
        setLitSet(pickLit())
      }}
      onBlur={() => setHot(false)}
    >
      {Array.from({ length: DOT_COUNT }, (_, k) => {
        const isLit = litSet.includes(k)
        const scale = shouldReduceMotion || !hot ? 1 : isLit ? 2.05 : 0.72
        return (
          <motion.span
            key={k}
            className="block h-2 w-2 flex-none rounded-full"
            animate={{ backgroundColor: isLit ? lit : base, scale }}
            transition={{
              backgroundColor: { duration: hot ? 0.09 : 0.5, ease: 'easeOut' },
              scale: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] },
            }}
          />
        )
      })}
    </span>
  )
}
