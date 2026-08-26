import { Fragment, type ReactNode } from 'react'

import { EventGalleryCard } from '@/components/media/EventGalleryCard'
import { eventGalleries } from '@/content/media'
import { pressItemHref } from '@/content/press-archive'
import {
  activismArchiveSection,
  activismFaqSection,
  activismHalachaCards,
  activismImageSlots,
  activismPillars,
  activismPositionPapers,
  activismPositionPapersEyebrow,
  activismPositionPapersPlaceholder,
  type ActivismPillar,
} from '@/content/activism'
import { getActivismContent, getActivismFaqs, getPressArchiveItems } from '@/lib/cms'
import { arrowForward, t, type Locale, type Localized } from '@/lib/i18n'

/** Renders a `\n`-joined CMS string's line breaks as real `<br>`s — same convention as the About/Story pages' fixture `\n` markers. */
function withLineBreaks(text: string): ReactNode {
  const lines = text.split('\n')
  return lines.map((line, i) => (
    <Fragment key={i}>
      {line}
      {i < lines.length - 1 ? <br /> : null}
    </Fragment>
  ))
}
import { Accordion, Button, Cell, CellGrid, Eyebrow, Figure, ImageSlot, Reveal, Section, SectionHead, Tag } from '@/components/ui'
import { EqualizerDots } from './EqualizerDots'

/**
 * Hero jump-nav (2026-08-13 brief: "תבנה כמו דף נחיתה שיהיה קל לדלג בין
 * הסקשנים" — build multi-topic pages like a landing page, easy to jump
 * between sections). One `Button` per major section on this page, same
 * primary/secondary pattern the Media page's hero already uses.
 */
const heroJumpLinks = [
  { href: '#legal', label: { he: 'למשפט והלכה ↓', en: 'Law & Halakha ↓' } satisfies Localized },
  { href: '#gatherings', label: { he: 'לכנסים ולגלריות ↓', en: 'Gatherings & galleries ↓' } satisfies Localized },
  { href: '#archive', label: { he: 'לארכיון ↓', en: 'Archive ↓' } satisfies Localized },
] as const

/**
 * "כנסים, הקרנות וגלריות" / "Conferences, screenings & galleries" — moved
 * here from the Media page (2026-08-13 brief, follow-up: "כנסים ושטח צריך
 * לעבור לאקטיביזם" — conferences/field-work belongs on the Activism page,
 * as real photographic evidence of the "כנסים"/Gatherings section right
 * above it, not filed under generic media). Reuses `eventGalleries` +
 * `EventGalleryCard` from `content/media.ts`/`components/media` as-is — the
 * data and card component didn't move, just where they're rendered.
 */
const galleriesSectionText = {
  eyebrow: { he: 'כנסים ושטח', en: 'GATHERINGS, ON FILM' } satisfies Localized,
  title: { he: 'כנסים, הקרנות וגלריות', en: 'Conferences, screenings & galleries' } satisfies Localized,
  lead: { he: 'כל אירוע והגלריה שלו.', en: 'Every event and its photo gallery.' } satisfies Localized,
}

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent focus-visible:rounded-[1px]'

