import type { FieldHook } from 'payload'
import { APIError } from 'payload'

import { slugify } from '../utils/slugify'

/**
 * Pulls plain text out of a possibly-localized field value for slug
 * derivation, preferring the English variant (already Latin) over Hebrew.
 */
function textFrom(raw: unknown): string {
  if (typeof raw === 'string') return raw
  if (raw && typeof raw === 'object') {
    const localized = raw as Record<string, unknown>
    const en = localized.en
    const he = localized.he
    if (typeof en === 'string' && en.trim().length > 0) return en
    if (typeof he === 'string') return he
  }
  return ''
}

/**
 * `beforeChange` field hook for the `slug` field (see `fields/slugField`):
 * normalizes whatever was typed into a Latin/kebab-case slug and, when left
 * blank, derives one from `fallbackField` on the same document.
 *
 * Hebrew text collapses to an empty string once non-Latin characters are
 * stripped by `slugify`; that's treated as a hard error rather than
 * guessed at with a transliteration, because Hebrew slugs percent-encode
 * badly in URLs — editors must supply a Latin transliteration by hand
 * (e.g. "kuntres-halachi" for "הקונטרס ההלכתי").
 */
export function enforceLatinSlug(fallbackField: string): FieldHook {
  return ({ value, siblingData, data }) => {
    const explicit = typeof value === 'string' ? value.trim() : ''
    const fromData = textFrom((data as Record<string, unknown> | undefined)?.[fallbackField])
    const fromSibling = textFrom(
      (siblingData as Record<string, unknown> | undefined)?.[fallbackField],
    )
    const source = explicit.length > 0 ? explicit : fromData || fromSibling
    const slug = slugify(source)

    if (!slug) {
      throw new APIError(
        `Could not derive a Latin slug from "${fallbackField}" ("${source}"). Hebrew text percent-encodes badly in URLs: enter a Latin/transliterated slug by hand (e.g. "kuntres-halachi").`,
        400,
        undefined,
        true,
      )
    }

    return slug
  }
}
