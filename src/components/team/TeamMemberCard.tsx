import Image from 'next/image'

import { AppreciateButton } from './AppreciateButton'

import { Cell } from '@/components/ui/Cell'
import { cn } from '@/components/ui/cn'
import { HeadphonesIcon } from '@/components/ui/HeadphonesIcon'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { t, type Locale } from '@/lib/i18n'
import type { TeamMember } from '@/content/team'
import { findTeamPodcastEpisode } from '@/content/teamPodcastEpisodes'

export type TeamMemberCardProps = {
  /**
   * Slightly smaller photo and type, used by the "over the years" group.
   *
   * It used to drop the bio too. It no longer does (2026-08-28 brief:
   * "enlarge that section's area and content") — those entries have real
   * bios now, and hiding them was the main thing making the group feel
   * like a footnote.
   */
  compact?: boolean
  member: TeamMember
  locale: Locale
}

/**
 * One team-member card: 150x150 circular photo (hover/focus-within zoom to
 * 1.03 over 0.6s, ease `[0.22,0.61,0.36,1]` — matches the mockups' global
 * `figure:hover img { transform: scale(1.03) }` rule) + name (h3) + role
 * caption + bio paragraph.
 *
 * Renders as a `Cell` — the site's existing bordered-grid unit (About,
 * Home, Hanivcheret, Join, Shop, Activism all use the same one) — so a row
 * of members reads as a row of cards, thin dividers between them, rather
 * than photos floating loose on the page background. `TeamPageContent`
 * must render these directly inside a `CellGrid` for the borders to land
 * (they key off direct-child CSS selectors).
 *
 * Uses `next/image` (not the shared `Figure`, which renders a plain
 * `<img>`) per this agent's assignment — photos hotlink to
 * www.nivcharot.co.il and need `images.remotePatterns` registered in
 * `next.config.ts` (out of this agent's scope, see final report).
 *
 * The role caption uses `text-accent-700`, not the mockup's raw
 * `--color-accent`: at 12px this is small text, and the project's a11y
 * rules require the darker accent shade for small red text to hold WCAG AA.
 */
export function TeamMemberCard({ member, locale, compact = false }: TeamMemberCardProps) {
  const name = t(locale, member.name)
  // Only for people who came from the CMS: `member.id` has to be the
  // collection's own id for the vote to attach to anyone. The static
  // fixture's ids are slugs like "esty-shushan", and the page falls back to
  // it only when the collection is empty — nothing to thank yet in that case.
  const canAppreciate = /^\d+$/.test(member.id)
  // Real, hand-verified matches only (see the lookup's own doc comment) —
  // most of the roster has no full episode and simply won't match here.
  const episode = findTeamPodcastEpisode(member.name.he)

  return (
    <Cell
      paddingBlockStart={compact ? '20px' : '24px'}
      paddingBlockEnd={compact ? '18px' : '22px'}
    >
      <div
        className={cn(
          'group relative overflow-hidden rounded-full',
          compact ? 'mb-[12px] h-[120px] w-[120px]' : 'mb-[14px] h-[150px] w-[150px]',
        )}
      >
        {member.photo ? (
          <Image
            src={member.photo.src}
            alt={t(locale, member.photo.alt)}
            fill
            sizes={compact ? '120px' : '150px'}
            loading="lazy"
            className="object-cover object-[center_20%] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.03] group-focus-within:scale-[1.03]"
          />
        ) : (
          <ImageSlot
            shape="circle"
            label={t(locale, { he: `תמונה, ${name}`, en: `Photo, ${name}` })}
            className="h-full w-full"
          />
        )}
      </div>
      <h3 className={cn('mb-[3px] leading-[1.2]', compact ? 'text-[16px]' : 'text-[17px]')}>{name}</h3>
      <p
        className={cn(
          'font-heading font-extrabold tracking-[0.03em] text-accent-700',
          compact ? 'mb-[8px] text-[11.5px] leading-[1.45]' : 'mb-[9px] text-[12px]',
        )}
      >
        {t(locale, member.role)}
      </p>
      {member.bio ? (
        <p className={cn('mb-2 leading-[1.6] text-neutral-800', compact ? 'text-[13px]' : 'text-[13.5px]')}>
          {t(locale, member.bio)}
        </p>
      ) : null}
      {/*
        `mt-auto` pushes this to the card's foot regardless of bio length —
        `Cell` is a flex column, and CSS grid's default `align-items:
        stretch` already makes every card in a row match the tallest one, so
        the rule lines up across the whole row, not just per card.
        The heart sits at the row's logical START (`justify-start` — right
        in Hebrew, left in English, matching `PostPrevNext`'s own use of
        logical `justify-end`/`text-end` elsewhere), not centered
        (2026-08-29 brief: "הלב שכוייח מתיישר לימין").
      */}
      {canAppreciate || episode ? (
        <div className="mt-auto flex flex-col gap-2 border-t border-divider pt-3.5">
          {canAppreciate ? (
            <div className="flex justify-start">
              <AppreciateButton memberId={member.id} memberName={name} locale={locale} />
            </div>
          ) : null}
          {episode ? (
            <a
              href={episode.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 self-start text-[12px] font-semibold leading-[1.4] text-accent-700 hover:text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <HeadphonesIcon size={14} className="flex-none" />
              <span>{t(locale, { he: `בואו להכיר מקרוב את ${name}`, en: `Get to know ${name}` })}</span>
            </a>
          ) : null}
        </div>
      ) : null}
    </Cell>
  )
}
