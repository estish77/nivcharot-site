'use client'

import { motion, useScroll, useSpring } from 'motion/react'
import { useRef, type ReactNode } from 'react'

import { useReducedMotion } from '@/lib/useReducedMotion'

/**
 * A rail across the top of the home timeline that fills as you scroll
 * through the section (2026-08-28 brief: "do something interesting on
 * scroll" for the timeline, with gentle element animation).
 *
 * Scroll-linked rather than a one-shot entrance: it gives the section a
 * sense of travel through the years as you move down the page, which a
 * fade-in can't. The per-cell content still uses `Reveal`, so its stagger
 * keeps that component's IntersectionObserver safety net — this rail
 * deliberately doesn't rely on `whileInView` at all, so it can only ever
 * be decorative and can never leave content invisible if the observer
 * misbehaves on a long page (see Reveal.tsx's note on exactly that bug).
 *
 * Under reduced motion the rail simply renders full, with no spring.
 */
export function TimelineTrack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Starts filling as the section rises into view and completes a little
  // before it leaves, so the fill finishes while the years are still on
  // screen rather than racing off the top.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] })
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 })

  return (
    <div ref={ref}>
      <div aria-hidden="true" className="mb-7 h-[2px] w-full bg-divider">
        <motion.div
          className="h-full w-full origin-left bg-accent rtl:origin-right"
          style={shouldReduceMotion ? { scaleX: 1 } : { scaleX }}
        />
      </div>
      {children}
    </div>
  )
}
