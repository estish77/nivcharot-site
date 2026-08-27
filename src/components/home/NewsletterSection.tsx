'use client'

import { useState, type FormEvent } from 'react'

import { Breathe, Section } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import { joinCards } from '@/content/join'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Still reuses the Join page's "newsletter" card for its intro title/body copy — that text is fine as-is, only the submission mechanism below changed. */
const newsletterCard = joinCards.find((card) => card.id === 'newsletter')!

/**
 * A standalone newsletter-signup section, split out from `DonateBand`
 * (2026-08-13 brief, item 18). Originally handed off to an external signup
 * page; now saves directly into Payload's `newsletter-subscribers`
 * collection (src/payload/collections/NewsletterSubscribers.ts) — same
 * public-create-plus-honeypot pattern as `ContactForm.tsx` — so the site
 * owner can see/export real subscribers from `/admin` without depending on
 * a third-party signup tool. No outbound email-sending is wired up yet;
 * this only durably stores who signed up.
 *
 * Deliberately lighter than `DonateBand` right above it — a thin, single-row
 * bar (own `tint-blue` background, distinct from the accent-red donate band
 * and the cream/slate tints used elsewhere) rather than another full-weight
 * banner, so two big asks back-to-back don't read as "two donation asks."
 */
export function NewsletterSection({ locale }: { locale: Locale }) {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'email' | 'submit'>('idle')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const errorMessage = t(locale, {
    he: 'נא להזין כתובת אימייל תקינה',
    en: 'Please enter a valid email address',
  })
  const submitErrorMessage = t(locale, {
    he: 'ההרשמה לא הצליחה, נסו שוב בעוד רגע.',
    en: "Signup didn't go through — please try again in a moment.",
  })
  const successMessage = t(locale, {
    he: 'נרשמתם בהצלחה! נעדכן אתכם בכל חדש.',
    en: "You're signed up! We'll keep you posted.",
  })
  const submitLabel = t(locale, { he: 'הרשמה', en: 'Subscribe' })
  const submittingLabel = t(locale, { he: 'נרשמים…', en: 'Subscribing…' })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus('email')
      setSent(false)
      return
    }

    setStatus('idle')
    setSubmitting(true)
    try {
      const response = await fetch('/api/newsletter-subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), locale, website }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setSent(true)
      setEmail('')
    } catch {
      setStatus('submit')
      setSent(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Breathe as="section" durationS={5}>
      <Section as="div" tint="tint-blue" paddingBlockStart="14px" paddingBlockEnd="14px" className="relative">
        <form onSubmit={handleSubmit} noValidate className="relative flex flex-nowrap items-center gap-4 overflow-x-auto max-[640px]:flex-wrap">
          <div className="absolute h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="niv-home-newsletter-website">Leave this field empty</label>
            <input
              id="niv-home-newsletter-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>

          <p className="m-0 shrink-0 whitespace-nowrap font-heading text-[13px] font-extrabold tracking-[0.04em] text-neutral-800">
            {t(locale, newsletterCard.title)}
          </p>

          <div className="flex min-w-0 flex-1 items-center gap-2">
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
                if (status !== 'idle') setStatus('idle')
              }}
              aria-invalid={status === 'email'}
              aria-describedby={status !== 'idle' ? 'niv-home-newsletter-error' : undefined}
              className="w-full min-w-0 max-w-[260px] border-2 border-divider bg-white px-3.5 py-2 text-[14px] text-text placeholder:text-neutral-600 focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            />
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary shrink-0 whitespace-nowrap px-5 py-2 text-[14px] disabled:opacity-60"
            >
              {submitting ? submittingLabel : submitLabel}
            </button>
          </div>

          {status !== 'idle' || sent ? (
            <p
              id="niv-home-newsletter-error"
              role="alert"
              className="absolute start-0 top-full mt-1 text-[13px] font-semibold text-accent-700"
            >
              {status === 'email' ? errorMessage : status === 'submit' ? submitErrorMessage : successMessage}
            </p>
          ) : null}
        </form>
      </Section>
    </Breathe>
  )
}
