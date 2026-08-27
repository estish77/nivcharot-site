import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { heroField } from '../fields/globalSections'
import { autoTranslateGlobalHook } from '../hooks/autoTranslate'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * Editable copy for `/halacha` — the comparative overview of the two
 * halakhic rulings on women in public office (Rabbi Kreuzer's responsum,
 * 5785, and the anonymous 2015 pamphlet). Only the hero copy and the two
 * source-document uploads are editable here; the write-up itself (the
 * section-by-section comparison with attributed quotes) is hardcoded in
 * `src/content/halacha.ts`, matching the site's existing convention for
 * precisely-quoted editorial content (see the Activism global's
 * `pillarCards`/hardcoded halakha cards) — free-text editing risks
 * mangling a citation, so it isn't exposed as richText here.
 */
export const Halacha: GlobalConfig = {
  slug: 'halacha',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobal('halacha'), autoTranslateGlobalHook()],
  },
  fields: [
    heroField(),
    {
      name: 'kroizerRulingDocument',
      type: 'upload',
      relationTo: 'media',
      admin: { description: "Rabbi Raphael Kreuzer's responsum (PDF), 18 Tammuz 5785 — offered as a download on the page." },
    },
    {
      name: 'pamphletDocument2015',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'The 2015 pamphlet ("קונטרס בירור הלכתי") on women\'s eligibility for public office — offered as a download on the page.' },
    },
  ],
}
