'use client'

import { memo, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'

import { cn } from './cn'
import type { Locale, Localized } from '@/lib/i18n'

/**
 * The Knesset seat hall. Shared by the home hero and `/hanivcheret`, which
 * is why it lives here rather than under `home/` — /hanivcheret used to
 * carry its own cut-down copy (ambient light-up only, no entrance, no
 * pointer interaction, no ring sentence) and the 2026-08-28 brief asked
 * for the animated element there too, so the two have been folded into
 * this one.
 *
 * Ported from "Home copy.dc.html"'s `__hallInit`/`moveHall` (source lines
 * ~457-669): a 1000x500 semicircular "Knesset hall" of 156 seats that light
 * up as the pointer roams nearby, drift on their own between interactions,
 * and — on the outermost ring of 30 — spell out a rotating sentence letter
 * by letter, one seat retiring back into a circle for every letter that
 * lights up.
 *
 * Geometry: 8 rings at r = 140..455 (step 45), seat count per ring
 * `round(pi*r/47)`, laid out across a semicircle (`a = pi - (i/(n-1))*pi`)
 * — reproduces the mockup's generator exactly and lands on the same 156
 * total. Pointer handling: client coords are mapped into the 1000x500
 * viewBox, the 3 nearest unlit seats within radius 110 light up, and once
 * the lit count hits 50% of the total, each newly-lit seat retires the
 * oldest one (a small FIFO order, mirroring `litOrder` in the source).
 *
 * The mockup's `nivSeat`/`nivSeatPop` `@keyframes` (accent flash + a scale
 * "pop") are defined in its stylesheet but never actually wired to any
 * element the generator renders — the live effect there is a plain CSS
 * transition on fill/r/opacity. This port reproduces that transition
 * faithfully via `motion.circle`, and adds a genuine one-shot scale bounce
 * on every seat that newly lights up (`[null, 1.35, 1]`, matching
 * `nivSeatPop`'s curve) for the flourish the keyframes evidently intended.
 * Two more `@keyframes` bodies in the source file are truncated (their
 * `@keyframes name {` opening lines are missing, leaving orphaned
 * percentage blocks) and unrecoverable — not ported.
 *
 * Two real defects fixed vs. the mockup: (1) `aria-label=""` on the
 * `role="img"` wrapper — replaced with a real bilingual description; (2)
 * the mockup only listens for `onMouseMove`/`onMouseEnter`, so anyone
 * without a mouse (touch, pen, keyboard-only) only ever saw the idle
 * animation with zero interactivity — this version uses Pointer Events
 * (mouse + touch + pen alike) instead, and keeps the ambient idle-light
 * loop (already pointer-independent in the source) always running as the
 * non-pointer fallback. `prefers-reduced-motion` gets a single frozen,
 * deterministic seat pattern and no timers at all, matching the site's
 * global reduced-motion convention.
 */

const RING_RADII = [140, 185, 230, 275, 320, 365, 410, 455] as const
const RING_SIZE = 30
const RING_SHIFT = 2
const LIGHT_RADIUS = 110
/** Matches the `max-[860px]:` breakpoint the hall's own wrapper (and the rest of the site) uses for its mobile layout — see the rotated `<div>` wrapper in the render below. */
const MOBILE_BREAKPOINT_QUERY = '(max-width: 860px)'
const AMBIENT_INTERVAL_MS = 1100
const LETTER_INTERVAL_MS = 130
const LETTER_HOLD_TICKS = 22

/** Motion needs concrete colors to interpolate a smooth flash — `var(--color-accent)`/`var(--niv-slate)` (opaque strings to a color-interpolation engine) can't be cross-faded, so the two design tokens' literal hex values are used here instead of their CSS custom properties. */
const SLATE = '#314451'
const ACCENT = '#d8252f'
const EASE = [0.22, 0.61, 0.36, 1] as const
const SEAT_STYLE: CSSProperties = { transformOrigin: 'center', transformBox: 'fill-box' } as CSSProperties

type SeatPos = { cx: number; cy: number }

function generateSeats(): SeatPos[] {
  const seats: SeatPos[] = []
  for (const r of RING_RADII) {
    const n = Math.round((Math.PI * r) / 47)
    for (let i = 0; i < n; i++) {
      const a = Math.PI - (i / (n - 1)) * Math.PI
      seats.push({
        cx: +(500 + Math.cos(a) * r).toFixed(1),
        cy: +(470 - Math.sin(a) * r).toFixed(1),
      })
    }
  }
  return seats
}

const SEATS = generateSeats()
const TOTAL_SEATS = SEATS.length
const CAP = Math.floor(TOTAL_SEATS * 0.5)
const OUTER_START = Math.max(0, TOTAL_SEATS - RING_SIZE)

type ScatterDatum = { x: number; y: number; delay: number }

/** Entrance-only: each seat's "flung outward" starting point (its resting position plus a random direction/distance), used to converge the hall in on mount. Computed once at module load — same shuffled arrangement all session, matching `STATIC_LIT`'s stability convention. */
function generateScatter(seats: SeatPos[]): ScatterDatum[] {
  return seats.map((s) => {
    const angle = Math.random() * Math.PI * 2
    const dist = 220 + Math.random() * 380
    return {
      x: +(s.cx + Math.cos(angle) * dist).toFixed(1),
      y: +(s.cy + Math.sin(angle) * dist).toFixed(1),
      // Wider stagger spread (was 0-0.4s) so seats visibly converge one
      // after another into the semicircle rather than nearly all at once.
      delay: +(Math.random() * 0.9).toFixed(2),
    }
  })
}

const SCATTER = generateScatter(SEATS)
// Was 0.9s cx/cy + up to 0.4s stagger (ENTRANCE_MS 1300) — the whole hall
// assembled almost as fast as it faded in, reading as a snap rather than a
// deliberate gathering into the semicircle. Slower flight (0.9s -> 2.1s)
// plus the wider stagger above (up to 0.9s) is meant to read as seats
// genuinely arriving one after another; ENTRANCE_MS tracks the new
// worst-case total (2.1 + 0.9 = 3.0s) so `entranceDone` still flips only
// once every seat has actually finished landing.
const ENTRANCE_MS = 3000

/** Deterministic (non-random) pattern shown under prefers-reduced-motion — same on every render, no timers. */
const STATIC_LIT: ReadonlySet<number> = new Set(SEATS.map((_, i) => i).filter((i) => i % 5 === 0))

type LitMap = Record<number, true>
type HallState = { lit: LitMap; order: number[] }

const SeatCircle = memo(function SeatCircle({
  cx,
  cy,
  lit,
  hidden,
  entrance,
  scatter,
  entranceDone,
}: {
  cx: number
  cy: number
  lit: boolean
  hidden: boolean
  entrance: boolean
  scatter: ScatterDatum
  entranceDone: boolean
}) {
  // `r` must be a valid length in the server-rendered markup and on first paint.
  // Motion only writes animated SVG attributes once it takes over on the client, so
  // driving `r` from `animate` alone emits r="undefined" and the browser rejects it.
  // Rendering the resting radius as a real attribute and starting from it
  // (`initial={false}`) keeps SSR valid while leaving state changes animated.
  const restingRadius = hidden ? 0 : lit ? 12 : 11

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={restingRadius}
      initial={entrance ? { cx: scatter.x, cy: scatter.y, opacity: 0 } : false}
      animate={{
        cx,
        cy,
        r: restingRadius,
        opacity: hidden ? 0 : 1,
        fill: lit ? ACCENT : SLATE,
        scale: lit ? [null, 1.35, 1] : 1,
      }}
      transition={{
        cx: { duration: 2.1, ease: EASE, delay: scatter.delay },
        cy: { duration: 2.1, ease: EASE, delay: scatter.delay },
        r: { duration: 0.32, ease: EASE },
        // Reuses the same slower, staggered timing for any opacity change that lands mid-entrance
        // (e.g. a seat getting claimed by a ring letter before it's finished flying in); once
        // `entranceDone` flips, later lit/hidden toggles get the original snappy fade back.
        opacity: entranceDone ? { duration: 0.28, ease: 'easeOut' } : { duration: 0.7, ease: 'easeOut', delay: scatter.delay },
        fill: { duration: 0.55, ease: EASE },
        scale: { duration: 0.5, ease: EASE },
      }}
      style={SEAT_STYLE}
    />
  )
})

