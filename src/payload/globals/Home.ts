import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { heroField, pillarCardsField, sectionIntrosField, statTilesField } from '../fields/globalSections'
import { revalidateGlobal } from '../hooks/revalidate'

/** Editable copy for the home page (docs/Home copy.dc.html). */
export const Home: GlobalConfig = {
  slug: 'home',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobal('home')],
  },
  fields: [heroField(), statTilesField(), pillarCardsField(), sectionIntrosField()],
}
