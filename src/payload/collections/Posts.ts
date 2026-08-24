import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { publishedOrAdmin } from '../access/publishedOrAdmin'
import { legacyFields } from '../fields/legacyFields'
import { reviewStatusField } from '../fields/reviewStatusField'
import { slugField } from '../fields/slugField'
import { revalidateCollection } from '../hooks/revalidate'

/**
 * The legacy-site article archive (docs/ArchiveTemp.dc.html, filterable by
 * category/year; docs/Post.dc.html, a single article with prev/next
 * navigation and optional "לקריאה ולצפייה במקור" source links).
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'reviewStatus', 'featured'],
  },
  access: {
    read: publishedOrAdmin({ reviewStatus: { equals: 'keep' } }),
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateCollection('posts')],
  },
  fields: [
    slugField('title'),
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'date', type: 'date', required: true },
    { name: 'body', type: 'richText', required: true, localized: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'categories', type: 'relationship', relationTo: 'categories', hasMany: true },
    {
      name: 'sourceLinks',
      type: 'array',
      labels: { singular: 'Source link', plural: 'Source links' },
      admin: {
        description: '"לקריאה ולצפייה במקור" — external links to the original coverage.',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    reviewStatusField(),
    ...legacyFields(),
  ],
}
