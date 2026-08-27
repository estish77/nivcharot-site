/**
 * Whether the archive posts (`posts` collection / `archivePosts` fixture)
 * are shown anywhere on the public site.
 *
 * 2026-08-27 brief: "remove from the site everything classified as archive
 * posts — keep them in the admin and improve them from the source
 * material, but do not display them anywhere on the site, until we decide
 * what to do with this content."
 *
 * So this hides them rather than deleting anything: every post stays in
 * Payload, editable in the dashboard exactly as before, and nothing about
 * the collection, its data or its routes is removed. Flipping this back to
 * `true` restores the archive bucket on `/media`, the `/media/[slug]`
 * detail pages and their sitemap entries in one edit, with no other change
 * needed.
 *
 * Everything that renders or publishes a post reads this:
 *   - src/app/(site)/[locale]/(pages)/media/page.tsx  (the desk's bucket)
 *   - src/app/(site)/[locale]/(pages)/media/[slug]/page.tsx  (detail route)
 *   - src/app/sitemap.ts  (so hidden pages are not advertised to crawlers)
 */
export const archivePostsVisible = false
