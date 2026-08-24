import Link from 'next/link'
import type { ReactNode } from 'react'

import { dict, t, type Locale } from '@/lib/i18n'
import { cn } from './cn'

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
      path: (
        <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
      ),
    },
    {
      href: social?.instagram ?? 'https://www.instagram.com/nivcharot/',
      label: 'Instagram',
      path: (
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.899.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.9 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.9-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm7.846-10.405a1.441 1.441 0 01-2.88 0 1.44 1.44 0 012.88 0z" />
      ),
    },
    {
      href: contactEmail ? `mailto:${contactEmail}` : 'mailto:estish@nivcharot.com',
      label: 'Email',
      path: (
        <path
          d="M1.5 4.5h21v15h-21zM1.5 4.5 12 13.5l10.5-9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      ),
    },
  ]
}

function buildHareditLinks(social?: FooterProps['social']): SocialLink[] {
  return [
    {
      href: social?.youtube ?? 'https://www.youtube.com/@%D7%97%D7%A8%D7%93%D7%99%D7%AA%D7%9E%D7%93%D7%95%D7%91%D7%A8%D7%AA',
      label: 'YouTube',
      path: (
        <path d="M23.499 6.203a3.008 3.008 0 00-2.089-2.089C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.41.614A3.008 3.008 0 00.501 6.203C0 8.11 0 12 0 12s0 3.89.501 5.797a3.008 3.008 0 002.089 2.089C4.495 20.5 12 20.5 12 20.5s7.505 0 9.41-.614a3.008 3.008 0 002.089-2.089C24 15.89 24 12 24 12s0-3.89-.501-5.797zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
      ),
    },
    {
      href: social?.spotify ?? 'https://open.spotify.com/show/1n2xdgVAKlIhcJqBiVfHFY',
      label: 'Spotify',
      path: (
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.24-.899-.6-.12-.421.24-.781.6-.901 4.561-1.021 8.52-.6 11.64 1.32.42.18.479.66.241 1.082zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      ),
    },
    {
      href: social?.applePodcasts ?? 'https://podcasts.apple.com/il/podcast/id1767223746',
      label: 'Apple Podcasts',
      path: (
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.377-2.376-1.897-.13-3.5 1.052-4.623 1.052zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
      ),
    },
    {
      href: social?.podcastInstagram ?? 'https://www.instagram.com/haredit_meduberet/',
      label: 'Instagram',
      path: (
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.899.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.9 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.9-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm7.846-10.405a1.441 1.441 0 01-2.88 0 1.44 1.44 0 012.88 0z" />
      ),
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
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap items-center justify-start gap-4">
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
        <div className="flex flex-wrap items-center justify-end gap-4 text-end text-xs tracking-[0.01em] text-neutral-700">
          <Link
            href={donateHref ?? `/${locale}/donate`}
            className="border-b border-divider pb-0.5 font-semibold no-underline hover:text-accent-700 focus-visible:text-accent-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {dict.donate[locale]}
          </Link>
          <span>{dict.copyright[locale]}</span>
        </div>
      </div>
    </footer>
  )
}
