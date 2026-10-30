'use client'

import { useRef } from 'react'
import type { ReactNode } from 'react'

/**
 * A soft pool of brand-red light that follows the cursor inside every
 * `.niv-cell` card in its subtree (the cards of the goal section, etc.).
 * Event delegation on one wrapper: the existing cards are untouched, they
 * just get `--mx/--my` set on them while the pointer is over them.
 */
export function SpotlightScope({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return
    const cell = (e.target as HTMLElement).closest<HTMLElement>('.niv-cell')
    if (!cell) return
    const r = cell.getBoundingClientRect()
    cell.style.setProperty('--mx', `${e.clientX - r.left}px`)
    cell.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div ref={ref} className="v2-spot" onPointerMove={onMove}>
      <style>{`
        .v2-spot .niv-cell {
          background-image: radial-gradient(380px circle at var(--mx, -999px) var(--my, -999px), rgba(216,37,47,.10), transparent 62%);
          transition: transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s;
        }
        .v2-spot .niv-cell:hover { box-shadow: 0 24px 40px -28px rgba(49,68,81,.45); }
      `}</style>
      {children}
    </div>
  )
}
