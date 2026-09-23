import { localeSitemapResponse } from '@/lib/localeSitemap'

/**
 * Fixed (not `[locale]`-dynamic) on purpose — see git history on this file:
 * the dynamic version (`(site)/[locale]/sitemap.xml/route.ts`,
 * `generateStaticParams` returning both locales) built and ran correctly
 * locally but 404'd in production. Root cause: Next treats any path segment
 * literally named `sitemap.xml` as its reserved metadata-route convention
 * name, and that special-casing collided with this one being nested under
 * a dynamic `[locale]` segment — the build produced a single broken shell
 * (`/-/sitemap.xml`) instead of prerendering `/he/sitemap.xml` and
 * `/en/sitemap.xml`. Two fixed, non-dynamic routes (this file and its
 * `en/` twin) sidestep that entirely: there's no dynamic segment for the
 * special-casing to collide with.
 */
export async function GET() {
  return localeSitemapResponse('he')
}
