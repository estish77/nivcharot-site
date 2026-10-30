'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Inertial ("butter") scrolling for the preview page only — the page glides
 * to a stop instead of halting the instant the wheel does. Skipped entirely
 * for visitors who ask their OS for reduced motion, and never hijacks
 * scrolling inside the open nav menu (`role="dialog"`) or any inner
 * scrollable box.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      anchors: { offset: -96 },
      prevent: (node) => !!node.closest?.('[role="dialog"], [data-lenis-prevent], .overflow-y-auto, .overflow-auto'),
    })
    return () => lenis.destroy()
  }, [])

  return (
    <style>{`
      html.lenis, html.lenis body { height: auto; }
      .lenis.lenis-smooth { scroll-behavior: auto !important; }
      .lenis.lenis-stopped { overflow: clip; }
    `}</style>
  )
}
