/**
 * Permanent redirects from the old nivcharot.co.il (WordPress, replaced by
 * this app) to their equivalents here. Consumed by `next.config.ts`'s
 * `redirects()` — these run BEFORE `src/proxy.ts` in Next's routing order,
 * so anything matched here never falls through to proxy's generic "add
 * /he and hope" behavior.
 *
 * 2026-09-23 research: pulled the old site's Yoast SEO sitemaps
 * (page-sitemap.xml, post-sitemap.xml) from the Wayback Machine. The old
 * site's URLs were Hebrew WordPress slugs (`/מי-אנחנו/`, date-based post
 * permalinks `/2021/01/31/<hebrew-slug>/`); this app's are English
 * (`/about`, `/media/<slug>`) — so proxy.ts's blanket "no prefix → add
 * /he/" redirect does NOT rescue these; `/מי-אנחנו` becomes `/he/מי-אנחנו`,
 * which 404s. `/contact` is the one accidental exception (same slug both
 * sites happen to use).
 *
 * STATIC_PAGE_REDIRECTS: every real (non theme-demo) top-level old URL,
 * mapped by hand to the current page that covers the same subject. The old
 * theme (Bridge) shipped with dozens of demo pages (`/typography`,
 * `/layout-a`, `/cart`, ...) that were never real content — deliberately
 * NOT redirected; they had no organic value to begin with.
 *
 * ARCHIVED_POST_REDIRECTS: old post URLs matched to a specific imported
 * `posts` collection entry (`src/lib/cms.ts`'s `getArchivePosts()`,
 * rendered at `/media/[slug]`) by title-word overlap against the old
 * URL's slug. Kept deliberately conservative — matched only where several
 * *specific* words overlap, not just common ones like "נשים"/"חרדיות"
 * ("women"/"haredi") that appear in half the titles. 158 old post URLs
 * were checked; 17 matched with real confidence. The rest fall through to
 * the generic date-pattern rule below rather than risk sending someone to
 * an unrelated article.
 *
 * The `posts` collection has a `legacyUrl` field (src/payload/fields/
 * legacyFields.ts) built for exactly this and never filled in at import
 * time — worth populating from this file next time someone's in there, so
 * this mapping lives in the CMS record itself and not only here.
 *
 * `source` values with Hebrew text are percent-encoded (`%D7%9E...`), not
 * literal UTF-8 characters. First deploy shipped these as literal Hebrew
 * and every one of them silently failed to match — Next compares `source`
 * against the raw request path, which arrives percent-encoded, before any
 * decoding happens. Confirmed by curling the live site right after that
 * deploy: a wildcard rule (ARCHIVED_POST_REDIRECTS' catch-all, which
 * doesn't need to match Hebrew literally) fired correctly while every
 * literal-Hebrew `source` here fell through to proxy.ts instead.
 */

type LegacyRedirect = { source: string; destination: string }

