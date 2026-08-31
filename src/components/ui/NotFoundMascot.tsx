'use client'

import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'

const SLATE = '#314451'
const ACCENT = '#d8252f'
const CREAM = '#f9dabb'

/**
 * The 404 page's mascot (2026-08-31 brief: "אנימציה של דמות מצחיקה שמחפשת
 * עם זכוכית מגדלת שתהיה בשפה הגרפית של האתר, מינימליסטית וחמודה") — flat
 * two-color shapes in the same SLATE/ACCENT pair every other icon on the
 * site draws from (see HeartIcon, PodcastIcon, SeatHall), not an
 * illustrated/shaded character, so it reads as part of this site rather
 * than a stock clip-art drop-in.
 *
 * Two independent loops, same `prefers-reduced-motion` convention as
 * `PodcastIcon`: the whole figure bobs gently in place, and the magnifying
 * glass sweeps on its own faster cycle as if scanning the ground — reduced
 * motion freezes both at their neutral pose instead of stopping mid-swing.
 */
export function NotFoundMascot({ className, size = 140 }: { className?: string; size?: number }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <svg viewBox="0 0 160 170" width={size} height={size} aria-hidden="true" className={className}>
      <motion.g
        animate={shouldReduceMotion ? { y: 0 } : { y: [0, -6, 0] }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="64" cy="156" rx="13" ry="4" fill={SLATE} opacity="0.18" />
        <ellipse cx="98" cy="156" rx="13" ry="4" fill={SLATE} opacity="0.18" />

        {/* resting arm */}
        <path d="M58 88 Q45 98 46 114" stroke={SLATE} strokeWidth="9" strokeLinecap="round" fill="none" />

        {/* dress/body */}
        <path
          d="M58 84 C58 73 67 66 81 66 C95 66 104 73 104 84 L112 148 C112 152 108 154 104 154 L58 154 C54 154 50 152 50 148 Z"
          fill={SLATE}
        />

        {/* head + ponytail */}
        <path d="M101 30 C112 27 118 37 112 46 C108 52 99 49 99 42 Z" fill={SLATE} />
        <circle cx="80" cy="44" r="24" fill={SLATE} />

        {/* face */}
        <circle cx="71" cy="42" r="2.6" fill={CREAM} />
        <circle cx="89" cy="42" r="2.6" fill={CREAM} />
        <path d="M70 52 Q80 58 90 52" stroke={CREAM} strokeWidth="2.4" strokeLinecap="round" fill="none" />

        {/* arm reaching toward the magnifying glass */}
        <path d="M103 86 Q118 78 126 64" stroke={SLATE} strokeWidth="9" strokeLinecap="round" fill="none" />

        <motion.g
          style={{ transformOrigin: '128px 52px' }}
          animate={shouldReduceMotion ? { rotate: 0 } : { rotate: [-14, 10, -14] }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="128" cy="52" r="16" fill={CREAM} stroke={ACCENT} strokeWidth="5" />
          <line x1="139" y1="63" x2="150" y2="74" stroke={ACCENT} strokeWidth="6" strokeLinecap="round" />
        </motion.g>
      </motion.g>
    </svg>
  )
}
