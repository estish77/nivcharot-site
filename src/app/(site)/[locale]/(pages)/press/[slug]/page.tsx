import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { EmptyState } from '@/components/media/EmptyState'
import { PressTypeIcon } from '@/components/media/PressTypeIcon'
import { Eyebrow, Reveal, Section } from '@/components/ui'
import { pressArchiveText } from '@/content/press-archive'
import { getPressArchiveItems } from '@/lib/cms'
import { arrowBack, isLocale, locales, t, type Locale } from '@/lib/i18n'
import { pageMetadata, urlFor } from '@/lib/seo'
import { siteUrl } from '@/lib/site'

type Params = { locale: string; slug: string }

/**
 * Standalone detail page for internal `PressArchiveItem`s (site owner's
 * brief item 16: full old-site articles, and described video/radio
 * appearances with no live embed, each "get their own page"). Deliberately
 * a SEPARATE route tree from `/media/[slug]` (a different fixture/collection
 * entirely) — see this file's git history for the original reasoning.
 *
 * Reads from getPressArchiveItems() (same live-or-fallback source as the
 * /media archive listing) instead of the static fixture directly — same
 * bug class as /media/[slug]'s pre-fix state: a dashboard-added item with
 * `Link kind: Internal` would archive-list fine but 404 here. Currently
 * latent (every real Press Archive item today is `linkKind: 'external'`,
 * confirmed 2026-08-26), but the moment an editor flips one to Internal
 * this needs to already work. NOTE: the `press-archive` collection
 * (src/payload/collections/PressArchive.ts) has no `body` field yet, so an
 * internal item wired up this way still renders with no body paragraphs
 * until that schema gap is filled in — this fix only closes the routing
 * gap, not the content-authoring one.
 */
export async function generateStaticParams() {
  const items = await getPressArchiveItems()
  const internalSlugs = items.filter((item) => item.link.kind === 'internal').map((item) => item.slug)
  return locales.flatMap((locale) => internalSlugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  if (!isLocale(rawLocale)) return {}
  const items = await getPressArchiveItems()
  const item = items.find((i) => i.slug === slug)
  if (!item) return {}

  return pageMetadata({
    locale: rawLocale,
    path: `/press/${slug}`,
    title: t(rawLocale, item.title),
    description: t(rawLocale, item.summary),
    type: 'article',
  })
}

export default async function PressDetailPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, slug } = await params
  if (!isLocale(rawLocale)) {
    notFound()
  }
  const locale: Locale = rawLocale
  const items = await getPressArchiveItems()
  const item = items.find((i) => i.slug === slug)

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

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: t(locale, item.title),
    description: t(locale, item.summary),
    datePublished: item.sortDate,
    url: urlFor(locale, `/press/${item.slug}`),
    isPartOf: { '@type': 'WebSite', name: 'נבחרות | Nivcharot', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'נבחרות | Nivcharot', url: siteUrl },
  }

  return (
    <>
      {/* Standard JSON-LD pattern — content is server-built from this same press-archive fixture/CMS data, never raw user input. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
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
    </>
  )
}
