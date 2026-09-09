'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'

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
  const medium = milestones.slice(0, 12)

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-14">
      <div className="mb-14 max-w-[760px]">
        <p className="mb-2 font-heading text-[12px] font-extrabold uppercase tracking-[0.1em] text-accent-700">
          {isHe ? 'מעבדת עיצוב · לא לפרסום' : 'Design lab · not for publishing'}
        </p>
        <h1 className="mb-3">{isHe ? 'ציר זמן אינטראקטיבי' : 'Interactive timeline'}</h1>
        <p className="text-[15.5px] leading-[1.7] text-neutral-800">
          {isHe
            ? 'כל הכרטיסים מתחת הם תוכן אמיתי מציר הזמן הקיים. גללו/גררו כל גרסה ותשוו.'
            : 'Every card below is real content from the existing timeline. Scroll/drag each version and compare.'}
        </p>
      </div>

      <LabSection
        letter={isHe ? 'ה' : 'E'}
        title={isHe ? 'קו מתפתל שמצטייר תוך כדי גלילה' : 'A winding line, drawn as you scroll'}
        note={
          isHe
            ? `קו אמיתי (SVG) מצטייר עם הגלילה, לא רק כרטיסים זזים: התרגום הכי מילולי ל"הזזת המחט". ${short.length} אירועים לדוגמה.`
            : `A real drawn SVG line, not just moving cards: the most literal version of "moving the needle." ${short.length} sample milestones.`
        }
      >
        <WindingPathTimeline locale={locale} milestones={short} />
      </LabSection>

      <LabSection
        letter={isHe ? 'ו' : 'F'}
        title={isHe ? 'מסלול עם הטיה לפי מהירות הגלילה' : 'Track that skews with scroll speed'}
        note={
          isHe
            ? 'גררו מהר או לאט: הכרטיסים נוטים לפי המהירות, כמו באתרים "קופצניים" עם תחושת אנרגיה אמיתית.'
            : 'Drag fast or slow: the cards tilt with your speed, the kinetic "energetic" feel from flashier award-style sites.'
        }
      >
        <VelocitySkewMarquee locale={locale} milestones={milestones} />
      </LabSection>

      <LabSection
        letter={isHe ? 'ז' : 'G'}
        title={isHe ? 'מספר שנה ענק שמוצמד למסך' : 'A giant pinned year number'}
        note={
          isHe
            ? `הדפוס של כתבות "עיתונות ארוכה" (NYT וכו׳): מספר השנה נשאר צמוד ומתחלף, הפרטים גולשים לצידו. ${medium.length} אירועים לדוגמה.`
            : `The long-form journalism pattern (NYT etc.): the year number stays pinned and swaps, details slide beside it. ${medium.length} sample milestones.`
        }
      >
        <PinnedNumberTimeline locale={locale} milestones={medium} />
      </LabSection>

      <div className="mb-14 mt-24 max-w-[760px] border-t-2 border-divider pt-8">
        <p className="text-[13.5px] leading-[1.6] text-neutral-600">
          {isHe
            ? 'הגרסאות הבאות מהסבב הקודם, פשוטות יותר, נשארות כאן להשוואה:'
            : "Earlier, plainer options from the last round, kept here for comparison:"}
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

/* ---------------------------------- E ---------------------------------- */

const WINDING_ROW_HEIGHT = 230
const WINDING_VIEWBOX_WIDTH = 600

