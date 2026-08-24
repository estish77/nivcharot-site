import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { heroField, pillarCardsField, sectionIntrosField, statTilesField } from '../fields/globalSections'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * Editable copy for the podcast page (docs/Podcast.dc.html): hero copy
 * above the episode lists, which are pulled live from the
 * `podcast-episodes` collection.
 */
export const Podcast: GlobalConfig = {
  slug: 'podcast',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobal('podcast')],
  },
  fields: [heroField(), statTilesField(), pillarCardsField(), sectionIntrosField()],
}
