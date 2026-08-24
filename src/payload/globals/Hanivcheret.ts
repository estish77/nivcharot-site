import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { heroField, pillarCardsField, sectionIntrosField, statTilesField } from '../fields/globalSections'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * Editable copy for the HaNivcheret leadership-program page
 * (docs/Hanivcheret.dc.html): hero, the "כלים / קהילה / עשייה" pillar
 * cards, and the "בוגרות מספרות" intro above the alumnae-quotes strip.
 */
export const Hanivcheret: GlobalConfig = {
  slug: 'hanivcheret',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobal('hanivcheret')],
  },
  fields: [heroField(), statTilesField(), pillarCardsField(), sectionIntrosField()],
}
