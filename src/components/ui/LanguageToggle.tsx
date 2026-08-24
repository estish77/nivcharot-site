'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { dict, locales, type Locale } from '@/lib/i18n'
import { cn } from './cn'

export type LanguageToggleProps = {
  locale: Locale
  className?: string
}

/** Swaps only the leading /he or /en path segment, preserving the rest of the route. */
function withLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split('/')
  segments[1] = locale
  return segments.join('/') || `/${locale}`
}

/**
 * The `עב | EN` language toggle: 12.5px, tracking 0.05em. Active = weight
 * 700 + 1.5px accent bottom border + `--color-text`; inactive = weight
 * 500, transparent bottom border, `hover:`/`focus-visible:` to
 * `--color-text`.
 *
 * Uses `--color-neutral-700` for the inactive state, not the mockups'
 * `--color-neutral-600` — an intentional a11y fix: this text is 12.5px
 * ("small text" under the project's WCAG rule), and neutral-600 on
 * `--color-bg` fails AA at that size.
 *
 * Switches locale by rewriting the current path's leading segment, so
 * navigating from any page keeps you on its translated equivalent.
 */
export function LanguageToggle({ locale, className }: LanguageToggleProps) {
  const pathname = usePathname()

  return (
    <span className={cn('flex items-center gap-[9px]', className)}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-[9px]">
          {i > 0 && <span aria-hidden="true" className="h-[11px] w-px bg-divider" />}
          <Link
            href={withLocale(pathname, l)}
            aria-current={l === locale ? 'true' : undefined}
            className={cn(
              'border-b-[1.5px] pb-0.5 font-heading text-[12.5px] tracking-[0.05em] transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              l === locale
                ? 'border-accent font-bold text-text'
                : 'border-transparent font-medium text-neutral-700 hover:text-text focus-visible:text-text',
            )}
          >
            {dict.languageToggle[l]}
          </Link>
        </span>
      ))}
    </span>
  )
}
