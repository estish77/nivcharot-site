import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { heroField } from '../fields/globalSections'
import { autoTranslateGlobalHook } from '../hooks/autoTranslate'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * Editable copy for `/mishpat` ("משפט") — a placeholder page for now (a
 * brief overview of Nivcharot's legal tools), meant to be filled out with
 * real material later directly through this global. Unlike `Halacha.ts`,
 * the body here is a genuinely free-text `richText` field with no
 * hardcoded citations to protect — this page is expected to keep changing
 * from the admin.
 */
export const Mishpat: GlobalConfig = {
  slug: 'mishpat',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobal('mishpat'), autoTranslateGlobalHook()],
  },
  fields: [heroField(), { name: 'body', type: 'richText', localized: true }],
}
