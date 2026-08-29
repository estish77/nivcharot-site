'use client'

import { useState, type FormEvent } from 'react'

import { contactEmail, contactForm } from '@/content/contact'
import { t, type Locale } from '@/lib/i18n'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type ContactFormProps = { locale: Locale }

/**
 * Submits to Payload's `inquiries` collection (POST /api/inquiries) so
 * every message is durably saved and visible in the admin dashboard, even
 * if outbound email is ever down. Production has SMTP configured (2026-08-29
 * — see .env.example), so `Inquiries.ts`'s `afterChange` hook also forwards
 * every new submission to `CONTACT_INBOX` (estish@nivcharot.com) — but that
 * forward is a best-effort extra, not something this form waits on or
 * surfaces: a mail outage never blocks or fails the visitor's submission.
 * `website` is a honeypot the real fields don't use; see Inquiries.ts for why.
 */
export function ContactForm({ locale }: ContactFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [error, setError] = useState<'required' | 'email' | 'submit' | null>(null)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim() || !message.trim()) {
      setError('required')
      setSent(false)
      return
    }
    if (email.trim() && !EMAIL_PATTERN.test(email.trim())) {
      setError('email')
      setSent(false)
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          message: message.trim(),
          locale,
          website,
        }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setSent(true)
    } catch {
      setError('submit')
      setSent(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-[560px] flex-col gap-4">
      <div className="absolute h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="niv-contact-website">Leave this field empty</label>
        <input
          id="niv-contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="niv-contact-name" className="font-heading text-[13px] font-extrabold tracking-[0.04em] text-neutral-700">
          {t(locale, contactForm.nameLabel)}
        </label>
        <input
          id="niv-contact-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            if (error) setError(null)
          }}
          className="w-full border-2 border-divider bg-white px-4 py-[11px] text-[15px] text-text focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="niv-contact-email" className="font-heading text-[13px] font-extrabold tracking-[0.04em] text-neutral-700">
          {t(locale, contactForm.emailLabel)}
        </label>
        <input
          id="niv-contact-email"
          type="email"
          inputMode="email"
          dir="ltr"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (error) setError(null)
          }}
          aria-invalid={error === 'email'}
          className="w-full border-2 border-divider bg-white px-4 py-[11px] text-[15px] text-text focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="niv-contact-message" className="font-heading text-[13px] font-extrabold tracking-[0.04em] text-neutral-700">
          {t(locale, contactForm.messageLabel)}
        </label>
        <textarea
          id="niv-contact-message"
          rows={5}
          value={message}
          onChange={(event) => {
            setMessage(event.target.value)
            if (error) setError(null)
          }}
          className="w-full resize-y border-2 border-divider bg-white px-4 py-[11px] text-[15px] leading-[1.6] text-text focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>

      {error === 'required' || error === 'email' ? (
        <p role="alert" className="m-0 text-[13px] font-semibold text-accent-700">
          {error === 'required' ? t(locale, contactForm.requiredError) : t(locale, contactForm.emailError)}
        </p>
      ) : null}

      {error === 'submit' ? (
        <p role="alert" className="m-0 text-[13px] font-semibold text-accent-700">
          {t(locale, contactForm.submitError)}
          <a href={`mailto:${contactEmail}`} className="focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            {contactEmail}
          </a>
        </p>
      ) : null}

      {sent ? (
        <p className="m-0 text-[14px] leading-[1.6] text-neutral-800">{t(locale, contactForm.successNote)}</p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary self-start whitespace-nowrap px-6 py-[13px] text-[15px] disabled:opacity-60"
      >
        {submitting ? t(locale, contactForm.submittingLabel) : t(locale, contactForm.submitLabel)}
      </button>
    </form>
  )
}
