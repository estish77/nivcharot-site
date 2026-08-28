import Link from 'next/link'
import type { ReactNode } from 'react'

import { dict, t, type Locale } from '@/lib/i18n'
import { cn } from './cn'
// Shared brand glyphs — these paths used to be inlined below, and are now
// used by the media page's social row too (src/components/ui/SocialLinks.tsx).
import { socialIconPaths } from './SocialLinks'

export type FooterProps = {
  locale: Locale
  /** @default `/${locale}/donate` */
  donateHref?: string
  contactEmail?: string
  social?: {
    facebook?: string
    instagram?: string
    youtube?: string
    spotify?: string
    applePodcasts?: string
    podcastInstagram?: string
    hostInstagram?: string
    hostFacebook?: string
    hostX?: string
    hostTiktok?: string
  }
  className?: string
}

type SocialLink = {
  href: string
  label: string
  path: ReactNode
}

function buildNivcharotLinks(social?: FooterProps['social'], contactEmail?: string): SocialLink[] {
  return [
    {
      href: social?.facebook ?? 'https://www.facebook.com/NoVoiceNoVote/',
      label: 'Facebook',
      path: socialIconPaths.facebook,
    },
    {
      href: social?.instagram ?? 'https://www.instagram.com/nivcharot/',
      label: 'Instagram',
      path: socialIconPaths.instagram,
    },
    {
      href: contactEmail ? `mailto:${contactEmail}` : 'mailto:estish@nivcharot.com',
      label: 'Email',
      path: socialIconPaths.email,
    },
  ]
}

function buildHareditLinks(social?: FooterProps['social']): SocialLink[] {
  return [
    {
      href: social?.youtube ?? 'https://www.youtube.com/@%D7%97%D7%A8%D7%93%D7%99%D7%AA%D7%9E%D7%93%D7%95%D7%91%D7%A8%D7%AA',
      label: 'YouTube',
      path: socialIconPaths.youtube,
    },
    {
      href: social?.spotify ?? 'https://open.spotify.com/show/1n2xdgVAKlIhcJqBiVfHFY',
      label: 'Spotify',
      path: socialIconPaths.spotify,
    },
    {
      href: social?.applePodcasts ?? 'https://podcasts.apple.com/il/podcast/id1767223746',
      label: 'Apple Podcasts',
      path: socialIconPaths.applePodcasts,
    },
    {
      href: social?.podcastInstagram ?? 'https://www.instagram.com/haredit_meduberet/',
      label: 'Instagram',
      path: socialIconPaths.instagram,
    },
  ]
}

function SocialIconLink({ href, label, path }: SocialLink) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener' : undefined}
      className="flex h-8 w-8 items-center justify-center text-neutral-700 transition-colors duration-200 ease-out hover:text-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true" className="block">
        {path}
      </svg>
    </a>
  )
}

/**
 * Site footer: 2px top divider, `padding: 34px 24px 28px`, max-width 1240px
 * centered — two brand groups with their verbatim social icon SVG paths
 * (נבחרות: Facebook/Instagram/email; חרדית מדוברת: YouTube/Spotify/Apple
 * Podcasts/Instagram), then a donate link + the copyright line.
 */
export function Footer({ locale, donateHref, contactEmail, social, className }: FooterProps) {
  const nivchaLinks = buildNivcharotLinks(social, contactEmail)
  const podcastLinks = buildHareditLinks(social)

  return (
    <footer className={cn('border-t-2 border-divider px-6 pb-7 pt-[34px]', className)}>
      {/*
        On a phone the two halves used to wrap onto separate rows with a
        full 24px gap between them, which read as two stacked footers rather
        than one (2026-08-28 brief). Below 720px they now stack as a single
        centred column with a tighter gap and no opposing alignment, so it
        holds together as one block.
      */}
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 max-[720px]:flex-col max-[720px]:items-center max-[720px]:gap-3 max-[720px]:text-center">
        <div className="flex flex-wrap items-center justify-start gap-4 max-[720px]:justify-center">
          <span className="font-heading text-[11px] font-extrabold tracking-[0.12em] text-neutral-700">
            {t(locale, { he: 'נבחרות', en: 'NIVCHAROT' })}
          </span>
          <span className="flex items-center gap-1">
            {nivchaLinks.map((link) => (
              <SocialIconLink key={link.href} {...link} />
            ))}
          </span>
          <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-divider" />
          <span className="font-heading text-[11px] font-extrabold tracking-[0.12em] text-neutral-700">
            {t(locale, { he: 'חרדית מדוברת', en: 'HAREDIT MEDUBERET' })}
          </span>
          <span className="flex items-center gap-1">
            {podcastLinks.map((link) => (
              <SocialIconLink key={link.href} {...link} />
            ))}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-4 text-end text-xs tracking-[0.01em] text-neutral-700 max-[720px]:justify-center max-[720px]:text-center">
          <Link
            href={donateHref ?? `/${locale}/donate`}
            // pt/pb + matching negative -mt/-mb grows the tap target to a
            // comfortable ~44px height (up from ~19px) without shifting the
            // visible text/border — see the identical technique (and the
            // note on why -mt-/-mb- rather than the -my- shorthand) in
            // LanguageToggle.tsx. Room to grow into comes from this row's
            // own gap-6 to the icon row above and the footer's pb-7 below.
            className="-mx-2 -mt-3 -mb-[14px] block border-b border-divider px-2 pt-3 pb-[14px] font-semibold no-underline hover:text-accent-700 focus-visible:text-accent-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {dict.donate[locale]}
          </Link>
          <span>{dict.copyright[locale]}</span>
        </div>
      </div>
    </footer>
  )
}
