'use client'

import { sendGAEvent } from '@next/third-parties/google'
import type { ReactNode } from 'react'
import type { Locale } from '@/lib/i18n'

type Props = {
  href: string
  locale: Locale
  event: 'program_interest_click' | 'archive_activity_click' | 'transparency_link_click'
  children: ReactNode
  className?: string
}

export function TrackedLink({ href, locale, event, children, className }: Props) {
  return (
    <a href={href} className={className} onClick={() => {
      if (window.dataLayer) sendGAEvent('event', event, { link_url: href, language: locale })
    }}>
      {children}
    </a>
  )
}
