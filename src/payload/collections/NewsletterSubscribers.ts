import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'

/**
 * Newsletter signups from the home page (src/components/home/DonateBand.tsx,
 * merged from the former NewsletterSection.tsx).
 * Public `create` (anonymous site visitors post here), admin/editor-only
 * read — transactional data, not editorial content, same shape as
 * `Inquiries.ts` (public create, honeypot, no localization, no revalidate
 * hook). No outbound-email sending is wired up yet; this only durably
 * stores who signed up so an editor can export/reach them later.
 *
 * `email` is normalized (trimmed + lowercased) and `unique` so the same
 * address can't create duplicate rows. `website` is a honeypot — see
 * `Inquiries.ts` for why.
 */
export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',
  labels: { singular: 'Newsletter Subscriber', plural: 'Newsletter Subscribers' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'locale', 'createdAt'],
    description: 'Email signups from the home page newsletter form.',
  },
  access: {
    read: isAdminOrEditor,
    create: () => true,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
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
      defaultValue: 'subscribed',
      options: [
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
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
        if (data?.email) {
          data.email = String(data.email).trim().toLowerCase()
        }
        return data
      },
    ],
  },
}
