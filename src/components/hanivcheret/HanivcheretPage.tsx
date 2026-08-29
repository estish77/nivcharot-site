import Link from 'next/link'

import {
  hanivcheretCurriculum,
  hanivcheretCurriculumEyebrow,
  hanivcheretHero,
  hanivcheretHeroImageSlot,
  hanivcheretHeroMedia,
  hanivcheretHeroVideoTitle,
  hanivcheretQuotesEyebrow,
  resolveHeroMedia,
} from '@/content/hanivcheret'
import { getHanivcheretContent } from '@/lib/cms'
import { AlumnaeWall } from './AlumnaeWall'
import { t, type Locale, type Localized } from '@/lib/i18n'
import { Button, Carousel, Cell, CellGrid, Eyebrow, Figure, ImageSlot, Reveal, Section, SeatHall, SectionHead, Tag, cn } from '@/components/ui'
import { AlumnaeVideosSection } from './AlumnaeVideosSection'
import { ApplySection } from './ApplySection'
import { NivcharotVoicesSection } from './NivcharotVoicesSection'

const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Consistency fix (item 12 audit): the Curriculum and Alumnae-voices
 * sections below had only an `Eyebrow`, no real `<h2>` — unlike every other
 * section on this page/site, which pairs Eyebrow + h2 (+ optional lead) via
 * `SectionHead`. These two h2 strings are page-chrome filling that gap, not
 * editorial content, so (matching the same call made for Activism's new
 * section headers) they're kept local here rather than added to
 * `src/content/hanivcheret.ts`, which is outside this task's ownership.
 */
const hanivcheretSectionTitles = {
  /** Summarizes the four curriculum pillar titles already in `hanivcheretCurriculum` (ידע/כלים/קהילה/עשייה) — no new claims. */
  curriculum: { he: 'ידע, כלים, קהילה ועשייה', en: 'Knowledge, tools, community, action' } satisfies Localized,
  quotes: { he: 'במילים שלהן', en: 'In their own words' } satisfies Localized,
}

