'use client'

import { useState } from 'react'

import { Reveal, SeatHall, type SeatHallHoverMode } from '@/components/ui'
import { hallAriaLabel, hallSentence, heroContent } from '@/content/home'
import { t, type Locale } from '@/lib/i18n'

const HOVER_OPTIONS: { value: SeatHallHoverMode; label: { he: string; en: string } }[] = [
  { value: 'off', label: { he: 'כבוי (מקורי)', en: 'Off (original)' } },
  { value: 'repel', label: { he: 'דחייה נקייה', en: 'Clean repel' } },
  { value: 'ripple', label: { he: 'אדווה גלית', en: 'Ripple wave' } },
  { value: 'jitter', label: { he: 'רטט חי', en: 'Lively jitter' } },
]

/**
 * Throwaway comparison page (2026-08-29 lab brief) — NOT linked from nav,
 * not meant to ship as-is. Lets the site owner try a few real hover/scroll
 * behaviors on the actual `SeatHall` component, in the actual Home hero
 * layout, before picking one to wire into the real Hero permanently. See
 * `SeatHall.tsx`'s own doc comment on `SeatHallHoverMode`/`scrollBurst` for
 * what each option actually does.
 *
 * A floating control panel (bottom-start, fixed) switches `hoverMode` and
 * toggles `scrollBurst` — both plain client state, nothing persisted.
 */
export function SeatLabHero({ locale }: { locale: Locale }) {
  const [hoverMode, setHoverMode] = useState<SeatHallHoverMode>('repel')
  const [scrollBurst, setScrollBurst] = useState(true)
  const titleLines = heroContent.title[locale].split('\n')

  return (
    <>
      <div className="sticky top-0 z-40 flex flex-wrap items-center gap-4 border-b-2 border-divider bg-niv-slate px-6 py-3 text-white">
        <span className="font-heading text-[12px] font-extrabold tracking-[0.08em] text-niv-cream">
          {t(locale, { he: 'מעבדת אנימציה — לא לשידור', en: 'Animation lab — not for publishing' })}
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {HOVER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setHoverMode(opt.value)}
              className={`border-2 px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                hoverMode === opt.value
                  ? 'border-accent bg-accent text-white'
                  : 'border-white/30 bg-transparent text-white/80 hover:border-white/60'
              }`}
            >
              {t(locale, opt.label)}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-[12.5px] font-semibold text-white/90">
          <input type="checkbox" checked={scrollBurst} onChange={(e) => setScrollBurst(e.target.checked)} />
          {t(locale, { he: 'פיזור בגלילה', en: 'Scroll burst' })}
        </label>
      </div>

      <Reveal
        as="section"
        className="relative grid grid-cols-[minmax(320px,44%)_1fr] items-center gap-6 border-b-2 border-divider bg-bg max-[860px]:grid-cols-1"
        style={{ minHeight: '78vh', paddingInline: '40px', paddingBlockStart: '56px', paddingBlockEnd: '48px' }}
      >
        <div style={{ maxWidth: 620 }}>
          <div className="mb-4 flex items-center gap-3">
            <span aria-hidden="true" className="block h-[3px] w-[34px] bg-accent" />
            <span className="font-heading text-[13px] font-extrabold tracking-[0.08em] text-neutral-700">
              {t(locale, heroContent.eyebrow)}
            </span>
          </div>
          <h1 className="m-0 mb-[18px] text-text" style={{ textWrap: 'balance' }}>
            {titleLines.map((line, i) => (
              <span key={line}>
                {i > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </h1>
          <p className="m-0 text-[18.5px] leading-[1.6] text-neutral-800" style={{ maxWidth: 520 }}>
            {t(locale, heroContent.lead)}
          </p>
        </div>
        <div className="flex min-w-0 items-center justify-center">
          <SeatHall
            locale={locale}
            ariaLabel={hallAriaLabel}
            sentence={hallSentence}
            hoverMode={hoverMode}
            scrollBurst={scrollBurst}
          />
        </div>
      </Reveal>
    </>
  )
}
