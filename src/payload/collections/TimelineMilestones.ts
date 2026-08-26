import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { publishedOrAdmin } from '../access/publishedOrAdmin'
import { autoTranslateCollectionHook } from '../hooks/autoTranslate'
import { revalidateCollection } from '../hooks/revalidate'

/**
 * Entries in the "מהרשת, לרחוב..." history timeline on docs/Story.dc.html.
 *
 * `year` is `text`, not `number`: the mockup's own entries include a
 * non-numeric label ("רקע" / "Background" for the pre-2012 context card)
 * and a combined label ("2020/23"), so a plain year number can't represent
 * every row.
 *
 * `visible` is localized on purpose (per the schema brief): the Hebrew
 * timeline in the mockup has 21 entries while the English one has 14 —
 * an editor unchecks `visible` for the English locale on the seven
 * Hebrew-only milestones (deep procedural/legal detail that doesn't
 * translate well) rather than maintaining two separate lists.
 */
export const TimelineMilestones: CollectionConfig = {
  slug: 'timeline-milestones',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['year', 'title', 'order'],
  },
  access: {
    read: publishedOrAdmin({ visible: { equals: true } }),
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateCollection('timeline-milestones'), autoTranslateCollectionHook()],
  },
  fields: [
    {
      name: 'year',
      type: 'text',
      required: true,
      admin: {
        description:
          'Display label, not always a plain year — the mockup uses "רקע"/"Background" and "2020/23".',
      },
    },
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'body', type: 'richText', required: true, localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number', required: true, defaultValue: 0 },
    {
      name: 'visible',
      type: 'checkbox',
      required: true,
      defaultValue: true,
      localized: true,
      admin: {
        description:
          'Localized on purpose — this is how 21 Hebrew milestones become 14 in the English timeline.',
      },
    },
    {
      name: 'externalArticles',
      type: 'array',
      labels: { singular: 'Press clipping', plural: 'Press clippings' },
      admin: {
        description: 'Optional "as covered by" links to real press coverage from the same period.',
      },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'outlet', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
