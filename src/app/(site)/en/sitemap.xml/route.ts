import { localeSitemapResponse } from '@/lib/localeSitemap'

/** See the `he/` twin of this file for why this is fixed, not `[locale]`-dynamic. */
export async function GET() {
  return localeSitemapResponse('en')
}