export const STATIC_PAGE_REDIRECTS: LegacyRedirect[] = [
  { source: '/who-we-are', destination: '/he/about' },
  { source: '/%D7%9E%D7%99-%D7%90%D7%A0%D7%97%D7%A0%D7%95', destination: '/he/about' },
  { source: '/%D7%97%D7%96%D7%95%D7%9F', destination: '/he/about' },
  { source: '/%D7%9E%D7%94-%D7%94%D7%A1%D7%99%D7%A4%D7%95%D7%A8-%D7%A9%D7%9C%D7%A0%D7%95', destination: '/he/story' },
  { source: '/%D7%A0%D7%99%D7%A1%D7%99%D7%95%D7%9F-%D7%9C%D7%98%D7%99%D7%99%D7%9E%D7%9C%D7%99%D7%99%D7%9F', destination: '/he/story' },
  { source: '/timeline', destination: '/he/story' },
  { source: '/timeline-modern', destination: '/he/story' },
  { source: '/timeline_um', destination: '/he/story' },
  { source: '/in-the-media', destination: '/he/media' },
  { source: '/%D7%91%D7%AA%D7%A7%D7%A9%D7%95%D7%A8%D7%AA', destination: '/he/media' },
  { source: '/%D7%A0%D7%91%D7%97%D7%A8%D7%95%D7%AA-%D7%91%D7%AA%D7%A7%D7%A9%D7%95%D7%A8%D7%AA', destination: '/he/media' },
  { source: '/%D7%9E%D7%94%D7%AA%D7%A7%D7%A9%D7%95%D7%A8%D7%AA', destination: '/he/media' },
  { source: '/%D7%98%D7%95%D7%A8%D7%99%D7%9D-%D7%95%D7%93%D7%A2%D7%95%D7%AA', destination: '/he/media' },
  { source: '/%D7%9B%D7%AA%D7%91%D7%95%D7%AA-%D7%95%D7%99%D7%93%D7%90%D7%95', destination: '/he/media' },
  { source: '/%D7%A4%D7%A2%D7%99%D7%9C%D7%95%D7%AA', destination: '/he/activism' },
  { source: '/%D7%A4%D7%A2%D7%99%D7%9C%D7%95%D7%99%D7%95%D7%AA', destination: '/he/activism' },
  { source: '/%D7%A4%D7%A2%D7%99%D7%9C%D7%99%D7%95%D7%AA', destination: '/he/activism' },
  { source: '/%D7%94%D7%A4%D7%A2%D7%9D-%D7%91%D7%95%D7%97%D7%A8%D7%95%D7%AA-%D7%9C%D7%A9%D7%A0%D7%95%D7%AA', destination: '/he/activism' },
  { source: '/%D7%A9%D7%90%D7%9C%D7%95%D7%AA-%D7%95%D7%AA%D7%A9%D7%95%D7%91%D7%95%D7%AA', destination: '/he/activism' },
  { source: '/%D7%92%D7%9C%D7%A8%D7%99%D7%94', destination: '/he/activism' },
  { source: '/%D7%92%D7%9C%D7%A8%D7%99%D7%94-222', destination: '/he/activism' },
  { source: '/%D7%97%D7%A7%D7%99%D7%A7%D7%94', destination: '/he/mishpat' },
  { source: '/%D7%A0%D7%99%D7%99%D7%A8%D7%95%D7%AA-%D7%A2%D7%9E%D7%93%D7%94', destination: '/he/mishpat' },
  { source: '/%D7%AA%D7%A8%D7%95%D7%9E%D7%95%D7%AA', destination: '/he/donate' },
  { source: '/%D7%AA%D7%A8%D7%95%D7%9E%D7%95%D7%AA-2', destination: '/he/donate' },
  { source: '/%D7%9E%D7%AA%D7%A0%D7%93%D7%91%D7%95%D7%AA', destination: '/he/join' },
  { source: '/%D7%A8%D7%90%D7%A9%D7%99', destination: '/he' },
  { source: '/%D7%A8%D7%90%D7%A9%D7%99-2', destination: '/he' },
]

