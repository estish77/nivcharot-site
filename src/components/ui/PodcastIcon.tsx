'use client'

import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'
import { cn } from './cn'

const PODCAST_PULSE_DURATION_S = 1.4

export type PodcastIconProps = {
  className?: string
}

/**
 * A "sound is playing" indicator — built from the universally recognized
 * speaker + sound-wave glyph (the same silhouette as a volume/broadcast
 * icon everywhere else on the web), rather than a custom abstract bar
 * visualizer. The two wave arcs pulse outward from the speaker on a calm,
 * gentle rhythm, staggered so the outer arc lags just behind the inner
 * one — reads immediately as "sound playing," not as decoration.
 *
 * Originally local to `Header.tsx` (its link to `/podcast`); pulled out
 * here (2026-08-29 brief) so the Home hero's own podcast CTA can reuse the
 * exact same glyph instead of a plain text button.
 */
export function PodcastIcon({ className }: PodcastIconProps) {
  const shouldReduceMotion = useReducedMotion()
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('h-[22px] w-[22px]', className)}>
      <path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor" />
      <motion.path
        d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
        fill="currentColor"
        initial={false}
        animate={shouldReduceMotion ? { opacity: 0.9 } : { opacity: [0.35, 1, 0.35] }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: PODCAST_PULSE_DURATION_S, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
        fill="currentColor"
        initial={false}
        animate={shouldReduceMotion ? { opacity: 0.75 } : { opacity: [0.2, 0.85, 0.2] }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: PODCAST_PULSE_DURATION_S, repeat: Infinity, ease: 'easeInOut', delay: PODCAST_PULSE_DURATION_S * 0.2 }
        }
      />
    </svg>
  )
}
