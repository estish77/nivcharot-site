import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

/**
 * Next 16's `revalidateTag(tag, profile)` always requires a `profile` —
 * `updateTag()` is the Server-Actions-only equivalent (for read-your-own-
 * writes inside a Server Action) and doesn't apply here, since Payload's
 * REST/local API writes run as ordinary request handlers, not Server
 * Actions. `{ expire: 0 }` asks for the tag to be treated as immediately
 * stale, matching the old zero-argument `revalidateTag(tag)` behavior from
 * Next 14.
 */
function revalidate(tag: string): void {
  revalidateTag(tag, { expire: 0 })
}

/**
 * afterChange hook factory shared by every content collection: revalidates
 * the Next.js cache tag for that collection whenever a document is
 * created or updated through the admin UI or the REST/local API, so public
 * pages don't keep serving stale content until their normal cache window
 * expires.
 *
 * Skips revalidation when `req.context.disableRevalidate` is set, so seed
 * scripts and bulk imports can opt out of triggering it per document.
 */
export function revalidateCollection(tag: string): CollectionAfterChangeHook {
  return ({ doc, req }) => {
    if (!req.context?.disableRevalidate) {
      revalidate(tag)
    }
    return doc
  }
}

/** Same as {@link revalidateCollection}, for singleton globals. */
export function revalidateGlobal(tag: string): GlobalAfterChangeHook {
  return ({ doc, req }) => {
    if (!req.context?.disableRevalidate) {
      revalidate(tag)
    }
    return doc
  }
}
