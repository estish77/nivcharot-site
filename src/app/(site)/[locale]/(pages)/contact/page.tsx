import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { ContactForm } from '@/components/contact/ContactForm'
import { Eyebrow, Reveal, Section, SocialLinksRow } from '@/components/ui'
import { contactDirect, contactEmail, contactHero } from '@/content/contact'
import { getSiteSettings } from '@/lib/cms'
import { isLocale, locales, t } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'
import { buildFollowLinks } from '@/lib/socialLinks'

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

  return pageMetadata({
    locale,
    path: '/contact',
    title: t(locale, contactHero.eyebrow),
    description: t(locale, contactHero.lead),
  })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()
  const locale = rawLocale
  const siteSettings = await getSiteSettings()
  const inbox = siteSettings.contactEmail || contactEmail

  // Same dashboard-editable source the footer and the media page read.
  const socialLinks = buildFollowLinks(siteSettings, locale)

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
        <p className="m-0 mb-7 max-w-[640px] text-[17px] leading-[1.7] text-neutral-800">
          {t(locale, contactHero.lead)}
        </p>
        {/*
          The follow-us icons sit above the form (2026-08-28 brief). They
          used to be the last thing on the page, below the form and the
          direct-email block — far enough down that anyone who came to
          follow rather than to write had to scroll past the whole form to
          find them.
        */}
        <SocialLinksRow
          heading={t(locale, contactDirect.followHeading)}
          links={socialLinks}
          className="mb-10 border-b-2 border-divider pb-7"
        />
        <ContactForm locale={locale} />

        <div className="mt-12 border-t-2 border-divider pt-8">
          <p className="m-0 mb-1.5 font-heading text-[11px] font-extrabold tracking-[0.14em] text-neutral-700">
            {t(locale, contactDirect.emailHeading)}
          </p>
          <a
            href={`mailto:${inbox}`}
            dir="ltr"
            className="inline-block font-heading text-[clamp(20px,2.6vw,26px)] font-extrabold text-accent-700 no-underline hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {inbox}
          </a>
          <p className="m-0 mt-2 text-[14px] leading-[1.7] text-neutral-700">{t(locale, contactDirect.emailNote)}</p>
        </div>
      </Section>
    </Reveal>
  )
}
