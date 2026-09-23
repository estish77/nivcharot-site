import config from '@payload-config'
import { getPayload } from 'payload'

import { getSearchConsoleTotals, listSearchConsoleSites } from '@/lib/searchConsole'
import { siteUrl } from '@/lib/site'

/**
 * Admin-only Search Console snapshot: `sites.list` (a pure connectivity
 * check — confirms the service account can see the two properties at all)
 * plus 28-day totals for each. Gated on a real Payload admin session, the
 * same one `/admin` itself uses, rather than a bearer secret — anyone
 * already logged into the dashboard can load this URL, no separate
 * credential to manage.
 *
 * 2026-09-23: this is the connectivity check for the service-account setup
 * done that day (see `lib/searchConsole.ts`'s doc comment), kept as a
 * standing endpoint rather than deleted afterward — cheap to keep, and the
 * natural place to check the numbers until this grows a real dashboard view.
 */
export async function GET(request: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return Response.json({ error: 'Not authenticated — log into /admin first, then load this URL in the same browser.' }, { status: 401 })
  }

  const sites = await listSearchConsoleSites()
  if (sites === null) {
    return Response.json(
      { error: 'Could not connect. GOOGLE_SEARCH_CONSOLE_CREDENTIALS is missing, malformed, or the service account key is invalid.' },
      { status: 502 },
    )
  }

  const properties = [`${siteUrl}/he/`, `${siteUrl}/en/`]
  const totals = await Promise.all(
    properties.map(async (url) => ({ property: url, last28Days: await getSearchConsoleTotals(url) })),
  )

  return Response.json({ connected: true, sitesVisibleToServiceAccount: sites, totals })
}
