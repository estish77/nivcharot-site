import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { publishedOrAdmin } from '../access/publishedOrAdmin'
import { reviewStatusField } from '../fields/reviewStatusField'
import { slugField } from '../fields/slugField'
import { revalidateCollection } from '../hooks/revalidate'

/**
 * "עוד ברשת" — podcasts, video/TV coverage and talks/conferences featuring
 * Nivcharot or its people, from outlets OTHER than the org's own "חרדית
 * מדוברת" podcast (src/content/elsewhere-media.ts's shape, ported to a
 * real, editable collection). Same reviewStatus moderation gate as
 * PressArchive — set to `hidden` to pull an item from the public site
 * without a code change.
 */
export const ElsewhereMedia: CollectionConfig = {
  slug: 'elsewhere-media',
  labels: { singular: 'Elsewhere Media Item', plural: 'Elsewhere Media' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'host', 'kind', 'sortDate', 'reviewStatus'],
    description: 'Podcasts, video/TV, and talks featuring Nivcharot on OTHER shows — the "עוד ברשת" section on /media.',
  },
  access: {
    read: publishedOrAdmin({ reviewStatus: { equals: 'keep' } }),
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateCollection('elsewhere-media')],
  },
  fields: [
    slugField('title'),
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'summary', type: 'textarea', required: true, localized: true },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'podcast',
      options: [
        { label: 'Podcast', value: 'podcast' },
        { label: 'Video / TV', value: 'video' },
        { label: 'Talk / conference', value: 'talk' },
      ],
      admin: { description: 'Which sub-section this appears under on the public page.' },
    },
    { name: 'host', type: 'text', required: true, admin: { description: 'Show/channel name — a proper name, not localized.' } },
    {
      name: 'dateLabel',
      type: 'text',
      localized: true,
      admin: { description: 'Human display date. Leave blank if the exact date is genuinely unknown.' },
    },
    { name: 'sortDate', type: 'date', required: true, admin: { description: 'Used only for sorting, never rendered as-is.' } },
    {
      name: 'sourceLanguage',
      type: 'select',
      required: true,
      defaultValue: 'he',
      options: [
        { label: 'Hebrew', value: 'he' },
        { label: 'English', value: 'en' },
      ],
    },
    { name: 'url', type: 'text', required: true, admin: { description: 'The real URL — a YouTube watch link embeds inline automatically.' } },
    {
      name: 'note',
      type: 'textarea',
      localized: true,
      admin: { description: 'An honest, visible caveat (e.g. "exact publish date not located") — shown on the card when present.' },
    },
    reviewStatusField(),
  ],
}
