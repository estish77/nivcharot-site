import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'

/**
 * Expressions of interest in the next "הנבחרת" leadership cycle, submitted
 * from `/hanivcheret` (2026-08-28 brief: the page presents the programme and
 * collects details for the next cycle into the system, rather than sending
 * people off to an external landing page).
 *
 * Deliberately modelled on `Inquiries`: public `create` so an anonymous
 * visitor can apply, admin/editor-only read because this is personal
 * contact data, not editorial content, and the same off-screen `website`
 * honeypot that collection uses against naive form-filling bots.
 *
 * Not localized. A person's name, phone and reasons exist in exactly one
 * language — whichever they typed — and translating them would be wrong.
 */
export const ProgramApplications: CollectionConfig = {
  slug: 'program-applications',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'phone', 'status', 'createdAt'],
    description: 'Applications to join the next "הנבחרת" leadership cycle.',
    group: 'Settings',
  },
  access: {
    read: isAdminOrEditor,
    create: () => true,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    {
      name: 'motivation',
      type: 'textarea',
      required: true,
      admin: { description: 'Why the applicant thinks the programme suits her.' },
    },
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
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Invited to interview', value: 'invited' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'website', type: 'text', admin: { hidden: true } },
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
        const body = [
          `שם מלא: ${doc?.fullName ?? ''}`,
          `אימייל: ${doc?.email ?? ''}`,
          `טלפון: ${doc?.phone ?? ''}`,
          `שפת הפנייה: ${doc?.locale ?? '—'}`,
          '',
          'למה היא חושבת שהיא מתאימה:',
          String(doc?.motivation ?? ''),
          '',
          `— נשלח מטופס ההרשמה ל"הנבחרת" באתר. הפנייה נשמרה גם בדשבורד (מזהה ${doc?.id}).`,
        ].join('\n')

        try {
          await req.payload.sendEmail({
            to,
            ...(doc?.email ? { replyTo: String(doc.email) } : {}),
            subject: `הרשמה ל"הנבחרת": ${doc?.fullName ?? ''}`,
            text: body,
          })
        } catch (error) {
          // The application is already stored; a mail problem must never
          // fail the submission or lose it. Same rule as Inquiries.
          req.payload.logger.error(
            { err: error, application: doc?.id },
            'HaNivcheret application saved, but the notification email could not be sent.',
          )
        }

        return doc
      },
    ],
  },
}
