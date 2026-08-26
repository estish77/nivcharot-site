import type { CollectionConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { publishedOrAdmin } from '../access/publishedOrAdmin'
import { reviewStatusField } from '../fields/reviewStatusField'
import { slugField } from '../fields/slugField'
import { autoTranslateCollectionHook } from '../hooks/autoTranslate'
import { revalidateCollection } from '../hooks/revalidate'

/**
 * "בתקשורת" (In the Media) — real, externally-verified press coverage of
 * Nivcharot (src/content/press-archive.ts's shape, ported to a real,
 * editable collection). 2026-08-16 brief: "מערכת ניהול... תאפשר לי סינון
 * כתבות לא רצויות" — the site owner specifically wants to be able to hide
 * coverage she doesn't want shown, without needing a code change each
 * time. `reviewStatusField()` — already the exact "keep/hidden" gate the
 * Posts collection uses for its own moderation — is that filter: setting
 * an item to `hidden` here removes it from the public archive immediately
 * (via `publishedOrAdmin`'s read-access rule below), while admins/editors
 * still see everything in the dashboard to review.
 */
export const PressArchive: CollectionConfig = {
  slug: 'press-archive',
  labels: { singular: 'Press Item', plural: 'Press Archive' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'outlet', 'sortDate', 'category', 'reviewStatus'],
    description: 'Real, externally-verified press coverage of Nivcharot — the "בתקשורת" section on /media.',
  },
  access: {
    read: publishedOrAdmin({ reviewStatus: { equals: 'keep' } }),
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateCollection('press-archive'), autoTranslateCollectionHook()],
  },
  fields: [
    slugField('title'),
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: 'A substantive paragraph — what the piece actually says, not a meta-description of its format.' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'article',
      options: [
        { label: 'Article', value: 'article' },
        { label: 'Video', value: 'video' },
        { label: 'Press mention', value: 'press-mention' },
        { label: 'Podcast', value: 'podcast' },
      ],
      admin: { description: 'Drives the small per-card type icon only.' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'coverage',
      options: [
        { label: 'כתבות · Coverage', value: 'coverage' },
        { label: 'טורי דעה · Opinion', value: 'opinion' },
        { label: 'ראיונות · Interviews', value: 'interview' },
        { label: 'נבחרות בפולמוס · Controversy', value: 'controversy' },
      ],
      admin: { description: 'The real filter/organizing axis on the public archive.' },
    },
    { name: 'outlet', type: 'text', required: true, localized: true },
    {
      name: 'dateLabel',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Human display date, e.g. "23.7.2017" or "March 2019" — can be an honest approximation.' },
    },
    { name: 'sortDate', type: 'date', required: true, admin: { description: 'Used only for sorting/year-grouping, never rendered as-is.' } },
    { name: 'year', type: 'number', required: true, admin: { description: 'Drives the year-grouped headers in the public archive — keep in sync with Sort date.' } },
    {
      name: 'sourceLanguage',
      type: 'select',
      required: true,
      defaultValue: 'he',
      options: [
        { label: 'Hebrew', value: 'he' },
        { label: 'English', value: 'en' },
      ],
      admin: { description: 'The language the piece was actually published in — drives the "originally in X" badge on the other locale.' },
    },
    {
      name: 'linkKind',
      type: 'select',
      required: true,
      defaultValue: 'external',
      options: [
        { label: 'External (real outbound URL)', value: 'external' },
        { label: 'Internal (hosted on this site)', value: 'internal' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      admin: { description: 'The real outlet URL. Required when Link kind is External.', condition: (data) => data?.linkKind !== 'internal' },
    },
    {
      name: 'note',
      type: 'textarea',
      localized: true,
      admin: { description: 'An honest, visible caveat (paywall, unconfirmed exact date, etc.) — shown on the card when present.' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on the home page media strip. Keep the set varied — not just pieces centered on one person.',
      },
    },
    reviewStatusField(),
  ],
}
