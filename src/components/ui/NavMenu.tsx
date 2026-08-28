'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'

import { dict, t, type Locale, type Localized } from '@/lib/i18n'
import { cn } from './cn'

export type NavLink = {
  label: Localized<string>
  href: string
  /**
   * Optional sub-links, rendered as a visually-indented sub-list directly
   * under their parent in the (single, always-flat, always-scrollable)
   * slide-out panel — no click-to-expand, just nesting by indent/size.
   */
  children?: NavLink[]
}

export type NavMenuProps = {
  locale: Locale
  /** Empty by default — `niv-menu.js` (the mockups' nav data source) isn't part of this repo, so pass the real link set from wherever routes end up living. */
  links: NavLink[]
  className?: string
}

const EASE = [0.22, 0.61, 0.36, 1] as const

/**
 * Accessible menu trigger + slide-in panel — `niv-menu.js` (the mockups'
 * nav widget) is missing from the repo, so this is a from-scratch,
 * design-consistent replacement: a 44px trigger button, an end-anchored
 * panel (uses logical `end-0`, so it opens from the correct physical side
 * per direction with no rtl:/ltr: needed), Escape-to-close, a manual focus
 * trap, body-scroll lock while open, and a flat 2px divider border instead
 * of a shadow (the mockups never use box-shadow anywhere).
 */
/**
 * One nav-panel row: current page (`aria-current="page"`) renders in
 * accent red at rest, everything else fades to accent red on hover/focus
 * via a color transition plus a thin underline that draws in from the
 * start edge (2026-08-13 brief, item 38).
 */
function NavLinkRow({
  href,
  active,
  size,
  onClick,
  children,
}: {
  href: string
  active: boolean
  size: 'base' | 'sub'
  onClick: () => void
  children: string
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative block font-heading no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
        size === 'base' ? 'py-1.5 text-lg font-semibold' : 'py-1 text-base font-medium',
        active ? 'text-accent-300' : 'text-white/90 group-hover:text-accent-300',
      )}
    >
      <span className="relative inline-block">
        {children}
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-x-0 -bottom-0.5 h-px origin-left rtl:origin-right bg-accent-300 transition-transform duration-300 ease-out motion-reduce:transition-none',
            active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100',
          )}
        />
      </span>
    </Link>
  )
}

