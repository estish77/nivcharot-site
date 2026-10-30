import type { ReactNode } from 'react'

/** Film-grain texture laid over a dark band (the reference site's paper/film feel) — a ~5% noise layer, never intercepts clicks. */
export function GrainBand({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate">
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  )
}
