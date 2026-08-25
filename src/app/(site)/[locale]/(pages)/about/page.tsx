import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Fragment, type ReactNode } from 'react'

import { Cell, CellGrid, Eyebrow, Figure, Reveal, Section, TabBar } from '@/components/ui'
import type { TabBarItem } from '@/components/ui'
import { EqualizerDots } from '@/components/about/EqualizerDots'
import { StatTile } from '@/components/about/StatTile'
import { aboutContent } from '@/content/about'
import { getAboutContent } from '@/lib/cms'
import { arrowForward, isLocale, locales, t, type Locale } from '@/lib/i18n'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : 'he'

  return {
    title: t(locale, { he: 'אודות', en: 'About' }),
    description: t(locale, aboutContent.hero.lead),
  }
}

/** Renders a fixture string's literal `\n` markers as real `<br>` line breaks. */
function withLineBreaks(text: string): ReactNode {
  const lines = text.split('\n')
  return lines.map((line, i) => (
    <Fragment key={i}>
      {line}
      {i < lines.length - 1 ? <br /> : null}
    </Fragment>
  ))
}

/** "לפודקאסט ←" (he, arrow trailing) / "→ The podcast" (en, arrow leading) — see `arrowForward()`. */
function arrowLabel(locale: Locale, label: string): string {
  const arrow = arrowForward(locale)
  return locale === 'he' ? `${label} ${arrow}` : `${arrow} ${label}`
}

/**
 * Below 860px the `-m*`/`p*` pairs below grow the tap target beyond the
 * text's visual box (invisible touch padding: padding adds hit area,
 * the matching negative margin cancels the layout shift so surrounding
 * content doesn't move) — these arrow links are short inline text sitting
 * inside generously-padded cells, easy to mis-tap otherwise.
 */