export function NavMenu({ locale, links, className }: NavMenuProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const reactId = useId()
  const panelId = `${reactId}-panel`
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusables = panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus()
  }, [open])

  return (
    <div className={className}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="group flex h-11 w-11 items-center justify-center border-2 border-accent text-accent transition-colors duration-300 ease-out hover:border-niv-slate hover:text-niv-slate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span className="sr-only">{open ? dict.closeMenu[locale] : dict.openMenu[locale]}</span>
        <HamburgerTriggerIcon open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="panel"
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label={dict.openMenu[locale]}
              className="fixed end-4 top-0 z-50 flex max-h-[100vh] w-[min(360px,calc(100vw-32px))] flex-col gap-1 bg-niv-slate px-8 pb-16 pt-7 text-white"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 34px), 50% 100%, 0 calc(100% - 34px))',
              }}
              /*
               * The panel drops in from above and lands, full stop.
               *
               * It used to keyframe a bounce into the entrance — an
               * overshoot past its resting position and back. Read as too
               * much movement every single time the menu opens (2026-08-28
               * brief: "it moves too much after it comes down"), so the
               * arrival is now a clean settle with no overshoot.
               *
               * The only idle motion left is a slow, 3px sway while the
               * pointer is actually over the open panel — which is exactly
               * where the brief asked to keep it. It never runs on touch or
               * keyboard, so opening the menu is still perfectly still for
               * anyone who doesn't hover.
               */
              initial={shouldReduceMotion ? false : { y: '-105%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { y: '-105%', opacity: 0 }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                    y: [0, 3, 0, -3, 0],
                    transition: { duration: 2.4, ease: 'easeInOut', repeat: Infinity },
                  }
              }
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.62, ease: EASE, opacity: { duration: 0.4 } }
              }
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative z-10 self-end p-2 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="sr-only">{dict.closeMenu[locale]}</span>
                <CloseIcon />
              </button>
              <nav aria-label={dict.openMenu[locale]} className="relative z-10">
                <ul className="flex flex-col">
                  {links.map((link, i) => (
                    <li key={link.href} className={cn(i < links.length - 1 && 'border-b border-white/15')}>
                      <NavLinkRow href={link.href} active={pathname === link.href} size="base" onClick={() => setOpen(false)}>
                        {t(locale, link.label)}
                      </NavLinkRow>
                      {link.children && link.children.length > 0 && (
                        <ul className="flex flex-col gap-1 ps-5 pb-2">
                          {link.children.map((child) => (
                            <li key={child.href}>
                              <NavLinkRow href={child.href} active={pathname === child.href} size="sub" onClick={() => setOpen(false)}>
                                {t(locale, child.label)}
                              </NavLinkRow>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function HamburgerTriggerIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
      <motion.path
        d="M5 7h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
        style={{ transformOrigin: '50% 50%' }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
      <motion.path
        d="M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        animate={open ? { opacity: 0, x: localeAwareOffset(open) } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
      <motion.path
        d="M5 17h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
        style={{ transformOrigin: '50% 50%' }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
    </svg>
  )
}

function localeAwareOffset(open: boolean) {
  return open ? 5 : 0
}

/**
 * Trigger icon, replacing the old hamburger per the site owner's brief: a
 * bookmark/ribbon-tag shape (rectangle, V-notch cut into the bottom edge)
 * in brand slate, that (1) drops in once from above on initial mount, a
 * short one-time entrance — skipped entirely under reduced motion, (2)
 * sways a few degrees on hover in a slow, calm rotation loop (not a fast
 * bounce) that eases back to rest when the pointer leaves, and (3) carries
 * a small brand-red dot that pulses on a slow, gentle loop — same calm
 * pacing family as `EqualizerDots` (~0.5s-scale ease transitions, no
 * strobing), though built independently here (not imported) since that
 * component's own effect is tuned for its 6-dot reshuffle, not a single
 * static accent. The ribbon fills solid slate when the panel is open
 * (outline otherwise) as the only open/closed visual cue — aria-expanded
 * + the panel itself carry the actual state.
 */
// Waypoints tracing the ribbon outline's own path
// (`M6 2.5a2 2 0 0 0-2 2V21l8-4.4 8 4.4V4.5a2 2 0 0 0-2-2H6Z`, viewBox 24x24)
// — top edge, down the right edge, in to the V-notch, back out and up the
// left edge, closing the loop. Used to walk the accent dot along the
// ribbon's own outline on hover, rather than animating an abstract path.
const RIBBON_WAYPOINTS: { cx: number; cy: number }[] = [
  { cx: 12, cy: 8.6 }, // rest position (top edge, centered) — matches the pre-hover dot exactly
  { cx: 18, cy: 3 },
  { cx: 20, cy: 12 },
  { cx: 20, cy: 21 },
  { cx: 12, cy: 16.5 },
  { cx: 4, cy: 21 },
  { cx: 4, cy: 12 },
  { cx: 6, cy: 3 },
  { cx: 12, cy: 8.6 }, // back to rest
]

function BookmarkTriggerIcon({ open }: { open: boolean }) {
  const shouldReduceMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="17"
      height="21"
      style={{ transformOrigin: '50% 4%' }}
      initial={shouldReduceMotion ? false : { y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: EASE }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              rotate: [0, -6, 5, -3, 0],
              transition: { duration: 1.6, ease: 'easeInOut', repeat: Infinity },
            }
      }
    >
      <motion.path
        d="M6 2.5a2 2 0 0 0-2 2V21l8-4.4 8 4.4V4.5a2 2 0 0 0-2-2H6Z"
        stroke="var(--niv-slate)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        // Literal rgba (not var(--niv-slate)) — motion tweens color by
        // interpolating channel values and can't resolve a CSS custom
        // property mid-animation, only a real color string. #314451 is
        // --niv-slate's value (see src/styles/globals.css).
        animate={{ fill: open ? 'rgba(49,68,81,1)' : 'rgba(49,68,81,0)' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      <motion.circle
        r="1.35"
        fill="var(--color-accent)"
        // Resting state: a slow, calm opacity pulse in place — same pacing
        // family as EqualizerDots. On hover it instead walks the ribbon's
        // own outline (RIBBON_WAYPOINTS) once, then settles back; opacity
        // stays fixed while traveling so the dot itself reads as steady
        // motion along the line rather than a flicker.
        animate={
          shouldReduceMotion
            ? { cx: 12, cy: 8.6, opacity: 1 }
            : hovered
              ? {
                  cx: RIBBON_WAYPOINTS.map((p) => p.cx),
                  cy: RIBBON_WAYPOINTS.map((p) => p.cy),
                  opacity: 1,
                }
              : { cx: 12, cy: 8.6, opacity: [1, 0.35, 1] }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : hovered
              ? { duration: 1.9, ease: 'linear' }
              : { duration: 1.8, ease: 'easeInOut', repeat: Infinity }
        }
      />
    </motion.svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
