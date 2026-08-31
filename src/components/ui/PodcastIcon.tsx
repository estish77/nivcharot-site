'use client'

import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'
import { cn } from './cn'

export type PodcastIconProps = {
  className?: string
}

/** Four bars, staggered so they don't move in lockstep — negative `delay`s start each bar partway through the cycle immediately, same trick as a CSS `animation-delay: -Ns`. */
const BARS = [
  { x: 2, y: 9, h: 6, delay: -0.9 },
  { x: 7.5, y: 5, h: 14, delay: -0.4 },
  { x: 13, y: 2, h: 20, delay: 0 },
  { x: 18.5, y: 6, h: 12, delay: -0.6 },
] as const

const DURATION_S = 1.1

/**
 * The site's podcast glyph: four bars dancing like an audio equalizer.
 * Always animating — including inside the Home hero's "חרדית מדוברת"
 * button, not just the header — per the 2026-08-29 brief ("תבחר את 4
 * ושירקוד תמיד באנימציה, גם בכפתור"), picked from a six-option audition.
 * Replaced the previous speaker + sound-wave glyph; both call sites
 * (Header.tsx, Hero.tsx) needed no changes since they just render
 * `<PodcastIcon />`.
 *
 * Each bar scales along Y around its own center — `prefers-reduced-motion`
 * freezes every bar at full height instead of stopping mid-animation.
 *
 * No `initial={false}` (2026-08-31 fix — confirmed production-only, via
 * `www.nivcharot.co.il`, never reproduced on `next dev`): with it, this
 * bar's looping keyframe `animate` never actually started after a real
 * production hydration — every bar sat frozen at its very first keyframe
 * value indefinitely, confirmed by sampling the rendered transform matrix
 * 15 times over 2+ seconds with zero change. The header's own
 * `repeat: Infinity` shadow-breathe animation, which has no `initial`
 * override and only starts once `scrolled` flips via a real state change,
 * animated correctly the whole time — narrowing this to the specific
 * combination of `initial={false}` with an `animate` value that's already
 * identical on the very first render (nothing ever changes it later to
 * nudge Motion into starting the loop). Dropping `initial={false}` costs a
 * barely-perceptible one-time settle into the first keyframe on mount,
 * which is a fair trade for the animation actually running at all.
 */
export function PodcastIcon({ className }: PodcastIconProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('h-[22px] w-[22px]', className)}>
      {BARS.map((bar) => (
        <motion.rect
          key={bar.x}
          x={bar.x}
          y={bar.y}
          width={3}
          height={bar.h}
          rx={1.5}
          fill="currentColor"
          style={{ transformOrigin: 'center' }}
          animate={shouldReduceMotion ? { scaleY: 1 } : { scaleY: [0.55, 1, 0.55] }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: DURATION_S, repeat: Infinity, ease: 'easeInOut', delay: bar.delay }
          }
        />
      ))}
    </svg>
  )
}
