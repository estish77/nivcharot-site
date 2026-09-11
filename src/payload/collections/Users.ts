import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField, isAdminOrSelf } from '../access/isAdmin'

/**
 * Admin-only auth collection used to log in to the Payload dashboard.
 * This is NOT bilingual content and is intentionally kept out of the
 * `collections` barrel (./index.ts) — it is wired directly into
 * payload.config.ts so it always exists regardless of which content
 * collections the schema agent adds.
 *
 * `role` was added by the schema agent (task spec: "users auth:true,
 * role: admin|editor") — every access-control helper in
 * src/payload/access/ reads `req.user.role` to decide between full
 * (admin/editor) and published-only (anonymous) access.
 *
 * ACCOUNT MANAGEMENT IS ADMIN-ONLY (2026-09-11 audit fix). This collection
 * previously declared no `access` block at all, which means Payload's
 * default applied: every logged-in user could list, create, update and
 * delete users. The single field-level guard below only covered *changing*
 * an existing role, not setting one at creation — so an editor could
 * simply create a second account with `role: 'admin'` and log in as an
 * admin, or delete the owner's account outright. The block below closes
 * both: only an admin may create or delete accounts or see anyone else's,
 * while an editor keeps full access to her own record so she can still
 * change her own password and email.
 *
 * Payload's "create the first user" flow is unaffected — it bypasses
 * access control while the collection is empty, which is the only way a
 * fresh database could ever get its first admin.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'הגדרות',
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    create: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      admin: {
        description: 'Admins manage other users; editors manage content only.',
      },
      access: {
        // Only admins may set or change a role. `create` matters as much as
        // `update` here: without it, anyone able to create a user could hand
        // the new account the admin role on the way in. Defence in depth —
        // creating a user is already admin-only at the collection level.
        create: isAdminField,
        update: isAdminField,
      },
    },
  ],
}