/**
 * The two named sections requested for this page (item 15: "דף אקטיביזם
 * צריך להתחלק: משפט והלכה, כנסים" — split the page into "Law & Halakha" and
 * "Gatherings"). This is page-chrome for the new `SectionHead` banners
 * below, not editorial content pulled from `src/content/activism.ts` — this
 * component is this task's sole ownership boundary, so the copy is kept
 * local here rather than added to that shared fixture file.
 *
 * Content mapping (every existing fact/quote/link is kept, only regrouped
 * — nothing below is new copy about the org's work, only new section
 * labels):
 *  - "משפט והלכה" / Law & Halakha: the בג"ץ bylaws-lawsuit pillar, the
 *    selected position-papers links, the two halakha ruling cards, and the
 *    FAQ accordion (five of its six questions are explicitly legal/
 *    halakhic — "does halakha forbid...", "what's actually blocking it",
 *    "the Court ruled in 2019, why still none", "is Nivcharot forming a
 *    women's party", "isn't Haredi feminism a contradiction" — only the
 *    opening survey-numbers question sits closer to public sentiment than
 *    law; splitting the accordion apart for one question would break its
 *    own 01-06 numbering, so the whole block stays together here).
 *  - "כנסים" / Gatherings: the #מחאת_הכסאות street protest, the Knesset
 *    lobby/committee pillar, and the שיח.ה community-circles pillar — three
 *    different ways of convening people, in the street, in committee
 *    rooms, and in living rooms.
 *  - Left OUTSIDE both buckets by design: the hero (introduces the whole
 *    page before either section starts) and the closing "מהארכיון" archive
 *    grid, which is a mixed-content further-reading footer (one welfare
 *    paper, one court ruling, pending petitions, lobby papers) playing the
 *    same closing-appendix role every other page's own archive/stats/facts
 *    block plays — filing it into one bucket would misclassify roughly
 *    half its entries.
 */
const activismSectionGroups = {
  legal: {
    eyebrow: { he: 'משפט והלכה', en: 'LAW & HALAKHA' } satisfies Localized,
    title: { he: 'הזירה המשפטית וההלכתית', en: 'The legal and halakhic arena' } satisfies Localized,
    lead: {
      he: 'מהמאבק המשפטי נגד תקנוני המפלגות ועד המקורות ההלכתיים עצמם: כאן נמצאות התשובות הכתובות לשאלה אם יש מניעה חוקית או הלכתית לייצוג נשים חרדיות.',
      en: "From the legal fight against party bylaws to the halakhic sources themselves: the written answers to whether any legal or halakhic barrier stands in the way of Haredi women's representation.",
    } satisfies Localized,
  },
  gatherings: {
    eyebrow: { he: 'כנסים', en: 'GATHERINGS' } satisfies Localized,
    title: { he: 'מהרחוב לוועדות הכנסת', en: 'From the street to the Knesset committees' } satisfies Localized,
    lead: {
      he: 'המחאה הציבורית, השדולה בכנסת וחוגי הבית: הזירות שבהן נבחרות מכנסת אנשים, בשטח ובקהילה, כדי להזיז את הקיר.',
      en: 'Public protest, the Knesset lobby and home discussion circles: the arenas where Nivcharot gathers people, on the ground and in the community, to move the wall.',
    } satisfies Localized,
  },
} as const

const activismPositionPapersSection = {
  title: { he: 'ניירות עמדה', en: 'Position papers' } satisfies Localized,
  lead: {
    he: 'המסמכים והקישורים הקיימים באתר, כפי שהם, ללא השלמת תוכן שלא קיים.',
    en: 'The documents and links already available on the site, without filling in missing material.',
  } satisfies Localized,
}

/**
 * "לפודקאסט ←" / "→ To podcast" — a label with the reading-direction arrow
 * appended (Hebrew) or prepended (English), per `arrowForward`'s doc.
 */
function ArrowLabel({ locale, children }: { locale: Locale; children: ReactNode }) {
  const arrow = arrowForward(locale)
  return locale === 'he' ? (
    <>
      {children} {arrow}
    </>
  ) : (
    <>
      {arrow} {children}
    </>
  )
}

function PillarText({ pillar, locale }: { pillar: ActivismPillar; locale: Locale }) {
  return (
    <div>
      <Eyebrow className="mb-2.5">{t(locale, pillar.eyebrow)}</Eyebrow>
      <h3 className="mb-2.5 text-[24px] leading-[1.2]">{t(locale, pillar.title)}</h3>
      <p className="text-[15px] leading-[1.7] text-neutral-800">{t(locale, pillar.body)}</p>
    </div>
  )
}

function PillarImage({ label }: { label: string }) {
  return (
    <Figure grayscale>
      <ImageSlot shape="rect" label={label} className="w-full" style={{ height: 260 }} />
    </Figure>
  )
}

