'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'
import { t, type Locale } from '@/lib/i18n'
import { Button } from './Button'
import { cn } from './cn'
import { HeartIcon } from './HeartIcon'
import { Logo } from './Logo'
import { LanguageToggle } from './LanguageToggle'
import { HeaderDonateHeart } from './HeaderDonateHeart'
import { NavMenu, type NavLink, type NavMenuTriggerVariant } from './NavMenu'
import { PodcastIcon } from './PodcastIcon'

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
  /** Pass-through to `NavMenu`'s `triggerVariant` — @default 'boxed', see its own doc comment. Only the `/header-lab` comparison page passes anything else. */
  navMenuTriggerVariant?: NavMenuTriggerVariant
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
 * `flex`, `gap-6` (24px), `py-[18px] px-8` (18px/32px) on desktop, matching
 * every mockup page's header exactly. Below `640px` the row's padding/gaps
 * (and the logo's and `PodcastIcon`'s own sizing) step down via
 * `max-[640px]:` — without that, the nav row (podcast icon + language
 * toggle + Donate button + hamburger, each a fixed minimum width) plus the
 * full-size logo don't fit on one line on any real phone width, so the nav
 * wraps onto its own second row under the logo instead of `flex-wrap`
 * merely reflowing individual items.
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
export function Header({ locale, navLinks = [], bordered = true, className, navMenuTriggerVariant }: HeaderProps) {
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
        'sticky z-30 flex flex-wrap items-center justify-between gap-6 max-[640px]:gap-3 max-[519px]:gap-2 bg-bg px-8 max-[640px]:px-4 py-[18px] max-[640px]:py-3',
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
        className="flex items-center gap-5 max-[640px]:gap-2 max-[519px]:gap-1"
        aria-label={t(locale, { he: 'ניווט ראשי', en: 'Primary navigation' })}
      >
        <Link
          href={`/${locale}/podcast`}
          className="group flex items-center text-accent-700 hover:text-accent focus-visible:rounded-sm focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={t(locale, { he: 'הפודקאסט של נבחרות', en: "Nivcharot's podcast" })}
        >
          <PodcastIcon className="max-[640px]:h-[18px] max-[640px]:w-[18px] transition-transform duration-300 ease-out group-hover:scale-110" />
        </Link>
        <LanguageToggle locale={locale} />
        {/*
          Below 520px: a bare heart (HeaderDonateHeart) instead of the
          "תרמו ♥" pill — the pill read as cramped once squeezed this far
          (2026-08-29 brief). At 520px+ it's the reverse: the full labelled
          button, hidden heart. Two elements, CSS-toggled, rather than one
          JS-conditional — avoids a hydration mismatch between server and
          client on which one should render at the client's actual width.
        */}
        <HeaderDonateHeart locale={locale} className="hidden max-[519px]:flex" />
        <Button
          href={`/${locale}/donate`}
          variant="primary"
          size="sm"
          className="hidden items-center gap-1.5 whitespace-nowrap max-[640px]:px-[12px] max-[640px]:py-[8px] max-[640px]:text-[13px] min-[520px]:flex"
        >
          <HeartIcon />
          {t(locale, { he: 'תרמו', en: 'Donate' })}
        </Button>
        <NavMenu locale={locale} links={navLinks} triggerVariant={navMenuTriggerVariant} />
      </nav>
    </motion.header>
  )
}
