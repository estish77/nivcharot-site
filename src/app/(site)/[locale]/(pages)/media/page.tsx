import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { MediaDesk } from '@/components/media/MediaDesk'
import { MediaMasthead, type MastheadStat } from '@/components/media/MediaMasthead'
import { Eyebrow, Reveal, Section } from '@/components/ui'
import { mediaDeskText } from '@/content/media-desk'
import { getArchivePosts, getElsewhereMediaItems, getPressArchiveItems } from '@/lib/cms'
import { isLocale, locales, t, type Locale } from '@/lib/i18n'
import { buildMediaEntries } from '@/lib/mediaEntries'
import { pageMetadata } from '@/lib/seo'

type Params = { locale: string }

/**
 * The media/press archive index.
 *
 * 2026-08-27 brief: this page used to be four long, independently filtered
 * sections stacked one under another — outside press coverage (70+
 * full-height rows), three grids of podcast/video/talk embeds, and the
 * archive-post grid with its own `?cat=&year=` server-side filter chips.
 * All the material was there, but reaching any of it meant scrolling past
 * everything above it, and nothing gave a view of the collection as a
 * whole.
 *
 * It is now a short masthead plus ONE explorer (`MediaDesk`) over exactly
 * the same, complete data: every source is normalized into a common row
 * shape (`buildMediaEntries`) with no field dropped, then searched,
 * faceted, sorted and paginated together. See `MediaDesk`'s own comment
 * for the interaction model, and `mediaEntries.ts` for the mapping.
 *
 * Filters live in client state rather than `?cat=&year=` search params
 * now: with one control surface spanning three formerly separate datasets,
 * round-tripping every chip click through the server (and re-rendering
 * every embed with it) cost far more than linkable filter URLs were worth.
 * The section anchors that other pages link to (`#in-the-media`,
 * `#elsewhere`, `#archive`) are preserved below and open the desk on the
 * matching bucket.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) return {}
  const locale = rawLocale

  return pageMetadata({
    locale,
    path: '/media',
    title: t(locale, { he: 'תקשורת וארכיון', en: 'Media & Archive' }),
    description: t(locale, {
      he: 'נבחרות בתקשורת: כתבות וריאיונות מהארכיון של נבחרות ומהעיתונות.',
      en: "Nivcharot in the media: articles and interviews from Nivcharot's own archive and outside press.",
    }),
  })
}

export default async function MediaArchivePage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) {
    notFound()
  }
  const locale: Locale = rawLocale

  const [press, elsewhere, posts] = await Promise.all([
    getPressArchiveItems(),
    getElsewhereMediaItems(),
    getArchivePosts(),
  ])

  const entries = buildMediaEntries(
    {
      press,
      podcasts: elsewhere.podcasts,
      videos: elsewhere.videos,
      talks: elsewhere.talks,
      posts,
    },
    locale,
  )

  const years = entries.map((entry) => entry.year).filter((year) => Number.isFinite(year))
  const firstYear = years.length ? Math.min(...years) : null
  const lastYear = years.length ? Math.max(...years) : null

  const stats: MastheadStat[] = [
    { value: String(press.length), label: t(locale, mediaDeskText.statPress) },
    {
      value: String(elsewhere.podcasts.length + elsewhere.videos.length + elsewhere.talks.length),
      label: t(locale, mediaDeskText.statWatch),
    },
    { value: String(posts.length), label: t(locale, mediaDeskText.statArchive) },
    {
      value: firstYear && lastYear ? `${firstYear}–${lastYear}` : '—',
      label: t(locale, mediaDeskText.statYears),
    },
  ]

  return (
    <>
      <Reveal as="section">
        <Section as="div" paddingBlockStart="52px" paddingBlockEnd="34px">
          <Eyebrow className="mb-3.5">{t(locale, { he: 'תקשורת וארכיון', en: 'MEDIA & ARCHIVE' })}</Eyebrow>
          <h1 className="mb-[18px] text-[clamp(32px,4.4vw,48px)] leading-[1.08]">
            {t(locale, { he: 'נבחרות בתקשורת ובשטח', en: 'Nivcharot in the media and in the field' })}
          </h1>
          <p className="mb-7 max-w-[680px] text-base leading-[1.7] text-neutral-800">
            {t(locale, {
              he: 'כל הכתבות, הראיונות, הפודקאסטים, ההודעות לתקשורת והניוזלטרים שנאספו מהפעילות של נבחרות, במקום אחד: לחפש, לסנן לפי סוג ולפי שנה, ולפתוח כל פריט בלי לצאת מהעמוד.',
              en: "Every article, interview, podcast, media release and newsletter from Nivcharot's work, in one place: search it, filter it by kind and by year, and open any item without leaving the page.",
            })}
          </p>
          <MediaMasthead stats={stats} />
          <p className="mt-5 text-[13.5px] leading-[1.7] text-neutral-700">
            {t(locale, { he: 'מחפשים תמונות מהשטח? ', en: 'Looking for photos from the field? ' })}
            <a
              href={`/${locale}/activism#gatherings`}
              className="font-heading text-[13.5px] font-extrabold text-accent-700 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t(locale, { he: 'לגלריות מהפעילות ←', en: '→ Activity galleries' })}
            </a>
          </p>
        </Section>
      </Reveal>

      <Reveal as="section" index={1}>
        <Section as="div" id="desk" borderBlockStart paddingBlockStart="46px" paddingBlockEnd="72px">
          {/*
            Anchor targets kept for the inbound links the four old sections
            owned (`/media#in-the-media` from the home strip, the story
            timeline and `/press/[slug]`; `/media#archive` from
            `/media/[slug]` and the activism sub-nav). `MediaDesk` reads the
            same hashes and opens on the bucket each one used to point at.
          */}
          <span id="in-the-media" aria-hidden="true" className="block" />
          <span id="elsewhere" aria-hidden="true" className="block" />
          <span id="archive" aria-hidden="true" className="block" />

          <div className="mb-7 max-w-[720px]">
            <Eyebrow className="mb-3">{t(locale, mediaDeskText.eyebrow)}</Eyebrow>
            <h2 className="text-[clamp(24px,3vw,32px)]">{t(locale, mediaDeskText.title)}</h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-neutral-800">{t(locale, mediaDeskText.lead)}</p>
          </div>

          <MediaDesk entries={entries} locale={locale} />
        </Section>
      </Reveal>
    </>
  )
}
