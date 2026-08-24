/**
 * Route-level locale plumbing + shared UI CHROME strings.
 *
 * Payload localizes CONTENT (post bodies, titles, etc. — see the `he`/`en`
 * fields on Payload documents once the schema agent wires them up). This
 * file only owns UI chrome: nav/button/label text that isn't editorial
 * content and ships with the code.
 */

export const locales = ['he', 'en'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'he'

/** Narrows an arbitrary route param to `Locale`, e.g. in generateStaticParams guards. */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/** The `dir` attribute for a given locale — Hebrew is RTL, English is LTR. */
export function dirOf(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'he' ? 'rtl' : 'ltr'
}

/**
 * The shape every bilingual string/value uses across fixtures and Payload
 * localized fields: `{ he: string; en: string }` (or any `T`, e.g. rich
 * content nodes) unless a collection field says otherwise.
 */
export type Localized<T = string> = {
  he: T
  en: T
}

/** Picks the value for the active locale out of a `{ he, en }` pair. */
export function t<T>(locale: Locale, value: Localized<T>): T {
  return value[locale]
}

/**
 * Directional arrow glyphs. The mockups mirror arrows by *reading
 * direction*, not by locale alone:
 *   - a "forward" link (e.g. "לפודקאסט ←" / "To podcast →") points toward
 *     the direction reading continues in: ← for RTL Hebrew, → for LTR English.
 *   - a "back" link (e.g. "→ חזרה לארכיון" / "← Back to archive") points the
 *     opposite way.
 * Pagination controls follow the same rule: Hebrew "→ הקודם" / "הבא ←",
 * English "← Previous" / "Next →".
 */
export function arrowForward(locale: Locale): '←' | '→' {
  return locale === 'he' ? '←' : '→'
}

export function arrowBack(locale: Locale): '←' | '→' {
  return locale === 'he' ? '→' : '←'
}

/**
 * Shared UI chrome strings reused across pages (verbatim from the mockups
 * where they appear in both languages; a couple of generic, low-risk
 * defaults are marked below where no mockup instance exists yet).
 */
export const dict = {
  /**
   * Labels for the two language-toggle buttons themselves (both render on
   * every page regardless of the active locale — mark the active one with
   * `aria-current="true"`), not a value that changes by current locale.
   */
  languageToggle: { he: 'עב', en: 'EN' } satisfies Localized,
  scrollCue: { he: 'גללו', en: 'SCROLL' } satisfies Localized,
  previous: { he: 'הקודם', en: 'Previous' } satisfies Localized,
  next: { he: 'הבא', en: 'Next' } satisfies Localized,
  share: { he: 'שיתוף', en: 'Share' } satisfies Localized,
  donate: { he: 'לתרומה', en: 'Donate' } satisfies Localized,
  copyright: {
    he: 'כל הזכויות שמורות לנבחרות (ע״ר) 580619120',
    en: 'All rights reserved to Nivcharot (NGO) 580619120',
  } satisfies Localized,
  /** Not present verbatim in any mockup — a conventional, low-risk default. */
  readMore: { he: 'קראו עוד', en: 'Read more' } satisfies Localized,
  /** Accessibility additions the mockups lack (no skip link, no menu aria-labels). */
  skipToContent: { he: 'דלגו לתוכן הראשי', en: 'Skip to main content' } satisfies Localized,
  openMenu: { he: 'פתיחת תפריט', en: 'Open menu' } satisfies Localized,
  closeMenu: { he: 'סגירת תפריט', en: 'Close menu' } satisfies Localized,
} as const
