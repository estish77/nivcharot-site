'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'
import { t, type Locale } from '@/lib/i18n'
import type { TimelineMilestone } from '@/content/story'

export type TimelineLabPageProps = { locale: Locale; milestones: TimelineMilestone[] }

/**
 * Four working prototypes of an interactive home-page timeline (2026-09-09
 * brief: horizontal, all real milestones, links to press/social, and a
 * visual sense of "how we moved the needle" through the controversy).
 * Compare on this page, then the chosen one gets built for real on the
 * home page and this whole route gets deleted — same throwaway-lab pattern
 * as the earlier /mivzakon-lab.
 */
export function TimelineLabPage({ locale, milestones }: TimelineLabPageProps) {
  const isHe = locale === 'he'
  // C and D need a much smaller working set to stay demo-able (a real build
  // of C would just use every milestone; a real build of D likely needs
  // several rings rather than one, see the note under it).
  const short = milestones.slice(0, 9)

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-14">
      <div className="mb-14 max-w-[760px]">
        <p className="mb-2 font-heading text-[12px] font-extrabold uppercase tracking-[0.1em] text-accent-700">
          {isHe ? 'מעבדת עיצוב · לא לפרסום' : 'Design lab · not for publishing'}
        </p>
        <h1 className="mb-3">{isHe ? 'ציר זמן אינטראקטיבי, ארבע גרסאות' : 'Interactive timeline, four takes'}</h1>
        <p className="text-[15.5px] leading-[1.7] text-neutral-800">
          {isHe
            ? 'כל הכרטיסים מתחת הם תוכן אמיתי מציר הזמן הקיים. גללו/גררו כל גרסה ותשוו.'
            : 'Every card below is real content from the existing timeline. Scroll/drag each version and compare.'}
        </p>
      </div>

      <LabSection
        letter={isHe ? 'א' : 'A'}
        title={isHe ? 'פס אופקי נגלל' : 'Horizontal scroll-snap rail'}
        note={
          isHe
            ? 'כמו המבזקון: כרטיסיות זו לצד זו, גרירה/swipe, כל ה-אירועים.'
            : 'Like the Mivzakon ticker: cards side by side, drag/swipe, every milestone.'
        }
      >
        <RailTimeline locale={locale} milestones={milestones} />
      </LabSection>

      <LabSection
        letter={isHe ? 'ב' : 'B'}
        title={isHe ? 'אותו פס, עם קו התקדמות' : 'Same rail, with a progress line'}
        note={
          isHe
            ? 'זהה ל-א׳, עם פס שממלא ככל שגוללים: תשובה פשוטה ל"הזזת המחט".'
            : 'Same as A, with a bar that fills as you scroll: a simple answer to "moving the needle."'
        }
      >
        <RailWithProgressTimeline locale={locale} milestones={milestones} />
      </LabSection>

      <LabSection
        letter={isHe ? 'ג' : 'C'}
        title={isHe ? 'גלילה אנכית שהופכת לאופקית' : 'Vertical scroll drives horizontal movement'}
        note={
          isHe
            ? `הכי דרמטי, והכי "כבד" בנגישות/מובייל. מוצג כאן עם ${short.length} אירועים לצורך ההדגמה, בבנייה אמיתית יהיו כל ה-${milestones.length}.`
            : `Most dramatic, and the heaviest on accessibility/mobile. Shown here with ${short.length} milestones for the demo; a real build would use all ${milestones.length}.`
        }
      >
        <ScrollJackedTimeline locale={locale} milestones={short} />
      </LabSection>

      <LabSection
        letter={isHe ? 'ד' : 'D'}
        title={isHe ? 'גלגל תלת-ממדי' : '3D rotating wheel'}
        note={
          isHe
            ? `גררו כדי לסובב. הכי מרשים חזותית והכי פחות נגיש. ${short.length} אירועים לדוגמה, בבנייה אמיתית זה כנראה יזדקק לכמה "טבעות" לפי תקופה.`
            : `Drag to rotate. The most visually striking and the least accessible. ${short.length} sample milestones; a real build would likely need several rings by era.`
        }
      >
        <WheelTimeline locale={locale} milestones={short} />
      </LabSection>
    </div>
  )
}

function LabSection({
  letter,
  title,
  note,
  children,
}: {
  letter: string
  title: string
  note: string
  children: ReactNode
}) {
  return (
    <section className="mb-20 border-t-2 border-divider pt-8">
      <div className="mb-5 flex flex-wrap items-baseline gap-3">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-niv-slate font-heading text-[14px] font-extrabold text-niv-cream">
          {letter}
        </span>
        <h2 className="m-0 text-[22px]">{title}</h2>
      </div>
      <p className="mb-6 max-w-[640px] text-[13.5px] leading-[1.6] text-neutral-700">{note}</p>
      {children}
    </section>
  )
}

/** Shared card content — year, title, truncated body, link row. Sizing/positioning is per-variant. */
function MilestoneCardBody({ locale, item }: { locale: Locale; item: TimelineMilestone }) {
  return (
    <>
      <div className="font-heading text-[26px] font-extrabold leading-none text-accent-700">{t(locale, item.year)}</div>
      <h3 className="mb-1 mt-2.5 text-[16px] leading-[1.3]">{t(locale, item.title)}</h3>
      <p className="m-0 line-clamp-4 text-[13px] leading-[1.55] text-neutral-800">{t(locale, item.body)}</p>
      {item.externalArticles && item.externalArticles.length > 0 ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {item.externalArticles.map((a) => (
            <a
              key={a.url}
              href={a.url}
              target="_blank"
              rel="noopener"
              onClick={(e) => e.stopPropagation()}
              className="rounded-full border border-divider bg-tint-cream px-2 py-0.5 text-[10.5px] font-semibold text-neutral-700 no-underline transition-colors hover:text-accent-700"
            >
              {a.outlet}
            </a>
          ))}
        </div>
      ) : null}
    </>
  )
}

