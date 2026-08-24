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
  },
}
