import Link from 'next/link'
import type { ReactNode } from 'react'

import { dict, t, type Locale } from '@/lib/i18n'
import type { PayloadSiteSettings } from '@/lib/cms'
import { buildHareditLinks, buildNivcharotLinks } from '@/lib/socialLinks'
import { cn } from './cn'
// Shared brand glyphs — these paths used to be inlined below, and are now
// used by the media page's social row too (src/components/ui/SocialLinks.tsx).
import { socialIconPaths } from './SocialLinks'

export type FooterProps = {
  locale: Locale
  /** @default `/${locale}/donate` */
  donateHref?: string
  contactEmail?: string
  social?: PayloadSiteSettings['social']
  className?: string
}

type SocialLink = {
  href: string
  label: string
  path: ReactNode
}

/**
 * Falls back to `PayloadSiteSettings['social']`'s real defaults (not a
 * second, separately-hand-typed set of URLs) when a caller passes no
 * `social` prop at all — every real call site does pass one, but the prop
 * stays optional for callers that don't have it yet.
 */
const FALLBACK_SOCIAL: PayloadSiteSettings['social'] = {
  facebook: 'https://www.facebook.com/NoVoiceNoVote/',
  instagram: 'https://www.instagram.com/nivcharot/',
  youtube: 'https://www.youtube.com/@%D7%97%D7%A8%D7%93%D7%99%D7%AA%D7%9E%D7%93%D7%95%D7%91%D7%A8%D7%AA',
  spotify: 'https://open.spotify.com/show/7HwVj9J7rnUFqoiUDtc1oL',
  applePodcasts: 'https://podcasts.apple.com/il/podcast/id1767223746',
  podcastInstagram: 'https://www.instagram.com/haredit_meduberet/',
  hostFacebook: 'https://www.facebook.com/profile.php?id=61565500745331',
  hostX: 'https://x.com/estyshushan',
  hostTiktok: 'https://www.tiktok.com/@estybittonshushan',
}

function SocialIconLink({ href, label, path }: SocialLink) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener' : undefined}
      className="flex h-8 w-8 items-center justify-center text-neutral-700 transition-colors duration-200 ease-out hover:text-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent max-[480px]:h-7 max-[480px]:w-7"
    >
      <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true" className="block max-[480px]:w-4">
        {path}
      </svg>
    </a>
  )
}

/**
 * Site footer: 2px top divider, `padding: 34px 24px 28px`, max-width 1240px
 * centered — a single row of social icons (Nivcharot's Facebook/Instagram/
 * X/email, then Haredit Meduberet's Facebook/Instagram/TikTok/YouTube/
 * Spotify/Apple Podcasts — see `src/lib/socialLinks.ts` for which account
 * backs each), then a donate link + the copyright line.
 */
export function Footer({ locale, donateHref, contactEmail, social, className }: FooterProps) {
  const resolvedSocial = social ?? FALLBACK_SOCIAL
  const nivchaLinks: SocialLink[] = [
    ...buildNivcharotLinks(resolvedSocial, locale).map((item) => ({
      href: item.href,
      label: item.label,
      path: socialIconPaths[item.network],
    })),
    {
      href: contactEmail ? `mailto:${contactEmail}` : 'mailto:estish@nivcharot.com',
      label: t(locale, { he: 'מייל', en: 'Email' }),
      path: socialIconPaths.email,
    },
  ]
  const podcastLinks: SocialLink[] = buildHareditLinks(resolvedSocial, locale).map((item) => ({
    href: item.href,
    label: item.label,
    path: socialIconPaths[item.network],
  }))

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
        {/*
          One unbroken row of icons (2026-08-28 brief: drop the "נבחרות" and
          "חרדית מדוברת" captions and put them all on one line) — kept that
          way rather than reintroducing captions when the account list grew
          to ten icons (2026-08-29 brief: Nivcharot's X, Haredit Meduberet's
          own Facebook and TikTok). `flex-nowrap` keeps it a single row at
          every width; each link still names its own destination for screen
          readers, which is what captions would otherwise do visually. Icons
          shrink a step below 480px (`max-[480px]:h-7/w-7`) so ten of them
          still fit one row on the narrowest real phones.
        */}
        <div className="flex flex-nowrap items-center justify-start gap-1 max-[720px]:justify-center">
          {[...nivchaLinks, ...podcastLinks].map((link) => (
            <SocialIconLink key={link.href} {...link} />
          ))}
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
