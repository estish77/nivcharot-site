import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { EmptyState } from '@/components/media/EmptyState'
import { OtherGalleries } from '@/components/media/OtherGalleries'
import { PhotoGrid } from '@/components/media/PhotoGrid'
import { Eyebrow, Reveal, Section } from '@/components/ui'
import { getEvents } from '@/lib/cms'
import { arrowBack, isLocale, locales, t, type Locale } from '@/lib/i18n'

type Params = { locale: string; slug: string }

/** Ported from docs/Event.dc.html (was a `?e=<slug>` query-string route). */
export async function generateStaticParams() {
  const results = await Promise.all(locales.map((locale) => getEvents(locale)))
  return results.flatMap((events, i) => events.map((event) => ({ locale: locales[i], slug: event.slug })))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  if (!isLocale(rawLocale)) return {}
  const events = await getEvents(rawLocale)
  const gallery = events.find((e) => e.slug === slug)
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
  const events = await getEvents(locale)
  const gallery = events.find((e) => e.slug === slug)

  if (!gallery) {
    return (
      <EmptyState
        title={t(locale, { he: 'הגלריה הזו לא נמצאה', en: "This gallery wasn't found" })}
        body={t(locale, {
          he: 'כל הכנסים והאירועים מרוכזים בעמוד הפעילות.',
          en: 'Every conference and event lives on the advocacy page.',
        })}
        ctaLabel={t(locale, { he: 'לכל הגלריות', en: 'View all galleries' })}
        ctaHref={`/${locale}/activism#gatherings`}
      />
    )
  }

  const others = events.filter((e) => e.slug !== gallery.slug).slice(0, 3)

  return (
    <>
      <Reveal as="section">
        <Section as="div" paddingBlockStart="52px" paddingBlockEnd="32px">
          <a
            href={`/${locale}/activism#gatherings`}
            className="mb-[26px] inline-block text-[13px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {arrowBack(locale)} {t(locale, { he: 'חזרה לכנסים ולאירועים', en: 'Back to conferences & events' })}
          </a>
          <div className="mb-3.5 font-heading text-[44px] leading-none text-accent-700">{gallery.year}</div>
          <h1 className="mb-4 max-w-[900px] text-[clamp(28px,3.6vw,44px)] leading-[1.15]">{gallery.title}</h1>
          <div className="flex flex-wrap items-center gap-[18px] border-b-2 border-divider pb-[26px] font-heading text-[13px] font-extrabold text-neutral-700">
            <span>
              {t(locale, { he: `${gallery.photos.length} תמונות`, en: `${gallery.photos.length} photos` })}
            </span>
            {gallery.credit ? <span>{gallery.credit}</span> : null}
            {locale === 'en' ? (
              // The gallery title above is real archive material, never translated
              // (see src/content/media.ts's file header) — same honest heads-up as
              // the post-detail template, PostPrevNext's Hebrew titles below, etc.
              <span className="border border-divider px-1.5 py-0.5 font-heading text-[10px] font-extrabold tracking-[0.06em] text-neutral-700">
                Title in Hebrew
              </span>
            ) : null}
          </div>
          {gallery.summary ? (
            <p className="mt-6 max-w-[720px] text-[16px] leading-[1.7] text-neutral-800">{gallery.summary}</p>
          ) : null}
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
