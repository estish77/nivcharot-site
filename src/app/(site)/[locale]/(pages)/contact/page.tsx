import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { ContactForm } from '@/components/contact/ContactForm'
import { Eyebrow, Reveal, Section } from '@/components/ui'
import { contactHero } from '@/content/contact'
import { isLocale, locales, t } from '@/lib/i18n'

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
    title: t(locale, contactHero.eyebrow),
    description: t(locale, contactHero.lead),
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()
  const locale = rawLocale

  return (
    <Reveal as="section">
      <Section as="div" maxWidth={1080} paddingBlockStart="64px" paddingBlockEnd="72px">
        <Eyebrow className="mb-3.5">{t(locale, contactHero.eyebrow)}</Eyebrow>
        <h1 className="m-0 mb-5 max-w-[640px] text-[clamp(36px,5vw,56px)] leading-[1.08] max-[860px]:text-[clamp(30px,9vw,46px)]">
          {t(locale, contactHero.title)}
        </h1>
        <p className="m-0 mb-10 max-w-[640px] text-[17px] leading-[1.7] text-neutral-800">
          {t(locale, contactHero.lead)}
        </p>
        <ContactForm locale={locale} />
      </Section>
    </Reveal>
  )
}
