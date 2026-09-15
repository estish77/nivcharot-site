import type { Access, FieldAccess } from 'payload'

import { isAdminRole } from './roles'

/** Admins only — editors and anonymous requests are denied. */
export const isAdmin: Access = ({ req }) => isAdminRole(req)

/** Field-level equivalent of {@link isAdmin}, for `field.access.create`/`.update`. */
export const isAdminField: FieldAccess = ({ req }) => isAdminRole(req)

/**
 * Admins get the whole collection; any other logged-in user is narrowed to
 * their OWN document. Used by `Users` so an editor can still open and edit
 * her own account (change her password, fix her email) without being able
 * to see, edit or delete anyone else's.
 *
 * Returning a `Where` rather than `false` is what keeps the admin UI usable
 * for an editor: Payload applies the constraint to list and detail views
 * alike, so she sees a Users list containing exactly one row, herself.
 */
export const isAdminOrSelf: Access = ({ req }) => {
  if (!req.user) return false
  if (isAdminRole(req)) return true
  return { id: { equals: req.user.id } }
}
