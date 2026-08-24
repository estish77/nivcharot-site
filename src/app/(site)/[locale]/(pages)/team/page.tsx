import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { TeamPageContent } from '@/components/team/TeamPageContent'
import { teamHero } from '@/content/team'
import { isLocale, locales, t } from '@/lib/i18n'

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

  return {
    title: t(locale, { he: 'הצוות', en: 'Team' }),
    description: t(locale, teamHero.lead),
  }
}

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }

  return <TeamPageContent locale={rawLocale} />
}
