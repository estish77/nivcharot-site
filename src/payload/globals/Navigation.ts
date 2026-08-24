import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * The primary nav menu. Every mockup loads it from an external
 * `niv-menu.js` component that isn't present in this repo (see the
 * scaffold report), so this global is what replaces it — editable menu
 * items instead of a missing hardcoded script.
 */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobal('navigation')],
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Menu item', plural: 'Menu items' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: { description: 'Route path, e.g. "/about" — the locale prefix is added automatically.' },
        },
        { name: 'order', type: 'number', required: true, defaultValue: 0 },
      ],
    },
  ],
}
