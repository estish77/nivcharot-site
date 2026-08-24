import { Eyebrow } from '@/components/ui/Eyebrow'
import { Reveal } from '@/components/ui/Reveal'
import { TabBar } from '@/components/ui/TabBar'
import { t, type Locale } from '@/lib/i18n'
import { teamHero, teamSectionIntro } from '@/content/team'
import { getTeamMembers } from '@/lib/cms'
import { EqualizerDots } from './EqualizerDots'
import { TeamMemberCard } from './TeamMemberCard'

export type TeamPageContentProps = { locale: Locale }

/**
 * docs/Team.dc.html body: hero, the shared About/Story/Team `TabBar`
 * (active on "Team"), and the 6-member grid — 3 columns at desktop,
 * collapsing to 2 at 860px and 1 at 560px via real `max-[…]:` breakpoints
 * (replacing the mockup's inline-style-substring "fake responsive" layer).
 *
 * Roster comes from Payload's `team-members` collection (dashboard-editable,
 * `active` checkbox = the "hide this person" control), falling back to the
 * static fixture if Payload/the DB is unreachable (`getTeamMembers`).
 */
export async function TeamPageContent({ locale }: TeamPageContentProps) {
  const tabItems = [
    { label: t(locale, { he: 'אודות', en: 'About' }), href: `/${locale}/about` },
    { label: t(locale, { he: 'הסיפור שלנו', en: 'Our story' }), href: `/${locale}/story` },
    { label: t(locale, { he: 'הצוות', en: 'Team' }), href: `/${locale}/team` },
  ]

  const teamMembers = await getTeamMembers()
  const visibleMembers = teamMembers.filter((member) => member.active).sort((a, b) => a.order - b.order)

  return (
    <>
      <Reveal as="section" className="mx-auto max-w-[1080px] px-8 pb-10 pt-16 max-[860px]:px-[18px] max-[860px]:pb-6 max-[860px]:pt-9">
        <Eyebrow className="mb-[14px]">{t(locale, teamHero.eyebrow)}</Eyebrow>
        <h1 className="mb-[18px] text-[clamp(34px,4.6vw,52px)] leading-[1.08] max-[860px]:text-[clamp(30px,9vw,46px)]">
          {t(locale, teamHero.title)}
        </h1>
        <p className="max-w-[680px] text-[17px] leading-[1.7] text-neutral-800">{t(locale, teamHero.lead)}</p>
      </Reveal>

      <Reveal as="section" className="mx-auto max-w-[1080px] px-8 max-[860px]:px-[18px]">
        <TabBar items={tabItems} activeHref={`/${locale}/team`} />
      </Reveal>

      <Reveal as="section" className="relative mx-auto max-w-[1080px] px-8 pb-16 pt-[72px] max-[860px]:px-[18px] max-[860px]:pb-9 max-[860px]:pt-9">
        <div className="absolute top-8 end-8 leading-none">
          <EqualizerDots tone="light" />
        </div>
        <Eyebrow className="mb-[10px]">{t(locale, teamSectionIntro.eyebrow)}</Eyebrow>
        <div className="flex items-center justify-between gap-[22px]">
          <h2 className="mb-[30px] max-[860px]:text-[clamp(24px,7vw,34px)]">{t(locale, teamSectionIntro.title)}</h2>
        </div>
        <div className="grid grid-cols-3 gap-x-[26px] gap-y-8 max-[860px]:grid-cols-2 max-[560px]:grid-cols-1">
          {visibleMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} locale={locale} />
          ))}
        </div>
      </Reveal>
    </>
  )
}
