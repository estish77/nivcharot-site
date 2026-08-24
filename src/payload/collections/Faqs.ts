import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { revalidateCollection } from '../hooks/revalidate'

/**
 * Accordion Q&A entries, e.g. the "שאלות ותשובות · מה שואלים אותנו" section
 * on docs/Activism.dc.html (six numbered `<details>` entries with an
 * answer paragraph and, on several, a "מקור:" source line — folded into
 * the `answer` rich text rather than a separate field, since it's prose
 * that reads as part of the answer, not structured metadata).
 *
 * `page` associates each FAQ with the route it renders on; its options
 * mirror the site's locale-agnostic page slugs (src/app/(site)/[locale]/).
 */
export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'page', 'order'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateCollection('faqs')],
  },
  fields: [
    { name: 'question', type: 'text', required: true, localized: true },
    { name: 'answer', type: 'richText', required: true, localized: true },
    {
      name: 'page',
      type: 'select',
      required: true,
      defaultValue: 'activism',
      options: [
        { label: 'Home', value: 'home' },
        { label: 'About', value: 'about' },
        { label: 'Story', value: 'story' },
        { label: 'Activism', value: 'activism' },
        { label: 'Podcast', value: 'podcast' },
        { label: 'HaNivcheret', value: 'hanivcheret' },
        { label: 'Join', value: 'join' },
        { label: 'Donate', value: 'donate' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
