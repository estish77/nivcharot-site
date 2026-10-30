'use client'

import { useEffect } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'

/**
 * Page-level scroll effects for the preview:
 *  - a thin brand-red progress line pinned to the very top of the screen
 *  - a smart header: slides away while reading downwards, returns the moment
 *    you scroll up (a few px of tolerance so a trembling trackpad doesn't
 *    make it flicker). Done with a data-attribute on <html> + CSS so the
 *    existing Header component doesn't need to change at all.
 */
export function PageFx() {
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('v2-fx')
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y > 360 && y > last + 5) root.dataset.v2Header = 'hidden'
      else if (y < last - 5 || y <= 360) delete root.dataset.v2Header
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      delete root.dataset.v2Header
      root.classList.remove('v2-fx')
    }
  }, [])

  return (
    <>
      <style>{`
        body > header, #__next > header, header.sticky { transition: transform .45s cubic-bezier(.22,1,.36,1); }
        html[data-v2-header="hidden"] header.sticky { transform: translateY(-110%); }
        @media (prefers-reduced-motion: reduce) { html[data-v2-header="hidden"] header.sticky { transform: none; } }

        /* Buttons: lift on hover, a light sheen sweeps across, press-in on click */
        .v2-fx main .btn {
          position: relative; overflow: hidden; isolation: isolate;
          transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s, background-color .2s, color .2s;
        }
        .v2-fx main .btn::after {
          content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none;
          background: linear-gradient(110deg, transparent 35%, rgba(255,255,255,.38) 50%, transparent 65%);
          transform: translateX(-130%); transition: transform .8s cubic-bezier(.22,1,.36,1);
        }
        .v2-fx main .btn:hover, .v2-fx main .btn:focus-visible {
          transform: translateY(-3px); box-shadow: 0 14px 22px -12px rgba(49,68,81,.5);
        }
        .v2-fx main .btn:hover::after, .v2-fx main .btn:focus-visible::after { transform: translateX(130%); }
        .v2-fx main .btn:active { transform: translateY(0) scale(.97); transition-duration: .1s; }

        /* Card links: nudge toward their arrow on hover */
        .v2-fx main .niv-cell a { transition: transform .35s cubic-bezier(.22,1,.36,1); }
        .v2-fx main .niv-cell a:hover { transform: translateX(-6px); }
        html[dir="ltr"].v2-fx main .niv-cell a:hover { transform: translateX(6px); }

        /* Section titles unroll out of a mask as they scroll into view (scroll-driven, pure CSS) */
        @supports (animation-timeline: view()) {
          @media (prefers-reduced-motion: no-preference) {
            .v2-fx main h2 { animation: v2-mask linear both; animation-timeline: view(); animation-range: entry 5% entry 55%; }
            @keyframes v2-mask {
              from { clip-path: inset(0 0 100% 0); transform: translateY(36px); }
              to { clip-path: inset(-10% -2% -10% -2%); transform: none; }
            }
          }
        }
      `}</style>
      {reduced ? null : (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-[0%_50%] bg-accent rtl:origin-[100%_50%]"
          style={{ scaleX: progress }}
        />
      )}
    </>
  )
}
