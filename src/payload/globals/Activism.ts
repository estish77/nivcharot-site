import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { heroField, pillarCardsField, sectionIntrosField, statTilesField } from '../fields/globalSections'
import { autoTranslateGlobalHook } from '../hooks/autoTranslate'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * Editable copy for the activism page (docs/Activism.dc.html): hero,
 * the בג"ץ/#מחאת_הכסאות/כנסת/קהילה pillar cards, and the survey stat used
 * in the first FAQ answer (59% / 27% / 32% / 65% / 14). The FAQ questions
 * themselves live in the `faqs` collection (`page: 'activism'`), not here.
 */
export const Activism: GlobalConfig = {
  slug: 'activism',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobal('activism'), autoTranslateGlobalHook()],
  },
  fields: [heroField(), statTilesField(), pillarCardsField(), sectionIntrosField()],
}
