import { notFound } from 'next/navigation'

import { TimelineLabPage } from '@/components/home/TimelineLabPage'
import { getStoryTimeline } from '@/lib/cms'
import { isLocale, t } from '@/lib/i18n'

/**
 * Throwaway comparison page (2026-09-09 brief: "תעשה לי את כל ההצעות...
 * אוכל להחליט רק כשארה ויזואלית" — build all the proposals, I can only
 * decide once I see it visually), for a possible interactive home-page
 * timeline. Same "lab" pattern as the earlier /mivzakon-lab: real content,
 * several variants side by side, delete this route once one is picked and
 * shipped for real.
 */
export default async function TimelineLab({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()
  const locale = rawLocale

  const milestones = await getStoryTimeline()
  const visible = milestones.filter((m) => t(locale, m.visible))

  return <TimelineLabPage locale={locale} milestones={visible} />
}
