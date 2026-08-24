import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'

/**
 * Shared upload library backing every `upload`/`relationTo: 'media'` field
 * across the schema (post cover images, event photos, team photos, podcast
 * covers, timeline images). The mockups render every photograph through an
 * `<image-slot>` placeholder or a `<figure class="grayscale">` crop, always
 * with alt text and, per docs/Event.dc.html's `-325x220` thumbnail suffix
 * convention, a small thumbnail alongside the full image — hence
 * `focalPoint` + fixed-aspect `imageSizes` rather than a single original.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  upload: {
    // Local-dev fallback path — payload.config.ts's vercelBlobStorage
    // plugin takes over storage (ignoring staticDir) once
    // BLOB_READ_WRITE_TOKEN is set, so production uploads don't land on a
    // disk that doesn't survive a deploy.
    staticDir: 'media',
    mimeTypes: ['image/*'],
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
      admin: { description: 'Descriptive alt text — required for every image, in both locales.' },
    },
  ],
}
