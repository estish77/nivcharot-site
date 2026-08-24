import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { revalidateCollection } from '../hooks/revalidate'

/**
 * "בוגרות מספרות" scrolling quote strip on docs/Hanivcheret.dc.html. The
 * mockup's own placeholders read "שם הבוגרת · בוגרת מחזור N" (alumna's
 * name · cohort N alumna) — `name` is intentionally NOT localized (a
 * person's name doesn't translate), matching the schema brief.
 */
export const AlumnaeQuotes: CollectionConfig = {
  slug: 'alumnae-quotes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'cohort', 'order'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateCollection('alumnae-quotes')],
  },
  fields: [
    { name: 'quote', type: 'textarea', required: true, localized: true },
    { name: 'name', type: 'text', required: true },
    {
      name: 'cohort',
      type: 'number',
      required: true,
      admin: { description: 'HaNivcheret cohort number, e.g. 6 for "בוגרת מחזור 6".' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
