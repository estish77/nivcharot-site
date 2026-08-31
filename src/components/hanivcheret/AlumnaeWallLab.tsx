'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { Carousel } from '@/components/ui/Carousel'
import { alumnaYear, alumnaeTestimonials, interleavedTestimonials, type AlumnaTestimonial } from '@/content/alumnae'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { t, type Locale } from '@/lib/i18n'
import { AlumnaeWall } from './AlumnaeWall'

const text = { cohort: { he: 'מחזור', en: 'Cohort' } }

/** Same card look as `AlumnaeWall`'s own — not exported from there, so kept as a matching copy for this lab only. */
function TestimonialCard({ item, locale }: { item: AlumnaTestimonial; locale: Locale }) {
  return (
    <figure className="m-0 h-full border-2 border-divider bg-bg px-5 py-[18px]">
      <span aria-hidden="true" className="mb-2 block font-heading text-[30px] font-extrabold leading-none text-accent/35">
        &ldquo;
      </span>
      <blockquote className="m-0 text-[14.5px] leading-[1.7] text-neutral-800">{t(locale, item.quote)}</blockquote>
      <figcaption className="mt-3.5 border-t border-divider pt-2.5 font-heading text-[12px] font-extrabold text-neutral-700">
        <span className="text-accent-700">{t(locale, item.name)}</span>
        <span className="mx-1.5 text-divider">·</span>
        {t(locale, text.cohort)} {item.cohort}, {alumnaYear(item.cohort)}
      </figcaption>
    </figure>
  )
}

function Dots({ count, active, onSelect }: { count: number; active: number; onSelect: (i: number) => void }) {
  return (
    <div className="mt-5 flex items-center justify-center gap-2">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-current={i === active}
          onClick={() => onSelect(i)}
          className={`h-2 w-2 rounded-full transition-colors ${i === active ? 'bg-accent' : 'bg-divider hover:bg-neutral-500'}`}
        />
      ))}
    </div>
  )
}

/** Option 1: the site's own existing reusable `Carousel` (horizontal scroll-snap + square chevron buttons) — the most "already the site's language" option, since nothing new is built for it. */
function CarouselVariant({ locale, items }: { locale: Locale; items: AlumnaTestimonial[] }) {
  return (
    <Carousel locale={locale} ariaLabel={t(locale, { he: 'תגובות בוגרות', en: 'Alumnae feedback' })} itemBasis="calc(33.333% - 16px)" gap="24px">
      {items.map((item) => (
        <TestimonialCard key={item.id} item={item} locale={locale} />
      ))}
    </Carousel>
  )
}

/** Option 2: a discrete page-at-a-time grid (6 cards/page) with a crossfade between pages and dot pagination — same dot language as AlumnaeQuoteBanner, but for whole pages instead of one quote. */
function PagedGridVariant({ locale, items }: { locale: Locale; items: AlumnaTestimonial[] }) {
  const shouldReduceMotion = useReducedMotion()
  const perPage = 6
  const pageCount = Math.ceil(items.length / perPage)
  const [page, setPage] = useState(0)

  return (
    <div>
      <div className="relative min-h-[420px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1"
          >
            {items.slice(page * perPage, page * perPage + perPage).map((item) => (
              <TestimonialCard key={item.id} item={item} locale={locale} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <Dots count={pageCount} active={page} onSelect={setPage} />
    </div>
  )
}

/** Option 3: one card at a time, side-wipe + auto-rotate + dots — the exact same visual language as the Join page's AlumnaeQuoteBanner, applied to a card instead of a bare quote. */
function RotationVariant({ locale, items }: { locale: Locale; items: AlumnaTestimonial[] }) {
  const shouldReduceMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (shouldReduceMotion || paused) return
    const id = window.setTimeout(() => setActive((a) => (a + 1) % items.length), 4500)
    return () => window.clearTimeout(id)
  }, [active, shouldReduceMotion, paused, items.length])

  return (
    <div
      className="mx-auto max-w-[560px]"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Ghost stack: every card rendered invisibly, stacked, so the block sizes to the tallest one with no layout jump when the live card swaps. */}
      <div className="grid">
        <div aria-hidden="true" className="invisible col-start-1 row-start-1">
          {items.map((item) => (
            <TestimonialCard key={item.id} item={item} locale={locale} />
          ))}
        </div>
        <div className="col-start-1 row-start-1 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={items[active].id}
              initial={shouldReduceMotion ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { x: '-100%' }}
              transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <TestimonialCard item={items[active]} locale={locale} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <Dots count={items.length} active={active} onSelect={setActive} />
    </div>
  )
}

const OPTIONS = [
  { value: 'current', label: { he: 'היום — נדנוד רציף', en: 'Today — continuous drift' } },
  { value: 'carousel', label: { he: 'קרוסלה עם חצים', en: 'Carousel with arrows' } },
  { value: 'paged', label: { he: 'עמודים עם נקודות', en: 'Paged with dots' } },
  { value: 'rotation', label: { he: 'סבב כרטיס אחד', en: 'Single-card rotation' } },
] as const
type Variant = (typeof OPTIONS)[number]['value']

/**
 * Throwaway comparison page (2026-08-31 brief: "האנימציה של התגובות לא
 * בשפה של האתר כולו, תן לי הצעות למעברים ודפדוף נוספים") — the current
 * `AlumnaeWall` is a perpetual vertical drift with no discrete pages, no
 * pause-and-look moment, no dots — unlike the rest of the site's rotation
 * patterns (the Join page's `AlumnaeQuoteBanner`, the reusable `Carousel`),
 * which are all discrete slide + explicit navigation control. Not linked
 * from nav; safe to delete once a direction is picked.
 */
export function AlumnaeWallLab({ locale }: { locale: Locale }) {
  const [variant, setVariant] = useState<Variant>('carousel')
  const items = interleavedTestimonials(alumnaeTestimonials)

  return (
    <div className="mx-auto max-w-[1080px] px-8 py-10 max-[860px]:px-[18px]">
      <div className="sticky top-0 z-40 -mx-8 mb-8 flex flex-wrap items-center gap-1.5 border-b-2 border-divider bg-niv-slate px-8 py-2.5 text-white max-[860px]:-mx-[18px] max-[860px]:px-[18px]">
        <span className="me-1.5 font-heading text-[11.5px] font-extrabold tracking-[0.06em] text-niv-cream">
          {t(locale, { he: 'מעבדת תגובות בוגרות — לא לשידור', en: 'Alumnae feedback lab — not for publishing' })}
        </span>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setVariant(opt.value)}
            className={`border-2 px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${
              variant === opt.value ? 'border-accent bg-accent text-white' : 'border-white/30 bg-transparent text-white/80 hover:border-white/60'
            }`}
          >
            {t(locale, opt.label)}
          </button>
        ))}
      </div>

      <h1 className="mb-6 text-[clamp(24px,3vw,34px)] leading-[1.15]">
        {t(locale, { he: 'תגובות בוגרות — השוואת אפשרויות', en: 'Alumnae feedback — comparing options' })}
      </h1>

      {variant === 'current' ? <AlumnaeWall locale={locale} /> : null}
      {variant === 'carousel' ? <CarouselVariant locale={locale} items={items} /> : null}
      {variant === 'paged' ? <PagedGridVariant locale={locale} items={items} /> : null}
      {variant === 'rotation' ? <RotationVariant locale={locale} items={items} /> : null}
    </div>
  )
}
