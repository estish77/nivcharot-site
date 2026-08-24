import type { PayloadRequest } from 'payload'

/**
 * Whether the requesting user is an authenticated admin or editor.
 * Anonymous (public site) requests have `req.user === null`.
 */
export function hasEditorRole(req: PayloadRequest): boolean {
  const role = req.user?.role
  return role === 'admin' || role === 'editor'
}
