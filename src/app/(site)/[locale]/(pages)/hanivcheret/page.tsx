import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { HanivcheretPage } from '@/components/hanivcheret/HanivcheretPage'
import { hanivcheretHero } from '@/content/hanivcheret'
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
    path: '/hanivcheret',
    title: t(rawLocale, hanivcheretHero.title),
    description: t(rawLocale, {
      he: 'תוכנית ההכשרה של נבחרות: מסע שנתי של ידע, כלים וקהילה לנשים חרדיות שרוצות להוביל שינוי בשכונה, ברשות המקומית ובחברה האזרחית.',
      en: "Nivcharot's year-long leadership program: knowledge, tools and community for Haredi women who want to lead change in their neighborhood, municipality and civil society.",
    }),
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }

  return <HanivcheretPage locale={rawLocale} />
}
