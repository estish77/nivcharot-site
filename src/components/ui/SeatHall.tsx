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
/**
 * Matches the `max-[640px]:` breakpoint the hall's own wrapper uses for its
 * rotated-portrait treatment below — see the rotated `<div>` wrapper in the
 * render below.
 *
 * 2026-08-29 brief: this used to match the Hero's own `max-[860px]:` column
 * collapse (and the rest of the site's mobile breakpoint), but a real iPad
 * (768px portrait) sits inside that range too — wide enough that "rotate
 * the landscape hall 90deg and render it at 200% width to fill a portrait
 * box" produced a ~689x1377px block, taller than the viewport itself. 640px
 * (the same phone cutoff `Header.tsx` and others already use) keeps that
 * treatment for genuinely narrow phones only; an iPad now gets the hall's
 * ordinary desktop-style landscape sizing, just inside the Hero's still-
 * single-column layout at that width (unrelated to this hall-specific fix).
 */
const MOBILE_BREAKPOINT_QUERY = '(max-width: 640px)'
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

/**
 * Each seat's "flung outward" point (its resting position plus a random
 * direction/distance) — used to converge the hall in on mount (entrance).
 * A same-distance reverse-entrance scroll effect was tried and reported
 * back as too much ("פיזור רחב יותר... ממש כמו בכניסה", then "זה כבר פיזור
 * חזק מידי ולא יפה") — the scroll modes below (`SeatHallScrollMode`) use
 * their own, smaller, purpose-built motion instead. Computed once at module
 * load — same shuffled arrangement all session, matching `STATIC_LIT`'s
 * stability convention.
 *
 * Real `Math.random()`, not `pseudoRandom()` (below) — 2026-08-29 fix: this
 * ran at MODULE LOAD time, once in the server process and once again in the
 * browser, on every single page load. Real `Math.random()` gives the server
 * and the client two different scatter arrangements, so the server-rendered
 * `initial={{cx: scatter.x, ...}}` markup never matched what the client
 * expected on hydration — a real, live bug (confirmed present on the actual
 * Home page, not something this brief's other changes introduced): a
 * hydration-mismatch warning plus a cascade of ~150 "attribute r: Expected
 * length, undefined" console errors on every load, the whole entrance flight
 * silently re-rendering from scratch client-side after hydration gave up on
 * it. Switched to the deterministic seeded hash below, so server and client
 * compute the identical arrangement.
 */
function generateScatter(seats: SeatPos[]): ScatterDatum[] {
  return seats.map((s, i) => {
    const angle = pseudoRandom(i * 2.13 + 1) * Math.PI * 2
    const dist = 220 + pseudoRandom(i * 4.41 + 2) * 380
    return {
      x: +(s.cx + Math.cos(angle) * dist).toFixed(1),
      y: +(s.cy + Math.sin(angle) * dist).toFixed(1),
      // Wider stagger spread (was 0-0.4s) so seats visibly converge one
      // after another into the semicircle rather than nearly all at once.
      delay: +(pseudoRandom(i * 6.65 + 3) * 0.9).toFixed(2),
    }
  })
}

const SCATTER = generateScatter(SEATS)

/**
 * Experimental hover/scroll behaviors (2026-08-29 lab brief: "אחרי שהעיגולים
 * הסתדרו, במצב הובר... יזוזו ויתפזרו עם תנועת העכבר ואז יחזרו... וכשגוללים
 * את המסך הם יפוצו למעלה ולצדדים"). Both are OFF by default (`hoverMode:
 * 'off'`, `scrollMode: 'off'`) so every existing caller (`Hero.tsx`,
 * `/hanivcheret`) renders exactly as before — these only activate where a
 * caller opts in, e.g. the comparison lab page.
 *
 * Three hover "flavors", so there's something real to compare rather than
 * one guess: `repel` pushes seats cleanly away from the pointer (a
 * fields-of-force feel), `ripple` adds a traveling wave on top of that push
 * (concentric, like water), and `jitter` replaces the clean push with a
 * per-seat shimmer/shake (a startled, lively feel). All three ease back to
 * the resting position once the pointer moves away — same spring, different
 * offset math.
 */
export type SeatHallHoverMode = 'off' | 'repel' | 'ripple' | 'jitter'

const HOVER_RADIUS = 170
const HOVER_MAX_PUSH = 46
const JITTER_MAX = 20

