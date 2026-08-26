import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { heroField, pillarCardsField, sectionIntrosField, statTilesField } from '../fields/globalSections'
import { autoTranslateGlobalHook } from '../hooks/autoTranslate'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * Editable copy for the about page (docs/About.dc.html): hero plus the
 * "הצוות" intro that precedes the team-members list.
 */
export const About: GlobalConfig = {
  slug: 'about',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobal('about'), autoTranslateGlobalHook()],
  },
  fields: [heroField(), statTilesField(), pillarCardsField(), sectionIntrosField()],
}
