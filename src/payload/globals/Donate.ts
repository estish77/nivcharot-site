import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { heroField, pillarCardsField, sectionIntrosField, statTilesField } from '../fields/globalSections'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * Editable copy for the donate page (docs/Shop.dc.html): hero copy above
 * the card/standing-order/bank-transfer options. The actual checkout
 * links, bank details and tax text live in `site-settings` since they're
 * reused in the footer too — this global only holds this page's own
 * headline copy.
 */
export const Donate: GlobalConfig = {
  slug: 'donate',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobal('donate')],
  },
  fields: [heroField(), statTilesField(), pillarCardsField(), sectionIntrosField()],
}
