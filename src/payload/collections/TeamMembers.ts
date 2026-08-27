import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { publishedOrAdmin } from '../access/publishedOrAdmin'
import { autoTranslateCollectionHook } from '../hooks/autoTranslate'
import { revalidateCollection } from '../hooks/revalidate'

/**
 * Staff/board/field-worker cards on docs/Team.dc.html. `name` is localized
 * because the mockup renders a transliterated English spelling on the
 * English page for the same photo (e.g. "שרה ינץ" / "Sara Yanetz", both
 * behind `image-slot id="team-sara"`).
 */
export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    group: 'People',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'category', 'active', 'order'],
  },
  access: {
    read: publishedOrAdmin({ active: { equals: true } }),
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateCollection('team-members'), autoTranslateCollectionHook()],
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'role', type: 'text', required: true, localized: true },
    { name: 'bio', type: 'richText', localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'staff',
      options: [
        { label: 'צוות', value: 'staff' },
        { label: 'צוות מרכזי', value: 'central-team' },
        { label: 'פעילות מרכזית', value: 'central-activity' },
      ],
      admin: { position: 'sidebar', description: 'Which group this person is listed under on the public Team page.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Unchecking hides this person from the public Team page.' },
    },
  ],
}
