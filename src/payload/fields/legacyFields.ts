import type { Field } from 'payload'

/**
 * Provenance fields carried over from the legacy nivcharot.co.il import, so
 * editors can trace a document back to its original record and so a future
 * import script can de-duplicate against `legacyId`. Read-only in the admin
 * UI: these are set once at import time, not edited afterward.
 */
export function legacyFields(): Field[] {
  return [
    {
      name: 'legacyId',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Original record ID from the legacy-site import, used for de-duplication.',
      },
    },
    {
      name: 'legacyUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Original URL on nivcharot.co.il, kept for reference and redirects.',
      },
    },
  ]
}
