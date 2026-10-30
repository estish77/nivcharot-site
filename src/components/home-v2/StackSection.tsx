'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

import { useReducedMotion } from '@/lib/useReducedMotion'

/**
 * The "strip covers the strip beneath it" scroll effect (same technique as
 * the reference site): each band is wrapped in a sticky container with a
 * higher z-index than the one before it. Scrolling past a band doesn't move
 * it away - it stays pinned while the NEXT band slides up and covers it, with
 * a soft shadow along the covering band's top edge.
 *
 * A band taller than the screen can't be pinned by its top (you'd never see
 * its lower half), so its `top` is set to `viewport height - band height`
 * (negative): it scrolls until its bottom edge reaches the bottom of the
 * screen, and only then stops and waits to be covered. Recomputed on resize.
 *
 * `last` bands (the one just before the footer) stay in normal flow.
 * Reduced-motion visitors get plain, unpinned bands.
 */
export function StackSection({
  children,
  z,
  shadow = true,
  last = false,
}: {
  children: ReactNode
  /** Stacking order - every band must be higher than the previous one. */
  z: number
  /** Soft shadow on the band's top edge, cast onto the band it covers. */
  shadow?: boolean
  last?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const pinned = !last && !reduced

  useEffect(() => {
    const el = ref.current
    if (!el || !pinned) return
    const apply = () => {
      el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    window.addEventListener('resize', apply)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', apply)
    }
  }, [pinned])

  return (
    <div
      ref={ref}
      className="bg-bg"
      style={{
        position: pinned ? 'sticky' : 'relative',
        top: 0,
        zIndex: z,
        boxShadow: shadow ? '0 -28px 60px -34px rgba(49,68,81,0.5)' : undefined,
      }}
    >
      {children}
    </div>
  )
}
