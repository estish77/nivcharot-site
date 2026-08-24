import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { ActivismPage } from '@/components/activism/ActivismPage'
import { activismHero } from '@/content/activism'
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

  return {
    title: t(rawLocale, activismHero.eyebrow),
    description: t(rawLocale, activismHero.lead),
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }

  return <ActivismPage locale={rawLocale} />
}
