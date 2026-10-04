import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { Eyebrow, Reveal } from '@/components/ui'
import {
  accessibilityAccommodations,
  accessibilityContact,
  accessibilityHero,
  accessibilityIntro,
  accessibilityLimitations,
} from '@/content/accessibility'
import { isLocale, locales, t, type Locale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

type Params = { locale: string }

/**
 * `/accessibility` — the legally-required accessibility statement. See
 * `src/content/accessibility.ts` for why this is a plain static fixture
 * rather than CMS-backed, and for the honesty constraint on its content.
 * Linked from the footer on every page (`Footer.tsx`), same as the plain
 * `/halacha`-style article pages, not from the primary nav — it's a
 * compliance document people look for in the footer, not a page anyone
 * browses to.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : 'he'
  return pageMetadata({
    locale,
    path: '/accessibility',
    title: t(locale, accessibilityHero.title),
    description: t(locale, accessibilityIntro),
  })
}

export default async function AccessibilityPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()
  const locale: Locale = rawLocale

  return (
    <Reveal as="section">
      <article className="mx-auto max-w-[760px] px-8 pb-16 pt-14 max-[640px]:px-5">
        <Eyebrow className="mb-3.5">{t(locale, accessibilityHero.eyebrow)}</Eyebrow>
        <h1 className="m-0 mb-2 text-[clamp(28px,4vw,44px)] leading-[1.15]">{t(locale, accessibilityHero.title)}</h1>
        <p className="m-0 mb-8 text-[13px] font-semibold text-neutral-700">{t(locale, accessibilityHero.lastReviewed)}</p>

        <p className="m-0 mb-8 text-[16px] leading-[1.7] text-neutral-800">{t(locale, accessibilityIntro)}</p>

        <section className="mb-9 border-t-2 border-divider pt-8">
          <h2 className="m-0 mb-4 text-[20px] leading-[1.3]">{t(locale, accessibilityAccommodations.heading)}</h2>
          <ul className="m-0 flex list-disc flex-col gap-2.5 ps-5 text-[15.5px] leading-[1.7] text-text">
            {accessibilityAccommodations.items.map((item, i) => (
              <li key={i}>{t(locale, item)}</li>
            ))}
          </ul>
        </section>

        <section className="mb-9 border-t-2 border-divider pt-8">
          <h2 className="m-0 mb-4 text-[20px] leading-[1.3]">{t(locale, accessibilityLimitations.heading)}</h2>
          <ul className="m-0 flex list-disc flex-col gap-2.5 ps-5 text-[15.5px] leading-[1.7] text-text">
            {accessibilityLimitations.items.map((item, i) => (
              <li key={i}>{t(locale, item)}</li>
            ))}
          </ul>
        </section>

        <section className="border-t-2 border-divider pt-8">
          <h2 className="m-0 mb-3 text-[20px] leading-[1.3]">{t(locale, accessibilityContact.heading)}</h2>
          <p className="m-0 mb-2 text-[15.5px] leading-[1.7] text-text">{t(locale, accessibilityContact.body)}</p>
          <p className="m-0 text-[15.5px] font-semibold leading-[1.7] text-text">
            <a
              href={`mailto:${accessibilityContact.coordinatorEmail}`}
              dir="ltr"
              className="inline-block text-accent-700 underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {accessibilityContact.coordinatorEmail}
            </a>
          </p>
        </section>
      </article>
    </Reveal>
  )
}
