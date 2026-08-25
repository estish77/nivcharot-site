import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { Eyebrow, Reveal, Section } from '@/components/ui'
import { DonateGiving } from '@/components/donate/DonateGiving'
import { TransparencyGrid } from '@/components/donate/TransparencyGrid'
import { donateHero } from '@/content/donate'
import { getDonateContent } from '@/lib/cms'
import { isLocale, locales, t } from '@/lib/i18n'

/** Ported from docs/Shop.dc.html. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) return {}
  const locale = rawLocale

  return {
    title: t(locale, { he: 'תרומה לנבחרות', en: 'Donate to Nivcharot' }),
    description: t(locale, donateHero.body),
  }
}

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) {
    notFound()
  }
  const locale = rawLocale
  const hero = await getDonateContent(locale)

  return (
    <>
      <Reveal as="section">
        <Section as="div" paddingBlockStart="56px" paddingBlockEnd="44px">
          <Eyebrow className="mb-3.5">{hero.eyebrow}</Eyebrow>
          <h1 className="mb-[18px] text-[clamp(34px,4.5vw,52px)] leading-[1.08] max-[860px]:text-[clamp(30px,9vw,46px)]">
            {hero.title}
          </h1>
          <p className="mb-3.5 max-w-[640px] text-[16.5px] leading-[1.7] text-neutral-800">
            {hero.body}
          </p>
          <p className="max-w-[640px] text-[15px] leading-[1.7] text-neutral-700">{t(locale, donateHero.taxNote)}</p>
        </Section>
      </Reveal>
      <DonateGiving locale={locale} />
      <TransparencyGrid locale={locale} />
    </>
  )
}
