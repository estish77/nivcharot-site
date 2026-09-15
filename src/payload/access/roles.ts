import type { PayloadRequest } from 'payload'

/**
 * Whether the requesting user is an authenticated admin or editor.
 * Anonymous (public site) requests have `req.user === null`.
 */
export function hasEditorRole(req: PayloadRequest): boolean {
  const role = req.user?.role
  return role === 'admin' || role === 'editor'
}

/**
 * Whether the requesting user is an authenticated admin — the stricter
 * check, for things an editor must not be able to do (managing other
 * people's accounts, handing out the admin role). See ./isAdmin.ts.
 */
export function isAdminRole(req: PayloadRequest): boolean {
  return req.user?.role === 'admin'
}
