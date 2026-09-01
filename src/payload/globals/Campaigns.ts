import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { autoTranslateGlobalHook } from '../hooks/autoTranslate'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * "קמפיינים" Instagram-post-card gallery on the Activism page. A global
 * with one array field, not a collection (2026-09-01 brief, after shipping
 * it as a collection the day before): "אני רוצה שתסדר לי במערכת אפשרות
 * להעלות כמה תמונות ולתת לכל אחת כיתוב וכותרת... לא בא לי כל אחת בנפרד".
 * A collection means opening Payload's "create new document" flow once per
 * photo; this array field is one screen where she clicks "Add Post" as
 * many times as she has photos, fills in each row, and saves everything
 * together.
 *
 * Starts empty on purpose, same as the collection it replaced: there's no
 * way to pull real posts off Instagram automatically, and this codebase
 * doesn't fabricate placeholder editorial content.
 */
export const Campaigns: GlobalConfig = {
  slug: 'campaigns',
  admin: { group: 'Pages' },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobal('campaigns'), autoTranslateGlobalHook()],
  },
  fields: [
    {
      name: 'posts',
      type: 'array',
      labels: { singular: 'Post', plural: 'Posts' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'textarea', required: true, localized: true },
        { name: 'postedAt', type: 'date', required: true, admin: { description: 'Used for both the display date and the sort order (newest first).' } },
        {
          name: 'instagramUrl',
          type: 'text',
          admin: { description: 'Optional link to the real post on Instagram. Leave blank to hide the "View on Instagram" link.' },
        },
      ],
    },
  ],
}
