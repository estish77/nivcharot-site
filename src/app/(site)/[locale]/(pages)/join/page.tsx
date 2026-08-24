import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { JoinPageContent } from '@/components/join/JoinPageContent'
import { joinHero } from '@/content/join'
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
    title: t(locale, { he: 'הצטרפות', en: 'Get involved' }),
    description: t(locale, joinHero.lead),
  }
}

export default async function JoinPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }

  return <JoinPageContent locale={rawLocale} />
}
