import type { CollectionAfterChangeHook, Field, GlobalAfterChangeHook } from 'payload'

import { applyRichTextLeaves, extractRichTextLeaves, isRichTextEmpty, translateBatch } from '../utils/translate'

/**
 * Auto-translates Hebrew content into English the moment an editor saves it
 * through the dashboard — the site owner's explicit ask: every field she or
 * a collaborator fills in in Hebrew should get an English version
 * immediately, without anyone having to switch to the English tab and do it
 * by hand.
 *
 * Design:
 *  - Only fires on a save made in the `he` locale (that's the only locale
 *    tab editors normally use day to day) and only fills in a field whose
 *    English value is currently EMPTY — it never overwrites an English
 *    value someone already wrote or a value this same hook already
 *    translated on a previous save. That's what makes it safe to attach
 *    everywhere: worst case, it's a no-op.
 *  - Walks the collection/global's OWN field config (text/textarea/
 *    richText/group/array) instead of a hand-maintained field list per
 *    file, so it never drifts out of sync when a schema changes — see
 *    `collectTranslationJobs` below.
 *  - Collects every string that needs translating across the WHOLE
 *    document into one batch and makes a single Claude API call
 *    (`translateBatch`), rather than one call per field — a save that
 *    touches a page-copy global's hero + several array rows would
 *    otherwise mean a dozen+ slow, separate API round trips.
 *  - Writes the result back via a second, `en`-locale-scoped update/
 *    updateGlobal call with `context: { disableAutoTranslate: true }` so
 *    that inner write doesn't recursively re-trigger translation (it's
 *    also naturally skipped since it isn't a `he`-locale save). That inner
 *    write is a REAL save, so the existing revalidateGlobal/
 *    revalidateCollection hooks still fire normally and the translated
 *    English text goes live immediately, same as any other edit.
 *  - Never throws past its own boundary and never touches content it
 *    can't safely handle: on any error (missing API key, network failure,
 *    a malformed response) it logs and leaves the document exactly as the
 *    editor saved it — an editor's Hebrew save must never be blocked or
 *    corrupted by a translation problem.
 */

type AnyRecord = Record<string, unknown>

type TranslationJob = { start: number; count: number; apply: (translated: string[]) => void }

function asRecord(value: unknown): AnyRecord {
  return value && typeof value === 'object' ? (value as AnyRecord) : {}
}

function localizedPairEn(value: unknown): unknown {
  const record = asRecord(value)
  return 'en' in record ? record.en : undefined
}

/** Builds one array row's `en`-locale patch: translates empty localized fields, safely passes every other field through untouched. */
function buildRowPatch(fields: Field[], heRow: AnyRecord, rawRow: AnyRecord, texts: string[], jobs: TranslationJob[]): AnyRecord {
  const rowPatch: AnyRecord = { id: heRow.id }

  for (const field of fields) {
    if (!('name' in field) || typeof field.name !== 'string') continue
    const name = field.name
    const heFieldValue = heRow[name]
    const rawFieldValue = rawRow[name]

    if ((field.type === 'text' || field.type === 'textarea') && field.localized) {
      const heText = typeof heFieldValue === 'string' ? heFieldValue.trim() : ''
      const existingEn = typeof localizedPairEn(rawFieldValue) === 'string' ? (localizedPairEn(rawFieldValue) as string).trim() : ''
      if (heText && !existingEn) {
        const start = texts.length
        texts.push(heText)
        jobs.push({ start, count: 1, apply: (t) => { rowPatch[name] = t[0] } })
      } else {
        rowPatch[name] = existingEn || heFieldValue || ''
      }
    } else if (field.type === 'richText' && field.localized) {
      const existingEnDoc = localizedPairEn(rawFieldValue)
      if (!isRichTextEmpty(heFieldValue as never) && isRichTextEmpty(existingEnDoc as never)) {
        const leaves = extractRichTextLeaves(heFieldValue as never)
        if (leaves.length > 0) {
          const start = texts.length
          texts.push(...leaves)
          jobs.push({ start, count: leaves.length, apply: (t) => { rowPatch[name] = applyRichTextLeaves(heFieldValue as never, t) } })
          continue
        }
      }
      rowPatch[name] = existingEnDoc ?? heFieldValue
    } else {
      // Non-localized field (id, order, url, linkHref, ...): locale-independent, safe to reuse verbatim.
      rowPatch[name] = heFieldValue
    }
  }

  return rowPatch
}

/**
 * Recursively walks a collection/global's field config, queuing a
 * translation job for every empty-English text/textarea/richText field it
 * finds (at the top level, one level of `group` nesting, or inside an
 * `array`'s rows) and writing the resulting patch into `outPatch` in place.
 * `heDoc` is the just-saved Hebrew-locale document; `rawDoc` is the same
 * document read back with `locale: 'all'`, used only to check what's
 * already in English (a locale-scoped read would return the Hebrew
 * fallback for an empty English field, making it useless for this check).
 */
