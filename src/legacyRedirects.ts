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
 */

type LegacyRedirect = { source: string; destination: string }

export const STATIC_PAGE_REDIRECTS: LegacyRedirect[] = [
  { source: '/who-we-are', destination: '/he/about' },
  { source: '/מי-אנחנו', destination: '/he/about' },
  { source: '/חזון', destination: '/he/about' },
  { source: '/מה-הסיפור-שלנו', destination: '/he/story' },
  { source: '/ניסיון-לטיימליין', destination: '/he/story' },
  { source: '/timeline', destination: '/he/story' },
  { source: '/timeline-modern', destination: '/he/story' },
  { source: '/timeline_um', destination: '/he/story' },
  { source: '/in-the-media', destination: '/he/media' },
  { source: '/בתקשורת', destination: '/he/media' },
  { source: '/נבחרות-בתקשורת', destination: '/he/media' },
  { source: '/מהתקשורת', destination: '/he/media' },
  { source: '/טורים-ודעות', destination: '/he/media' },
  { source: '/כתבות-וידאו', destination: '/he/media' },
  { source: '/פעילות', destination: '/he/activism' },
  { source: '/פעילויות', destination: '/he/activism' },
  { source: '/פעיליות', destination: '/he/activism' },
  { source: '/הפעם-בוחרות-לשנות', destination: '/he/activism' },
  { source: '/שאלות-ותשובות', destination: '/he/activism' },
  { source: '/גלריה', destination: '/he/activism' },
  { source: '/גלריה-222', destination: '/he/activism' },
  { source: '/חקיקה', destination: '/he/mishpat' },
  { source: '/ניירות-עמדה', destination: '/he/mishpat' },
  { source: '/תרומות', destination: '/he/donate' },
  { source: '/תרומות-2', destination: '/he/donate' },
  { source: '/מתנדבות', destination: '/he/join' },
  { source: '/ראשי', destination: '/he' },
  { source: '/ראשי-2', destination: '/he' },
]

export const ARCHIVED_POST_REDIRECTS: LegacyRedirect[] = [
  { source: '/2017/05/03/נייר-עמדה-העדר-ייצוג-נשים-חרדיות-בכנסת', destination: '/he/media/position-paper-no-representation-2017' },
  { source: '/2017/07/20/קול-קורא-לעיתונאים-ועיתונאיות', destination: '/he/media/call-to-journalists-2017' },
  { source: '/2019/07/04/השינוי-מתחיל-מבפנים-הלכה-למעשה', destination: '/he/media/change-starts-inside-2019' },
  { source: '/2020/03/31/אלימות-במשפחה-בחברה-החרדית-בתקופת-משב', destination: '/he/media/domestic-violence-corona-2020' },
  { source: '/2021/01/31/קשה-להיות-אם-גרושה-חרדית-בימי-הקורונה', destination: '/he/media/divorced-haredi-mothers-corona-2021' },
  { source: '/2021/01/31/בישראל-2021-עדיין-רצות-לכנסת-מפלגות-לגברי', destination: '/he/media/mens-only-parties-2021' },
  { source: '/2021/01/31/מה-שרואים-כיום-זה-לא-המראות-של-החברה-הח', destination: '/he/media/not-the-face-of-haredi-society-2021' },
  { source: '/2021/11/01/עוד-וועדה-ודבר-לא-השתנה', destination: '/he/media/daycare-workers-committee-2021' },
  { source: '/2022/01/06/אקטביזם-חרדי-חי-ובועט', destination: '/he/media/haredi-activism-alive-2022' },
  { source: '/2022/03/10/שאשת-חיל-פוגשת-את-שגרירות-ארהב', destination: '/he/media/women-of-valor-us-embassy-screening-2022' },
  { source: '/2022/07/23/האם-שרה-שנירר-הייתה-פמיניסטית', destination: '/he/media/was-sarah-schenirer-a-feminist-2022' },
  { source: '/2022/06/12/תעסוקת-נשים-חרדיות-לא-מה-שחשבתם', destination: '/he/media/haredi-womens-employment-2022' },
  { source: '/2023/04/04/איזוק-אלקטרוני-מציל-חיים', destination: '/he/media/electronic-monitoring-abusers-2023' },
  { source: '/2024/04/26/מה-עושים-עם-כאב-שאין-לו-סוף', destination: '/he/media/endless-pain-2024' },
  { source: '/2024/04/26/מה-הבעיה-עם-חוק-התקשורת', destination: '/he/media/media-law-kosher-phones-2024' },
  { source: '/2024/09/29/חרדית-מדוברת-הפודקאסט-שמגשר-בין-העול', destination: '/he/media/haredit-meduberet-season-2-launch-2024' },
  { source: '/2024/09/29/על-זהות-חרדיות-תהליכים-ומה-שביניהם', destination: '/he/media/identity-and-processes-radical-2024' },
]
