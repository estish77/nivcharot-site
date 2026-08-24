'use client'

import { useState, type FormEvent } from 'react'

import { Reveal, Section } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import { joinCards } from '@/content/join'
import { EqualizerDots } from './EqualizerDots'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Reuses the Join page's "newsletter" card as the single source of truth for the signup URL/label — see DonateBand's original comment for why. */
const newsletterCard = joinCards.find((card) => card.id === 'newsletter')!
const newsletterLink = newsletterCard.links[0]

/**
 * A standalone newsletter-signup section, split out from `DonateBand`
 * (2026-08-13 brief, item 18: the home page needs its own dedicated spot
 * for newsletter signup, separate from the donation banner — the two were
 * previously combined in one accent-red section, reading as "two donation
 * spots" with no clear newsletter destination). Same client-side-validate,
 * then hand off to the external signup page pattern as before.
 */
export function NewsletterSection({ locale }: { locale: Locale }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'error'>('idle')

  const newsletterUrl = t(locale, newsletterLink.href)
  const errorMessage = t(locale, {
    he: 'נא להזין כתובת אימייל תקינה',
    en: 'Please enter a valid email address',
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus('error')
      return
    }
    setStatus('idle')
    window.open(newsletterUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Reveal as="section">
      <Section as="div" tint="tint-cream" borderBlock paddingBlockStart="56px" paddingBlockEnd="56px" className="relative">
        <div className="absolute leading-none" style={{ insetBlockStart: '32px', insetInlineEnd: '32px' }}>
          <EqualizerDots tone="light" />
        </div>
        <form onSubmit={handleSubmit} noValidate className="flex flex-wrap items-start justify-between gap-6">
          <div style={{ maxWidth: 420 }}>
            <p className="m-0 mb-1.5 font-heading text-[13px] font-extrabold tracking-[0.06em] text-accent-700">
              {t(locale, newsletterCard.title)}
            </p>
            <p className="m-0 text-[15px] leading-[1.7] text-neutral-800">{t(locale, newsletterCard.body)}</p>
          </div>
          <div className="flex flex-1 flex-wrap items-start gap-3" style={{ minWidth: 280, maxWidth: 520 }}>
            <div className="flex flex-1 flex-col gap-1.5" style={{ minWidth: 200 }}>
              <label htmlFor="niv-home-newsletter-email" className="sr-only">
                {t(locale, { he: 'כתובת אימייל', en: 'Email address' })}
              </label>
              <input
                id="niv-home-newsletter-email"
                type="email"
                inputMode="email"
                dir="ltr"
                autoComplete="email"
                placeholder={t(locale, { he: 'כתובת אימייל', en: 'Email address' })}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (status === 'error') setStatus('idle')
                }}
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? 'niv-home-newsletter-error' : undefined}
                className="w-full border-2 border-divider bg-white px-4 py-[13px] text-[15px] text-text placeholder:text-neutral-600 focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
              {status === 'error' ? (
                <p id="niv-home-newsletter-error" role="alert" className="m-0 text-[13px] font-semibold text-accent-700">
                  {errorMessage}
                </p>
              ) : null}
            </div>
            <button
              type="submit"
              className="btn btn-primary whitespace-nowrap px-6 py-[13px] text-[15px]"
            >
              {t(locale, newsletterLink.label)}
            </button>
          </div>
        </form>
      </Section>
    </Reveal>
  )
}
