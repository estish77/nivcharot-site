import type { Localized } from '@/lib/i18n'

/**
 * Contact page fixture — no mockup exists for this page (docs/ has no
 * Contact.dc.html), it's new scope added directly by the site owner
 * (2026-08-13 brief, item 36: "a Contact page with a form that forwards
 * inquiries to the organizational email"). Styled to match the established
 * hero pattern (About/Join/Story) rather than a literal mockup port.
 */
export const contactHero = {
  eyebrow: { he: 'צרו קשר', en: 'Contact us' } satisfies Localized,
  title: { he: 'נשמח לשמוע מכן.', en: "We'd love to hear from you." } satisfies Localized,
  lead: {
    he: 'שאלות, שיתופי פעולה, פניות תקשורת או כל דבר אחר. מלאו את הטופס ונחזור אליכן בהקדם.',
    en: 'Questions, partnerships, press inquiries, or anything else. Fill out the form and we’ll get back to you soon.',
  } satisfies Localized,
}

export const contactForm = {
  nameLabel: { he: 'שם מלא', en: 'Full name' } satisfies Localized,
  emailLabel: { he: 'כתובת אימייל', en: 'Email address' } satisfies Localized,
  messageLabel: { he: 'הודעה', en: 'Message' } satisfies Localized,
  submitLabel: { he: 'שליחה', en: 'Send' } satisfies Localized,
  submittingLabel: { he: 'שולחת...', en: 'Sending...' } satisfies Localized,
  requiredError: { he: 'נא למלא שם והודעה', en: 'Please fill in your name and message' } satisfies Localized,
  emailError: { he: 'נא להזין כתובת אימייל תקינה', en: 'Please enter a valid email address' } satisfies Localized,
  /**
   * Shown when the POST to /api/inquiries itself fails (network error, API
   * down) — distinct from the client-side validation errors above.
   */
  submitError: {
    he: 'ההודעה לא נשלחה. אפשר לנסות שוב, או לכתוב ישירות ל-',
    en: 'The message could not be sent. Please try again, or write directly to ',
  } satisfies Localized,
  /**
   * The message is saved server-side (Inquiries collection, visible in the
   * admin dashboard) — there's no outbound-email adapter wired up yet (see
   * .env.example), so this doesn't promise an auto-reply, just that the
   * message arrived.
   */
  successNote: {
    he: 'ההודעה שלכן התקבלה ונשמרה, ונחזור אליכן בהקדם. אפשר גם לכתוב ישירות ל-',
    en: 'Your message was received and saved, and we’ll get back to you soon. You can also write directly to ',
  } satisfies Localized,
}

export const contactEmail = 'estish@nivcharot.com'

/** Chrome for the direct-contact block and social row (2026-08-27 brief). */
export const contactDirect = {
  emailHeading: { he: 'במייל, ישירות', en: 'By email, directly' } satisfies Localized,
  emailNote: {
    he: 'מעדיפות לכתוב מהמייל שלכן? זו הכתובת.',
    en: 'Prefer to write from your own inbox? This is the address.',
  } satisfies Localized,
  followHeading: { he: 'עקבו אחרינו', en: 'FOLLOW US' } satisfies Localized,
} as const