function WindingPathTimeline({ locale, milestones }: { locale: Locale; milestones: TimelineMilestone[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const height = milestones.length * WINDING_ROW_HEIGHT + 60

  const points = useMemo(
    () => milestones.map((_, i) => ({ x: i % 2 === 0 ? 150 : WINDING_VIEWBOX_WIDTH - 150, y: i * WINDING_ROW_HEIGHT + 60 })),
    [milestones],
  )

  const pathD = useMemo(() => {
    if (points.length === 0) return ''
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const cur = points[i]
      const midY = (prev.y + cur.y) / 2
      d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`
    }
    return d
  }, [points])

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 0.75', 'end 0.4'] })
  const pathLength = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 })

  if (shouldReduceMotion) {
    return <RailTimeline locale={locale} milestones={milestones} />
  }

  return (
    <div ref={containerRef} className="relative" style={{ height }}>
      <svg viewBox={`0 0 ${WINDING_VIEWBOX_WIDTH} ${height}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        <motion.path d={pathD} fill="none" stroke="var(--color-accent)" strokeWidth={3} strokeLinecap="round" style={{ pathLength }} />
      </svg>
      {milestones.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-35% 0px -35% 0px' }}
          transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute w-[240px] border-2 border-divider bg-bg p-4"
          style={{
            top: points[i].y - 70,
            insetInlineStart: `${(points[i].x / WINDING_VIEWBOX_WIDTH) * 100}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <MilestoneCardBody locale={locale} item={item} />
        </motion.div>
      ))}
    </div>
  )
}

/* ---------------------------------- F ---------------------------------- */

function VelocitySkewMarquee({ locale, milestones }: { locale: Locale; milestones: TimelineMilestone[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollX } = useScroll({ container: trackRef })
  const velocity = useVelocity(scrollX)
  const skew = useTransform(velocity, [-2500, 0, 2500], [10, 0, -10], { clamp: true })
  const smoothSkew = useSpring(skew, { stiffness: 260, damping: 32 })

  if (shouldReduceMotion) {
    return <RailTimeline locale={locale} milestones={milestones} />
  }

  return (
    <div
      ref={trackRef}
      className="select-none overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <motion.div className="flex w-max gap-4" style={{ skewX: smoothSkew }}>
        {milestones.map((item) => (
          <div key={item.id} className="w-[260px] flex-none border-2 border-divider bg-bg p-4">
            <MilestoneCardBody locale={locale} item={item} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* ---------------------------------- G ---------------------------------- */

function PinnedNumberTimeline({ locale, milestones }: { locale: Locale; milestones: TimelineMilestone[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const isRtl = locale === 'he'
  const total = milestones.length

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const indexMV = useTransform(scrollYProgress, (v) => Math.min(total - 1, Math.max(0, Math.floor(v * total))))
  const [activeIndex, setActiveIndex] = useState(0)
  useMotionValueEvent(indexMV, 'change', (v) => setActiveIndex(v))

  const activeItem = milestones[activeIndex]

  if (shouldReduceMotion) {
    return <RailTimeline locale={locale} milestones={milestones} />
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: `${total * 70}vh` }}>
      <div className="sticky top-24 grid grid-cols-1 gap-8 overflow-hidden border-2 border-divider bg-tint-cream p-8 min-[720px]:grid-cols-[1fr_1.3fr] min-[720px]:p-10" style={{ height: 420 }}>
        <div className="relative flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
              className="font-heading font-extrabold leading-none text-accent-700"
              style={{ fontSize: 'clamp(56px, 8vw, 120px)' }}
            >
              {t(locale, activeItem.year)}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ x: isRtl ? -36 : 36, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isRtl ? 36 : -36, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <h3 className="mb-2 text-[19px]">{t(locale, activeItem.title)}</h3>
              <p className="m-0 text-[14px] leading-[1.6] text-neutral-800">{t(locale, activeItem.body)}</p>
              {activeItem.externalArticles && activeItem.externalArticles.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {activeItem.externalArticles.map((a) => (
                    <a
                      key={a.url}
                      href={a.url}
                      target="_blank"
                      rel="noopener"
                      className="rounded-full border border-divider bg-bg px-2 py-0.5 text-[10.5px] font-semibold text-neutral-700 no-underline transition-colors hover:text-accent-700"
                    >
                      {a.outlet}
                    </a>
                  ))}
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
        <span dir="ltr" className="absolute bottom-4 end-4 font-heading text-[12px] font-extrabold tracking-wide text-neutral-600">
          {activeIndex + 1} / {total}
        </span>
      </div>
    </div>
  )
}
