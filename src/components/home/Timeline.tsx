import Link from 'next/link'

import { Cell, CellGrid, Reveal } from '@/components/ui'
import { arrowForward, t, type Locale } from '@/lib/i18n'
import { timelineItems, timelineSection } from '@/content/home'

export function Timeline({ locale }: { locale: Locale }) {
  const arrow = arrowForward(locale)

  return (
    <Reveal as="section" className="border-y-2 border-divider bg-tint-cream">
      <div className="relative mx-auto" style={{ maxWidth: 1240, paddingInline: '32px', paddingBlockStart: '72px', paddingBlockEnd: '64px' }}>
        <div className="mb-6 flex flex-col items-start gap-3">
          <h2 className="m-0">{t(locale, timelineSection.title)}</h2>
          <Link
            href={`/${locale}/story`}
            className="text-[14px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {locale === 'he' ? (
              <>
                {t(locale, timelineSection.linkLabel)} {arrow}
              </>
            ) : (
              <>
                {arrow} {t(locale, timelineSection.linkLabel)}
              </>
            )}
          </Link>
        </div>
        <CellGrid cols={4}>
          {timelineItems.map((item) => (
            <Cell key={item.year} paddingInline="20px" paddingBlockStart="26px" paddingBlockEnd="26px">
              <div className="font-heading text-[32px] font-extrabold text-accent-700">{item.year}</div>
              <p className="mt-2 text-[14px] leading-[1.55]">{t(locale, item.body)}</p>
            </Cell>
          ))}
        </CellGrid>
      </div>
    </Reveal>
  )
}
