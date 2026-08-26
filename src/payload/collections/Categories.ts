import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { slugField } from '../fields/slugField'
import { autoTranslateCollectionHook } from '../hooks/autoTranslate'
import { revalidateCollection } from '../hooks/revalidate'

/**
 * Post categories used as filter chips on the legacy-archive listing
 * (docs/ArchiveTemp.dc.html's `{{ catChips }}`, e.g. "בלוג", "בעיתונות").
 * Public and unrestricted to read: categories aren't editorial content on
 * their own, just labels attached to posts.
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateCollection('categories'), autoTranslateCollectionHook()],
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    slugField('name'),
  ],
}
