import Link from 'next/link'

import { Cell, CellGrid, Eyebrow, Reveal, Tag } from '@/components/ui'
import { arrowForward, t, type Locale } from '@/lib/i18n'
import { goalSection, pillarCards, pillarTagLabel } from '@/content/home'

export function GoalSection({
  locale,
  section = goalSection,
  cards = pillarCards,
  tag = pillarTagLabel,
}: {
  locale: Locale
  section?: typeof goalSection
  cards?: typeof pillarCards
  tag?: typeof pillarTagLabel
}) {
  const titleLines = section.titleLines[locale]
  const tagLabel = tag[locale]
  const arrow = arrowForward(locale)

  return (
    <Reveal as="section">
      <div className="relative mx-auto" style={{ maxWidth: 1240, paddingInline: '32px', paddingBlockStart: '64px', paddingBlockEnd: '60px' }}>
        <div className="mb-[30px]">
          <Eyebrow className="mb-3">{t(locale, section.eyebrow)}</Eyebrow>
          <h2 className="m-0">
            {titleLines.map((line, i) => (
              <span key={line}>
                {i > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-4 text-[16.5px] leading-[1.7] text-neutral-800" style={{ maxWidth: 660 }}>
            {t(locale, section.lead)}
          </p>
        </div>
        <CellGrid cols={3}>
          {cards.map((pillar) => (
            <Cell key={pillar.id} hoverTint paddingInline="26px" paddingBlockStart="30px" paddingBlockEnd="30px">
              <div className="mb-[14px] flex items-center gap-[10px]">
                <span className="font-heading text-[13px] font-extrabold text-neutral-700">{pillar.number}</span>
                {tagLabel ? <Tag variant="accent">{tagLabel}</Tag> : null}
              </div>
              <h3 className="mb-3">{t(locale, pillar.title)}</h3>
              <p className="text-[14.5px] leading-[1.65] text-neutral-800">{t(locale, pillar.body)}</p>
              <Link
                href={`/${locale}/${pillar.slug}`}
                className="mt-auto inline-block pt-5 text-[14px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {locale === 'he' ? (
                  <>
                    {t(locale, pillar.linkLabel)} {arrow}
                  </>
                ) : (
                  <>
                    {arrow} {t(locale, pillar.linkLabel)}
                  </>
                )}
              </Link>
            </Cell>
          ))}
        </CellGrid>
      </div>
    </Reveal>
  )
}