export async function ActivismPage({ locale }: { locale: Locale }) {
  const [content, faqs, pressArchiveItemsSorted] = await Promise.all([
    getActivismContent(locale),
    getActivismFaqs(locale),
    getPressArchiveItems(),
  ])

  return (
    <>
      {/* Hero */}
      <Reveal as="section">
        <Section as="div" maxWidth={1080} paddingBlockStart="64px" paddingBlockEnd="40px">
          <Eyebrow className="mb-3.5">{content.hero.eyebrow}</Eyebrow>
          <h1 className="mb-5 text-[clamp(36px,5vw,56px)] leading-[1.08]">{withLineBreaks(content.hero.title)}</h1>
          <p className="mb-7 max-w-[660px] text-[17px] leading-[1.7] text-neutral-800">{content.hero.body}</p>
          <div className="flex flex-wrap gap-3">
            {heroJumpLinks.map((link, i) => (
              <Button key={link.href} href={link.href} variant={i === 0 ? 'primary' : 'secondary'}>
                {t(locale, link.label)}
              </Button>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* ===== Section: משפט והלכה / Law & Halakha ===== */}

      {/* בג"ץ pillar + selected position papers */}
      <Reveal as="section">
        <Section as="div" id="legal" maxWidth={1080} paddingBlockStart="8px" paddingBlockEnd="64px">
          <SectionHead
            className="mb-2"
            eyebrow={t(locale, activismSectionGroups.legal.eyebrow)}
            title={t(locale, activismSectionGroups.legal.title)}
            lead={t(locale, activismSectionGroups.legal.lead)}
          />
          <div className="grid grid-cols-1 items-center gap-10 py-8 min-[861px]:grid-cols-2">
            <PillarText pillar={activismPillars.bagatz} locale={locale} />
            <PillarImage label={t(locale, activismImageSlots.bagatz.label)} />
          </div>
          <div className="border-t-2 border-divider pt-8">
            <Eyebrow className="mb-4">{t(locale, activismPositionPapersEyebrow)}</Eyebrow>
            <h3 className="mb-3">{t(locale, activismPositionPapersSection.title)}</h3>
            <p className="mb-5 max-w-[640px] text-[15px] leading-[1.7] text-neutral-800">
              {t(locale, activismPositionPapersSection.lead)}
            </p>
            <div className="flex max-w-[720px] flex-col gap-3">
              {activismPositionPapers.map((link) =>
                link.href ? (
                  <a
                    key={t(locale, link.label)}
                    href={link.href}
                    className={`text-[15px] font-semibold ${FOCUS_RING}`}
                  >
                    <ArrowLabel locale={locale}>{t(locale, link.label)}</ArrowLabel>
                  </a>
                ) : (
                  /*
                   * The old nivcharot.co.il pages these pointed to are going
                   * offline (2026-08-13 brief, item 33) and have no new home
                   * yet — same "no link, dotted placeholder" treatment as
                   * activismHalachaCards.second below, rather than linking to
                   * a domain that's about to 404.
                   */
                  <span key={t(locale, link.label)} className="flex flex-wrap items-baseline gap-2 text-[15px] font-semibold text-neutral-700">
                    {t(locale, link.label)}
                    <span className="border-b border-dotted border-accent text-[12.5px] text-accent-700">
                      {t(locale, activismPositionPapersPlaceholder)}
                    </span>
                  </span>
                ),
              )}
            </div>
          </div>
        </Section>
      </Reveal>

      {/* Halakha — two rulings (subsection of "משפט והלכה" above, hence h3) */}
      <Reveal as="section">
        <Section as="div" id="halacha" maxWidth={1080} paddingBlockStart="64px" paddingBlockEnd="8px">
          <Eyebrow className="mb-2.5">{content.halakha.eyebrow}</Eyebrow>
          <h3 className="mb-3">{content.halakha.title}</h3>
          <p className="mb-[30px] max-w-[660px] text-[15.5px] leading-[1.7] text-neutral-800">
            {content.halakha.body}
          </p>
          {/*
            Hand-rolled, not CellGrid: this 2-card row's border convention
            differs from CellGrid's ("no border on the last column cell") —
            here BOTH cards carry border-inline-end (see docs/Activism.dc.html
            :161-174), with the container's own border-inline-start/block
            plus a -2px inline-end margin absorbing the second card's edge.
          */}
          <div className="-me-[2px] grid grid-cols-1 border-s-2 border-y-2 border-divider min-[861px]:grid-cols-2">
            <div className="flex flex-col gap-2.5 border-e-2 border-divider px-[26px] py-[30px]">
              <Tag variant="outline" className="self-start">
                {t(locale, activismHalachaCards.first.tag)}
              </Tag>
              <h4 className="mt-1.5 text-[22px] leading-[1.25]">{t(locale, activismHalachaCards.first.title)}</h4>
              <p className="text-[14.5px] leading-[1.7] text-neutral-800">
                {t(locale, activismHalachaCards.first.body)}
              </p>
              <a
                href={`/${locale}${activismHalachaCards.first.href}`}
                className={`mt-auto self-start pt-2.5 text-[14px] font-semibold ${FOCUS_RING}`}
              >
                <ArrowLabel locale={locale}>{t(locale, activismHalachaCards.first.linkLabel)}</ArrowLabel>
              </a>
            </div>
            <div className="flex flex-col gap-2.5 border-e-2 border-divider px-[26px] py-[30px]">
              <Tag variant="outline" className="self-start">
                {t(locale, activismHalachaCards.second.tag)}
              </Tag>
              <h4 className="mt-1.5 text-[22px] leading-[1.25]">{t(locale, activismHalachaCards.second.title)}</h4>
              <p className="text-[14.5px] leading-[1.7] text-neutral-800">
                {t(locale, activismHalachaCards.second.body)}
              </p>
              {/*
                Explicit, intentional placeholder in the mockup — no link,
                no invented URL. See src/content/activism.ts.
              */}
              <span className="mt-auto self-start border-b border-dotted border-accent pt-2.5 text-[12.5px] text-accent-700">
                {t(locale, activismHalachaCards.second.placeholderLabel)}
              </span>
            </div>
          </div>
        </Section>
      </Reveal>

      {/* FAQ accordion (subsection of "משפט והלכה" above, hence h3 — see the
          content-mapping comment near activismSectionGroups: mostly
          legal/halakhic questions, kept together as one accordion) */}
      <Reveal as="section">
        <Section as="div" tint="tint-cream" borderBlock maxWidth={1080} paddingBlockStart="64px" paddingBlockEnd="64px">
          <Eyebrow className="mb-2.5">{t(locale, activismFaqSection.eyebrow)}</Eyebrow>
          <h3 className="mb-3">{t(locale, activismFaqSection.title)}</h3>
          <p className="mb-[30px] max-w-[620px] text-[15.5px] leading-[1.7] text-neutral-800">
            {t(locale, activismFaqSection.lead)}
          </p>
          <Accordion
            className="max-w-[840px] border-t-2 border-divider"
            /*
              Shared-component gap: Accordion's trigger button hardcodes
              `items-center gap-6` (see src/components/ui/Accordion.tsx).
              The mockup wants `align-items:flex-start; gap:16px` on this
              row (number badge + wrapping question text + the "+" icon all
              top-aligned, 16px apart) — `!` (important) overrides below get
              there without editing the shared component.
            */
            triggerClassName={`!items-start !gap-4 px-1 py-5 font-heading text-[17.5px] font-extrabold leading-[1.35] text-text hover:text-accent-700 focus-visible:text-accent-700`}
            panelClassName="ms-[34px] max-w-[640px] px-1 pb-6"
            items={faqs.map((faq) => ({
              id: faq.id,
              trigger: (
                <span className="flex items-start gap-4">
                  <span className="flex-none pt-[5px] font-heading text-xs font-extrabold text-accent-700">
                    {faq.number}
                  </span>
                  <span className="flex-1">{faq.question}</span>
                </span>
              ),
              children: faq.answerParagraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? 'text-[15px] leading-[1.75] text-neutral-800'
                      : 'mt-2.5 text-[12.5px] leading-[1.5] text-neutral-700'
                  }
                >
                  {paragraph}
                </p>
              )),
            }))}
          />
        </Section>
      </Reveal>

      {/* ===== Section: כנסים / Gatherings ===== */}
      <Reveal as="section">
        <Section as="div" id="gatherings" maxWidth={1080} paddingBlockStart="64px" paddingBlockEnd="64px">
          <SectionHead
            className="mb-2"
            eyebrow={t(locale, activismSectionGroups.gatherings.eyebrow)}
            title={t(locale, activismSectionGroups.gatherings.title)}
            lead={t(locale, activismSectionGroups.gatherings.lead)}
          />
          <div className="grid grid-cols-1 items-center gap-10 py-8 min-[861px]:grid-cols-2">
            <PillarImage label={t(locale, activismImageSlots.chairs.label)} />
            <PillarText pillar={activismPillars.chairs} locale={locale} />
          </div>
          <div className="grid grid-cols-1 gap-10 py-8 min-[861px]:grid-cols-2">
            <PillarText pillar={activismPillars.knesset} locale={locale} />
            <PillarText pillar={activismPillars.community} locale={locale} />
          </div>
          <div className="mt-4 border-t-2 border-divider pt-8">
            <Eyebrow className="mb-2.5">{t(locale, galleriesSectionText.eyebrow)}</Eyebrow>
            <h4 className="mb-2 text-[22px] leading-[1.25]">{t(locale, galleriesSectionText.title)}</h4>
            <p className="mb-6 max-w-[620px] text-[15px] leading-[1.7] text-neutral-800">
              {t(locale, galleriesSectionText.lead)}
            </p>
            <div className="grid grid-cols-1 gap-7 min-[560px]:grid-cols-2 min-[861px]:grid-cols-3">
              {eventGalleries.map((gallery) => (
                <EventGalleryCard key={gallery.slug} gallery={gallery} locale={locale} />
              ))}
            </div>
          </div>
        </Section>
      </Reveal>

      {/* Archive: position papers & legislation */}
      <Reveal as="section">
        <Section as="div" id="archive" paddingBlockStart="72px" paddingBlockEnd="72px" innerClassName="relative">
          <EqualizerDots className="absolute top-8 end-8" />
          <div className="mb-[22px] flex flex-col items-start gap-3">
            <div className="flex flex-1 items-center justify-between gap-[22px]">
              <h2>{t(locale, activismArchiveSection.title)}</h2>
            </div>
            <a href={`/${locale}${activismArchiveSection.href}`} className={`text-[14px] font-semibold ${FOCUS_RING}`}>
              <ArrowLabel locale={locale}>{t(locale, activismArchiveSection.linkLabel)}</ArrowLabel>
            </a>
          </div>
          <CellGrid cols={4}>
            {pressArchiveItemsSorted.slice(0, 4).map((entry) => {
              const { href, external } = pressItemHref(entry.link, locale)
              return (
                <Cell
                  key={entry.slug}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener' : undefined}
                  hoverTint
                  className="gap-2"
                >
                  <span className="font-heading text-[13px] font-extrabold text-accent-700">{t(locale, entry.dateLabel)}</span>
                  <span className="font-heading text-[17px] font-extrabold leading-[1.35]">
                    {t(locale, entry.title)}
                  </span>
                  <span className="text-[13.5px] leading-[1.6] text-neutral-700">{t(locale, entry.summary)}</span>
                </Cell>
              )
            })}
          </CellGrid>
        </Section>
      </Reveal>
    </>
  )
}