export const ARCHIVED_POST_REDIRECTS: LegacyRedirect[] = [
  { source: '/2017/05/03/%D7%A0%D7%99%D7%99%D7%A8-%D7%A2%D7%9E%D7%93%D7%94-%D7%94%D7%A2%D7%93%D7%A8-%D7%99%D7%99%D7%A6%D7%95%D7%92-%D7%A0%D7%A9%D7%99%D7%9D-%D7%97%D7%A8%D7%93%D7%99%D7%95%D7%AA-%D7%91%D7%9B%D7%A0%D7%A1%D7%AA', destination: '/he/media/position-paper-no-representation-2017' },
  { source: '/2017/07/20/%D7%A7%D7%95%D7%9C-%D7%A7%D7%95%D7%A8%D7%90-%D7%9C%D7%A2%D7%99%D7%AA%D7%95%D7%A0%D7%90%D7%99%D7%9D-%D7%95%D7%A2%D7%99%D7%AA%D7%95%D7%A0%D7%90%D7%99%D7%95%D7%AA', destination: '/he/media/call-to-journalists-2017' },
  { source: '/2019/07/04/%D7%94%D7%A9%D7%99%D7%A0%D7%95%D7%99-%D7%9E%D7%AA%D7%97%D7%99%D7%9C-%D7%9E%D7%91%D7%A4%D7%A0%D7%99%D7%9D-%D7%94%D7%9C%D7%9B%D7%94-%D7%9C%D7%9E%D7%A2%D7%A9%D7%94', destination: '/he/media/change-starts-inside-2019' },
  { source: '/2020/03/31/%D7%90%D7%9C%D7%99%D7%9E%D7%95%D7%AA-%D7%91%D7%9E%D7%A9%D7%A4%D7%97%D7%94-%D7%91%D7%97%D7%91%D7%A8%D7%94-%D7%94%D7%97%D7%A8%D7%93%D7%99%D7%AA-%D7%91%D7%AA%D7%A7%D7%95%D7%A4%D7%AA-%D7%9E%D7%A9%D7%91', destination: '/he/media/domestic-violence-corona-2020' },
  { source: '/2021/01/31/%D7%A7%D7%A9%D7%94-%D7%9C%D7%94%D7%99%D7%95%D7%AA-%D7%90%D7%9D-%D7%92%D7%A8%D7%95%D7%A9%D7%94-%D7%97%D7%A8%D7%93%D7%99%D7%AA-%D7%91%D7%99%D7%9E%D7%99-%D7%94%D7%A7%D7%95%D7%A8%D7%95%D7%A0%D7%94', destination: '/he/media/divorced-haredi-mothers-corona-2021' },
  { source: '/2021/01/31/%D7%91%D7%99%D7%A9%D7%A8%D7%90%D7%9C-2021-%D7%A2%D7%93%D7%99%D7%99%D7%9F-%D7%A8%D7%A6%D7%95%D7%AA-%D7%9C%D7%9B%D7%A0%D7%A1%D7%AA-%D7%9E%D7%A4%D7%9C%D7%92%D7%95%D7%AA-%D7%9C%D7%92%D7%91%D7%A8%D7%99', destination: '/he/media/mens-only-parties-2021' },
  { source: '/2021/01/31/%D7%9E%D7%94-%D7%A9%D7%A8%D7%95%D7%90%D7%99%D7%9D-%D7%9B%D7%99%D7%95%D7%9D-%D7%96%D7%94-%D7%9C%D7%90-%D7%94%D7%9E%D7%A8%D7%90%D7%95%D7%AA-%D7%A9%D7%9C-%D7%94%D7%97%D7%91%D7%A8%D7%94-%D7%94%D7%97', destination: '/he/media/not-the-face-of-haredi-society-2021' },
  { source: '/2021/11/01/%D7%A2%D7%95%D7%93-%D7%95%D7%95%D7%A2%D7%93%D7%94-%D7%95%D7%93%D7%91%D7%A8-%D7%9C%D7%90-%D7%94%D7%A9%D7%AA%D7%A0%D7%94', destination: '/he/media/daycare-workers-committee-2021' },
  { source: '/2022/01/06/%D7%90%D7%A7%D7%98%D7%91%D7%99%D7%96%D7%9D-%D7%97%D7%A8%D7%93%D7%99-%D7%97%D7%99-%D7%95%D7%91%D7%95%D7%A2%D7%98', destination: '/he/media/haredi-activism-alive-2022' },
  { source: '/2022/03/10/%D7%A9%D7%90%D7%A9%D7%AA-%D7%97%D7%99%D7%9C-%D7%A4%D7%95%D7%92%D7%A9%D7%AA-%D7%90%D7%AA-%D7%A9%D7%92%D7%A8%D7%99%D7%A8%D7%95%D7%AA-%D7%90%D7%A8%D7%94%D7%91', destination: '/he/media/women-of-valor-us-embassy-screening-2022' },
  { source: '/2022/07/23/%D7%94%D7%90%D7%9D-%D7%A9%D7%A8%D7%94-%D7%A9%D7%A0%D7%99%D7%A8%D7%A8-%D7%94%D7%99%D7%99%D7%AA%D7%94-%D7%A4%D7%9E%D7%99%D7%A0%D7%99%D7%A1%D7%98%D7%99%D7%AA', destination: '/he/media/was-sarah-schenirer-a-feminist-2022' },
  { source: '/2022/06/12/%D7%AA%D7%A2%D7%A1%D7%95%D7%A7%D7%AA-%D7%A0%D7%A9%D7%99%D7%9D-%D7%97%D7%A8%D7%93%D7%99%D7%95%D7%AA-%D7%9C%D7%90-%D7%9E%D7%94-%D7%A9%D7%97%D7%A9%D7%91%D7%AA%D7%9D', destination: '/he/media/haredi-womens-employment-2022' },
  { source: '/2023/04/04/%D7%90%D7%99%D7%96%D7%95%D7%A7-%D7%90%D7%9C%D7%A7%D7%98%D7%A8%D7%95%D7%A0%D7%99-%D7%9E%D7%A6%D7%99%D7%9C-%D7%97%D7%99%D7%99%D7%9D', destination: '/he/media/electronic-monitoring-abusers-2023' },
  { source: '/2024/04/26/%D7%9E%D7%94-%D7%A2%D7%95%D7%A9%D7%99%D7%9D-%D7%A2%D7%9D-%D7%9B%D7%90%D7%91-%D7%A9%D7%90%D7%99%D7%9F-%D7%9C%D7%95-%D7%A1%D7%95%D7%A3', destination: '/he/media/endless-pain-2024' },
  { source: '/2024/04/26/%D7%9E%D7%94-%D7%94%D7%91%D7%A2%D7%99%D7%94-%D7%A2%D7%9D-%D7%97%D7%95%D7%A7-%D7%94%D7%AA%D7%A7%D7%A9%D7%95%D7%A8%D7%AA', destination: '/he/media/media-law-kosher-phones-2024' },
  { source: '/2024/09/29/%D7%97%D7%A8%D7%93%D7%99%D7%AA-%D7%9E%D7%93%D7%95%D7%91%D7%A8%D7%AA-%D7%94%D7%A4%D7%95%D7%93%D7%A7%D7%90%D7%A1%D7%98-%D7%A9%D7%9E%D7%92%D7%A9%D7%A8-%D7%91%D7%99%D7%9F-%D7%94%D7%A2%D7%95%D7%9C', destination: '/he/media/haredit-meduberet-season-2-launch-2024' },
  { source: '/2024/09/29/%D7%A2%D7%9C-%D7%96%D7%94%D7%95%D7%AA-%D7%97%D7%A8%D7%93%D7%99%D7%95%D7%AA-%D7%AA%D7%94%D7%9C%D7%99%D7%9B%D7%99%D7%9D-%D7%95%D7%9E%D7%94-%D7%A9%D7%91%D7%99%D7%A0%D7%99%D7%94%D7%9D', destination: '/he/media/identity-and-processes-radical-2024' },
]

