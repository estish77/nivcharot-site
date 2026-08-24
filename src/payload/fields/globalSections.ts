import type { Field } from 'payload'

/**
 * Shared building blocks for the eight page-copy globals (home, about,
 * story, activism, podcast, hanivcheret, join, donate). Every mockup page
 * is built from the same handful of recurring section shapes — a hero, a
 * row of big-number stat tiles, a grid of numbered pillar cards, and
 * intro copy ahead of a list pulled from a collection — so each global
 * composes from these builders instead of redeclaring the same fields
 * eight times. A given page only populates the sections its mockup
 * actually uses; the others are simply left empty by editors.
 */

/** Hero copy: eyebrow label + h1 + intro paragraph. */
export function heroField(): Field {
  return {
    name: 'hero',
    type: 'group',
    fields: [
      { name: 'eyebrow', type: 'text', localized: true },
      { name: 'title', type: 'text', required: true, localized: true },
      { name: 'body', type: 'textarea', localized: true },
    ],
  }
}

/**
 * Big-number stat tiles, e.g. "59% would like to see Haredi women in the
 * Knesset — Nivcharot survey" (docs/Activism.dc.html FAQ #1). `value` and
 * `suffix` are plain text rather than numbers on purpose: the mockups mix
 * true counts ("14"), percentages ("59%") and ranges, and free text lets
 * an editor enter exactly what should render without the template
 * inventing formatting rules.
 */
export function statTilesField(): Field {
  return {
    name: 'statTiles',
    type: 'array',
    labels: { singular: 'Stat tile', plural: 'Stat tiles' },
    fields: [
      { name: 'value', type: 'text', required: true },
      { name: 'suffix', type: 'text' },
      { name: 'label', type: 'text', required: true, localized: true },
      { name: 'source', type: 'text', localized: true },
    ],
  }
}

/**
 * Numbered pillar/feature cards, e.g. the four בג"ץ / #מחאת_הכסאות / כנסת /
 * קהילה cards on docs/Activism.dc.html, or the pillar rows on
 * docs/About.dc.html.
 */
export function pillarCardsField(): Field {
  return {
    name: 'pillarCards',
    type: 'array',
    labels: { singular: 'Pillar card', plural: 'Pillar cards' },
    fields: [
      { name: 'number', type: 'text', required: true },
      { name: 'title', type: 'text', required: true, localized: true },
      { name: 'body', type: 'richText', required: true, localized: true },
      { name: 'linkLabel', type: 'text', localized: true },
      { name: 'linkHref', type: 'text' },
    ],
  }
}

/**
 * Named section intros (eyebrow + h2 + paragraph) that precede a repeated
 * list pulled from a collection — e.g. "הצוות" before team-members,
 * "שאלות ותשובות" before faqs, "בוגרות מספרות" before alumnae-quotes.
 * `key` is a stable identifier the page template matches against to
 * place each intro above the right section.
 */
export function sectionIntrosField(): Field {
  return {
    name: 'sectionIntros',
    type: 'array',
    labels: { singular: 'Section intro', plural: 'Section intros' },
    fields: [
      {
        name: 'key',
        type: 'text',
        required: true,
        admin: { description: 'Stable identifier the page template matches, e.g. "team", "faq".' },
      },
      { name: 'eyebrow', type: 'text', localized: true },
      { name: 'title', type: 'text', required: true, localized: true },
      { name: 'body', type: 'textarea', localized: true },
    ],
  }
}
