'use client'

import { useMemo, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type Variants } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'

import { cn } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import type { TimelineMilestone } from '@/content/story'

// Motion needs concrete colors to interpolate the per-letter sweep — a
// `var(--color-*)` reference doesn't animate smoothly through Motion's color
// interpolator — so these inline the design tokens' known hex values,
// matching the convention already used in components/podcast/StoriesStrip.tsx
// and components/home/SeatHall.tsx.
const TITLE_COLOR_INACTIVE = '#4b5661' // --color-neutral-800
const TITLE_COLOR_ACTIVE = '#971a21' // --color-accent-700

// Per-letter stagger: each letter's own transition is ~0.3s, offset from
// its neighbor by ~22ms, so a title sweeps fully red in roughly
// (letterCount * 0.022 + 0.3)s — for a ~30-character Hebrew heading that's
// under 1s, quick enough to read as "driven by this row becoming active"
// rather than a separate, disconnected animation.
const LETTER_STAGGER_S = 0.022
const LETTER_ACTIVE_DURATION_S = 0.3
// Leaving the active row resets color WITHOUT the letter-by-letter sweep:
// re-running the staggered reveal in reverse every time the user scrolls
// past a row (which can happen many times a second while flicking through
// the list) would read as chattery/busy, so inactive rows fade back to the
// resting color as one quick, uniform block instead.
const LETTER_INACTIVE_DURATION_S = 0.18

const titleGroupVariants: Variants = {
  inactive: { transition: { staggerChildren: 0 } },
  active: { transition: { staggerChildren: LETTER_STAGGER_S } },
}

const titleLetterVariants: Variants = {
  inactive: { color: TITLE_COLOR_INACTIVE, transition: { duration: LETTER_INACTIVE_DURATION_S, ease: 'easeIn' } },
  active: { color: TITLE_COLOR_ACTIVE, transition: { duration: LETTER_ACTIVE_DURATION_S, ease: 'easeOut' } },
}

export type TimelineProps = {
  locale: Locale
  milestones: TimelineMilestone[]
  /** "ציר הזמן" / "TIMELINE" — the small eyebrow label above the year counter, both desktop and mobile. */
  sidebarLabel: string
}

/**
 * The scroll-driven timeline the mockups implement with a missing
 * `timeline-scroll.js`: a sticky year/progress sidebar on desktop, driven
 * here by `useScroll`+`useSpring`+`useTransform` against the row list
 * instead of the original's imperative DOM script.
 *
 * `milestones` is the FULL fixture list (up to 21 rows) — this component
 * filters to `visible[locale]` itself, so it always renders the right
 * count per language (21 in Hebrew, 14 in English) and every index/total
 * below is computed from that filtered, locale-correct list.
 *
 * Below 861px the desktop sidebar has nothing to stick to usefully, so
 * this renders a genuinely different mobile treatment instead of just
 * hiding it: a sticky compact status bar (current year + count + one
 * progress dot per milestone) sits above the row list, and each row's own
 * year marker shrinks and stays inline rather than moving to a rail.
 */
