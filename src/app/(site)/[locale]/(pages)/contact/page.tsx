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
      {/*
       * maxWidth 760, not the 1080 the About/Join/Story hero pattern this
       * was styled after uses (see content/contact.ts's top comment) —
       * those pages fill that width with full-bleed sections below the
       * hero, but this page's entire content IS the hero: just a ~640px
       * text column plus a 560px form, nothing else. At 1080 (let alone a
       * 1440-1920px viewport centering that box) the unfilled remainder
       * reads as a broken/empty page rather than intentional whitespace.
       * 760 keeps the same inline padding/left(RTL)-aligned content shape,
       * just sized to what's actually in it, so the whole block reads as
       * one centered column instead of hugging one edge of an oversized box.
       */}
      <Section as="div" maxWidth={760} paddingBlockStart="64px" paddingBlockEnd="72px">
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
