import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { ActivismPage } from '@/components/activism/ActivismPage'
import { activismHero } from '@/content/activism'
import { isLocale, locales, t } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

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

  return pageMetadata({
    locale: rawLocale,
    path: '/activism',
    title: t(rawLocale, activismHero.eyebrow),
    description: t(rawLocale, {
      he: 'נבחרות פועלת בכל הזירות שבהן מתקבלות ההחלטות: חקיקה, משפט, לובי ועבודת תודעה בקהילה, כדי שהפוליטיקה בישראל לא תישאר מועדון סגור לגברים.',
      en: 'Nivcharot acts in every arena where decisions are made: legislation, law, lobbying and community awareness, so Israeli politics stops being a closed men\'s club.',
    }),
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }

  return <ActivismPage locale={rawLocale} />
}
