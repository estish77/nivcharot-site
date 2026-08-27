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
 * Deliberately lighter than `DonateBand` right above it (less padding, no
 * block border) — two full-weight accent bands stacked back-to-back read as
 * "two donation asks," so this one is the quieter, secondary one.
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
      <Section as="div" tint="tint-cream" paddingBlockStart="28px" paddingBlockEnd="28px" className="relative">
        <form onSubmit={handleSubmit} noValidate className="flex flex-wrap items-start justify-between gap-6">
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

          <div style={{ maxWidth: 420 }}>
            <p className="m-0 mb-1.5 font-heading text-[13px] font-extrabold tracking-[0.06em] text-accent-700">
              {t(locale, newsletterCard.title)}
            </p>
            <p className="m-0 text-[15px] leading-[1.7] text-neutral-800">{t(locale, newsletterCard.body)}</p>
            {sent ? <p className="m-0 mt-2 text-[13.5px] font-semibold text-accent-700">{successMessage}</p> : null}
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
                  if (status !== 'idle') setStatus('idle')
                }}
                aria-invalid={status === 'email'}
                aria-describedby={status !== 'idle' ? 'niv-home-newsletter-error' : undefined}
                className="w-full border-2 border-divider bg-white px-4 py-[13px] text-[15px] text-text placeholder:text-neutral-600 focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
              {status !== 'idle' ? (
                <p id="niv-home-newsletter-error" role="alert" className="m-0 text-[13px] font-semibold text-accent-700">
                  {status === 'email' ? errorMessage : submitErrorMessage}
                </p>
              ) : null}
            </div>
            <button type="submit" disabled={submitting} className="btn btn-primary whitespace-nowrap px-6 py-[13px] text-[15px] disabled:opacity-60">
              {submitting ? submittingLabel : submitLabel}
            </button>
          </div>
        </form>
      </Section>
    </Breathe>
  )
}
