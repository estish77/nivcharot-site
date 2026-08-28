'use client'

import { useState, type FormEvent } from 'react'

import { cn } from '@/components/ui'
import { hanivcheretApply } from '@/content/hanivcheret'
import { t, type Locale } from '@/lib/i18n'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** Deliberately loose: Israeli numbers get written with spaces, dashes and +972 in every combination. */
const PHONE_PATTERN = /^[+\d][\d\s()-]{7,}$/

export type ApplyFormProps = { locale: Locale; contactEmail: string }

/**
 * Sign-up for the next "הנבחרת" cycle (2026-08-28 brief). Posts to Payload's
 * `program-applications` collection, so applications land in the dashboard
 * — and, once SMTP is configured, arrive by email too (see that collection's
 * afterChange hook).
 *
 * Same shape as `ContactForm`: an off-screen honeypot the collection
 * rejects, client-side validation before the request, and a failure message
 * that offers the inbox address so a broken submission never becomes a dead
 * end for the applicant.
 */
export function ApplyForm({ locale, contactEmail }: ApplyFormProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [motivation, setMotivation] = useState('')
  const [website, setWebsite] = useState('')
  const [error, setError] = useState<'required' | 'email' | 'phone' | 'submit' | null>(null)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const fieldClass =
    'w-full border-2 border-divider bg-white px-4 py-[13px] text-[15px] text-text focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
  const labelClass = 'font-heading text-[13px] font-extrabold tracking-[0.04em] text-neutral-700'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!fullName.trim() || !email.trim() || !phone.trim() || !motivation.trim()) {
      setError('required')
      setSent(false)
      return
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('email')
      setSent(false)
      return
    }
    if (!PHONE_PATTERN.test(phone.trim())) {
      setError('phone')
      setSent(false)
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      const response = await fetch('/api/program-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          motivation: motivation.trim(),
          locale,
          website,
        }),
      })
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)
      setSent(true)
      setFullName('')
      setEmail('')
      setPhone('')
      setMotivation('')
    } catch {
      setError('submit')
      setSent(false)
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <p className="m-0 max-w-[560px] border-2 border-accent bg-white px-5 py-4 text-[15px] leading-[1.7] text-text">
        {t(locale, hanivcheretApply.successNote)}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-[560px] flex-col gap-5">
      <div className="absolute h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="niv-apply-website">Leave this field empty</label>
        <input
          id="niv-apply-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="niv-apply-name" className={labelClass}>
          {t(locale, hanivcheretApply.nameLabel)}
        </label>
        <input
          id="niv-apply-name"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(event) => {
            setFullName(event.target.value)
            if (error) setError(null)
          }}
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="niv-apply-email" className={labelClass}>
          {t(locale, hanivcheretApply.emailLabel)}
        </label>
        <input
          id="niv-apply-email"
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
          className={cn(fieldClass, 'text-start')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="niv-apply-phone" className={labelClass}>
          {t(locale, hanivcheretApply.phoneLabel)}
        </label>
        <input
          id="niv-apply-phone"
          type="tel"
          inputMode="tel"
          dir="ltr"
          autoComplete="tel"
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value)
            if (error) setError(null)
          }}
          aria-invalid={error === 'phone'}
          className={cn(fieldClass, 'text-start')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="niv-apply-motivation" className={labelClass}>
          {t(locale, hanivcheretApply.motivationLabel)}
        </label>
        <textarea
          id="niv-apply-motivation"
          rows={5}
          value={motivation}
          onChange={(event) => {
            setMotivation(event.target.value)
            if (error) setError(null)
          }}
          className={cn(fieldClass, 'resize-y leading-[1.6]')}
        />
      </div>

      {error && error !== 'submit' ? (
        <p role="alert" className="m-0 text-[13px] font-semibold text-accent-700">
          {t(locale, hanivcheretApply[`${error}Error`])}
        </p>
      ) : null}

      {error === 'submit' ? (
        <p role="alert" className="m-0 text-[13px] font-semibold text-accent-700">
          {t(locale, hanivcheretApply.submitError)}
          <a href={`mailto:${contactEmail}`} className="focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
            {contactEmail}
          </a>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary self-start whitespace-nowrap px-6 py-[13px] text-[15px] disabled:opacity-60"
      >
        {submitting ? t(locale, hanivcheretApply.submittingLabel) : t(locale, hanivcheretApply.submitLabel)}
      </button>
    </form>
  )
}
