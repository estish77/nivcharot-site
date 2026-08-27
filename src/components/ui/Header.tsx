'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'
import { t, type Locale } from '@/lib/i18n'
import { Button } from './Button'
import { cn } from './cn'
import { Logo } from './Logo'
import { LanguageToggle } from './LanguageToggle'
import { NavMenu, type NavLink } from './NavMenu'

/** Filled, minimal heart — matches the hand-drawn-inline-SVG convention used everywhere else in this codebase (see NavMenu.tsx's icons); no icon library is installed or needed. */
function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" className={className}>
      <path
        d="M12 20.5c-.25 0-.5-.09-.7-.27C7.6 16.9 3 13 3 8.7 3 5.8 5.2 3.5 8 3.5c1.7 0 3.2.85 4 2.15.8-1.3 2.3-2.15 4-2.15 2.8 0 5 2.3 5 5.2 0 4.3-4.6 8.2-8.3 11.53-.2.18-.45.27-.7.27Z"
        fill="currentColor"
      />
    </svg>
  )
}

const PODCAST_BAR_COUNT = 4
const PODCAST_PULSE_DURATION_S = 1.6
const PODCAST_BAR_DELAY_STEP_S = 0.16

/**
 * A "sound is playing" equalizer glyph — the header's link to `/podcast`.
 * A calm, slow, gently staggered breathing pulse (not a fast/erratic
 * visualizer) — each bar shares the same rhythm, just slightly out of
 * phase with its neighbors. Kept accent-colored at rest (not just on
 * hover, like a plain nav icon) and scales up slightly on hover, so it
 * reads as a live, clickable indicator rather than decoration. Bars scale
 * on their own vertical center (not height+position) so they never shift
 * the icon's baseline while animating. Sized larger than a typical nav
 * glyph (24x20, vs. the header's other ~18px icons) specifically so the
 * pulse is easy to notice at a glance.
 */
function PodcastIcon() {
  const shouldReduceMotion = useReducedMotion()
  return (
    <svg
      viewBox="0 0 24 20"
      width="24"
      height="20"
      aria-hidden="true"
      className="transition-transform duration-300 ease-out group-hover:scale-110"
    >
      {Array.from({ length: PODCAST_BAR_COUNT }, (_, i) => (
        <motion.rect
          key={i}
          x={i * 6 + 2}
          y={3}
          width={3.5}
          height={14}
          rx={1.75}
          fill="currentColor"
          style={{ transformOrigin: 'center' }}
          initial={false}
          animate={shouldReduceMotion ? { scaleY: 0.6 } : { scaleY: [0.45, 1, 0.45] }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: PODCAST_PULSE_DURATION_S, repeat: Infinity, ease: 'easeInOut', delay: i * PODCAST_BAR_DELAY_STEP_S }
          }
        />
      ))}
    </svg>
  )
}

export type { NavLink }

export type HeaderProps = {
  locale: Locale
  /**
   * Nav links passed straight through to `NavMenu`. Defaults to an empty
   * array — `niv-menu.js` (the mockups' nav data source) is missing from
   * this repo, so there's no recoverable link set; wire up the real one
   * from wherever the page routes end up living.
   */
  navLinks?: NavLink[]
  /**
   * Every mockup page has a 2px bottom divider under the header *except*
   * Home. @default true
   *
   * Note: the current root layout (`src/app/(site)/[locale]/layout.tsx`,
   * out of this agent's scope) renders one `<Header>` for every route and
   * doesn't pass this prop, so it always gets the default `true` today.
   * Whichever page composes the Home route will need either the layout
   * updated to pass `bordered={false}` conditionally, or `Header` lifted
   * out of the root layout into per-page composition.
   */
  bordered?: boolean
  className?: string
}

const SHADOW_REST = '0 0 0 0 rgba(49,68,81,0)'
const SHADOW_BREATHE = [
  '0 6px 16px -6px rgba(49,68,81,0.14)',
  '0 10px 26px -6px rgba(49,68,81,0.22)',
  '0 6px 16px -6px rgba(49,68,81,0.14)',
]
const SHADOW_STATIC = '0 8px 20px -8px rgba(49,68,81,0.18)'

/**
 * Site header: logo (links home) + language toggle + nav menu trigger.
 * `flex`, `gap-6` (24px), `py-[18px] px-8` (18px/32px), wraps on narrow
 * viewports — matches every mockup page's header exactly.
 *
 * `sticky`, 2026-08-13 brief: on the long multi-section pages (Activism,
 * Media) the logo and hamburger used to scroll away entirely, with no way
 * back to navigation without scrolling all the way up. Keeping the whole
 * header pinned — rather than a separate "mini header" that fades in on
 * scroll — is the simplest fix that works identically on every page, needs
 * no scroll-position JS for the pinning itself, and can never show a
 * stale/duplicate header. `bg-bg` keeps page content from showing through
 * once it's pinned; `z-30` stays below `NavMenu`'s own overlay/panel
 * (z-40/z-50) so the open menu still draws on top of it, and below
 * `SiteNotice`'s z-[35] so that stays above this once both are pinned.
 *
 * `top` reads `--site-notice-height` (published by `SiteNotice`, 0px if
 * that component isn't mounted) instead of a bare `0`, so the two stack
 * instead of overlapping without either one hardcoding the other's height.
 *
 * 2026-08-25 design note: once the page is scrolled, a soft shadow grows
 * in under the header (it's now visually "swallowing" content scrolling
 * beneath it) with a slow, subtle breathing pulse rather than a static
 * flat shadow — skipped under `prefers-reduced-motion`, which gets the
 * plain static shadow instead.
 */
export function Header({ locale, navLinks = [], bordered = true, className }: HeaderProps) {
  const shouldReduceMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Reduced motion still gets a (static) shadow once scrolled, just without
  // the breathing keyframes — applied as a plain style instead of `animate`.
  const headerStyle = {
    top: 'var(--site-notice-height, 0px)',
    ...(shouldReduceMotion ? { boxShadow: scrolled ? SHADOW_STATIC : 'none' } : {}),
  }

  return (
    <motion.header
      className={cn(
        'sticky z-30 flex flex-wrap items-center justify-between gap-6 bg-bg px-8 py-[18px]',
        bordered && 'border-b-2 border-divider',
        className,
      )}
      style={headerStyle}
      animate={shouldReduceMotion ? undefined : { boxShadow: scrolled ? SHADOW_BREATHE : SHADOW_REST }}
      transition={
        !shouldReduceMotion && scrolled
          ? { duration: 2.8, ease: 'easeInOut', repeat: Infinity }
          : { duration: 0.35, ease: 'easeOut' }
      }
    >
      <Link
        href={`/${locale}`}
        className="inline-flex items-center rounded-sm text-text no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Logo locale={locale} />
      </Link>
      <nav
        className="flex items-center gap-5"
        aria-label={t(locale, { he: 'ניווט ראשי', en: 'Primary navigation' })}
      >
        <Link
          href={`/${locale}/podcast`}
          className="group flex items-center text-accent-700 hover:text-accent focus-visible:rounded-sm focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={t(locale, { he: 'הפודקאסט של נבחרות', en: "Nivcharot's podcast" })}
        >
          <PodcastIcon />
        </Link>
        <LanguageToggle locale={locale} />
        <Button href={`/${locale}/donate`} variant="primary" size="sm" className="flex items-center gap-1.5 whitespace-nowrap">
          <HeartIcon />
          {t(locale, { he: 'תרמו', en: 'Donate' })}
        </Button>
        <NavMenu locale={locale} links={navLinks} />
      </nav>
    </motion.header>
  )
}
