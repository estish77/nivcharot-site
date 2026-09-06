import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { autoTranslateCollectionHook } from '../hooks/autoTranslate'
import { revalidateCollection } from '../hooks/revalidate'

/**
 * Reusable bulk-image gallery (2026-09-06 brief: "אני רוצה שתבנה לי רכיב
 * גלריה שיהיה מחובר למדיה, ואוכל להוסיף כמה תמונות בבת אחת לאותה גלריה,
 * תהיה גלריית כנסים, קמפיינים, ועוד"). One document per gallery (a
 * campaign post, a gathering's photo set), with a single `hasMany` upload
 * field: Payload's own "Select existing" picker on that field type shows
 * every Media item's thumbnail and lets several be multi-selected and added
 * in one action, unlike an `array` of one-upload-per-row fields (the
 * pattern Campaigns used until this replaced it), which only ever adds one
 * image per click.
 *
 * `type` decides where a gallery surfaces on the site (see src/lib/cms.ts's
 * `getGalleries()` and ActivismPage.tsx); add a new option there plus a new
 * render block on the page for a gallery kind beyond the two wired today.
 */
const GALLERY_TYPES = [
  { label: 'Campaigns', value: 'campaigns' },
  { label: 'Gatherings', value: 'gatherings' },
]

export const Galleries: CollectionConfig = {
  slug: 'galleries',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'date'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateCollection('galleries'), autoTranslateCollectionHook()],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'campaigns',
      options: GALLERY_TYPES,
      admin: { position: 'sidebar', description: 'Where this gallery is shown on the site.' },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      minRows: 1,
      displayPreview: true,
      admin: {
        description: 'Select several images from the Media library at once, using ctrl/shift-click or "Select existing".',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      localized: true,
      admin: { description: 'Post caption, shown under the images (used for Campaigns-type galleries).' },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: { description: 'Used for both the display date and the sort order (newest first).' },
    },
    {
      name: 'link',
      type: 'text',
      admin: { description: 'Optional link to the original post (e.g. Instagram). Leave blank to hide the "View" link.' },
    },
  ],
}
