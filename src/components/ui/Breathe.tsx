'use client'

import { motion } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'
import type { ComponentType } from 'react'

import { useReducedMotion } from '@/lib/useReducedMotion'

export type BreatheTag = 'div' | 'section'

export type BreatheProps = HTMLMotionProps<'div'> & {
  /** Host element to render. @default 'div' */
  as?: BreatheTag
  /** Idle loop period, seconds. @default 4.4 */
  durationS?: number
}

/**
 * A continuous, gentle "breathing" idle loop (subtle scale pulse) — the
 * always-on alternative to `Reveal`'s one-shot scroll entrance, for sections
 * that should read as alive/ongoing rather than animate in once and stop
 * (the donate/newsletter bands). Same scale range and easing as the Hero
 * seat-hall's own idle breathe (`Hero.tsx`) and the header's scrolled-shadow
 * pulse (`Header.tsx`), so the site's looped-motion vocabulary stays
 * consistent. Renders straight into rest state under
 * `prefers-reduced-motion`, matching every other looped animation here.
 */
export function Breathe({ as = 'div', durationS = 4.4, ...props }: BreatheProps) {
  const shouldReduceMotion = useReducedMotion()
  const MotionTag = motion[as] as ComponentType<HTMLMotionProps<'div'>>

  return (
    <MotionTag
      animate={shouldReduceMotion ? undefined : { scale: [1, 1.015, 1] }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: durationS, repeat: Infinity, ease: 'easeInOut' }}
      {...props}
    />
  )
}
