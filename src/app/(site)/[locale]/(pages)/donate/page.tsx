import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { Eyebrow, Reveal, Section } from '@/components/ui'
import { DonateGiving } from '@/components/donate/DonateGiving'
import { TransparencyGrid } from '@/components/donate/TransparencyGrid'
import { donateHero, donationLinks as staticDonationLinks } from '@/content/donate'
import { getDonateContent, getSiteSettings } from '@/lib/cms'
import { isLocale, locales, t } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

/**
 * The Donate page (ported from docs/Shop.dc.html).
 *
 * 2026-08-27 redesign brief: the page used to open with a text-only hero
 * and then put the monthly standing order, credit card and bank transfer
 * side by side as three equal columns, with the red call-to-action banner
 * landing immediately under the button it repeated and the transparency
 * block last. It now runs ask -> alternatives -> trust -> final ask, with
 * the amount scale as the page's single focal point; see `DonateGiving`
 * for the full rationale.
 *
 * `TransparencyGrid` is passed to `DonateGiving` as `children` rather than
 * rendered as a sibling: the closing banner echoes the selected amount, so
 * it has to live inside that client component, but the trust content
 * belongs BEFORE a final ask rather than after it. Passing it down keeps
 * it a server-rendered child sitting in the right place in the run.
 */
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
    path: '/donate',
    title: t(locale, { he: 'תרומה לנבחרות', en: 'Donate to Nivcharot' }),
    description: t(locale, donateHero.body),
  })
}

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) {
    notFound()
  }
  const locale = rawLocale
  const [hero, siteSettings] = await Promise.all([getDonateContent(locale), getSiteSettings()])

  return (
    <>
      <Reveal as="section">
        <Section as="div" paddingBlockStart="56px" paddingBlockEnd="40px">
          <Eyebrow className="mb-3.5">{hero.eyebrow}</Eyebrow>
          <h1 className="mb-[18px] text-[clamp(34px,4.5vw,52px)] leading-[1.08] max-[860px]:text-[clamp(30px,9vw,46px)]">
            {hero.title}
          </h1>
          <p className="mb-4 max-w-[680px] text-[17px] leading-[1.75] text-neutral-800">{hero.body}</p>
          <p className="max-w-[680px] text-[15px] leading-[1.7] text-neutral-700">{t(locale, donateHero.taxNote)}</p>
        </Section>
      </Reveal>
      <DonateGiving
        locale={locale}
        donationLinks={{
          standingOrderUrl: siteSettings.donation.standingOrderUrl ?? staticDonationLinks.standingOrderUrl,
          cardUrl: siteSettings.donation.cardUrl ?? staticDonationLinks.cardUrl,
        }}
      >
        <TransparencyGrid locale={locale} />
      </DonateGiving>
    </>
  )
}
