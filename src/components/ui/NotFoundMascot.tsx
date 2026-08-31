'use client'

import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'

const SLATE = '#314451'
const ACCENT = '#d8252f'
const CREAM = '#f9dabb'

/**
 * The 404 page's mascot (2026-08-31 brief: "אנימציה של דמות מצחיקה שמחפשת
 * עם זכוכית מגדלת שתהיה בשפה הגרפית של האתר, מינימליסטית וחמודה", then a
 * follow-up with a reference photo: "תצבע לה את החולצה באדום שתתאים לשפת
 * האתר ותגרום לה ללכת ולחפש" — red top instead of an all-slate figure, and
 * an actively bent-forward, walking search pose instead of a static stand)
 * — flat two-color shapes in the same SLATE/ACCENT pair every other icon on
 * the site draws from (see HeartIcon, PodcastIcon, SeatHall), not a shaded
 * illustration, so it reads as part of this site rather than a stock
 * clip-art drop-in.
 *
 * The whole figure is one rotated group pivoting at the hip (`rotate(28)`)
 * rather than hand-plotted bent-body coordinates — far easier to keep
 * proportional than computing a leaning torso/head/arm point by point.
 *
 * Two independent loops, same `prefers-reduced-motion` convention as
 * `PodcastIcon`: a walking bob on the whole figure, and the magnifying
 * glass sweeping a few extra degrees on its own faster cycle as if
 * scanning the ground. Reduced motion freezes both at their base pose
 * instead of stopping mid-stride.
 */
export function NotFoundMascot({ className, size = 150 }: { className?: string; size?: number }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <svg viewBox="0 0 200 170" width={size} height={size} aria-hidden="true" className={className}>
      {/* marks on the ground she's searching through */}
      <g fill={SLATE} opacity="0.32">
        <path d="M118 148 q3 -6 8 -4 q4 2 1 6 q-2 3 1 5" stroke={SLATE} strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <circle cx="126" cy="161" r="1.6" />
        <circle cx="144" cy="146" r="2.2" />
        <path d="M152 156 l5 5 M157 156 l-5 5" stroke={SLATE} strokeWidth="2" strokeLinecap="round" />
      </g>

      <motion.g
        animate={shouldReduceMotion ? { y: 0 } : { y: [0, -5, 0] }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* legs, mid-stride */}
        <ellipse cx="56" cy="160" rx="11" ry="4" fill={SLATE} opacity="0.85" />
        <ellipse cx="110" cy="160" rx="11" ry="4" fill={SLATE} opacity="0.85" />
        <path d="M68 114 Q60 136 56 158" stroke={SLATE} strokeWidth="11" strokeLinecap="round" fill="none" />
        <path d="M88 115 Q100 136 108 158" stroke={SLATE} strokeWidth="11" strokeLinecap="round" fill="none" />

        {/* skirt */}
        <path d="M58 100 C58 92 67 86 79 86 C91 86 100 92 100 100 L102 124 Q79 133 57 124 Z" fill={SLATE} />

        {/* upper body: torso, head, arms and the magnifying glass, all one
            group pivoting forward at the hip so the whole figure reads as
            bent over and reaching down to search. */}
        <motion.g
          style={{ transformOrigin: '78px 106px' }}
          animate={shouldReduceMotion ? { rotate: 28 } : { rotate: [25, 31, 25] }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <g transform="translate(78 106) rotate(28)">
            {/* far arm, tucked behind the torso */}
            <path d="M-10 -44 Q10 -30 40 -8" stroke={SLATE} strokeWidth="8" strokeLinecap="round" fill="none" />
            {/* torso / red blouse */}
            <rect x="-16" y="-54" width="32" height="54" rx="14" fill={ACCENT} />
            {/* near arm, reaching to the glass */}
            <path d="M13 -48 Q30 -28 46 -8" stroke={SLATE} strokeWidth="9" strokeLinecap="round" fill="none" />

            {/* head + ponytail */}
            <ellipse cx="16" cy="-64" rx="7" ry="10" transform="rotate(25 16 -64)" fill={SLATE} />
            <circle cx="2" cy="-66" r="17" fill={SLATE} />
            <circle cx="-5" cy="-68" r="2" fill={CREAM} />
            <circle cx="9" cy="-68" r="2" fill={CREAM} />
            <path d="M-5 -60 Q2 -56 9 -60" stroke={CREAM} strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* magnifying glass */}
            <circle cx="65" cy="0" r="22" fill={CREAM} stroke={ACCENT} strokeWidth="6" />
            <line x1="79" y1="14" x2="84" y2="20" stroke={ACCENT} strokeWidth="8" strokeLinecap="round" />
          </g>
        </motion.g>
      </motion.g>
    </svg>
  )
}
