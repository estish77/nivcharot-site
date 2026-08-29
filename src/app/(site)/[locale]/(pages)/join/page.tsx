import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { JoinPageContent } from '@/components/join/JoinPageContent'
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
  const locale = rawLocale

  return pageMetadata({
    locale,
    path: '/join',
    title: t(locale, { he: 'דברו איתנו', en: 'Talk to us' }),
    description: t(locale, {
      he: 'יש הרבה דרכים להיות חלק מנבחרות: להצטרף לתוכנית המנהיגות, לתמוך בפעילות, להישאר בקשר, או פשוט לדבר איתנו.',
      en: 'There are many ways to be part of Nivcharot: join the leadership program, support the work, stay in touch, or just talk to us.',
    }),
  })
}

export default async function JoinPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }

  return <JoinPageContent locale={rawLocale} />
}
