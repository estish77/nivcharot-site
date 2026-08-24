import type { Access } from 'payload'

import { hasEditorRole } from './roles'

/** Full read/write access for logged-in admins and editors; denies everyone else. */
export const isAdminOrEditor: Access = ({ req }) => hasEditorRole(req)