function HeroMedia({ locale }: { locale: Locale }) {
  const media = resolveHeroMedia(hanivcheretHeroMedia)
  const isHe = locale === 'he'

  if (media.showVideo) {
    return (
      <div
        className={cn(
          'block w-full border-2 bg-[#141210]',
          isHe ? 'aspect-video border-niv-slate' : 'h-[400px] border-divider',
        )}
      >
        <iframe
          title={t(locale, hanivcheretHeroVideoTitle)}
          src={media.embedUrl}
          className="block h-full w-full border-0"
          allow="encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <Figure grayscale>
      <ImageSlot shape="rect" label={t(locale, hanivcheretHeroImageSlot.label)} className="w-full" style={{ height: 400 }} />
    </Figure>
  )
}

/**
 * The mockup's Hebrew and English hero sections are not a plain text
 * translation of one another — they differ structurally (see
 * src/content/hanivcheret.ts's top comment for the full breakdown: wordmark
 * vs. literal `<h1>`, decorative seat-hall SVG vs. none, a separate
 * video/image section vs. one embedded in the hero grid). This component
 * preserves that asymmetry rather than fabricating parity between locales,
 * branching only where the source itself branches — everything else
 * (curriculum grid, quotes carousel, hero media resolution) is fully shared.
 */
export async function HanivcheretPage({ locale }: { locale: Locale }) {
  const isHe = locale === 'he'
  const ctaHref = `/${locale}${hanivcheretHero.cta.href}`
  const hero = await getHanivcheretContent(locale)

  return (
    <>
      {isHe ? (
        <Reveal as="section">
          <Section
            as="div"
            maxWidth={1240}
            paddingBlockStart="64px"
            paddingBlockEnd="52px"
            innerClassName="grid grid-cols-1 items-center gap-14 min-[861px]:grid-cols-[7fr_5fr]"
          >
            <div>
              {/*
                The source has no <h1> here at all (just a logo image,
                "assets/hanivcheret-logo.png", which — like the sitewide
                logo — doesn't exist as a real asset). Rendered as a styled
                text wordmark inside a real <h1> instead of an <img>, both
                so it's trivial to swap for the real file later and so the
                page has a valid h1 (the source's image-only hero left the
                page with none).
              */}
              <h1 className="mb-[26px] max-w-[470px] text-[clamp(38px,5vw,60px)] leading-[1.05]">
                {hero.title}
                {locale === 'he' ? (
                  <span className="sr-only">, {t(locale, hanivcheretHero.titleSrOnlySuffix)}</span>
                ) : null}
              </h1>
              <p className="mb-3 max-w-[600px] text-[17.5px] leading-[1.7] text-niv-slate">
                {hero.body}
              </p>
              <p className="mb-7 max-w-[600px] text-[15px] leading-[1.7] text-neutral-700">
                {t(locale, hanivcheretHero.bodySecondary)}
              </p>
              <Link
                href={ctaHref}
                className={cn(
                  /*
                   * Consistency fix (item 12 audit): this was the only
                   * button/tag/tab hover state in the entire codebase that
                   * didn't land on the sitewide "hover -> bg-niv-slate,
                   * text-white" convention (see Button/Tag/TabBar/Carousel/
                   * globals.css .btn-*) — worse, it used a raw `text-black`
                   * that isn't one of this project's design tokens at all.
                   * This button's own DEFAULT is already niv-slate (an
                   * intentional dark-on-cream look for this hero, see the
                   * file's own top comment on he/en asymmetry), so hovering
                   * to niv-slate again would be invisible; hover moves to
                   * `bg-accent` instead — an approved solid-fill use of the
                   * brand red — paired with `text-white`, exactly like every
                   * other accent/niv-slate fill on the site (never black).
                   */
                  'inline-block whitespace-nowrap bg-niv-slate px-[26px] py-[13px] font-heading text-[15px] font-extrabold text-niv-cream no-underline transition-colors duration-[250ms] ease-out hover:bg-accent hover:text-white',
                  'focus-visible:bg-accent focus-visible:text-white',
                  FOCUS_RING,
                )}
              >
                {t(locale, hanivcheretHero.cta.label)}
              </Link>
            </div>
            <div className="flex min-w-0 items-center justify-center py-2">
              <SeatHall
                locale={locale}
                ariaLabel={hanivcheretHero.seatHallAriaLabel}
                sentence={hanivcheretHero.seatHallSentence}
              />
            </div>
          </Section>
        </Reveal>
      ) : (
        <Reveal as="section">
          <Section
            as="div"
            maxWidth={1240}
            paddingBlockStart="64px"
            paddingBlockEnd="48px"
            innerClassName="grid grid-cols-1 items-center gap-12 min-[861px]:grid-cols-[7fr_5fr]"
          >
            <div>
              <div className="mb-3.5 flex items-center gap-3">
                <Tag variant="accent">{t(locale, hanivcheretHero.tag)}</Tag>
                <Eyebrow as="span">{hero.eyebrow}</Eyebrow>
              </div>
              <h1 className="mb-5 text-[clamp(38px,5vw,60px)] leading-[1.05]">{hero.title}</h1>
              <p className="mb-3 max-w-[600px] text-[17px] leading-[1.7]">{hero.body}</p>
              <p className="mb-7 max-w-[600px] text-[15px] leading-[1.7] text-neutral-700">
                {t(locale, hanivcheretHero.bodySecondary)}
              </p>
              <Button href={ctaHref} variant="primary" size="md">
                {t(locale, hanivcheretHero.cta.label)}
              </Button>
            </div>
            <div>
              <HeroMedia locale={locale} />
            </div>
          </Section>
        </Reveal>
      )}

      {/*
        The mockup only shows the separate video/image section for the
        Hebrew branch — English embeds it directly in the hero grid above.
        See this file's top-level comment.
      */}
      {isHe ? (
        <Reveal as="section">
          <Section as="div" maxWidth={1240} paddingBlockStart="44px" paddingBlockEnd="8px">
            <HeroMedia locale={locale} />
          </Section>
        </Reveal>
      ) : null}

      {/* Curriculum: knowledge / tools / community / action */}
      <Reveal as="section">
        <Section as="div" maxWidth={1240} paddingBlockStart="48px" paddingBlockEnd="48px">
          {/*
            Consistency fix (item 12 audit): this section previously had
            only an Eyebrow with no real `<h2>` — every other section on
            this page and on every other page (About/Activism/Podcast) pairs
            Eyebrow + h2 + optional lead via `SectionHead`. The bare Eyebrow
            also broke the document's heading order (h1 straight to h3
            inside the cells, no h2 for the section itself).
          */}
          <SectionHead
            className="mb-6"
            eyebrow={t(locale, hanivcheretCurriculumEyebrow)}
            title={t(locale, hanivcheretSectionTitles.curriculum)}
          />
          <CellGrid cols={4}>
            {hanivcheretCurriculum.map((item) => (
              <Cell key={item.id} paddingInline="20px" paddingBlockStart="24px" paddingBlockEnd="24px">
                <h3 className="mb-2 text-[20px] leading-[1.2]">{t(locale, item.title)}</h3>
                <p className="text-[14px] leading-[1.6] text-neutral-800">{t(locale, item.body)}</p>
              </Cell>
            ))}
          </CellGrid>
        </Section>
      </Reveal>

      {/*
        Alumnae feedback. Was a carousel of six placeholder quotes credited
        to "שם הבוגרת · בוגרת מחזור N"; it now carries 20 real responses from
        cohorts 2 to 9, supplied 2026-08-29, as a wall of drifting cards.

        It reads the fixture directly rather than `getHanivcheretQuotes`:
        that getter is bound to the `alumnae-quotes` collection, whose rows
        are still the six placeholders and whose `name` field isn't
        localized, so it can neither hold these nor render them in English.
      */}
      <Reveal as="section">
        <Section as="div" maxWidth={1240} paddingBlockStart="48px" paddingBlockEnd="56px">
          <SectionHead
            className="mb-7"
            eyebrow={t(locale, hanivcheretQuotesEyebrow)}
            title={t(locale, hanivcheretSectionTitles.quotes)}
          />
          <AlumnaeWall locale={locale} />
        </Section>
      </Reveal>

      {/* Alumnae-speaking video grid (item 13) — see AlumnaeVideosSection.tsx for why its fixture is intentionally empty. */}
      <AlumnaeVideosSection locale={locale} />

      {/* Nivcharot activists speaking, from the movement's own media channel. */}
      <NivcharotVoicesSection locale={locale} />

      {/* What the programme is, and sign-up for the next cycle. */}
      <ApplySection locale={locale} />
    </>
  )
}
