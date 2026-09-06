import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { autoTranslateCollectionHook } from '../hooks/autoTranslate'

/**
 * Shared upload library backing every `upload`/`relationTo: 'media'` field
 * across the schema (post cover images, event photos, team photos, podcast
 * covers, timeline images). The mockups render every photograph through an
 * `<image-slot>` placeholder or a `<figure class="grayscale">` crop, always
 * with alt text and, per docs/Event.dc.html's `-325x220` thumbnail suffix
 * convention, a small thumbnail alongside the full image — hence
 * `focalPoint` + fixed-aspect `imageSizes` rather than a single original.
 */
/**
 * "category" (2026-09-06 brief: "ספריית המדיה צריכה להכיל תצוגה מקדימה,
 * ואפשרות לסווג בה תמונות" — filter by what an image actually shows, so
 * bulk-picking media into a gallery later starts from a short list instead
 * of the whole library. A plain `select`, not a relationship to a separate
 * collection: this is a coarse content-type filter for browsing the media
 * library, not editorial taxonomy like `categories` (that one tags posts).
 */
const MEDIA_CATEGORIES = [
  { label: 'Team', value: 'team' },
  { label: 'Events / Gatherings', value: 'events' },
  { label: 'Campaigns', value: 'campaigns' },
  { label: 'Podcast', value: 'podcast' },
  { label: 'Press', value: 'press' },
  { label: 'Other', value: 'other' },
]

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'category', 'updatedAt'],
    // Payload's own upload-collection admin already renders a thumbnail
    // per row and a full preview on each document; nothing extra was
    // needed there. `displayPreview` on the `images` field in the new
    // `Galleries` collection is what shows previews at PICK time, since
    // that's the point in the workflow the brief's "תצוגה מקדימה" is about.
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [autoTranslateCollectionHook()],
  },
  upload: {
    // Local-dev fallback path — payload.config.ts's vercelBlobStorage
    // plugin takes over storage (ignoring staticDir) once
    // BLOB_READ_WRITE_TOKEN is set, so production uploads don't land on a
    // disk that doesn't survive a deploy.
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1600, height: 900, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Descriptive alt text, required for every image, in both locales.' },
    },
    {
      name: 'caption',
      type: 'textarea',
      localized: true,
      admin: {
        description:
          'Optional real caption, shown to visitors on a gallery card. Different from Alt text above, which is for screen readers only and never rendered as visible text.',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: MEDIA_CATEGORIES,
      admin: {
        position: 'sidebar',
        description: 'What this image shows, used to filter the library when picking images for a gallery.',
      },
    },
  ],
}
