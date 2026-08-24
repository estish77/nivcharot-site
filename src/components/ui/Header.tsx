import Link from 'next/link'

import { t, type Locale } from '@/lib/i18n'
import { cn } from './cn'
import { Logo } from './Logo'
import { LanguageToggle } from './LanguageToggle'
import { NavMenu, type NavLink } from './NavMenu'

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

/**
 * Site header: logo (links home) + language toggle + nav menu trigger.
 * `flex`, `gap-6` (24px), `py-[18px] px-8` (18px/32px), wraps on narrow
 * viewports — matches every mockup page's header exactly.
 *
 * `sticky top-0`, 2026-08-13 brief: on the long multi-section pages
 * (Activism, Media) the logo and hamburger used to scroll away entirely,
 * with no way back to navigation without scrolling all the way up. Keeping
 * the whole header pinned — rather than a separate "mini header" that
 * fades in on scroll — is the simplest fix that works identically on every
 * page, needs no scroll-position JS, and can never show a stale/duplicate
 * header. `bg-bg` keeps page content from showing through once it's
 * pinned; `z-30` stays below `NavMenu`'s own overlay/panel (z-40/z-50) so
 * the open menu still draws on top of it.
 */
export function Header({ locale, navLinks = [], bordered = true, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex flex-wrap items-center justify-between gap-6 bg-bg px-8 py-[18px]',
        bordered && 'border-b-2 border-divider',
        className,
      )}
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
        <LanguageToggle locale={locale} />
        <NavMenu locale={locale} links={navLinks} />
      </nav>
    </header>
  )
}