/* ---------------------------------- A ---------------------------------- */

function RailTimeline({ locale, milestones }: { locale: Locale; milestones: TimelineMilestone[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }
  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {milestones.map((item) => (
          <div
            key={item.id}
            className="w-[260px] flex-none border-2 border-divider bg-bg p-4"
            style={{ scrollSnapAlign: 'start' }}
          >
            <MilestoneCardBody locale={locale} item={item} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <RailArrow dir={-1} onClick={() => scrollBy(-1)} />
        <RailArrow dir={1} onClick={() => scrollBy(1)} />
      </div>
    </div>
  )
}

function RailArrow({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 1 ? 'next' : 'previous'}
      className="flex h-8 w-8 items-center justify-center border-2 border-text text-text transition-colors hover:border-niv-slate hover:bg-niv-slate hover:text-white"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path
          d={dir === 1 ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

/* ---------------------------------- B ---------------------------------- */

function RailWithProgressTimeline({ locale, milestones }: { locale: Locale; milestones: TimelineMilestone[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const onScroll = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const raw = max > 0 ? Math.abs(el.scrollLeft) / max : 0
    setProgress(Math.min(1, Math.max(0, raw)))
  }, [])

  useEffect(() => {
    onScroll()
  }, [onScroll])

  return (
    <div>
      <div aria-hidden="true" className="mb-4 h-[3px] w-full bg-divider">
        <div className="h-full bg-accent transition-[width] duration-75 ease-out" style={{ width: `${progress * 100}%` }} />
      </div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {milestones.map((item) => (
          <div
            key={item.id}
            className="w-[260px] flex-none border-2 border-divider bg-bg p-4"
            style={{ scrollSnapAlign: 'start' }}
          >
            <MilestoneCardBody locale={locale} item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------- C ---------------------------------- */

function ScrollJackedTimeline({ locale, milestones }: { locale: Locale; milestones: TimelineMilestone[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const isRtl = locale === 'he'

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const travel = (milestones.length - 1) * 340
  const x = useTransform(scrollYProgress, [0, 1], isRtl ? [0, travel] : [0, -travel])

  if (shouldReduceMotion) {
    // Falls back to variant A's plain rail rather than a motion effect that would otherwise be skipped entirely.
    return <RailTimeline locale={locale} milestones={milestones} />
  }

  return (
    <div ref={containerRef} style={{ height: `${milestones.length * 90}vh` }} className="relative">
      <div className="sticky top-24 h-[440px] overflow-hidden border-2 border-divider bg-tint-cream">
        <motion.div className="flex h-full items-center gap-6 px-10" style={{ x }}>
          {milestones.map((item) => (
            <div key={item.id} className="w-[300px] flex-none border-2 border-divider bg-bg p-5 shadow-[0_8px_24px_rgba(49,68,81,0.12)]">
              <MilestoneCardBody locale={locale} item={item} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

/* ---------------------------------- D ---------------------------------- */

function WheelTimeline({ locale, milestones }: { locale: Locale; milestones: TimelineMilestone[] }) {
  const [rotation, setRotation] = useState(0)
  const dragState = useRef<{ startX: number; startRotation: number } | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const count = milestones.length
  const step = 360 / count
  const radius = 420

  const onPointerDown = (e: PointerEvent) => {
    dragState.current = { startX: e.clientX, startRotation: rotation }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: PointerEvent) => {
    if (!dragState.current) return
    const delta = e.clientX - dragState.current.startX
    setRotation(dragState.current.startRotation + delta * 0.3)
  }
  const onPointerUp = () => {
    if (!dragState.current) return
    dragState.current = null
    setRotation((r) => Math.round(r / step) * step)
  }

  const activeIndex = (((Math.round(-rotation / step) % count) + count) % count)
  const activeItem = milestones[activeIndex]

  if (shouldReduceMotion) {
    return <RailTimeline locale={locale} milestones={milestones} />
  }

  return (
    <div>
      <div
        className="relative mx-auto h-[360px] w-full max-w-[900px] cursor-grab touch-pan-y select-none active:cursor-grabbing"
        style={{ perspective: 1400 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d', transform: `translateZ(-${radius}px) rotateY(${rotation}deg)` }}
        >
          {milestones.map((item, i) => {
            const angle = i * step
            const isActive = i === activeIndex
            return (
              <div
                key={item.id}
                className="absolute left-1/2 top-1/2 w-[220px] -translate-x-1/2 -translate-y-1/2 border-2 bg-bg p-3.5 transition-[opacity,filter] duration-200"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  opacity: isActive ? 1 : 0.35,
                  filter: isActive ? 'none' : 'blur(1px)',
                  borderColor: isActive ? 'var(--color-accent-700)' : 'var(--color-divider)',
                  backfaceVisibility: 'hidden',
                }}
              >
                <MilestoneCardBody locale={locale} item={item} />
              </div>
            )
          })}
        </div>
      </div>
      <p className="mt-2 text-center text-[12.5px] text-neutral-600">
        {activeItem ? `${t(locale, activeItem.year)}: ${t(locale, activeItem.title)}` : null}
      </p>
    </div>
  )
}
