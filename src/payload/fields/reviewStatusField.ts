import type { Field } from 'payload'

/**
 * Editorial triage state for content imported from the legacy
 * nivcharot.co.il site (see docs/ArchiveTemp.dc.html and docs/Review.dc.html,
 * the "חומר לבדיקה" / material-for-review work page): everything starts
 * `needs-review` until an editor decides whether it earns a page on the
 * new site (`keep`) or should stay out of the public archive (`hidden`).
 */
export function reviewStatusField(): Field {
  return {
    name: 'reviewStatus',
    type: 'select',
    required: true,
    defaultValue: 'needs-review',
    options: [
      { label: 'Needs review', value: 'needs-review' },
      { label: 'Keep', value: 'keep' },
      { label: 'Hidden', value: 'hidden' },
    ],
    admin: { position: 'sidebar' },
  }
}
