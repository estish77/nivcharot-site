import type { CollectionConfig } from 'payload'

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
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
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
        // Only admins may change a user's role — editors cannot self-promote.
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],
}
