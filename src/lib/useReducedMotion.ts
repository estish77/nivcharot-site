'use client'

import { useEffect, useState } from 'react'

/**
 * SSR-safe replacement for motion's own `useReducedMotion` — import this
 * everywhere instead of `useReducedMotion` from 'motion/react'.
 *
 * motion's hook reads `matchMedia` synchronously inside the hook body (via
 * a lazily-run `initPrefersReducedMotion()`) and seeds `useState` from that
 * read on the very first render. On the server there's no `window`, so SSR
 * always assumes "not reduced". A real visitor whose OS actually prefers
 * reduced motion gets `true` back on their FIRST CLIENT render too — before
 * any hydration effect runs — so it disagrees with the server-rendered HTML.
 * React logs a hydration mismatch and discards the SSR markup for that
 * subtree, for exactly the users this project most needs to render
 * correctly for.
 *
 * This hook always starts at `false` on both the server and the client's
 * first render (identical output, no mismatch), then corrects itself inside
 * a `useEffect` — which only ever runs after hydration completes. Consumers
 * gating `whileInView` reveals or looping animations see the correction
 * before anything below the fold has had a chance to animate in.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}