const arrowLinkClass =
  'inline-block font-semibold text-[14px] no-underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent max-[860px]:-mx-1 max-[860px]:-mb-1.5 max-[860px]:px-1 max-[860px]:pb-1.5'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()
  const locale = rawLocale
  const content = await getAboutContent(locale)

  const tabs: TabBarItem[] = [
    { label: t(locale, { he: 'אודות', en: 'About' }), href: `/${locale}/about` },
    { label: t(locale, { he: 'הסיפור שלנו', en: 'Our story' }), href: `/${locale}/story` },
    { label: t(locale, { he: 'הצוות', en: 'Team' }), href: `/${locale}/team` },
  ]

  return (
    <>
      {/* Hero */}
      <Reveal as="section" index={0}>
        <Section as="div" maxWidth={1080} paddingBlockStart="64px" paddingBlockEnd="48px">
          <Eyebrow className="mb-3.5">{content.hero.eyebrow}</Eyebrow>
          <h1 className="m-0 mb-5 text-[clamp(36px,5vw,56px)] leading-[1.08] max-[860px]:text-[clamp(30px,9vw,46px)]">
            {withLineBreaks(content.hero.title)}
          </h1>
          <p className="m-0 max-w-[680px] text-[17px] leading-[1.7] text-neutral-800">{content.hero.body}</p>
        </Section>
      </Reveal>

      {/* About / Story / Team tabs */}
      <Reveal as="section" index={1}>
        <Section as="div" maxWidth={1080} paddingBlockStart="0px" paddingBlockEnd="0px">
          <TabBar items={tabs} activeHref={`/${locale}/about`} />
        </Section>
      </Reveal>

      {/* Purpose + three lines of work */}
      <Reveal as="section" index={2}>
        <Section as="div" maxWidth={1080} paddingBlockStart="52px" paddingBlockEnd="52px">
          <Eyebrow className="mb-3">{content.purpose.eyebrow}</Eyebrow>
          <h2 className="mb-4 max-w-[780px] max-[860px]:text-[clamp(24px,7vw,34px)]">
            {withLineBreaks(content.purpose.title)}
          </h2>
          <p className="mb-[34px] max-w-[720px] text-base leading-[1.7] text-neutral-800">{content.purpose.body}</p>

          <div className="border-y-2 border-s-2 border-e-2 border-divider">
            <CellGrid cols={3}>
              {aboutContent.pillars.map((pillar) => (
                <Cell key={pillar.number} hoverTint paddingBlockStart="28px" paddingBlockEnd="28px" className="gap-3">
                  <span className="font-heading text-[13px] font-extrabold text-neutral-700">{pillar.number}</span>
                  <h3 className="m-0 text-[22px] max-[860px]:text-[clamp(19px,5.2vw,24px)]">{t(locale, pillar.title)}</h3>
                  <p className="m-0 text-[14px] leading-[1.65] text-neutral-800">{t(locale, pillar.body)}</p>
                  <div className="mt-1 font-heading text-[11px] font-extrabold tracking-[0.12em] text-accent-700">
                    {t(locale, pillar.meansLabel)}
                  </div>
                  <ul className="m-0 flex list-disc flex-col gap-1.5 ps-4 text-[13.5px] leading-[1.6] text-neutral-800">
                    {t(locale, pillar.means).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <Link href={`/${locale}${pillar.hrefSlug}`} className={`${arrowLinkClass} mt-auto pt-2`}>
                    {arrowLabel(locale, t(locale, pillar.linkLabel))}
                  </Link>
                </Cell>
              ))}
            </CellGrid>
          </div>
        </Section>
      </Reveal>

      {/* Sarah Schenirer */}
      <Reveal as="section" index={3}>
        <Section
          as="div"
          maxWidth={1080}
          paddingBlockStart="72px"
          paddingBlockEnd="72px"
          innerClassName="relative grid grid-cols-1 items-center gap-11 min-[861px]:grid-cols-[4fr_8fr]"
        >
          <div className="absolute top-8 end-8 leading-none">
            <EqualizerDots tone="light" />
          </div>
          <Figure
            grayscale={false}
            src="/assets/schenirer-logo-portrait.png"
            alt={t(locale, aboutContent.schenirer.imageLabel)}
            aspectRatio="3/4"
            className="w-full"
            mediaClassName="bg-tint-cream object-contain"
          />
          <div>
            <Eyebrow className="mb-3">{t(locale, aboutContent.schenirer.eyebrow)}</Eyebrow>
            <h2 className="mb-3.5 max-[860px]:text-[clamp(24px,7vw,34px)]">{t(locale, aboutContent.schenirer.name)}</h2>
            {t(locale, aboutContent.schenirer.paragraphs).map((paragraph, i) => (
              <p
                key={i}
                className={`m-0 max-w-[580px] leading-[1.75] text-neutral-800 ${i === 0 ? 'mb-4 text-[15.5px]' : 'mb-4 text-[15px]'}`}
              >
                {paragraph}
              </p>
            ))}
            <p className="m-0 mb-4 max-w-[580px] text-[12.5px] leading-[1.6] text-neutral-700">
              {t(locale, aboutContent.schenirer.sources)}
            </p>
            <Link href={`/${locale}/story`} className={arrowLinkClass}>
              {arrowLabel(locale, t(locale, aboutContent.schenirer.timelineLinkLabel))}
            </Link>
          </div>
        </Section>
      </Reveal>

      {/* Transparency + Team */}
      <Reveal as="section" index={4}>
        <Section
          as="div"
          maxWidth={1080}
          paddingBlockStart="48px"
          paddingBlockEnd="48px"
          innerClassName="grid grid-cols-1 gap-10 min-[861px]:grid-cols-2"
        >
          <div>
            <Eyebrow className="mb-3">{t(locale, aboutContent.transparency.eyebrow)}</Eyebrow>
            <p className="m-0 text-[15px] leading-[1.7] text-neutral-800">
              {t(locale, aboutContent.transparency.bodyPrefix)}{' '}
              <a
                href={`mailto:${aboutContent.transparency.email}`}
                className="focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {aboutContent.transparency.email}
              </a>
            </p>
          </div>
          <div>
            <Eyebrow className="mb-3">{t(locale, aboutContent.team.eyebrow)}</Eyebrow>
            <p className="m-0 text-[15px] leading-[1.7] text-neutral-800">{t(locale, aboutContent.team.body)}</p>
          </div>
        </Section>
      </Reveal>

      {/* By the numbers */}
      <Reveal as="section" index={5}>
        <Section as="div" maxWidth={1080} paddingBlockStart="48px" paddingBlockEnd="24px">
          <Eyebrow className="mb-2.5">{t(locale, aboutContent.stats.eyebrow)}</Eyebrow>
          <p className="m-0 mb-[30px] max-w-[620px] text-[15px] leading-[1.7] text-neutral-800">
            {t(locale, aboutContent.stats.leadPrefix)}
            {/* he: "מסומנים ב" is a prefix letter glued to the next word, no
                space; en: "marked with a" is a standalone word and needs one. */}
            {locale === 'en' ? ' ' : ''}
            <span className="border-b border-dotted border-accent text-accent-700">{t(locale, aboutContent.stats.leadDotted)}</span>
            {t(locale, aboutContent.stats.leadSuffix)}
          </p>
          <CellGrid cols={4} bottomDivider>
            {aboutContent.stats.tiles.map((tile, i) => (
              <Cell key={i} paddingInline="26px" paddingBlockStart="26px" paddingBlockEnd="26px">
                <StatTile tile={tile} locale={locale} />
              </Cell>
            ))}
          </CellGrid>
        </Section>
      </Reveal>

      {/* Facts */}
      <Reveal as="section" index={6}>
        <Section as="div" maxWidth={1080} paddingBlockStart="48px" paddingBlockEnd="48px">
          <Eyebrow className="mb-2.5">{t(locale, aboutContent.facts.eyebrow)}</Eyebrow>
          <p className="m-0 mb-7 max-w-[620px] text-[15px] leading-[1.7] text-neutral-800">{t(locale, aboutContent.facts.lead)}</p>
          <CellGrid cols={2}>
            {aboutContent.facts.items.map((fact, i) => {
              const isLastRow = i >= aboutContent.facts.items.length - 2
              return (
                <Cell
                  key={i}
                  paddingInline="26px"
                  paddingBlockStart="22px"
                  paddingBlockEnd="22px"
                  className={!isLastRow ? 'border-b-2 border-divider' : undefined}
                >
                  <p className="m-0 text-[15px] leading-[1.65]">{t(locale, fact)}</p>
                </Cell>
              )
            })}
          </CellGrid>
        </Section>
      </Reveal>
    </>
  )
}
