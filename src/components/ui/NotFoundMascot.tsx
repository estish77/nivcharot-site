'use client'

import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'

/**
 * The 404 page's mascot (2026-08-31 brief, then a follow-up with a
 * reference photo: "האיור שעשית די מעפן, תצבע את האיור שמצורף פה בחולצה
 * אדומה ותזיז אותה כאילו היא הולכת ומחפשת"). The hand-drawn inline-SVG
 * attempt this file used to hold wasn't good enough; she wanted her own
 * reference illustration recolored to the site's red and animated as if
 * walking. The reference photo itself was pasted straight into chat, not
 * saved to disk anywhere reachable, so `public/assets/404-mascot.png` is a
 * generated recreation of it (same bent-forward walking-search pose), its
 * top recolored from the reference's blue to this site's accent red and a
 * slate-navy skirt, background removed for a transparent cutout that
 * blends on any page background regardless of exact shade.
 *
 * A still image can't hold a real multi-frame walk cycle without either a
 * sprite sheet or a second illustration pass, so "walking" here uses the
 * same technique a static walking-pose illustration usually gets: a gentle
 * vertical bob standing in for footstep impacts, same
 * `prefers-reduced-motion` convention as every other animated icon on the
 * site (frozen in place instead of stopped mid-bounce).
 */
export function NotFoundMascot({ className, size = 150 }: { className?: string; size?: number }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.img
      src="/assets/404-mascot.png"
      alt=""
      aria-hidden="true"
      width={700}
      height={878}
      style={{ width: size, height: 'auto' }}
      className={className}
      animate={shouldReduceMotion ? { y: 0 } : { y: [0, -6, 0] }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
