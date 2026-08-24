import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { EmptyState } from '@/components/media/EmptyState'
import { PressTypeIcon } from '@/components/media/PressTypeIcon'
import { Eyebrow, Reveal, Section } from '@/components/ui'
import { findPressItemBySlug, pressArchiveItems, pressArchiveText } from '@/content/press-archive'
import { arrowBack, isLocale, locales, t, type Locale } from '@/lib/i18n'

type Params = { locale: string; slug: string }

/**
 * Standalone detail page for internal `PressArchiveItem`s (site owner's
 * brief item 16: full old-site articles, and described video/radio
 * appearances with no live embed, each "get their own page"). Deliberately
 * a SEPARATE route tree from the existing `/media/[slug]` (which already
 * serves a different, established fixture — `src/content/media.ts`'s
 * fictional/placeholder `archivePosts`) rather than reusing it: the two
 * fixtures have different shapes (`body: Localized<string[]>` here vs.
 * Hebrew-only `body: string[]` there) and different provenance (real,
 * research-sourced vs. placeholder), and `/media/[slug]` is already fully
 * wired up for its own data — extending it risked colliding with another
 * agent's already-shipped route. See the page-agent report for the full
 * reasoning.
 */
export function generateStaticParams() {
  const internalSlugs = pressArchiveItems.filter((item) => item.link.kind === 'internal').map((item) => item.slug)
  return locales.flatMap((locale) => internalSlugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  if (!isLocale(rawLocale)) return {}
  const item = findPressItemBySlug(slug)
  if (!item) return {}

  return {
    title: t(rawLocale, item.title),
    description: t(rawLocale, item.summary),
  }
}

export default async function PressDetailPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, slug } = await params
  if (!isLocale(rawLocale)) {
    notFound()
  }
  const locale: Locale = rawLocale
  const item = findPressItemBySlug(slug)

  if (!item) {
    return (
      <EmptyState
        title={t(locale, { he: 'הפריט הזה לא נמצא', en: "This item wasn't found" })}
        body={t(locale, {
          he: 'אולי הקישור נשבר. ה"בתקשורת" המלא נמצא בעמוד תקשורת ומדיה.',
          en: 'The link may be broken. The full "In the Media" archive lives on the media page.',
        })}
        ctaLabel={t(locale, pressArchiveText.backToArchive)}
        ctaHref={`/${locale}/media#in-the-media`}
      />
    )
  }

  const body = item.body ? t(locale, item.body) : []

  return (
    <Reveal as="section">
      <article className="mx-auto max-w-[760px] px-8 pb-20 pt-14 max-[860px]:px-[18px] max-[860px]:pb-12 max-[860px]:pt-8">
        <a
          href={`/${locale}/media#in-the-media`}
          className="mb-[26px] inline-block text-[13px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {arrowBack(locale)} {t(locale, pressArchiveText.backToArchive)}
        </a>
        <Eyebrow className="mb-3.5 flex items-center gap-2">
          <PressTypeIcon type={item.type} />
          {t(locale, pressArchiveText.typeLabel[item.type])} · {t(locale, item.outlet)}
        </Eyebrow>
        <h1 className="mb-4 text-[clamp(30px,4vw,46px)] leading-[1.12]">{t(locale, item.title)}</h1>
        <div className="border-b-2 border-divider pb-6 font-heading text-[13px] font-extrabold text-neutral-700">
          {t(locale, item.dateLabel)} · {t(locale, pressArchiveText.fromArchive)}
        </div>

        {body.map((paragraph, i) => (
          <p key={i} className="mt-6 text-[17px] leading-[1.9] text-text">
            {paragraph}
          </p>
        ))}

        {item.note ? (
          <p className="mt-8 border-2 border-dashed border-divider bg-tint-cream px-5 py-4 text-[14px] leading-[1.7] text-neutral-800">
            {t(locale, item.note)}
          </p>
        ) : null}
      </article>
    </Reveal>
  )
}