/**
 * A SECOND, separate old site: nivcharot.com, a Wix-hosted English site
 * (different domain entirely from nivcharot.co.il, which was Hebrew-only).
 * That domain is already configured (outside this repo, in Vercel's own
 * domain settings) to redirect to nivcharot.co.il — confirmed 2026-09-23 by
 * curling it live and seeing it land here — but only the DOMAIN redirect
 * exists; the path is carried over as-is, so it hits this same app with a
 * Wix-shaped path (`/about_us`, `/post/<slug>`) that nothing below maps on
 * its own. Same Wayback Machine research method as the Hebrew site above,
 * against nivcharot.com's own Wix-generated sitemaps.
 *
 * `/contact`, `/media`, `/donate` are deliberately NOT in
 * WIX_STATIC_PAGE_REDIRECTS even though nivcharot.com had them too: those
 * three words already resolve successfully via proxy.ts's default-locale
 * fallback (`/media` → `/he/media`, a real page) since the Hebrew site
 * happens to use the same English word for its own route. Redirecting them
 * to the English page instead would swap a working Hebrew landing for a
 * working English one on a path with no other locale signal — not
 * obviously a fix, so left alone. Every other page below has no `/he/...`
 * equivalent at all (different words entirely) and was a straight 404
 * without this.
 *
 * WIX_POST_REDIRECTS: same conservative matching as ARCHIVED_POST_REDIRECTS
 * above, this time English-to-English (both the old Wix slug and the new
 * `posts` collection slug are already English words, no decoding needed —
 * and correspondingly easier to eyeball). 102 old post URLs checked; the
 * word-overlap scorer's top candidates still needed real checking, not a
 * blind confidence cutoff — it matched two "leadership course" posts to
 * the same new post by generic overlap alone (missing that "sixth"/
 * "seventh" as WORDS don't match the new slugs' "6"/"7" as DIGITS) and
 * matched an "electronic tags" post to an unrelated "no representation"
 * position paper (missing that "electronic tags" and
 * "electronic-monitoring-abusers" describe the same policy topic in
 * different words) — both corrected by hand below. Four other candidates
 * (two "Woman of Valor" screening posts, one about a WIZO-run program,
 * one generic "leadership program" announcement) were dropped: their only
 * overlap was a recurring name/category word ("women", "valor",
 * "leadership", "program") shared by several *different* real posts, not
 * evidence of being the same one.
 */
export const WIX_STATIC_PAGE_REDIRECTS: LegacyRedirect[] = [
  { source: '/about_us', destination: '/en/about' },
  { source: '/our-team', destination: '/en/team' },
  { source: '/get_involved', destination: '/en/join' },
  { source: '/time-line', destination: '/en/story' },
  { source: '/projects', destination: '/en/activism' },
  { source: '/shop', destination: '/en' },
  { source: '/members', destination: '/en' },
]

export const WIX_POST_REDIRECTS: LegacyRedirect[] = [
  { source: '/post/what-do-you-do-with-the-endless-pain', destination: '/en/media/endless-pain-2024' },
  { source: '/post/nivcharot-launches-its-sixth-leadership-course', destination: '/en/media/leadership-course-6-2023' },
  { source: '/post/nivcharot-concludes-its-seventh-leadership-course', destination: '/en/media/leadership-course-7-2024' },
  { source: '/post/nivcharot-presents-a-position-paper-on-electronic-tags', destination: '/en/media/electronic-monitoring-abusers-2023' },
  { source: '/post/no-representation-no-vote-say-haredi-women', destination: '/en/media/position-paper-no-representation-2017' },
  { source: '/post/charedi-women-speak-up-about-no-representation-no-vote-campaign', destination: '/en/media/position-paper-no-representation-2017' },
]
