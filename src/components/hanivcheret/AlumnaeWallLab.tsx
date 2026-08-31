'use client'

import { useState } from 'react'

import { t, type Locale } from '@/lib/i18n'
import { AlumnaeWall, type AlumnaeWallEdgeTreatment } from './AlumnaeWall'

const OPTIONS: { value: AlumnaeWallEdgeTreatment; label: { he: string; en: string } }[] = [
  { value: 'fade', label: { he: 'היום — עמעום רך (64px)', en: 'Today — soft fade (64px)' } },
  { value: 'hardCut', label: { he: 'קיצוץ חד, בלי עמעום', en: 'Hard cut, no fade' } },
  { value: 'accentLine', label: { he: 'קו אדום מסגרת', en: 'Accent line frame' } },
  { value: 'sharpFade', label: { he: 'עמעום דק מאוד (8px)', en: 'Very thin fade (8px)' } },
]

/**
 * Throwaway comparison page (2026-08-31 follow-up: "אני רוצה תזוזה
 * אוטומטית... אהבתי את מה שקיים, אבל השקיפות שקורית בתזוזה לא קשורה לשפה
 * הויזואלית של האתר") — corrects the first pass at this brief, which
 * replaced the continuous auto-drift with click-to-page options (wrong:
 * she wants to KEEP the automatic movement, just change how cards meet the
 * top/bottom edge). Compares `AlumnaeWall`'s new `edgeTreatment` prop live,
 * same drift mechanic every time. Not linked from nav; safe to delete once
 * a direction is picked.
 */
export function AlumnaeWallLab({ locale }: { locale: Locale }) {
  const [edgeTreatment, setEdgeTreatment] = useState<AlumnaeWallEdgeTreatment>('hardCut')

  return (
    <div className="mx-auto max-w-[1080px] px-8 py-10 max-[860px]:px-[18px]">
      <div className="sticky top-0 z-40 -mx-8 mb-8 flex flex-wrap items-center gap-1.5 border-b-2 border-divider bg-niv-slate px-8 py-2.5 text-white max-[860px]:-mx-[18px] max-[860px]:px-[18px]">
        <span className="me-1.5 font-heading text-[11.5px] font-extrabold tracking-[0.06em] text-niv-cream">
          {t(locale, { he: 'מעבדת קצה הקיר — לא לשידור', en: 'Wall-edge lab — not for publishing' })}
        </span>
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setEdgeTreatment(opt.value)}
            className={`border-2 px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${
              edgeTreatment === opt.value ? 'border-accent bg-accent text-white' : 'border-white/30 bg-transparent text-white/80 hover:border-white/60'
            }`}
          >
            {t(locale, opt.label)}
          </button>
        ))}
      </div>

      <h1 className="mb-3 text-[clamp(24px,3vw,34px)] leading-[1.15]">
        {t(locale, { he: 'תגובות בוגרות — עריכת שולי הקיר', en: 'Alumnae feedback — wall-edge comparison' })}
      </h1>
      <p className="mb-6 max-w-[640px] text-[14px] leading-[1.6] text-neutral-700">
        {t(locale, {
          he: 'התזוזה האוטומטית זהה בכל האפשרויות — רק מה שקורה בשוליים העליון והתחתון משתנה.',
          en: 'The automatic movement is identical in every option — only what happens at the top and bottom edges changes.',
        })}
      </p>

      <AlumnaeWall locale={locale} edgeTreatment={edgeTreatment} />
    </div>
  )
}
