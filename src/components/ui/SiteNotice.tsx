'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'
import { t, type Locale } from '@/lib/i18n'

export type SiteNoticeProps = {
  locale: Locale
}

/**
 * Temporary sitewide banner while the new site is going live and content
 * (posts, team, press archive) is still being migrated over — sits above
 * the sticky `Header` on every route in `(site)/[locale]`. Pinned (not
 * just scrolled-away) so it stays visible the whole session, per
 * 2026-08-25 design note: it should "stand out more."
 *
 * Publishes its own rendered height as `--site-notice-height` on the root
 * element (via ResizeObserver, since the text wraps to a second line at
 * some widths/locales) — `Header`'s own `sticky` offset reads that
 * variable so the two stack instead of overlapping, without either
 * component needing to know the other's exact height ahead of time.
 * Remove this component once migration is done and the site is fully
 * populated (undoing the CSS-var offset in Header.tsx too).
 */
export function SiteNotice({ locale }: SiteNoticeProps) {
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const publishHeight = () => {
      document.documentElement.style.setProperty('--site-notice-height', `${el.offsetHeight}px`)
    }
    publishHeight()
    const observer = new ResizeObserver(publishHeight)
    observer.observe(el)
    return () => {
      observer.disconnect()
      document.documentElement.style.removeProperty('--site-notice-height')
    }
  }, [])

  return (
    <div
      ref={ref}
      className="sticky top-0 z-[35] flex items-center justify-center gap-2.5 bg-niv-slate px-8 py-2.5 text-center text-[13px] font-semibold leading-snug text-white"
    >
      <motion.span
        aria-hidden="true"
        className="inline-block h-[6px] w-[6px] shrink-0 rounded-full bg-accent-300"
        animate={shouldReduceMotion ? undefined : { opacity: [0.4, 1, 0.4], scale: [0.8, 1.05, 0.8] }}
        transition={{ duration: 2.2, ease: 'easeInOut', repeat: Infinity }}
      />
      {/*
        The text pulses between white and the brand red (2026-08-28 brief).
        Two deliberate choices in how:

        - It blinks to --color-accent-300, not the raw brand red. That token
          exists for exactly this situation: red text on the brand slate
          measures 2.04:1 and fails WCAG AA, so the raw red would leave the
          notice unreadable for half of every cycle. #efa8ac reads as red on
          this ground and holds 5.23:1.
        - The cycle is slow (1.8s, eased). Anything flashing more than three
          times a second is a seizure risk under WCAG 2.3.1; this is a gentle
          pulse, and it stops entirely under prefers-reduced-motion.

        The hexes are inlined because Motion interpolates between concrete
        colours - a var() reference does not animate - matching what
        StoriesStrip already does with its ring colours.
      */}
      <motion.span
        animate={shouldReduceMotion ? undefined : { color: ['#ffffff', '#efa8ac', '#ffffff'] }}
        transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
      >
        {t(locale, {
          he: 'אתר חדש באוויר, עדיין בבנייה, התוכן מתעדכן, תישארו איתנו.',
          en: 'A new site is live and still being built. Content is updating — stay with us.',
        })}
      </motion.span>
    </div>
  )
}
