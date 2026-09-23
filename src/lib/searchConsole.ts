import { JWT } from 'google-auth-library'

/**
 * Read-only Google Search Console access for the two locale-scoped
 * properties (`.../he/` and `.../en/` — see `app/(site)/[locale]/sitemap.xml`'s
 * doc comment for why Search Console is set up per-locale here rather than
 * as one domain-level property).
 *
 * Auth: a service account (`search-console-reader@nivcharot-site.iam.gserviceaccount.com`,
 * set up 2026-09-23) added as a Restricted user on both properties. Its key
 * lives only in `GOOGLE_SEARCH_CONSOLE_CREDENTIALS` (Vercel env var,
 * Production + Preview) — never in this repo, never in a fixture, never
 * logged. Unset/unparseable is a normal state (local dev, a preview deploy
 * that hasn't been given the var) and every function here returns `null`
 * rather than throwing, same fallback convention as `lib/cms.ts`'s getters.
 */

const SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']

function getClient(): JWT | null {
  const raw = process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS
  if (!raw) return null

  try {
    const key = JSON.parse(raw) as { client_email?: string; private_key?: string }
    if (!key.client_email || !key.private_key) return null
    return new JWT({ email: key.client_email, key: key.private_key, scopes: SCOPES })
  } catch {
    // Malformed JSON (e.g. the wrong value ended up in the env var) — treat
    // exactly like "not configured" rather than crashing a page/route.
    return null
  }
}

export type SearchConsoleSite = { siteUrl: string; permissionLevel: string }

/** `sites.list` — the simplest possible connectivity check: no property URL to get right, just "what can this key see". */
export async function listSearchConsoleSites(): Promise<SearchConsoleSite[] | null> {
  const client = getClient()
  if (!client) return null

  try {
    const res = await client.request<{ siteEntry?: SearchConsoleSite[] }>({
      url: 'https://www.googleapis.com/webmasters/v3/sites',
    })
    return res.data.siteEntry ?? []
  } catch {
    return null
  }
}

export type SearchConsoleTotals = { clicks: number; impressions: number; ctr: number; position: number }

/** Site-wide totals (no dimensions) over the last `days` days for one property — the same numbers the Performance report's top cards show. */
export async function getSearchConsoleTotals(siteUrl: string, days = 28): Promise<SearchConsoleTotals | null> {
  const client = getClient()
  if (!client) return null

  const end = new Date()
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)

  try {
    const res = await client.request<{ rows?: SearchConsoleTotals[] }>({
      url: `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      method: 'POST',
      data: { startDate: fmt(start), endDate: fmt(end) },
    })
    const row = res.data.rows?.[0]
    return row ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 }
  } catch {
    return null
  }
}
