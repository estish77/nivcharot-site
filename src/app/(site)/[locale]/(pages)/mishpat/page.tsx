import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { Eyebrow, Reveal } from '@/components/ui'
import { getMishpatContent } from '@/lib/cms'
import { isLocale, locales, type Locale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

type Params = { locale: string }

/**
 * `/mishpat` — a placeholder overview of Nivcharot's legal tools, meant to
 * be expanded from `/admin` later (the `Mishpat` Payload global's `body`
 * richText field). Unlike `/halacha`, there's no hardcoded write-up here —
 * everything below the hero comes straight from Payload (or the fallback
 * paragraphs in `src/content/mishpat.ts` if unset).
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : 'he'
  const content = await getMishpatContent(locale)
  return pageMetadata({ locale, path: '/mishpat', title: content.hero.title, description: content.hero.body })
}

export default async function MishpatPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()
  const locale: Locale = rawLocale
  const content = await getMishpatContent(locale)

  return (
    <Reveal as="section">
      <article className="mx-auto max-w-[760px] px-8 pb-16 pt-14 max-[640px]:px-5">
        <Eyebrow className="mb-3.5">{content.hero.eyebrow}</Eyebrow>
        <h1 className="m-0 mb-4 text-[clamp(28px,4vw,44px)] leading-[1.15]">{content.hero.title}</h1>
        <p className="m-0 mb-8 text-[16px] leading-[1.7] text-neutral-800">{content.hero.body}</p>
        <div className="border-t-2 border-divider pt-8">
          {content.body.map((paragraph, i) => (
            <p key={i} className="mb-5 text-[15.5px] leading-[1.8] text-text">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </Reveal>
  )
}
