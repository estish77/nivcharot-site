'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'
import { t, type Locale } from '@/lib/i18n'
import { HeartIcon } from './HeartIcon'

const LABEL = { he: 'תרמו', en: 'Donate' }

/**
 * Mobile-only donate link: a bare heart instead of the full "תרמו ♥" pill
 * (2026-08-29 brief — the pill read as cramped on a narrow header). Same
 * outline-to-filled heart and "pop" scale animation as the team page's
 * שכוייח button (`AppreciateButton`), but this one isn't a toggle that
 * persists — it's a real link to `/donate`, so the fill plays once as
 * immediate click feedback and the page navigates right behind it (the
 * header stays mounted across the route change, so the animation is still
 * visible while the new page loads in).
 */
export function HeaderDonateHeart({ locale, className }: { locale: Locale; className?: string }) {
  const [pressed, setPressed] = useState(false)
  const reducedMotion = useReducedMotion()

  return (
    <Link
      href={`/${locale}/donate`}
      aria-label={t(locale, LABEL)}
      onClick={() => setPressed(true)}
      className={`flex items-center justify-center rounded-full p-2 -m-2 text-accent transition-colors duration-200 ease-out hover:text-accent-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className ?? ''}`}
    >
      <motion.span
        className="inline-flex"
        animate={pressed && !reducedMotion ? { scale: [1, 1.4, 0.85, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 0.5, times: [0, 0.25, 0.55, 0.8, 1], ease: [0.22, 0.61, 0.36, 1] }}
      >
        <HeartIcon size={20} filled={pressed} />
      </motion.span>
    </Link>
  )
}