export function Timeline({ locale, milestones, sidebarLabel }: TimelineProps) {
  const items = useMemo(() => milestones.filter((m) => t(locale, m.visible)), [milestones, locale])
  const total = items.length

  const listRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 0.3', 'end 0.75'],
  })

  const progress = useSpring(scrollYProgress, shouldReduceMotion ? { stiffness: 1000, damping: 100 } : { stiffness: 210, damping: 32 })

  const indexMV = useTransform(progress, (v) => Math.min(total - 1, Math.max(0, Math.floor(v * total))))
  const [activeIndex, setActiveIndex] = useState(0)
  useMotionValueEvent(indexMV, 'change', (v) => setActiveIndex(v))

  const barHeight = useTransform(progress, (v) => `${Math.round(Math.min(1, Math.max(0, v)) * 100)}%`)

  const activeItem = items[activeIndex]
  const activeYear = activeItem ? t(locale, activeItem.year) : ''

  return (
    <div>
      {/* Mobile status bar: replaces the desktop sticky sidebar below 861px
          with a real, purpose-built mobile design (not a hidden leftover) —
          current year, count, and one progress dot per milestone. */}
      {/*
        top-[106px], not top-0: `Header` (src/components/ui/Header.tsx) is
        now itself `sticky top-0` site-wide, so this bar has to sit BELOW
        it, not compete for the same spot. 106px = the header's own fixed
        rendered height (18px padding block-start/end + the 70px-tall
        Hebrew logo, its tallest child) — stable across viewports since
        Header only wraps at widths far narrower than this section's own
        861px breakpoint.
      */}
      <div className="sticky top-[106px] z-10 mb-1 flex flex-col gap-2 border-b-2 border-divider bg-bg py-3 min-[861px]:hidden">
        <div className="flex items-baseline justify-between gap-3">
          <p className="m-0 font-heading text-[11px] font-extrabold tracking-[0.1em] text-neutral-700">{sidebarLabel}</p>
          <span dir="ltr" className="font-heading text-[12px] font-extrabold tracking-[0.06em] text-neutral-700">
            {`${activeIndex + 1} / ${total}`}
          </span>
        </div>
        <div className="font-heading text-[32px] font-extrabold leading-none text-accent-700">{activeYear}</div>
        <div className="flex flex-wrap gap-[6px]" aria-hidden="true">
          {items.map((item, i) => (
            <span
              key={item.id}
              className={cn(
                'h-[5px] w-[5px] flex-none rounded-full transition-[transform,background-color] duration-300 ease-out',
                i === activeIndex ? 'scale-[1.7] bg-accent' : 'bg-divider',
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-10 min-[861px]:grid-cols-[1fr_180px]">
        <div ref={listRef} className="relative">
          <div aria-hidden="true" className="absolute top-[34px] bottom-[34px] start-1 w-[2px] bg-divider" />
          {items.map((item, i) => (
            <TimelineRow key={item.id} item={item} locale={locale} active={i === activeIndex} />
          ))}
        </div>

        <aside
          aria-hidden="true"
          className="hidden flex-col gap-3 min-[861px]:sticky min-[861px]:top-[22vh] min-[861px]:flex"
        >
          <div className="font-heading text-xs font-extrabold tracking-[0.1em] text-neutral-700">{sidebarLabel}</div>
          <div className="font-heading font-extrabold leading-[0.95] text-accent-700" style={{ fontSize: 'clamp(38px, 5vw, 64px)' }}>
            {activeYear}
          </div>
          <div dir="ltr" className="font-heading text-[12.5px] font-extrabold tracking-[0.06em] text-neutral-700">
            {`${activeIndex + 1} / ${total}`}
          </div>
          <div className="relative mt-1 h-[170px] w-[3px] bg-divider">
            <motion.div className="absolute inset-x-0 top-0 bg-accent" style={{ height: barHeight }} />
          </div>
        </aside>
      </div>
    </div>
  )
}

function TimelineRow({ item, locale, active }: { item: TimelineMilestone; locale: Locale; active: boolean }) {
  const shouldReduceMotion = useReducedMotion()
  const title = t(locale, item.title)
  // Array.from, not .split(''), to stay code-point safe for Hebrew (and any
  // combining marks) — this is a letter sweep, not a byte sweep. Spans are
  // rendered in logical (string) order; the browser's own bidi handling is
  // what puts them on screen right-to-left, the same as if this were one
  // plain text node.
  const letters = useMemo(() => Array.from(title), [title])

  return (
    <div className="grid grid-cols-[56px_minmax(0,1fr)] gap-5 py-6 min-[861px]:grid-cols-[130px_minmax(0,1fr)] min-[861px]:gap-7 min-[861px]:py-7">
      <div className="flex items-baseline gap-2 min-[861px]:gap-[11px]">
        <span
          aria-hidden="true"
          className={cn(
            '-mt-1 block h-[10px] w-[10px] flex-none rounded-full transition-[background-color,opacity,transform] duration-300 ease-out motion-reduce:transition-none',
            active ? 'scale-125 bg-accent opacity-100' : 'scale-100 bg-niv-slate opacity-35',
          )}
        />
        <div
          className={cn(
            'font-heading text-[17px] font-extrabold leading-[1.1] transition-colors duration-300 ease-out min-[861px]:text-[26px]',
            // accent-700 / neutral-700, not the mockups' accent / neutral-600:
            // at 17px, raw brand red only reliably passes AA as text on
            // --color-bg — this row can render under other light tints too,
            // where it falls short — and neutral-600 fails outright.
            active ? 'text-accent-700' : 'text-neutral-700',
          )}
        >
          {t(locale, item.year)}
        </div>
      </div>
      <div>
        {shouldReduceMotion ? (
          <h3
            className="m-0 mb-2 text-[22px] max-[860px]:text-[clamp(19px,5.2vw,24px)]"
            style={{ color: active ? TITLE_COLOR_ACTIVE : TITLE_COLOR_INACTIVE }}
          >
            {title}
          </h3>
        ) : (
          <motion.h3
            className="m-0 mb-2 text-[22px] max-[860px]:text-[clamp(19px,5.2vw,24px)]"
            initial={false}
            animate={active ? 'active' : 'inactive'}
            variants={titleGroupVariants}
          >
            {letters.map((letter, i) => (
              // index is a safe key here: `title` is stable per row, letters are never reordered/inserted independently
              <motion.span key={i} variants={titleLetterVariants}>
                {letter}
              </motion.span>
            ))}
          </motion.h3>
        )}
        <p className="m-0 max-w-[660px] text-[15px] leading-[1.65] text-neutral-800">{t(locale, item.body)}</p>
        {item.externalArticles && item.externalArticles.length > 0 ? (
          <div className="mt-2.5 flex min-w-0 flex-wrap gap-x-4 gap-y-1.5">
            {item.externalArticles.map((article) => (
              <a
                key={article.url}
                href={article.url}
                target="_blank"
                rel="noopener"
                className="inline-flex min-w-0 max-w-full items-baseline gap-1.5 text-[12.5px] font-semibold text-neutral-700 no-underline transition-colors duration-200 ease-out hover:text-accent-700 focus-visible:rounded-sm focus-visible:text-accent-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span className="min-w-0 max-w-[280px] truncate">{t(locale, article.label)}</span>
                <span className="flex-none whitespace-nowrap text-neutral-600">· {article.outlet} ↗</span>
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
