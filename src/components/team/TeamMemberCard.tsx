import Image from 'next/image'

import { ImageSlot } from '@/components/ui/ImageSlot'
import { t, type Locale } from '@/lib/i18n'
import type { TeamMember } from '@/content/team'

export type TeamMemberCardProps = {
  member: TeamMember
  locale: Locale
}

/**
 * One team-member card: 150x150 circular photo (hover/focus-within zoom to
 * 1.03 over 0.6s, ease `[0.22,0.61,0.36,1]` — matches the mockups' global
 * `figure:hover img { transform: scale(1.03) }` rule) + name (h3) + role
 * caption + bio paragraph.
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
export function TeamMemberCard({ member, locale }: TeamMemberCardProps) {
  const name = t(locale, member.name)

  return (
    <div className="flex flex-col">
      <div className="group relative mb-[14px] h-[150px] w-[150px] overflow-hidden rounded-full">
        {member.photo ? (
          <Image
            src={member.photo.src}
            alt={t(locale, member.photo.alt)}
            fill
            sizes="150px"
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
      <h3 className="mb-[3px] text-[17px] leading-[1.2]">{name}</h3>
      <p className="mb-[9px] font-heading text-[12px] font-extrabold tracking-[0.03em] text-accent-700">
        {t(locale, member.role)}
      </p>
      {member.bio ? <p className="m-0 text-[13.5px] leading-[1.6] text-neutral-800">{t(locale, member.bio)}</p> : null}
    </div>
  )
}
