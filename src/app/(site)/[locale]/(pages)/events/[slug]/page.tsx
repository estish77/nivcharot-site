import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { EmptyState } from '@/components/media/EmptyState'
import { OtherGalleries } from '@/components/media/OtherGalleries'
import { PhotoGrid } from '@/components/media/PhotoGrid'
import { Eyebrow, Reveal, Section } from '@/components/ui'
import { eventGalleries, findEventBySlug, otherGalleries } from '@/content/media'
import { arrowBack, isLocale, locales, t, type Locale } from '@/lib/i18n'

type Params = { locale: string; slug: string }

/** Ported from docs/Event.dc.html (was a `?e=<slug>` query-string route). */
export function generateStaticParams() {
  return locales.flatMap((locale) => eventGalleries.map((event) => ({ locale, slug: event.slug })))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  if (!isLocale(rawLocale)) return {}
  const gallery = findEventBySlug(slug)
  if (!gallery) return {}

  return {
    title: gallery.title,
    description: t(rawLocale, { he: `${gallery.photos.length} תמונות מ${gallery.title}`, en: `${gallery.photos.length} photos from ${gallery.title}` }),
  }
}

export default async function EventDetailPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, slug } = await params
  if (!isLocale(rawLocale)) {
    notFound()
  }
  const locale: Locale = rawLocale
  const gallery = findEventBySlug(slug)

  if (!gallery) {
    return (
      <EmptyState
        title={t(locale, { he: 'הגלריה הזו לא נמצאה', en: "This gallery wasn't found" })}
        body={t(locale, {
          he: 'כל הכנסים והאירועים מרוכזים בעמוד תקשורת ומדיה.',
          en: 'Every conference and event lives on the media page.',
        })}
        ctaLabel={t(locale, { he: 'לכל הגלריות', en: 'View all galleries' })}
        ctaHref={`/${locale}/media#events`}
      />
    )
  }

  const others = otherGalleries(gallery.slug)

  return (
    <>
      <Reveal as="section">
        <Section as="div" paddingBlockStart="52px" paddingBlockEnd="32px">
          <a
            href={`/${locale}/media#events`}
            className="mb-[26px] inline-block text-[13px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {arrowBack(locale)} {t(locale, { he: 'חזרה לכנסים ולאירועים', en: 'Back to conferences & events' })}
          </a>
          <div className="mb-3.5 font-heading text-[44px] leading-none text-accent-700">{gallery.year}</div>
          <h1 className="mb-4 max-w-[900px] text-[clamp(28px,3.6vw,44px)] leading-[1.15]">{gallery.title}</h1>
          <div className="flex flex-wrap gap-[18px] border-b-2 border-divider pb-[26px] font-heading text-[13px] font-extrabold text-neutral-700">
            <span>
              {t(locale, { he: `${gallery.photos.length} תמונות`, en: `${gallery.photos.length} photos` })}
            </span>
            {gallery.credit ? <span>{gallery.credit}</span> : null}
          </div>
        </Section>
      </Reveal>
      <Reveal as="section" index={1}>
        <Section as="div" paddingBlockStart="0px" paddingBlockEnd="56px">
          <PhotoGrid photos={gallery.photos} />
        </Section>
      </Reveal>
      {others.length > 0 ? (
        <Reveal as="section" index={2}>
          <Section as="div" paddingBlockStart="0px" paddingBlockEnd="64px">
            <Eyebrow className="mb-[22px]">{t(locale, { he: 'גלריות נוספות', en: 'More galleries' })}</Eyebrow>
            <OtherGalleries galleries={others} locale={locale} />
          </Section>
        </Reveal>
      ) : null}
    </>
  )
}
