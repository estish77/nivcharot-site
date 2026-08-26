import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { heroField, pillarCardsField, sectionIntrosField, statTilesField } from '../fields/globalSections'
import { autoTranslateGlobalHook } from '../hooks/autoTranslate'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * Editable copy for the join/get-involved page (docs/Join.dc.html): hero
 * plus the ways-to-get-involved pillar cards (newsletter signup is a
 * site-settings link, not page copy — see SiteSettings.newsletterUrl).
 */
export const Join: GlobalConfig = {
  slug: 'join',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobal('join'), autoTranslateGlobalHook()],
  },
  fields: [heroField(), statTilesField(), pillarCardsField(), sectionIntrosField()],
}
