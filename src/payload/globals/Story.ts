import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { heroField, pillarCardsField, sectionIntrosField, statTilesField } from '../fields/globalSections'
import { autoTranslateGlobalHook } from '../hooks/autoTranslate'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * Editable copy for the story page (docs/Story.dc.html): hero copy above
 * the timeline-milestones list.
 */
export const Story: GlobalConfig = {
  slug: 'story',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobal('story'), autoTranslateGlobalHook()],
  },
  fields: [heroField(), statTilesField(), pillarCardsField(), sectionIntrosField()],
}
