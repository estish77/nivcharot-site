/**
 * Normalizes arbitrary text into a Latin, kebab-case URL slug.
 *
 * Any character outside `a-z0-9` — including the entirety of the Hebrew
 * alphabet, and any accented Latin letters — is dropped. Feeding this pure
 * Hebrew text therefore returns an empty string *on purpose*: see
 * `enforceLatinSlug`, which turns that into a hard validation error instead
 * of silently producing an unreadable, percent-encoded slug (Hebrew slugs
 * percent-encode badly in URLs, per the schema brief).
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
