'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'
import type { ComponentType } from 'react'

import { useReducedMotion } from '@/lib/useReducedMotion'

/** Wrapper tags Reveal is allowed to render as. */
export type RevealTag = 'div' | 'section' | 'li' | 'article'

export type RevealProps = HTMLMotionProps<'div'> & {
  /** Host element to render. @default 'div' */
  as?: RevealTag
  /** Position within a staggered group — each step adds a 90ms delay. */
  index?: number
}

const EASE = [0.22, 0.61, 0.36, 1] as const
const DURATION_S = 0.7
const STAGGER_STEP_S = 0.09

/**
 * Safety-net timeout (2026-08-15): if `whileInView`'s IntersectionObserver
 * hasn't fired by the time this elapses, reveal anyway. Found via real
 * headless-browser testing (not just server-rendered HTML, which always
 * looks fine since it never runs the animation) that on a long page — the
 * Media page, ~24,000px tall — every `Reveal` past the first one could get
 * stuck at its `initial` opacity:0 forever: real, visible content the DOM
 * genuinely contains, permanently invisible to an actual visitor. Root
 * cause not fully pinned down (viewport-margin math on a very tall page,
 * timing against the now-sticky Header, or a Motion/IntersectionObserver
 * edge case), but relying solely on the observer firing is inherently
 * fragile — this makes the failure mode impossible instead of chasing the
 * exact trigger. `animate` outranks `whileInView` in Motion's variant
 * priority, so once `revealed` flips true (from either the observer or
 * this timer), it wins regardless of whileInView's own state.
 */
const REVEAL_FALLBACK_MS = 1200

/**
 * The single shared scroll-reveal primitive used across every page:
 * opacity 0 + y:18 -> opacity 1 + y:0 over 0.7s (ease [0.22,0.61,0.36,1]),
 * triggered via `whileInView` (viewport margin "0px 0px -6% 0px", amount
 * 0.06) OR the fallback timer above, whichever comes first, with a 90ms
 * stagger step driven by the `index` prop.
 *
 * Honours prefers-reduced-motion via `useReducedMotion()`: instead of
 * skipping the animation props (which would change the rendered element
 * tree between motion/reduced-motion), it renders straight into the final
 * visible state (`initial={false}`) with no transition, so markup stays
 * identical either way.
 *
 * Usage: `<Reveal as="li" index={i}>...</Reveal>` for a staggered list,
 * or plain `<Reveal>...</Reveal>` (defaults to a div, index 0) for a
 * single section-level reveal.
 */
export function Reveal({ as = 'div', index = 0, transition, viewport, ...props }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()
  const [revealed, setRevealed] = useState(false)
  const revealedRef = useRef(false)

  useEffect(() => {
    if (shouldReduceMotion) return
    const timer = setTimeout(
      () => {
        if (!revealedRef.current) {
          revealedRef.current = true
          setRevealed(true)
        }
      },
      REVEAL_FALLBACK_MS + index * STAGGER_STEP_S * 1000,
    )
    return () => clearTimeout(timer)
  }, [shouldReduceMotion, index])

  // `motion` is indexed by every HTML tag name; RevealTag is a narrow
  // subset that all share the same practically-relevant prop surface as
  // 'div' (className/style/aria/data/event handlers + the motion fields
  // used below), so this single assertion keeps the component simple
  // without resorting to `any`.
  const MotionTag = motion[as] as ComponentType<HTMLMotionProps<'div'>>

  return (
    <MotionTag
      // Marks the element for the print / no-JS safety net in globals.css, which
      // forces revealed content visible. Without it, content that starts at
      // opacity 0 stays invisible whenever the animation never runs.
      data-reveal=""
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={revealed ? { opacity: 1, y: 0 } : undefined}
      onViewportEnter={() => {
        revealedRef.current = true
        setRevealed(true)
      }}
      viewport={viewport ?? { once: true, margin: '0px 0px -6% 0px', amount: 0.06 }}
      transition={
        transition ??
        (shouldReduceMotion
          ? { duration: 0 }
          : { duration: DURATION_S, ease: EASE, delay: index * STAGGER_STEP_S })
      }
      {...props}
    />
  )
}
