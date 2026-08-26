import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { autoTranslateCollectionHook } from '../hooks/autoTranslate'
import { revalidateCollection } from '../hooks/revalidate'

/**
 * Episodes of "חרדית מדוברת" / "Haredit Meduberet" (docs/Podcast.dc.html):
 * the 3-up "recently" cards, the collapsible full archive list, and the
 * single embedded-player "latest episode" section all read from this list.
 *
 * `description` intentionally collapses the mockup's separate short
 * summary (`e.summary`, shown on the 3-up cards) and long copy (`e.full`,
 * shown in the archive accordion) into one field, per the field list in
 * the schema brief — the frontend can truncate it for the compact card,
 * the same way docs/ArchiveTemp.dc.html derives a post's `lead` by slicing
 * its first paragraph. The mockup's Hebrew-calendar subtitle date
 * (`e.dateJew`, e.g. under the Gregorian date in the archive list) has no
 * field in the brief either; it isn't modeled here — flagged in the final
 * report as content the brief's field list doesn't capture.
 */
export const PodcastEpisodes: CollectionConfig = {
  slug: 'podcast-episodes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['number', 'title', 'publishedAt', 'featured'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateCollection('podcast-episodes'), autoTranslateCollectionHook()],
  },
  fields: [
    { name: 'number', type: 'number', required: true, unique: true, min: 1 },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'guestName', type: 'text' },
    { name: 'description', type: 'textarea', required: true, localized: true },
    { name: 'publishedAt', type: 'date', required: true },
    {
      name: 'appleId',
      type: 'text',
      admin: {
        description:
          'Apple Podcasts show ID shared by every episode (docs/Podcast.dc.html links to podcasts.apple.com/il/podcast/id1767223746), used to build the per-episode Apple Podcasts URL.',
      },
    },
    { name: 'spotifyUrl', type: 'text' },
    { name: 'youtubeUrl', type: 'text' },
    { name: 'appleUrl', type: 'text' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
