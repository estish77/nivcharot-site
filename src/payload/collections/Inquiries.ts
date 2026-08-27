import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'

/**
 * Contact-form submissions (src/components/contact/ContactForm.tsx). Public
 * `create` (anonymous site visitors post here), admin/editor-only read —
 * this is transactional inbox data, not editorial content, so unlike the
 * rest of the collections it isn't localized and has no revalidate hook.
 *
 * `website` is a honeypot: rendered off-screen in the form so real visitors
 * never fill it, but naive spam bots that autofill every input do. Hidden
 * from the admin UI (`admin.hidden`) since editors never need to see it.
 *
 * 2026-08-27 brief ("whoever fills the form, the message they wrote has to
 * reach me by email"): every new submission is now also forwarded to the
 * organization's inbox by the `afterChange` hook below, on top of being
 * stored here. The store is still the source of truth - the hook never
 * throws, so a mail outage or missing SMTP credentials can delay the
 * notification but can never lose the message or fail the visitor's
 * submission.
 */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'status', 'createdAt'],
    description: 'Messages submitted through the site contact form.',
  },
  access: {
    read: isAdminOrEditor,
    create: () => true,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'locale',
      type: 'select',
      options: [
        { label: 'Hebrew', value: 'he' },
        { label: 'English', value: 'en' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'website',
      type: 'text',
      admin: { hidden: true },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.website) {
          throw new APIError('Invalid submission.', 400, undefined, true)
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return doc

        const to = process.env.CONTACT_INBOX || 'estish@nivcharot.com'
        const from = doc?.name ? String(doc.name) : 'לא צוין'
        const replyTo = doc?.email ? String(doc.email) : undefined
        const body = [
          `שם: ${from}`,
          `אימייל: ${replyTo ?? 'לא צוין'}`,
          `שפת הפנייה: ${doc?.locale ?? '—'}`,
          '',
          'ההודעה:',
          String(doc?.message ?? ''),
          '',
          `— נשלח מטופס צור קשר באתר. הפנייה נשמרה גם בדשבורד (מזהה ${doc?.id}).`,
        ].join('\n')

        try {
          await req.payload.sendEmail({
            to,
            // Reply hits the visitor directly; the From stays the site's own
            // authenticated sender, since sending as the visitor's address
            // would fail SPF/DMARC at most providers.
            ...(replyTo ? { replyTo } : {}),
            subject: `פנייה חדשה מהאתר: ${from}`,
            text: body,
          })
        } catch (error) {
          // Never fail the visitor's submission over a mail problem - the
          // message is already saved, and that is what must not be lost.
          req.payload.logger.error(
            { err: error, inquiry: doc?.id },
            'Contact form: saved the inquiry but could not send the notification email.',
          )
        }

        return doc
      },
    ],
  },
}
