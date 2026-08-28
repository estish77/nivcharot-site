import { Eyebrow } from '@/components/ui/Eyebrow'
import { Reveal } from '@/components/ui/Reveal'
import { TabBar } from '@/components/ui/TabBar'
import { t, type Locale } from '@/lib/i18n'
import { teamMemberCategoryLabels, type TeamMember, type TeamMemberCategory } from '@/content/team'
import { getTeamMembers, getTeamPageContent } from '@/lib/cms'
import { EqualizerDots } from './EqualizerDots'
import { TeamMemberCard } from './TeamMemberCard'

const CATEGORY_ORDER: TeamMemberCategory[] = ['central-team', 'central-activity', 'staff']

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

  const [teamMembers, pageContent] = await Promise.all([getTeamMembers(), getTeamPageContent(locale)])
  const visibleMembers = teamMembers.filter((member) => member.active).sort((a, b) => a.order - b.order)
  const membersIn = (category: TeamMemberCategory): TeamMember[] =>
    visibleMembers.filter((member) => (member.category ?? 'staff') === category)

  const staff = membersIn('staff')
  const overTheYears: [TeamMemberCategory, TeamMember[]][] = (
    ['central-team', 'central-activity'] as TeamMemberCategory[]
  )
    .map((category): [TeamMemberCategory, TeamMember[]] => [category, membersIn(category)])
    .filter(([, members]) => members.length > 0)

  return (
    <>
      <Reveal as="section" className="mx-auto max-w-[1080px] px-8 pb-10 pt-16 max-[860px]:px-[18px] max-[860px]:pb-6 max-[860px]:pt-9">
        <Eyebrow className="mb-[14px]">{pageContent.hero.eyebrow}</Eyebrow>
        <h1 className="mb-[18px] text-[clamp(34px,4.6vw,52px)] leading-[1.08] max-[860px]:text-[clamp(30px,9vw,46px)]">
          {pageContent.hero.title}
        </h1>
        <p className="max-w-[680px] text-[17px] leading-[1.7] text-neutral-800">{pageContent.hero.body}</p>
      </Reveal>

      <Reveal as="section" className="mx-auto max-w-[1080px] px-8 max-[860px]:px-[18px]">
        <TabBar items={tabItems} activeHref={`/${locale}/team`} />
      </Reveal>

      {/*
        Two sections, not one list with sub-headings (2026-08-28 brief). The
        current team is the page's subject and keeps the full card; the
        people who carried the movement over the years are a roll of names,
        so they get their own band below, on a tint, with smaller cards and
        no bios. Same data, different weight.
      */}
      <Reveal as="section" className="relative mx-auto max-w-[1080px] px-8 pb-14 pt-[72px] max-[860px]:px-[18px] max-[860px]:pb-8 max-[860px]:pt-9">
        <div className="absolute top-8 end-8 leading-none">
          <EqualizerDots tone="light" />
        </div>
        <Eyebrow className="mb-[10px]">{pageContent.intro.eyebrow}</Eyebrow>
        <h2 className="mb-[30px] max-[860px]:text-[clamp(24px,7vw,34px)]">
          {staff.length > 0 ? t(locale, teamMemberCategoryLabels.staff) : pageContent.intro.title}
        </h2>
        <div className="grid grid-cols-3 gap-x-[26px] gap-y-8 max-[860px]:grid-cols-2 max-[560px]:grid-cols-1">
          {(staff.length > 0 ? staff : visibleMembers).map((member) => (
            <TeamMemberCard key={member.id} member={member} locale={locale} />
          ))}
        </div>
      </Reveal>

      {overTheYears.length > 0 ? (
        <Reveal as="section" className="bg-tint-cream">
          <div className="mx-auto max-w-[1080px] px-8 pb-16 pt-14 max-[860px]:px-[18px] max-[860px]:pb-10 max-[860px]:pt-10">
            {overTheYears.map(([category, members], i) => (
              <div key={category} className={i > 0 ? 'mt-10' : undefined}>
                <h2 className="mb-6 text-[clamp(20px,2.4vw,26px)] max-[860px]:text-[clamp(19px,5.5vw,24px)]">
                  {t(locale, teamMemberCategoryLabels[category])}
                </h2>
                <div className="grid grid-cols-4 gap-x-5 gap-y-7 max-[860px]:grid-cols-3 max-[560px]:grid-cols-2">
                  {members.map((member) => (
                    <TeamMemberCard key={member.id} member={member} locale={locale} compact />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      ) : null}

    </>
  )
}
