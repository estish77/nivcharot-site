import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { publishedOrAdmin } from '../access/publishedOrAdmin'
import { legacyFields } from '../fields/legacyFields'
import { reviewStatusField } from '../fields/reviewStatusField'
import { slugField } from '../fields/slugField'
import { autoTranslateCollectionHook } from '../hooks/autoTranslate'
import { revalidateCollection } from '../hooks/revalidate'

/**
 * Legacy conference/screening/gallery imports (docs/Event.dc.html): a year,
 * a title, a photo grid, and an optional credit line. `photos` mirrors
 * docs/ArchiveTemp.dc.html's gallery-data shape, where each event is a
 * folder of full-size images with a shared `-325x220` thumbnail suffix —
 * modeled here as individual uploads so Payload/`sharp` generates the
 * thumbnail size per photo instead of relying on a filename convention.
 */
export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'reviewStatus'],
  },
  access: {
    read: publishedOrAdmin({ reviewStatus: { equals: 'keep' } }),
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateCollection('events'), autoTranslateCollectionHook()],
  },
  fields: [
    slugField('title'),
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'year', type: 'number', required: true, min: 1990, max: 2100 },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      admin: { description: 'A few sentences about the event — shown on its gallery page.' },
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Photo credit line, e.g. a photographer or organization name.' },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'photos',
      type: 'array',
      labels: { singular: 'Photo', plural: 'Photos' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text', required: true, localized: true },
      ],
    },
    reviewStatusField(),
    ...legacyFields(),
  ],
}