type LetterDatum = { key: number; ch: string; cx: number; cy: number; angleDeg: number; on: boolean; hot: boolean }

const RingLetter = memo(function RingLetter({
  datum,
  onHoverStart,
  onHoverEnd,
}: {
  datum: LetterDatum
  onHoverStart: () => void
  onHoverEnd: () => void
}) {
  const { ch, cx, cy, angleDeg, on, hot } = datum
  const style: CSSProperties = {
    opacity: on ? 1 : 0,
    cursor: on ? 'pointer' : 'default',
    pointerEvents: on ? 'auto' : 'none',
    transform: `rotate(${(90 - angleDeg).toFixed(1)}deg) ${on ? 'scale(1)' : 'scale(0.4)'}`,
    transformOrigin: `${cx}px ${cy}px`,
    transformBox: 'view-box',
    transition: 'opacity 0.32s ease-out, fill 0.14s ease-out, transform 0.32s cubic-bezier(0.22,0.61,0.36,1)',
  } as CSSProperties
  return (
    <text
      x={cx}
      y={cy + 12}
      textAnchor="middle"
      fontFamily="var(--font-heading)"
      fontSize={34}
      fontWeight={800}
      fill={hot ? ACCENT : SLATE}
      onPointerEnter={on ? onHoverStart : undefined}
      onPointerLeave={on ? onHoverEnd : undefined}
      style={style}
    >
      {ch}
    </text>
  )
})

