import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'

/**
 * One "שכוייח" from one visitor to one team member.
 *
 * The count is deliberately NOT shown on the site. A public tally beside
 * each person turns a team page into a league table of colleagues, which
 * is the last thing this particular page needs; the running total lives on
 * the member's own record in /admin, where only the movement sees it.
 *
 * WHY A ROW PER VOTE, AND NOT JUST A COUNTER
 *
 * The row is what makes "once per visitor" enforceable at all — without it
 * there is nothing to compare a returning visitor against. It holds two
 * hashes, never an address: `voterHash` (the visitor's cookie id + member id
 * + a server-side secret) recognises a repeat vote from the same browser;
 * `ipHash` (the IP + member id + the same secret) is a separate signal, see
 * below. Neither can be reversed into an address, and the same visitor
 * produces a different pair of hashes for every member, so the rows can't be
 * joined up into one person's browsing.
 *
 * WHY THE IP IS A RATE LIMIT AND NOT THE LOCK
 *
 * A hard one-vote-per-IP rule would misfire badly here. Much of this
 * audience browses through filtered-internet providers (Netfree, Rimon and
 * the like) that route very large numbers of users through shared exit
 * addresses — one woman votes and her whole neighbourhood is told it has
 * already voted. Meanwhile switching from wifi to cellular defeats the
 * rule in seconds, so it doesn't even stop a determined double-voter.
 *
 * So the browser cookie is the real one-per-visitor lock, and the IP hash
 * only enforces a generous ceiling per member (see APPRECIATIONS_PER_IP) to
 * blunt scripted abuse. That stops the thing IPs can actually stop, without
 * silencing a whole community behind one proxy.
 */
export const TeamAppreciations: CollectionConfig = {
  slug: 'team-appreciations',
  admin: {
    group: 'People',
    useAsTitle: 'id',
    defaultColumns: ['member', 'location', 'createdAt'],
    description: 'Individual "שכוייח" clicks. The per-person total is on the team member record.',
    // Nothing here is editable by hand; it exists to make the count auditable.
    hidden: false,
  },
  access: {
    // Written only by the server action, which uses the Local API and
    // bypasses access control. Nothing public may read or write it.
    read: isAdminOrEditor,
    create: () => false,
    update: () => false,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'member',
      type: 'relationship',
      relationTo: 'team-members',
      required: true,
      index: true,
    },
    {
      name: 'voterHash',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Salted hash of visitor + member. Not an address, and not reversible.' },
    },
    {
      name: 'ipHash',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description:
          'Salted hash of visitor IP + member. Not an address, and not reversible — used only to cap votes per shared address, see APPRECIATIONS_PER_IP.',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description:
          'Country/city, from the visit\'s IP via Vercel\'s edge geolocation headers. Best-effort: absent outside Vercel (e.g. local dev).',
      },
    },
  ],
}
