import Link from 'next/link'

import { Cell, CellGrid, Reveal } from '@/components/ui'
import { arrowForward, t, type Locale } from '@/lib/i18n'
import { timelineItems, timelineSection } from '@/content/home'
import { EqualizerDots } from './EqualizerDots'
import { TimelineTrack } from './TimelineTrack'

export function Timeline({ locale }: { locale: Locale }) {
  const arrow = arrowForward(locale)

  return (
    <Reveal as="section" className="border-y-2 border-divider bg-tint-cream">
      <div className="relative mx-auto" style={{ maxWidth: 1240, paddingInline: '32px', paddingBlockStart: '72px', paddingBlockEnd: '64px' }}>
        <div className="absolute leading-none" style={{ insetBlockStart: '32px', insetInlineEnd: '32px' }}>
          <EqualizerDots tone="light" />
        </div>
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
        {/*
          The years used to appear all at once with the section. They now sit
          under a rail that fills with scroll position, and each entry rises
          in on its own beat (2026-08-28 brief).

          The stagger goes through `Reveal` rather than a hand-rolled
          `whileInView`, so it inherits that component's fallback timer —
          the one added after entries on a very long page could stick at
          opacity 0 forever. `Reveal` wraps each cell's CONTENT rather than
          the cell itself, because `CellGrid` styles its children with a
          direct-child selector that an extra wrapper element would break.
        */}
        <TimelineTrack>
          <CellGrid cols={4}>
            {timelineItems.map((item, index) => (
              <Cell key={item.year} paddingInline="20px" paddingBlockStart="26px" paddingBlockEnd="26px">
                <Reveal index={index}>
                  <div className="font-heading text-[32px] font-extrabold leading-none text-accent-700">
                    {item.year}
                  </div>
                  <span aria-hidden="true" className="mt-2.5 block h-[2px] w-8 bg-accent/35" />
                  <p className="mt-2.5 text-[14px] leading-[1.55]">{t(locale, item.body)}</p>
                </Reveal>
              </Cell>
            ))}
          </CellGrid>
        </TimelineTrack>
      </div>
    </Reveal>
  )
}