function collectTranslationJobs(fields: Field[], heDoc: AnyRecord, rawDoc: AnyRecord, texts: string[], jobs: TranslationJob[], outPatch: AnyRecord): void {
  for (const field of fields) {
    if (!('name' in field) || typeof field.name !== 'string') continue
    const name = field.name
    const heValue = heDoc[name]
    const rawValue = rawDoc[name]

    if ((field.type === 'text' || field.type === 'textarea') && field.localized) {
      const heText = typeof heValue === 'string' ? heValue.trim() : ''
      const existingEn = typeof localizedPairEn(rawValue) === 'string' ? (localizedPairEn(rawValue) as string).trim() : ''
      if (heText && !existingEn) {
        const start = texts.length
        texts.push(heText)
        jobs.push({ start, count: 1, apply: (t) => { outPatch[name] = t[0] } })
      }
    } else if (field.type === 'richText' && field.localized) {
      const existingEnDoc = localizedPairEn(rawValue)
      if (!isRichTextEmpty(heValue as never) && isRichTextEmpty(existingEnDoc as never)) {
        const leaves = extractRichTextLeaves(heValue as never)
        if (leaves.length > 0) {
          const start = texts.length
          texts.push(...leaves)
          jobs.push({ start, count: leaves.length, apply: (t) => { outPatch[name] = applyRichTextLeaves(heValue as never, t) } })
        }
      }
    } else if (field.type === 'group' && 'fields' in field && Array.isArray(field.fields)) {
      const subPatch: AnyRecord = {}
      const before = jobs.length
      collectTranslationJobs(field.fields, asRecord(heValue), asRecord(rawValue), texts, jobs, subPatch)
      if (jobs.length > before) outPatch[name] = subPatch
    } else if (field.type === 'array' && 'fields' in field && Array.isArray(field.fields)) {
      const heRows = Array.isArray(heValue) ? (heValue as AnyRecord[]) : []
      const rawRows = Array.isArray(rawValue) ? (rawValue as AnyRecord[]) : []
      if (heRows.length === 0) continue
      const before = jobs.length
      const rowPatches = heRows.map((heRow) => {
        const rawRow = rawRows.find((r) => r?.id === heRow?.id) ?? {}
        return buildRowPatch(field.fields as Field[], heRow, rawRow, texts, jobs)
      })
      if (jobs.length > before) outPatch[name] = rowPatches
    }
  }
}

async function buildAutoTranslatePatch(fields: Field[], heDoc: AnyRecord, rawDoc: AnyRecord): Promise<AnyRecord | null> {
  const texts: string[] = []
  const jobs: TranslationJob[] = []
  const patch: AnyRecord = {}
  collectTranslationJobs(fields, heDoc, rawDoc, texts, jobs, patch)
  if (jobs.length === 0) return null

  const translated = await translateBatch(texts)
  for (const job of jobs) {
    job.apply(translated.slice(job.start, job.start + job.count))
  }
  return patch
}

export function autoTranslateCollectionHook(): CollectionAfterChangeHook {
  return async ({ doc, req, collection }) => {
    if (req.locale !== 'he') return doc
    if (req.context?.disableAutoTranslate) return doc
    if (!process.env.ANTHROPIC_API_KEY) return doc

    try {
      const rawDoc = await req.payload.findByID({
        collection: collection.slug,
        id: doc.id,
        locale: 'all',
        depth: 0,
        overrideAccess: true,
      })
      const patch = await buildAutoTranslatePatch(collection.fields, doc as unknown as AnyRecord, rawDoc as unknown as AnyRecord)
      if (!patch) return doc

      await req.payload.update({
        collection: collection.slug,
        id: doc.id,
        locale: 'en',
        context: { disableAutoTranslate: true },
        data: patch,
        overrideAccess: true,
      })
    } catch (err) {
      console.error(`autoTranslate failed for ${collection.slug}/${doc.id}:`, err)
    }

    return doc
  }
}

export function autoTranslateGlobalHook(): GlobalAfterChangeHook {
  return async ({ doc, req, global }) => {
    if (req.locale !== 'he') return doc
    if (req.context?.disableAutoTranslate) return doc
    if (!process.env.ANTHROPIC_API_KEY) return doc

    try {
      const rawDoc = await req.payload.findGlobal({
        slug: global.slug,
        locale: 'all',
        depth: 0,
        overrideAccess: true,
      })
      const patch = await buildAutoTranslatePatch(global.fields, doc as unknown as AnyRecord, rawDoc as unknown as AnyRecord)
      if (!patch) return doc

      await req.payload.updateGlobal({
        slug: global.slug,
        locale: 'en',
        context: { disableAutoTranslate: true },
        data: patch,
        overrideAccess: true,
      })
    } catch (err) {
      console.error(`autoTranslate failed for global ${global.slug}:`, err)
    }

    return doc
  }
}