/**
 * Four scroll "flavors" (2026-08-29 follow-up: the first attempt reused the
 * entrance's own wide scatter distances verbatim for a symmetric "entrance
 * in reverse" feel — reported back as "too strong a scatter, not pretty".
 * These four go the other way: smaller, more deliberate motions with real
 * differences in FEEL, not just distance —
 *   - `fade`: barely moves, mostly dissolves (opacity down, not position)
 *   - `riseAway`: drifts straight up and fades, like released lanterns
 *   - `converge`: pulls inward toward the hall's own center and compresses
 *     — the only one that moves the OPPOSITE direction from a burst
 *   - `cascade`: the original modest outward push, but staggered by each
 *     seat's own x position so the dispersal visibly ripples across the
 *     hall left-to-right instead of every seat moving at once
 * All four ease back to the settled formation on scrolling back up.
 */
export type SeatHallScrollMode = 'off' | 'fade' | 'riseAway' | 'converge' | 'cascade'

/** Disperses once less than half the hall is still on screen — see the `IntersectionObserver` effect below for why this replaced a fixed scrollY pixel threshold. */
const SCROLL_VISIBLE_THRESHOLD = 0.5

type ScrollOffset = { dx: number; dy: number; delay: number; opacityMul: number }
const SCROLL_OFFSET_REST: ScrollOffset = { dx: 0, dy: 0, delay: 0, opacityMul: 1 }

function computeScrollOffset(seat: SeatPos, i: number, mode: SeatHallScrollMode): ScrollOffset {
  if (mode === 'off') return SCROLL_OFFSET_REST

  const dxFromCenter = seat.cx - 500
  const dyFromCenter = seat.cy - 470
  const r = Math.hypot(dxFromCenter, dyFromCenter) || 1
  const ux = dxFromCenter / r
  const uy = dyFromCenter / r

  switch (mode) {
    case 'fade': {
      const dist = 20 + pseudoRandom(i * 8.2 + 4) * 25
      return { dx: ux * dist, dy: uy * dist, delay: 0, opacityMul: 0.12 }
    }
    case 'riseAway': {
      const dx = (pseudoRandom(i * 9.4 + 5) - 0.5) * 40
      const dy = -(120 + pseudoRandom(i * 3.3 + 6) * 130)
      return { dx, dy, delay: 0, opacityMul: 0.25 }
    }
    case 'converge': {
      const factor = 0.55 + pseudoRandom(i * 5.9 + 7) * 0.15
      return { dx: -dxFromCenter * factor, dy: -dyFromCenter * factor, delay: 0, opacityMul: 1 }
    }
    case 'cascade': {
      const dist = 70 + pseudoRandom(i * 6.7 + 8) * 70
      const delay = (Math.abs(dxFromCenter) / 500) * 0.4
      return { dx: ux * dist, dy: uy * dist, delay, opacityMul: 1 }
    }
  }
}

/**
 * Three ways the outer-ring sentence letters can join a scroll mode's
 * dispersal (2026-08-29 follow-up: "מרחפים למעלה גם האותיות צריכות
 * להתפזר" — letters used to sit fixed in place while only the seats moved).
 * All three are no-ops (`'off'`) unless a `scrollMode` is also active — a
 * letter riding along makes no sense with nothing else moving.
 *   - `withSeats`: exactly the same offset as the seat the letter currently
 *     occupies — one unified system, letters and seats move together.
 *   - `lead`: that same offset, amplified — letters fly further/faster than
 *     the seats, reading as lighter than the dots.
 *   - `independent`: the letter's own small scatter, unrelated to its
 *     seat's motion — looks like the type is coming loose on its own.
 */
export type SeatHallLetterMode = 'off' | 'withSeats' | 'lead' | 'independent'

const LETTER_LEAD_FACTOR = 1.6

function computeLetterOffset(datum: LetterDatum, letterMode: SeatHallLetterMode, scrollMode: SeatHallScrollMode): ScrollOffset {
  if (letterMode === 'off' || scrollMode === 'off') return SCROLL_OFFSET_REST

  if (letterMode === 'independent') {
    const dxFromCenter = datum.cx - 500
    const dyFromCenter = datum.cy - 470
    const r = Math.hypot(dxFromCenter, dyFromCenter) || 1
    const dist = 90 + pseudoRandom(datum.key * 7.3 + 11) * 120
    return {
      dx: (dxFromCenter / r) * dist,
      dy: (dyFromCenter / r) * dist - (60 + pseudoRandom(datum.key * 4.1 + 12) * 80),
      delay: pseudoRandom(datum.key * 2.6 + 13) * 0.3,
      opacityMul: 1,
    }
  }

  const seatOffset = computeScrollOffset({ cx: datum.cx, cy: datum.cy }, datum.seatIdx, scrollMode)
  if (letterMode === 'lead') {
    return { ...seatOffset, dx: seatOffset.dx * LETTER_LEAD_FACTOR, dy: seatOffset.dy * LETTER_LEAD_FACTOR }
  }
  return seatOffset
}

