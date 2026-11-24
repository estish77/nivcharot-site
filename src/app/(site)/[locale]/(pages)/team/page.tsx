import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { TeamPageContent } from '@/components/team/TeamPageContent'
import { isLocale, locales, t } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/**
 * The roster is dashboard-editable (`getTeamMembers` reads Payload's
 * `team-members` collection live) — force per-request rendering so an edit
 * saved in the admin appears immediately instead of waiting for the next
 * build's static HTML to be regenerated. `/media` needs no such override:
 * its use of `searchParams` already makes it dynamic by default.
 */
export const dynamic = 'force-dynamic'

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
    path: '/team',
    title: t(locale, { he: 'צוות העמותה והנשים שמאחורי התנועה', en: 'Our team and the women behind the movement' }),
    description: t(locale, {
      he: 'הכירו את אסתי שושן, מייסדת נבחרות, ואת חברות הצוות והפעילות לאורך השנים. קראו על הרקע שלהן ועל תפקידן בתנועה.',
      en: 'Meet founder Esty Shushan and the staff and activists who have shaped Nivcharot. Read their biographies and learn about their roles in the movement.',
    }),
  })
}

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }

  return <TeamPageContent locale={rawLocale} />
}
