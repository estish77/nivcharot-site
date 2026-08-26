import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Fragment, type ReactNode } from 'react'

import { Cell, CellGrid, Eyebrow, Figure, ImageSlot, Reveal, Section, TabBar } from '@/components/ui'
import type { TabBarItem } from '@/components/ui'
import { EqualizerDots } from '@/components/story/EqualizerDots'
import { Timeline } from '@/components/story/Timeline'
import { storyContent } from '@/content/story'
import { pressItemHref } from '@/content/press-archive'
import { getPressArchiveItems, getStoryContent, getStoryTimeline } from '@/lib/cms'
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
    title: t(locale, { he: 'הסיפור שלנו', en: 'Our story' }),
    description: t(locale, storyContent.hero.kicker),
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

function arrowLabel(locale: Locale, label: string): string {
  const arrow = arrowForward(locale)
  return locale === 'he' ? `${label} ${arrow}` : `${arrow} ${label}`
}

const arrowLinkClass =
  'inline-block font-semibold text-[14px] no-underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default async function StoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()
  const locale = rawLocale
  const [hero, timelineMilestones, pressArchiveItemsSorted] = await Promise.all([
    getStoryContent(locale),
    getStoryTimeline(),
    getPressArchiveItems(),
  ])

  const tabs: TabBarItem[] = [
    { label: t(locale, { he: 'אודות', en: 'About' }), href: `/${locale}/about` },
    { label: t(locale, { he: 'הסיפור שלנו', en: 'Our story' }), href: `/${locale}/story` },
    { label: t(locale, { he: 'הצוות', en: 'Team' }), href: `/${locale}/team` },
  ]

  const images = t(locale, storyContent.images)

  return (
    <>
      {/* Hero */}
      <Reveal as="section">
        <Section as="div" maxWidth={1080} paddingBlockStart="64px" paddingBlockEnd="40px">
          <Eyebrow className="mb-3.5">{hero.eyebrow}</Eyebrow>
          <h1 className="m-0 mb-5 text-[clamp(36px,5vw,60px)] leading-[1.08]">{withLineBreaks(hero.title)}</h1>
          <p className="m-0 mb-5 max-w-[520px] text-[clamp(17px,2vw,22px)] font-heading font-extrabold leading-[1.4] text-accent-700">
            {t(locale, storyContent.hero.kicker)}
          </p>
          <p className="m-0 max-w-[640px] text-[17px] leading-[1.65] text-neutral-800">{withLineBreaks(hero.body)}</p>
        </Section>
      </Reveal>

      {/* About / Story / Team tabs */}
      <Reveal as="section">
        <Section as="div" maxWidth={1080} paddingBlockStart="0px" paddingBlockEnd="12px">
          <TabBar items={tabs} activeHref={`/${locale}/story`} />
        </Section>
      </Reveal>

      {/* Timeline + closing archive photos */}
      <Reveal as="section">
        <Section as="div" maxWidth={1080} paddingBlockStart="0px" paddingBlockEnd="72px">
          <Timeline locale={locale} milestones={timelineMilestones} sidebarLabel={t(locale, storyContent.sidebarLabel)} />

          <div className="mt-7 grid grid-cols-1 gap-5 border-t-2 border-divider pt-7 min-[861px]:grid-cols-3">
            {images.map((image) => (
              <Figure key={image.id} grayscale>
                <ImageSlot label={image.label} className="w-full" style={{ height: 220 }} />
              </Figure>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* CTA band */}
      <Reveal as="section" className="relative bg-accent">
        <div className="absolute top-8 end-8 leading-none">
          <EqualizerDots tone="accent" />
        </div>
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-8 px-8 py-14">
          <h2 className="m-0 text-[clamp(26px,3.5vw,40px)] text-white">{t(locale, storyContent.cta.title)}</h2>
          <Link
            href={`/${locale}${storyContent.cta.hrefSlug}`}
            className="inline-block whitespace-nowrap px-[22px] py-3 font-heading text-[15px] font-extrabold text-accent no-underline transition-colors duration-200 ease-out hover:text-accent-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white bg-white"
          >
            {t(locale, storyContent.cta.buttonLabel)}
          </Link>
        </div>
      </Reveal>

      {/* From the archive */}
      <Reveal as="section">
        <Section as="div" maxWidth={1240} paddingBlockStart="72px" paddingBlockEnd="72px" innerClassName="relative">
          <div className="absolute top-8 end-8 leading-none">
            <EqualizerDots tone="light" />
          </div>
          <div className="mb-[22px] flex flex-col items-start gap-3">
            <h2 className="m-0">{t(locale, storyContent.archiveHead.title)}</h2>
            <Link href={`/${locale}${storyContent.archiveHead.hrefSlug}`} className={arrowLinkClass}>
              {arrowLabel(locale, t(locale, storyContent.archiveHead.linkLabel))}
            </Link>
          </div>
          <CellGrid cols={4}>
            {pressArchiveItemsSorted.slice(0, 4).map((post) => {
              const { href, external } = pressItemHref(post.link, locale)
              return (
                <Cell
                  key={post.slug}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener' : undefined}
                  className="gap-2"
                >
                  <span className="font-heading text-[13px] font-extrabold text-accent-700">{t(locale, post.dateLabel)}</span>
                  <span className="font-heading text-[17px] font-extrabold leading-[1.35]">{t(locale, post.title)}</span>
                  <span className="text-[13.5px] leading-[1.6] text-neutral-700">{t(locale, post.summary)}</span>
                </Cell>
              )
            })}
          </CellGrid>
        </Section>
      </Reveal>
    </>
  )
}