/** Simple deterministic hash → [0,1), so `jitter` shakes reproducibly per seat+tick instead of needing `Math.random()` every frame (which would read as noise, not shimmer). */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

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
  offsetX = 0,
  offsetY = 0,
  offsetActive = false,
  offsetDelay = 0,
  opacityMul = 1,
}: {
  cx: number
  cy: number
  lit: boolean
  hidden: boolean
  entrance: boolean
  scatter: ScatterDatum
  entranceDone: boolean
  /** Hover/scroll displacement, additive on top of the resting position — always 0 until the caller's own hoverMode/scrollMode actually pushes a seat. */
  offsetX?: number
  offsetY?: number
  /**
   * Switches cx/cy from the entrance's slow staggered tween to a snappy
   * spring. MUST stay false until `entranceDone` — 2026-08-29 fix: this used
   * to be driven off hoverMode/scrollMode alone, so on a caller with
   * hoverMode="repel" (a permanently-on mode, unlike scroll) it was true
   * from the very first frame, and the entrance itself silently animated on
   * the spring instead of its own tuned tween — every seat's carefully
   * staggered "arriving one after another" flight collapsed into one
   * uniform snap (reported back as "the entrance changed, put it back").
   */
  offsetActive?: boolean
  /** Extra spring delay (seconds) — only the `cascade` scroll mode sets this, keyed to each seat's own position, so the dispersal visibly ripples rather than every seat moving at once. */
  offsetDelay?: number
  /** Multiplies the resting opacity — used by the `fade`/`riseAway` scroll modes to dissolve seats on scroll. 1 (no-op) for every real caller and for scroll modes that don't fade. */
  opacityMul?: number
}) {
  // `r` must be a valid length in the server-rendered markup and on first paint.
  // Motion only writes animated SVG attributes once it takes over on the client, so
  // driving `r` from `animate` alone emits r="undefined" and the browser rejects it.
  // Rendering the resting radius as a real attribute and starting from it
  // (`initial={false}`) keeps SSR valid while leaving state changes animated.
  const restingRadius = hidden ? 0 : lit ? 12 : 11
  const targetCx = cx + offsetX
  const targetCy = cy + offsetY

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={restingRadius}
      initial={entrance ? { cx: scatter.x, cy: scatter.y, opacity: 0 } : false}
      animate={{
        cx: targetCx,
        cy: targetCy,
        r: restingRadius,
        opacity: hidden ? 0 : opacityMul,
        fill: lit ? ACCENT : SLATE,
        scale: lit ? [null, 1.35, 1] : 1,
      }}
      transition={{
        cx: offsetActive
          ? { type: 'spring', stiffness: 170, damping: 16, delay: offsetDelay }
          : { duration: 2.1, ease: EASE, delay: scatter.delay },
        cy: offsetActive
          ? { type: 'spring', stiffness: 170, damping: 16, delay: offsetDelay }
          : { duration: 2.1, ease: EASE, delay: scatter.delay },
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

type LetterDatum = {
  key: number
  ch: string
  cx: number
  cy: number
  /** The outer-ring seat this letter currently occupies — `withSeats`/`lead` letter-dispersal modes look up that seat's own scroll offset. */
  seatIdx: number
  angleDeg: number
  on: boolean
  hot: boolean
}

const RingLetter = memo(function RingLetter({
  datum,
  onHoverStart,
  onHoverEnd,
  offsetX = 0,
  offsetY = 0,
}: {
  datum: LetterDatum
  onHoverStart: () => void
  onHoverEnd: () => void
  /** Scroll displacement, additive on top of the resting position — 0 for every real (non-lab) caller today, see `SeatHallLetterMode`. */
  offsetX?: number
  offsetY?: number
}) {
  const { ch, cx, cy, angleDeg, on, hot } = datum
  // A `translate()` folded into the SAME transform string as the existing
  // rotate/scale, animated by the SAME plain CSS `transition` below — NOT
  // Motion's `animate`/`x`/`y`. `motion.text` has no special-cased SVG
  // attribute support for `<text>`'s `x`/`y` the way `motion.circle` does
  // for `cx`/`cy`/`r` (see `SeatCircle`); asking it to animate `x`/`y`
  // anyway makes it drive them through a SEPARATE `transform:
  // translateX()/translateY()` write, which clobbers this element's own
  // rotate/scale transform outright — every letter silently lost its
  // rotation and (via a knock-on effect) stopped showing up in testing at
  // all. Plain CSS transitioning one unified transform string, like the
  // rotate/scale already did before this offset existed, has no such conflict.
  const style: CSSProperties = {
    opacity: on ? 1 : 0,
    cursor: on ? 'pointer' : 'default',
    pointerEvents: on ? 'auto' : 'none',
    transform: `translate(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px) rotate(${(90 - angleDeg).toFixed(1)}deg) ${on ? 'scale(1)' : 'scale(0.4)'}`,
    transformOrigin: `${cx}px ${cy}px`,
    transformBox: 'view-box',
    transition: 'opacity 0.32s ease-out, fill 0.14s ease-out, transform 0.4s cubic-bezier(0.22,0.61,0.36,1)',
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
  /** @default 'off' — see the doc comment above `SeatHallHoverMode`. */
  hoverMode?: SeatHallHoverMode
  /** @default 'off' — see the doc comment above `SeatHallScrollMode`. */
  scrollMode?: SeatHallScrollMode
  /** @default 'off' — see the doc comment above `SeatHallLetterMode`. Only meaningful alongside an active `scrollMode`. */
  letterMode?: SeatHallLetterMode
}

export function SeatHall({
  locale,
  ariaLabel,
  sentence,
  className,
  hoverMode = 'off',
  scrollMode = 'off',
  letterMode = 'off',
}: SeatHallProps) {
  const shouldReduceMotion = useReducedMotion()
  const reduced = shouldReduceMotion === true

  const svgRef = useRef<SVGSVGElement>(null)
  const hallRef = useRef<HallState>({ lit: {}, order: [] })
  const [, bumpHall] = useReducer((c: number) => c + 1, 0)

  // Hover displacement: a per-seat {dx, dy} offset, additive on top of the
  // resting position. Empty (every seat at its resting spot) whenever
  // `hoverMode === 'off'` — the real Home/HaNivcheret usage never touches
  // this ref at all.
  const offsetRef = useRef<Record<number, { dx: number; dy: number }>>({})
  const rippleTickRef = useRef(0)
  const [, bumpOffsets] = useReducer((c: number) => c + 1, 0)

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    if (scrollMode === 'off' || reduced) return
    const svg = svgRef.current
    if (!svg) return
    /*
     * An `IntersectionObserver` on the hall itself, not a fixed
     * `window.scrollY` pixel threshold (2026-08-29 fix: "במובייל ההעלמות
     * קורית מהר מידי, כשאני עוד במסך" — a fixed 80px threshold fires after
     * a tiny fraction of a real mobile scroll gesture, well before the hall
     * has actually scrolled out of view, since phone flicks commonly move
     * 300px+ at once).
     *
     * Visibility ratio ALONE is still wrong on mobile, though (found while
     * testing this fix): below the Hero's `max-[860px]:grid-cols-1`
     * breakpoint the hall sits BELOW the hero's text, not beside it, so on
     * page load — before scrolling at all — it already starts out mostly
     * below the fold (ratio ~0.2). A pure ratio check reads that as
     * "already scrolled past" on the very first frame. What actually
     * distinguishes "scrolled past" from "not reached yet" is DIRECTION:
     * only once the hall's own top edge has gone above the viewport's top
     * edge (`boundingClientRect.top < 0`) has anything actually been
     * scrolled away — checking ratio alone can't tell "approaching from
     * below" and "leaving above" apart, since both read as partially/not
     * visible.
     */
    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(entry.boundingClientRect.top < 0 && entry.intersectionRatio < SCROLL_VISIBLE_THRESHOLD)
      },
      { threshold: [0, SCROLL_VISIBLE_THRESHOLD, 1] },
    )
    observer.observe(svg)
    return () => observer.disconnect()
  }, [scrollMode, reduced])

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
      letterEls.push({ key: k, ch, cx: slot.seat.cx, cy: slot.seat.cy, seatIdx: slot.idx, angleDeg, on, hot: hotLetter === k })
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

      if (hoverMode !== 'off') {
        rippleTickRef.current += 1
        const tick = rippleTickRef.current
        const offsets: Record<number, { dx: number; dy: number }> = {}
        SEATS.forEach((s, i) => {
          const d = Math.hypot(s.cx - px, s.cy - py)
          if (d >= HOVER_RADIUS) return
          const strength = 1 - d / HOVER_RADIUS

          if (hoverMode === 'jitter') {
            const amp = JITTER_MAX * strength
            offsets[i] = {
              dx: (pseudoRandom(i * 13.1 + tick) - 0.5) * 2 * amp,
              dy: (pseudoRandom(i * 7.7 + tick * 1.3) - 0.5) * 2 * amp,
            }
            return
          }

          // repel + ripple both push straight away from the pointer;
          // ripple layers a traveling concentric wave on top of that push
          // (a sine keyed to distance-from-pointer and the tick counter) so
          // it reads as an outgoing ring rather than a flat cushion.
          const ux = d === 0 ? 0 : (s.cx - px) / d
          const uy = d === 0 ? 0 : (s.cy - py) / d
          const wave = hoverMode === 'ripple' ? 0.55 + 0.45 * Math.sin(d / 16 - tick * 0.5) : 1
          const push = HOVER_MAX_PUSH * strength * wave
          offsets[i] = { dx: ux * push, dy: uy * push }
        })
        offsetRef.current = offsets
        bumpOffsets()
      }
    },
    [reduced, hoverMode],
  )

  const handlePointerLeave = useCallback(() => {
    if (hoverMode === 'off') return
    offsetRef.current = {}
    bumpOffsets()
  }, [hoverMode])

  const litNow = hallRef.current.lit
  const hoverOffsets = offsetRef.current

  return (
    <div
      role="img"
      aria-label={ariaLabel[locale]}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn('relative w-full cursor-crosshair max-[640px]:aspect-[1/2] max-[640px]:overflow-hidden', className)}
    >
      {/*
        Below 640px this inner wrapper is rotated -90deg so the (otherwise
        landscape, 1000x500-viewBox) hall reads portrait on narrow screens.
        The "reserve the rotated footprint" trick: the outer `<div>` above
        reserves the FINAL portrait box (`aspect-[1/2]`), while this wrapper
        renders the SVG at its natural 2:1 landscape size at 200% width —
        exactly so that once rotated 90deg, its footprint (width becomes the
        old height, height becomes the old width) fills that portrait box.
      */}
      <div className="max-[640px]:absolute max-[640px]:left-1/2 max-[640px]:top-1/2 max-[640px]:w-[200%] max-[640px]:-translate-x-1/2 max-[640px]:-translate-y-1/2 max-[640px]:rotate-[-90deg]">
        <svg
          ref={svgRef}
          viewBox="0 0 1000 500"
          aria-hidden="true"
          focusable="false"
          className="block h-auto max-h-full w-full overflow-visible"
        >
          {SEATS.map((s, i) => {
            const hover = hoverOffsets[i]
            const burst = scrolled ? computeScrollOffset(s, i, scrollMode) : SCROLL_OFFSET_REST
            return (
              <SeatCircle
                key={i}
                cx={s.cx}
                cy={s.cy}
                lit={Boolean(litNow[i])}
                hidden={ringHidden.has(i)}
                entrance={!reduced}
                scatter={SCATTER[i]}
                entranceDone={entranceDone}
                offsetX={(hover?.dx ?? 0) + burst.dx}
                offsetY={(hover?.dy ?? 0) + burst.dy}
                offsetActive={entranceDone && (hoverMode !== 'off' || scrollMode !== 'off')}
                offsetDelay={burst.delay}
                opacityMul={burst.opacityMul}
              />
            )
          })}
          <g>
            {letters.map((datum) => {
              const letterOffset = scrolled ? computeLetterOffset(datum, letterMode, scrollMode) : SCROLL_OFFSET_REST
              return (
                <RingLetter
                  key={datum.key}
                  datum={datum}
                  onHoverStart={() => setHotLetter(datum.key)}
                  onHoverEnd={() => setHotLetter((h) => (h === datum.key ? null : h))}
                  offsetX={letterOffset.dx}
                  offsetY={letterOffset.dy}
                />
              )
            })}
          </g>
        </svg>
      </div>
    </div>
  )
}
