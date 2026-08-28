import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { Eyebrow, Reveal } from '@/components/ui'
import { halachaIntro, halachaSections, halachaSourceMeta, type HalachaQuote } from '@/content/halacha'
import { getHalachaContent } from '@/lib/cms'
import { isLocale, locales, t, type Locale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

type Params = { locale: string }

/**
 * `/halacha` — a comparative overview of two halakhic rulings on women's
 * eligibility for public office. Hero copy is Payload-backed
 * (`getHalachaContent`); the write-up itself lives in
 * `src/content/halacha.ts` and is bilingual as of 2026-08-29 — it used to
 * render its Hebrew source material as-is under both locales, so an
 * English reader met an English hero followed by ninety lines of Hebrew.
 * Each quotation's Hebrew original is still shown on the English page,
 * beneath its translation; see `QuoteBlock`.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : 'he'
  const content = await getHalachaContent(locale)
  return pageMetadata({ locale, path: '/halacha', title: content.hero.title, description: content.hero.body })
}

function QuoteBlock({ quote, locale }: { quote: HalachaQuote; locale: Locale }) {
  const meta = halachaSourceMeta[quote.source]
  return (
    <blockquote className="m-0 border-s-2 border-accent ps-[18px]">
      <p className="m-0 mb-2 text-[15px] leading-[1.8] text-text">{t(locale, quote.text)}</p>
      {/*
        The Hebrew original stays on the English page, under the
        translation. These are verbatim citations from named poskim, and a
        translation of a psak is an interpretation of it — keeping the
        original alongside is the ordinary scholarly convention, and it
        means the English rendering can never be mistaken for the ruling.
      */}
      {locale === 'en' ? (
        <p dir="rtl" lang="he" className="m-0 mb-2 text-[13.5px] leading-[1.9] text-neutral-600">
          {quote.text.he}
        </p>
      ) : null}
      <footer className="text-[12.5px] text-neutral-600">
        — {t(locale, quote.attribution)} <span className="text-neutral-400">·</span> {t(locale, meta.name)}
      </footer>
    </blockquote>
  )
}

export default async function HalachaPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()
  const locale: Locale = rawLocale
  const content = await getHalachaContent(locale)

  return (
    <Reveal as="section">
      <article className="mx-auto max-w-[760px] px-8 pb-16 pt-14 max-[640px]:px-5">
        <Eyebrow className="mb-3.5">{content.hero.eyebrow}</Eyebrow>
        <h1 className="m-0 mb-4 text-[clamp(28px,4vw,44px)] leading-[1.15]">{content.hero.title}</h1>
        <p className="m-0 mb-8 text-[16px] leading-[1.7] text-neutral-800">{content.hero.body}</p>

        {locale === 'en' ? (
          <p className="mb-8 border-2 border-divider bg-tint-cream px-4 py-3 text-[13px] leading-[1.6] text-neutral-700">
            The quotations below are translated from Hebrew halakhic sources, with each original kept underneath
            its translation. Where a term carries the argument — <em>serarah</em>, the category of authority the
            whole question turns on — it is transliterated rather than flattened into English.
          </p>
        ) : null}

        <div className="border-t-2 border-divider pt-8">
          {t(locale, halachaIntro).map((paragraph, i) => (
            <p key={i} className="mb-5 text-[15.5px] leading-[1.8] text-text">
              {paragraph}
            </p>
          ))}
        </div>

        {halachaSections.map((section) => (
          <section key={section.id} id={section.id} className="mt-12 scroll-mt-24 border-t-2 border-divider pt-8">
            <h2 className="m-0 mb-4 text-[21px] leading-[1.3]">
              <span className="me-2 font-heading font-extrabold text-accent-700">{t(locale, section.letter)}.</span>
              {t(locale, section.title)}
            </h2>
            {(section.intro ? t(locale, section.intro) : []).map((paragraph, i) => (
              <p key={i} className="mb-4 text-[15px] leading-[1.8] text-text">
                {paragraph}
              </p>
            ))}
            {section.quotes && section.quotes.length > 0 ? (
              <div className="my-6 flex flex-col gap-5">
                {section.quotes.map((quote, i) => (
                  <QuoteBlock key={i} quote={quote} locale={locale} />
                ))}
              </div>
            ) : null}
            {(section.closing ? t(locale, section.closing) : []).map((paragraph, i) => (
              <p key={i} className="mt-4 text-[14.5px] leading-[1.75] text-neutral-800">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        {content.kroizerDocumentUrl || content.pamphletDocumentUrl ? (
          <div className="mt-14 border-t-2 border-divider pt-8">
            <Eyebrow className="mb-4">{locale === 'he' ? 'לקריאה במקור' : 'Read the source documents'}</Eyebrow>
            <div className="flex flex-col gap-2.5">
              {content.pamphletDocumentUrl ? (
                <a
                  href={content.pamphletDocumentUrl}
                  target="_blank"
                  rel="noopener"
                  className="font-heading text-[14.5px] font-extrabold text-accent-700 no-underline hover:text-accent focus-visible:rounded-sm focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {locale === 'he' ? 'קונטרס בירור הלכתי, 2015 (PDF) ↗' : 'The 2015 pamphlet (PDF) ↗'}
                </a>
              ) : null}
              {content.kroizerDocumentUrl ? (
                <a
                  href={content.kroizerDocumentUrl}
                  target="_blank"
                  rel="noopener"
                  className="font-heading text-[14.5px] font-extrabold text-accent-700 no-underline hover:text-accent focus-visible:rounded-sm focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {locale === 'he' ? 'תשובת הרב קרויזר, תשפ"ה (PDF) ↗' : "Rabbi Kreuzer's responsum (PDF) ↗"}
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </article>
    </Reveal>
  )
}
