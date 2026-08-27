import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import type { FilterChip } from '@/components/media/ArchiveFilters'
import { ArchiveFilters } from '@/components/media/ArchiveFilters'
import { ElsewhereMediaSection } from '@/components/media/ElsewhereMediaSection'
import { PostCard } from '@/components/media/PostCard'
import { PressArchiveSection } from '@/components/media/PressArchiveSection'
import { Button, CellGrid, Eyebrow, Reveal, Section, SectionHead } from '@/components/ui'
import { categoryChips, filterArchivePosts, yearChips } from '@/content/media'
import { elsewhereMediaText } from '@/content/elsewhere-media'
import { pressArchiveText } from '@/content/press-archive'
import { getArchivePosts, getElsewhereMediaItems, getPressArchiveItems } from '@/lib/cms'
import { isLocale, locales, t, type Locale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

type Params = { locale: string }
type SearchParams = { cat?: string | string[]; year?: string | string[] }

/**
 * The media/press archive index (linked as `Media.dc.html#archive`
 * throughout the mockups, but never itself drawn — see the task brief).
 * Built in the established visual language (`SectionHead` + category/year
 * `Tag` filter chips + a `CellGrid` of post cards), using
 * docs/ArchiveTemp.dc.html only for its filter/sort *behaviour*, not its
 * styling, per the brief. The event-galleries section that used to live
 * here moved to the Activism page's Gatherings section (2026-08-13 brief).
 *
 * Filters are plain `?cat=&year=` search params read on the server, so
 * every filtered view is a real, linkable, server-rendered URL — no
 * client-side state.
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

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function archiveHref(locale: Locale, cat: string | undefined, year: string | undefined): string {
  const qs = new URLSearchParams()
  if (cat) qs.set('cat', cat)
  if (year) qs.set('year', year)
  const query = qs.toString()
  return `/${locale}/media${query ? `?${query}` : ''}#archive`
}

export default async function MediaArchivePage({
  params,
  searchParams,
}: {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) {
    notFound()
  }
  const locale: Locale = rawLocale

  const sp = await searchParams
  const currentCat = firstParam(sp.cat)
  const currentYear = firstParam(sp.year)

  const [archivePosts, pressArchiveItemsSorted, elsewhereMedia] = await Promise.all([
    getArchivePosts(),
    getPressArchiveItems(),
    getElsewhereMediaItems(),
  ])

  const filtered = filterArchivePosts({ category: currentCat, year: currentYear }, archivePosts)
  const postsInCategory = filterArchivePosts({ category: currentCat }, archivePosts)

  const categoryFilterChips: FilterChip[] = [
    {
      key: 'all',
      label: `${t(locale, { he: 'הכול', en: 'All' })} (${archivePosts.length})`,
      href: archiveHref(locale, undefined, currentYear),
      active: !currentCat,
    },
    ...categoryChips(archivePosts).map((c) => ({
      key: c.slug,
      label: `${c.name} (${c.count})`,
      href: archiveHref(locale, c.slug, currentYear),
      active: currentCat === c.slug,
    })),
  ]

  const yearFilterChips: FilterChip[] = [
    {
      key: 'all',
      label: t(locale, { he: 'כל השנים', en: 'All years' }),
      href: archiveHref(locale, currentCat, undefined),
      active: !currentYear,
    },
    ...yearChips(postsInCategory).map((y) => ({
      key: String(y),
      label: String(y),
      href: archiveHref(locale, currentCat, String(y)),
      active: currentYear === String(y),
    })),
  ]

  return (
    <>
      <Reveal as="section">
        <Section as="div" paddingBlockStart="56px" paddingBlockEnd="24px">
          <Eyebrow className="mb-3.5">{t(locale, { he: 'תקשורת וארכיון', en: 'MEDIA & ARCHIVE' })}</Eyebrow>
          <h1 className="mb-[18px] text-[clamp(32px,4.4vw,48px)] leading-[1.08]">
            {t(locale, { he: 'נבחרות בתקשורת ובשטח', en: 'Nivcharot in the media and in the field' })}
          </h1>
          <p className="mb-7 max-w-[660px] text-base leading-[1.7] text-neutral-800">
            {t(locale, {
              he: 'כל הכתבות, ההודעות לתקשורת והניוזלטרים שנאספו מהפעילות של נבחרות, לצפייה, לשיתוף ולמעקב אחרי מה שקורה.',
              en: "Every article, media release and newsletter from Nivcharot's work, to read, share and follow along.",
            })}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="#in-the-media" variant="primary">
              {t(locale, { he: 'לתקשורת ↓', en: 'In the media ↓' })}
            </Button>
            <Button href="#elsewhere" variant="secondary">
              {t(locale, { he: 'לפודקאסטים ולוידאו ↓', en: 'Podcasts & video ↓' })}
            </Button>
            <Button href={`/${locale}/activism#gatherings`} variant="secondary">
              {t(locale, { he: 'לגלריות מפעילות ←', en: '→ Activity galleries' })}
            </Button>
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" index={1}>
        <Section as="div" id="in-the-media" borderBlockStart paddingBlockStart="56px" paddingBlockEnd="64px">
          <SectionHead
            eyebrow={t(locale, pressArchiveText.eyebrow)}
            title={t(locale, pressArchiveText.title)}
            lead={t(locale, pressArchiveText.lead)}
            titleClassName="text-[clamp(24px,3vw,32px)]"
            className="mb-[26px]"
          />
          <PressArchiveSection items={pressArchiveItemsSorted} locale={locale} />
        </Section>
      </Reveal>

      <Reveal as="section" index={2}>
        <Section as="div" id="elsewhere" borderBlockStart paddingBlockStart="56px" paddingBlockEnd="64px">
          <SectionHead
            eyebrow={t(locale, elsewhereMediaText.eyebrow)}
            title={t(locale, elsewhereMediaText.title)}
            lead={t(locale, elsewhereMediaText.lead)}
            titleClassName="text-[clamp(24px,3vw,32px)]"
            className="mb-[26px]"
          />
          <ElsewhereMediaSection
            podcasts={elsewhereMedia.podcasts}
            videos={elsewhereMedia.videos}
            talks={elsewhereMedia.talks}
            locale={locale}
          />
        </Section>
      </Reveal>

      <Reveal as="section" index={3}>
        <Section as="div" id="archive" borderBlockStart paddingBlockStart="56px" paddingBlockEnd="64px">
          <div className="mb-[22px] flex flex-wrap items-end justify-between gap-7">
            <SectionHead
              title={t(locale, { he: 'רשומות מהארכיון', en: 'Archive posts' })}
              titleClassName="text-[clamp(24px,3vw,32px)]"
            />
            <div className="whitespace-nowrap font-heading text-[13px] font-extrabold text-neutral-700">
              {t(locale, {
                he: `${filtered.length} רשומות מתוך ${archivePosts.length}`,
                en: `${filtered.length} of ${archivePosts.length} posts`,
              })}
            </div>
          </div>
          <ArchiveFilters categoryChips={categoryFilterChips} yearChips={yearFilterChips} />
          {filtered.length > 0 ? (
            <CellGrid cols={3} className="mt-6">
              {filtered.map((post) => (
                <PostCard key={post.slug} post={post} locale={locale} />
              ))}
            </CellGrid>
          ) : (
            <p className="py-7 text-[15px] text-neutral-700">
              {t(locale, {
                he: 'אין רשומות בחיתוך הזה. נסו קטגוריה או שנה אחרת.',
                en: 'No posts match this filter. Try a different category or year.',
              })}
            </p>
          )}
        </Section>
      </Reveal>
    </>
  )
}
