import type { Access, Where } from 'payload'

import { hasEditorRole } from './roles'

/**
 * Read-access factory shared by every content collection/global that has a
 * notion of "published": admins/editors always see every document
 * (needed to triage `needs-review` legacy content in the admin UI), while
 * anonymous site visitors are limited to documents matching `where`.
 *
 * @example
 * access: { read: publishedOrAdmin({ reviewStatus: { equals: 'keep' } }) }
 */
export function publishedOrAdmin(where: Where): Access {
  return ({ req }) => (hasEditorRole(req) ? true : where)
}