export type SeatHallProps = {
  locale: Locale
  ariaLabel: Localized
  sentence: Localized
  className?: string
}

export function SeatHall({ locale, ariaLabel, sentence, className }: SeatHallProps) {
  const shouldReduceMotion = useReducedMotion()
  const reduced = shouldReduceMotion === true

  const svgRef = useRef<SVGSVGElement>(null)
  const hallRef = useRef<HallState>({ lit: {}, order: [] })
  const [, bumpHall] = useReducer((c: number) => c + 1, 0)

  // Gates the seat circles' opacity-transition timing back to normal once the
  // scattered-dots entrance (see `SeatCircle`) has finished converging.
  const [entranceDone, setEntranceDone] = useState(reduced)
  useEffect(() => {
    if (reduced) return
    const id = window.setTimeout(() => setEntranceDone(true), ENTRANCE_MS)
    return () => window.clearTimeout(id)
  }, [reduced])

  const [letterState, setLetterState] = useState<{ letterN: number; outSet: Record<number, true> }>({
    letterN: 0,
    outSet: {},
  })
  const [hotLetter, setHotLetter] = useState<number | null>(null)

  // Ambient seat-lighting: seeds an initial cluster, then drifts on a timer
  // (drain near the cap, top up when sparse) — independent of the pointer.
  useEffect(() => {
    if (reduced) {
      const seed: LitMap = {}
      STATIC_LIT.forEach((i) => {
        seed[i] = true
      })
      hallRef.current = { lit: seed, order: [] }
      bumpHall()
      return
    }

    const seed: LitMap = {}
    while (Object.keys(seed).length < 4) {
      seed[Math.floor(Math.random() * TOTAL_SEATS)] = true
    }
    hallRef.current = { lit: seed, order: [] }
    bumpHall()

    const id = window.setInterval(() => {
      const current = hallRef.current.lit
      const next = { ...current }
      const keys = Object.keys(next)
      let changed = true
      if (keys.length >= CAP) {
        const drain = 3 + Math.floor(Math.random() * 3)
        for (let k = 0; k < drain && keys.length; k++) {
          const j = Math.floor(Math.random() * keys.length)
          delete next[Number(keys[j])]
          keys.splice(j, 1)
        }
      } else if (keys.length < 4) {
        next[Math.floor(Math.random() * TOTAL_SEATS)] = true
      } else if (keys.length < 7 && Math.random() < 0.3) {
        next[Math.floor(Math.random() * TOTAL_SEATS)] = true
      } else if (keys.length > 7 && Math.random() < 0.2) {
        delete next[Number(keys[Math.floor(Math.random() * keys.length)])]
      } else {
        changed = false
      }
      if (changed) {
        hallRef.current = { lit: next, order: hallRef.current.order.filter((k) => next[k]) }
        bumpHall()
      }
    }, AMBIENT_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [reduced])

  // Outer-ring "typewriter" sentence: reveals a letter every tick, holds,
  // then dissolves back into seats in random order before looping.
  useEffect(() => {
    setHotLetter(null)
    if (reduced) {
      setLetterState({ letterN: 0, outSet: {} })
      return
    }
    const sentenceText = sentence[locale]
    const tick = { letterN: 0, hold: 0, queue: null as number[] | null, outSet: {} as Record<number, true> }
    setLetterState({ letterN: 0, outSet: {} })

    const id = window.setInterval(() => {
      if (tick.letterN < sentenceText.length) {
        tick.letterN += 1
      } else {
        tick.hold += 1
        if (tick.hold >= LETTER_HOLD_TICKS) {
          if (!tick.queue) {
            const q: number[] = []
            for (let k = 0; k < sentenceText.length; k++) if (sentenceText[k] !== ' ') q.push(k)
            for (let i = q.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1))
              const t = q[i]
              q[i] = q[j]
              q[j] = t
            }
            tick.queue = q
          }
          if (tick.queue.length) {
            const next = tick.queue.shift() as number
            tick.outSet = { ...tick.outSet, [next]: true }
          } else {
            tick.letterN = 0
            tick.hold = 0
            tick.queue = null
            tick.outSet = {}
          }
        }
      }
      setLetterState({ letterN: tick.letterN, outSet: tick.outSet })
    }, LETTER_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [reduced, locale, sentence])

  // Hebrew reads right-to-left along the arc; English left-to-right.
  const ring = useMemo(() => {
    const outer: { seat: SeatPos; idx: number }[] = []
    for (let i = OUTER_START; i < TOTAL_SEATS; i++) outer.push({ seat: SEATS[i], idx: i })
    const ordered = locale === 'he' ? outer.slice().reverse() : outer
    return ordered.slice(RING_SHIFT)
  }, [locale])

  const sentenceText = sentence[locale]

  const { ringHidden, letters } = useMemo(() => {
    const hidden = new Set<number>()
    const letterEls: LetterDatum[] = []
    const shown = letterState.letterN
    const { outSet } = letterState
    const max = Math.min(sentenceText.length, ring.length)
    for (let k = 0; k < max; k++) {
      const ch = sentenceText[k]
      if (ch === ' ') continue
      const slot = ring[k]
      const on = k < shown && !outSet[k]
      if (on) hidden.add(slot.idx)
      const angleDeg = (Math.atan2(470 - slot.seat.cy, slot.seat.cx - 500) * 180) / Math.PI
      letterEls.push({ key: k, ch, cx: slot.seat.cx, cy: slot.seat.cy, angleDeg, on, hot: hotLetter === k })
    }
    return { ringHidden: hidden, letters: letterEls }
  }, [ring, sentenceText, letterState, hotLetter])

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (reduced) return
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      // Below the mobile breakpoint the whole hall is rotated -90deg (CSS,
      // see the wrapper `<div>` below) so it reads portrait instead of
      // landscape. `getBoundingClientRect()` already reflects that rotated
      // (swapped width/height) box, but mapping a pointer point back into
      // the *unrotated* 1000x500 viewBox needs the inverse of that rotation,
      // not the plain unrotated fraction-of-width/height math below.
      let px: number
      let py: number
      if (window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches) {
        const cx = e.clientX - rect.left - rect.width / 2
        const cy = e.clientY - rect.top - rect.height / 2
        px = 500 - cy * (1000 / rect.height)
        py = 250 + cx * (500 / rect.width)
      } else {
        px = ((e.clientX - rect.left) / rect.width) * 1000
        py = ((e.clientY - rect.top) / rect.height) * 500
      }

      const { lit: current, order: currentOrder } = hallRef.current
      const next = { ...current }
      const order = currentOrder.filter((k) => next[k])
      Object.keys(next).forEach((k) => {
        const num = Number(k)
        if (!order.includes(num)) order.push(num)
      })
      const dark: { i: number; d: number }[] = []
      SEATS.forEach((s, i) => {
        if (next[i]) return
        const d = Math.hypot(s.cx - px, s.cy - py)
        if (d < LIGHT_RADIUS) dark.push({ i, d })
      })
      if (!dark.length) return
      dark.sort((a, b) => a.d - b.d)
      const take = Math.min(dark.length, 3)
      for (let k = 0; k < take; k++) {
        const idx = dark[k].i
        next[idx] = true
        order.push(idx)
        while (order.length > CAP) {
          const gone = order.shift()
          if (gone !== undefined) delete next[gone]
        }
      }
      hallRef.current = { lit: next, order }
      bumpHall()
    },
    [reduced],
  )

  const litNow = hallRef.current.lit

  return (
    <div
      role="img"
      aria-label={ariaLabel[locale]}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerMove}
      className={cn('relative w-full cursor-crosshair max-[860px]:aspect-[1/2] max-[860px]:overflow-hidden', className)}
    >
      {/*
        Below 860px this inner wrapper is rotated -90deg so the (otherwise
        landscape, 1000x500-viewBox) hall reads portrait on narrow screens.
        The "reserve the rotated footprint" trick: the outer `<div>` above
        reserves the FINAL portrait box (`aspect-[1/2]`), while this wrapper
        renders the SVG at its natural 2:1 landscape size at 200% width —
        exactly so that once rotated 90deg, its footprint (width becomes the
        old height, height becomes the old width) fills that portrait box.
      */}
      <div className="max-[860px]:absolute max-[860px]:left-1/2 max-[860px]:top-1/2 max-[860px]:w-[200%] max-[860px]:-translate-x-1/2 max-[860px]:-translate-y-1/2 max-[860px]:rotate-[-90deg]">
        <svg
          ref={svgRef}
          viewBox="0 0 1000 500"
          aria-hidden="true"
          focusable="false"
          className="block h-auto max-h-full w-full overflow-visible"
        >
          {SEATS.map((s, i) => (
            <SeatCircle
              key={i}
              cx={s.cx}
              cy={s.cy}
              lit={Boolean(litNow[i])}
              hidden={ringHidden.has(i)}
              entrance={!reduced}
              scatter={SCATTER[i]}
              entranceDone={entranceDone}
            />
          ))}
          <g>
            {letters.map((datum) => (
              <RingLetter
                key={datum.key}
                datum={datum}
                onHoverStart={() => setHotLetter(datum.key)}
                onHoverEnd={() => setHotLetter((h) => (h === datum.key ? null : h))}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
