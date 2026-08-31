import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { autoTranslateCollectionHook } from '../hooks/autoTranslate'
import { revalidateCollection } from '../hooks/revalidate'

/**
 * "קמפיינים" section on the Activism page (2026-08-31 brief: an
 * Instagram-post-card gallery for the org's real @nivcharot campaigns,
 * added and edited here going forward). This collection starts empty:
 * there's no automated way to pull real images/captions off Instagram, so
 * nothing here is seeded or invented, matching `getEvents()`'s own doc
 * comment in src/lib/cms.ts on why an empty section beats a fabricated one.
 *
 * Each row is one post: one image, one caption, the date it went out, and
 * an optional link back to the real Instagram post. No like/comment counts:
 * this site has no way to know real engagement numbers, and making some up
 * would be exactly that same kind of fabricated content.
 */
export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  labels: { singular: 'Campaign Post', plural: 'Campaigns' },
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['image', 'caption', 'postedAt'],
    description: 'The "קמפיינים" post-card gallery on the Activism page.',
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateCollection('campaigns'), autoTranslateCollectionHook()],
  },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'textarea', required: true, localized: true },
    { name: 'postedAt', type: 'date', required: true, admin: { description: 'Used for both the display date and the sort order (newest first).' } },
    {
      name: 'instagramUrl',
      type: 'text',
      admin: { description: 'Optional link to the real post on Instagram. Leave blank to hide the "View on Instagram" link.' },
    },
  ],
}
