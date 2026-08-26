import type { Field } from 'payload'

import { enforceLatinSlug } from '../hooks/enforceLatinSlug'

/**
 * Shared `slug` field for every collection that needs a stable, Latin-only
 * URL identifier (posts, events, categories — see docs/ArchiveTemp.dc.html,
 * docs/Post.dc.html, docs/Event.dc.html). Never localized: Payload
 * localizes editorial content, not routes, and one canonical Latin slug
 * serves both locales given Hebrew slugs percent-encode badly in URLs.
 *
 * @param fallbackField name of the (usually localized) title field on the
 *   same document to derive a slug from when the editor leaves this blank.
 */
export function slugField(fallbackField: string): Field {
  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description:
        'Latin/transliterated URL slug. Hebrew is rejected on save: it percent-encodes badly in URLs.',
    },
    hooks: {
      beforeChange: [enforceLatinSlug(fallbackField)],
    },
  }
}
