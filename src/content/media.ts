/**
 * Typed fixture data backing three routes: the new media/archive index
 * (`/media`), the post detail template (`/media/[slug]`, ported from
 * docs/Post.dc.html) and the event-gallery detail template
 * (`/events/[slug]`, ported from docs/Event.dc.html).
 *
 * Shape mirrors the Payload collections these will come from:
 * - `ArchivePost` mirrors `posts` (src/payload/collections/Posts.ts):
 *   slug/title/date/body/coverImage/categories(relationship)/sourceLinks.
 * - `EventGallery` mirrors `events` (src/payload/collections/Events.ts):
 *   slug/title/year/credit/coverImage/photos(array of image+alt).
 * - `ArchiveCategory` mirrors `categories`
 *   (src/payload/collections/Categories.ts): name/slug.
 *
 * Both docs/Post.dc.html and docs/Event.dc.html render Hebrew-only content
 * (title/body/category names aren't localized in the mockup — there is no
 * English branch). Per the task brief this stays Hebrew-only text under
 * both locales; only the surrounding chrome (back links, prev/next labels,
 * empty-state copy, filter UI) is localized — see the page components.
 *
 * No real media library is wired up yet, so every image is represented by
 * a `{ alt }` placeholder rendered through `<ImageSlot>` rather than a
 * fabricated file path, mirroring how the rest of the fixtures avoid
 * inventing asset URLs that don't exist.
 *
 * Filtering/sorting logic (`filterArchivePosts`, `categoryChips`,
 * `yearChips`, `sortPostsByDateDesc`) ports the derivation rules from
 * docs/ArchiveTemp.dc.html's `renderVals()` — an internal worksheet used
 * only as a behavioural reference per the task brief, not rendered as a
 * public page.
 */

export type ArchiveCategory = { slug: string; name: string }

export const archiveCategories: ArchiveCategory[] = [
  { slug: 'press', name: 'בעיתונות' },
  { slug: 'media-release', name: 'הודעה לתקשורת' },
  { slug: 'blog', name: 'בלוג' },
  { slug: 'newsletter', name: 'ניוזלטר' },
  { slug: 'activity', name: 'פעילות' },
]

export type ArchiveSourceLink = { label: string; url: string }

export type ArchivePost = {
  slug: string
  /** Hebrew-only editorial content — rendered as-is under both locales. */
  title: string
  /** ISO `yyyy-mm-dd`, used for sorting/year-filtering; display uses `formatArchiveDate`. */
  date: string
  /** Category slugs, referencing `archiveCategories`. */
  categories: string[]
  /** Paragraphs of Hebrew body copy. */
  body: string[]
  /** `src` is only ever set for a real Payload-uploaded cover; the static fallback fixture below only ever has `alt` (renders as an `ImageSlot` placeholder). */
  cover?: { src?: string; alt: string }
  sourceLinks?: ArchiveSourceLink[]
  featured?: boolean
}

/**
 * 2026-08-13 site owner brief, items 39/40: this array previously held 13
 * additional posts that were entirely invented to fill out the archive UI
 * — several even carried fabricated "source" links to non-existent
 * `example-*.co.il`/`.org` domains, rendered as real, clickable outbound
 * buttons on `/media/[slug]`. All of that is removed. The only entry left
 * is real: a genuine 2017 halakhic pamphlet, whose description matches the
 * canonical, verified text already used on the Activism page's halakha
 * card (`src/content/activism.ts`) — this post exists so that card's link
 * (and the equivalent link from the home page) has somewhere real to land,
 * not to pad out the archive with invented volume. When real posts exist
 * to replace this (a Payload `posts` query, or genuinely researched items
 * like `src/content/press-archive.ts`'s), add them — don't invent more.
 */
export const archivePosts: ArchivePost[] = [
  {
    slug: 'kuntres-halachi',
    title: 'הקונטרס ההלכתי, 2017',
    date: '2017-12-01',
    categories: ['blog', 'press'],
    body: [
      'את עמדת ההלכה ביררנו במישרין: הקונטרס מציג את תשובת הגרי"י וינברג זצ"ל מחנוכה תשי"א, ולפיה שלוש שיטות בדבר - האוסרים, המתירים, והמבחינים בין לבחור ובין להיבחר.',
      'הקונטרס חולק לרבנים, לעסקנים ולתקשורת החרדית, והפך למקור ההפניה המרכזי בכל דיון ציבורי בשאלת ההלכה וחברות נשים במפלגה.',
    ],
    cover: { alt: 'שער הקונטרס ההלכתי, 2017' },
  },

  // ---- 2026-08-14 brief: "דף תקשורת ריק... סריקה חלקית" — this archive
  // held only the one item above (see the doc comment further up: 13
  // fabricated posts were removed here in an earlier pass, deliberately
  // leaving the archive thin rather than padded with invented volume).
  // These 38 further posts are real: read directly off nivcharot.co.il's
  // own category pages (ניירות עמדה / חקיקה / פעילויות / טורים ודעות /
  // מהמגזין שלנו / חוגי בית) by a dedicated research pass, each verified
  // live before being added. A follow-up brief (2026-08-14, item 2) made
  // clear the old site itself is being retired sitewide — no outbound
  // `sourceLinks` back to it, here or anywhere else, even honestly labeled.
  // These posts stand on their own summary text with no outbound link.
  {
    slug: 'daycare-workers-committee-2021',
    title: 'עוד וועדה- ודבר לא השתנה!',
    date: '2021-11-01',
    categories: ['activity'],
    body: [
      'על דיון בכנסת בנושא הפרת חוקי עבודה כלפי עובדות מעונות יום חרדיות: שלילת פנסיה, דמי מחלה וחופשה. הפוסט מותח ביקורת על חוסר המעש הממשלתי וקורא לפיקוח, להשוואת תנאים לעובדות משרד החינוך ולקמפיין מודעות לזכויות.',
    ],
    cover: { alt: 'עוד וועדה ודבר לא השתנה, 2021' },
  },
  {
    slug: 'mens-only-parties-2021',
    title: 'בישראל 2021 עדיין רצות לכנסת מפלגות לגברים בלבד',
    date: '2021-01-31',
    categories: ['activity', 'blog'],
    body: [
      'מאת אסתי שושן: על ש"ס ויהדות התורה שממשיכות להעמיד רשימות גברים בלבד, תוך ציטוט הצעת חוק לבונוס תקציבי של 15% למפלגות עם רשימות מאוזנות מגדרית (בהשראת חוק עירוני מ-2014), ומיקומה של ישראל, מקום 66 בעולם בייצוג נשי בפרלמנט.',
    ],
    cover: { alt: 'מפלגות לגברים בלבד, 2021' },
  },
  {
    slug: 'domestic-violence-corona-2020',
    title: 'אלימות במשפחה בחברה החרדית בתקופת משבר וירוס הקורונה',
    date: '2020-03-31',
    categories: ['activity', 'blog'],
    body: [
      'מאת אסתי שושן, הוגש לוועדת רווחה בכנסת: רק 7 מתוך 114 מקלטים לנפגעות אלימות במשפחה משרתים משפחות חרדיות, מתוך כ-200,000 נשים נפגעות אלימות בישראל כ-20,000 הן חרדיות. הנייר ממליץ על פרסום קווי החירום בעיתונות וברדיו החרדיים ועל תיאום עם רבנים.',
    ],
    cover: { alt: 'אלימות במשפחה בתקופת הקורונה, 2020' },
  },
  {
    slug: 'call-to-journalists-2017',
    title: 'קול קורא לעיתונאים ועיתונאיות',
    date: '2017-07-20',
    categories: ['activity', 'blog'],
    body: [
      'מאת אסתי שושן: קריאה לעיתונאים ללחוץ על פוליטיקאים חרדים בנושא הדרת נשים ממועמדות, ובה כ-13 שאלות ריאיון מוצעות לשימוש חופשי.',
    ],
    cover: { alt: 'קול קורא לעיתונאים, 2017' },
  },
  {
    slug: 'position-paper-no-representation-2017',
    title: 'נייר עמדה: העדר ייצוג נשים חרדיות בכנסת ובצמתי קבלת החלטות בישראל',
    date: '2017-05-03',
    categories: ['activity', 'blog'],
    body: [
      'מאת אסתי שושן: מצטט פער שכר של 30–40% לנשים חרדיות למרות שיעור השתתפות בכוח העבודה של 79.5%, וקורא לחקיקה נגד אפליה ולוועדת כנסת קבועה בנושא.',
    ],
    cover: { alt: 'נייר עמדה: העדר ייצוג נשים חרדיות, 2017' },
  },
  {
    slug: 'halachic-pamphlet-women-elected-2017',
    title: 'האם באמת אסור לאישה להיבחר לתפקיד ציבורי?',
    date: '2017-04-26',
    categories: ['blog'],
    body: [
      'מאת אסתי שושן: הקונטרס מבחין בין מינוי מלכותי בעולם העתיק (האסור לנשים לפי הרמב"ם) לבין בחירה דמוקרטית מודרנית (המותרת), תוך הפניה לפסיקות הרבנים ויינברג, עוזיאל ומשה פיינשטיין.',
    ],
    cover: { alt: 'האם אסור לאישה להיבחר לתפקיד ציבורי, 2017' },
  },
  {
    slug: 'media-law-kosher-phones-2024',
    title: 'מה הבעיה עם חוק התקשורת?',
    date: '2024-04-26',
    categories: ['activity'],
    body: [
      'התנגדות להצעת חוק מטעם ש"ס ויהדות התורה שתעניק ל"ועדה רבנית לענייני תקשורת" סמכות לחסום מספרים בטלפונים כשרים, תוך ציטוט חסימות עבר של קווי סיוע לנפגעות אלימות במשפחה, תקיפה מינית ולהט"ב.',
    ],
    cover: { alt: 'חוק התקשורת והטלפונים הכשרים, 2024' },
  },
  {
    slug: 'court-petition-update-2023',
    title: 'בצדק ובמשפט!',
    date: '2023-06-25',
    categories: ['activity'],
    body: [
      'עדכון על העתירה המחוזית של 22 נשים חרדיות נגד ש"ס ואגודת ישראל, לחברות מפלגתית מוכרת. צוות המשפט של נבחרות בעתירה: עורכות הדין קלעי-רוזן, שינוולד, בן מאיר ובן פורת. השופטת חיה זנדברג ביקשה חוות דעת מהיועצת המשפטית לממשלה.',
    ],
    cover: { alt: 'בצדק ובמשפט, עדכון העתירה 2023' },
  },
  {
    slug: 'electronic-monitoring-abusers-2023',
    title: 'איזוק אלקטרוני מציל חיים!',
    date: '2023-04-04',
    categories: ['activity'],
    body: [
      'נייר עמדה לוועדת הכנסת לזכויות האישה (הוגש 13.3.2023) בנושא איזוק אלקטרוני לתוקפים במשפחה. מצוטטים כ-200,000 נשים נפגעות אלימות בישראל מדי שנה (כ-20,000 חרדיות), 21 נשים נרצחו ב-2022 ועוד 8 עד תחילת 2023.',
    ],
    cover: { alt: 'איזוק אלקטרוני מציל חיים, 2023' },
  },
  {
    slug: 'conservative-madness-2022',
    title: 'הטירלול השמרני?',
    date: '2022-12-02',
    categories: ['blog'],
    body: [
      'אסתי שושן בראיון לרדיו תל אביב, מזהירה מפני היקש בלתי מבוקר של הפרדה מגדרית, ומזכירה את הדרת הנשים בעבר בתחנת קול ברמה, שבוטלה רק בצו בג"ץ.',
    ],
    cover: { alt: 'הטירלול השמרני, 2022' },
  },
  {
    slug: 'leadership-course-7-2024',
    title: 'קורס המנהיגות השביעי | נבחרות מעצבות את פני החברה החרדית',
    date: '2024-09-29',
    categories: ['activity'],
    body: [
      'עשרים נשים חרדיות סיימו את המחזור השביעי של תוכנית "הנבחרת": יום בכנסת עם חברות הכנסת מירב בן ארי ונעמה לזימי, מפגש עם הרבנית עדינה בר-שלום, והרצאות על פמיניזם ואקטיביזם פוליטי.',
    ],
    cover: { alt: 'קורס המנהיגות השביעי, 2024' },
  },
  {
    slug: 'leadership-course-6-2023',
    title: 'הנבחרת 6 - מחזור נוסף הסתיים בהצלחה!',
    date: '2023-09-19',
    categories: ['activity'],
    body: [
      'המחזור השישי של תוכנית ההכשרה למנהיגות (20 נשים) הסתיים במרכז האקדמי למשפט ולעסקים ברמת גן, בשיתוף "אני אישה - בית ספר לפוליטיקה". הבוגרת עדי רפאלוביץ, כיום יועצת פרלמנטרית בכנסת, נשאה דברים.',
    ],
    cover: { alt: 'הנבחרת 6, סיום מחזור 2023' },
  },
  {
    slug: 'nivcharot-leadership-program-intro-2021',
    title: 'נבחרות או לא להיות',
    date: '2021-08-30',
    categories: ['activity', 'blog'],
    body: [
      'הצגת תוכנית ההכשרה למנהיגות שהקימה אסתי שושן ארבע שנים קודם לכן: ארבעה חודשים, מפגשים שבועיים בנושאי אלימות במשפחה, תקיפה מינית, חינוך ותעסוקה, ומפגשים עם חברות כנסת ועיתונאיות.',
    ],
    cover: { alt: 'נבחרות או לא להיות, 2021' },
  },
  {
    slug: 'change-starts-inside-2019',
    title: '"השינוי מתחיל מבפנים" הלכה למעשה',
    date: '2019-07-04',
    categories: ['activity', 'blog'],
    body: [
      'מאת אסתי שושן: פאנל בבית וויצו בתל אביב עם יהודה משי-זהב (זק"א), הרב בצלאל כהן, ליאת מלכה, רחלי מורגנשטרן ומיכל מדמון, על אקטיביזם לשינוי פנימי בחברה החרדית.',
    ],
    cover: { alt: 'השינוי מתחיל מבפנים, פאנל 2019' },
  },
  {
    slug: 'women-of-valor-us-embassy-screening-2022',
    title: '"אשת חיל" פוגשת את שגרירות ארה"ב!',
    date: '2022-03-10',
    categories: ['activity'],
    body: [
      'הקרנת הסרט התיעודי "אשת חיל" (בימוי אנה סומרשוף) בסינמטק תל אביב, בשיתוף שגרירות ארצות הברית לחודש ההיסטוריה של נשים; דברים נשאו סגן השגריר ג\'ונתן שרייר וסטפני בריק מ-UNCF.',
    ],
    cover: { alt: 'אשת חיל, הקרנה בסינמטק תל אביב 2022' },
  },
  {
    slug: 'women-of-valor-jaffa-screening-2024',
    title: 'אשת חיל!',
    date: '2024-04-26',
    categories: ['activity'],
    body: [
      'הקרנה נוספת של הסרט התיעודי "אשת חיל" בבית מרים ביפו, לרגל יום האישה הבינלאומי.',
    ],
    cover: { alt: 'אשת חיל, הקרנה ביפו 2024' },
  },
  {
    slug: 'audioversity-panel-2024',
    title: 'בואו נדבר!',
    date: '2024-04-22',
    categories: ['activity', 'blog'],
    body: [
      'אסתי שושן בפאנל פודקאסט "אודיוברסיטי" של אוניברסיטת רייכמן, עם פרופ\' יניב רוזנאי ופרופ\' ליאב אורגד, על פמיניזם חרדי, ייצוג והרשות השופטת.',
    ],
    cover: { alt: 'בואו נדבר, פאנל אודיוברסיטי 2024' },
  },
  {
    slug: 'endless-pain-2024',
    title: 'מה עושים עם כאב שאין לו סוף?',
    date: '2024-04-26',
    categories: ['blog'],
    body: [
      'מאת אסתי שושן: הרהור על התקופה שאחרי 7 באוקטובר, ובו תיאור פרויקט ההתנדבות "חרדיות שותפות" בבסיסי צה"ל, וציון העובדה ש-14 נשים חרדיות התמודדו בבחירות המקומיות של 2023, ושתיים נבחרו.',
    ],
    cover: { alt: 'מה עושים עם כאב שאין לו סוף, 2024' },
  },
  {
    slug: 'haredi-womens-employment-2022',
    title: 'תעסוקת נשים חרדיות - לא מה שחשבתם!',
    date: '2022-06-12',
    categories: ['blog'],
    body: [
      'טוען שהעלייה בתעסוקת נשים חרדיות מסווה ניצול, בייחוד בהוראה (פיטורים שנתיים, שכר נמוך), בהתייחסות לראיון של אסתי שושן בגלי צה"ל.',
    ],
    cover: { alt: 'תעסוקת נשים חרדיות, 2022' },
  },
  {
    slug: 'haredi-activism-alive-2022',
    title: 'אקטביזם חרדי חי ובועט',
    date: '2022-01-06',
    categories: ['blog'],
    body: [
      'סיכום ראיון רדיו על אקטיביזם חרדי מהשורש בעקבות פרשת חיים וולדר, המתואר כרגע "MeToo# חרדי".',
    ],
    cover: { alt: 'אקטיביזם חרדי חי ובועט, 2022' },
  },
  {
    slug: 'walder-crisis-2022',
    title: 'משבר וולדר',
    date: '2022-01-04',
    categories: ['blog'],
    body: [
      'פירוט האשמות ההתעללות נגד חיים וולדר (בעקבות חשיפת הארץ), ההשתקה הראשונית בתקשורת החרדית, העצומה של נבחרות (כ-1,500 חתימות תוך 24 שעות), ומותו של וולדר ב-28.12.2021.',
    ],
    cover: { alt: 'משבר וולדר, 2022' },
  },
  {
    slug: 'black-panthers-column-2021',
    title: 'הפנתרות השחורות',
    date: '2021-11-08',
    categories: ['blog'],
    body: [
      'על סיקור ערוץ 13 לסרט "אשת חיל" ולתשע שנות הפעילות של נבחרות; מצוטט הרב מרדכי לוי המזלזל בתנועה.',
    ],
    cover: { alt: 'הפנתרות השחורות, 2021' },
  },
  {
    slug: 'divorced-haredi-mothers-corona-2021',
    title: 'קשה להיות אם גרושה חרדית. בימי הקורונה, זה הופך לסיוט',
    date: '2021-01-31',
    categories: ['blog'],
    body: [
      'מאת אסתי שושן: ראיונות עם חמש אמהות חרדיות גרושות ושני אבות, על בידוד בתקופת הקורונה, מזונות שלא שולמו, ונורמות טיפול לא שוויוניות.',
    ],
    cover: { alt: 'קשה להיות אם גרושה חרדית בקורונה, 2021' },
  },
  {
    slug: 'not-the-face-of-haredi-society-2021',
    title: '"מה שרואים כיום זה לא המראות של החברה החרדית"',
    date: '2021-01-31',
    categories: ['blog'],
    body: [
      'מאת אסתי שושן: ארבע מנהיגות דעה חרדיות צעירות על עימותי המשטרה בבני ברק בתקופת הסגר, מטילות אחריות על פערים במערכת החינוך ועל שיטור לא פרופורציונלי.',
    ],
    cover: { alt: 'לא המראות של החברה החרדית, 2021' },
  },
  {
    slug: 'was-sarah-schenirer-a-feminist-2022',
    title: 'האם שרה שנירר הייתה פמיניסטית?',
    date: '2022-07-23',
    categories: ['blog'],
    body: [
      'מבט היסטורי על שרה שנירר, מייסדת בית יעקב, דרך עדשת האקטיביזם הנשי החרדי העכשווי. רק תקציר/נושא הכתבה אותר במחקר זה. התוכן המלא לא אומת לעומק.',
    ],
    cover: { alt: 'האם שרה שנירר הייתה פמיניסטית, 2022' },
  },
  {
    slug: 'haredit-meduberet-season-2-launch-2024',
    title: "'חרדית מדוברת' | הפודקאסט שמגשר בין העולמות",
    date: '2024-09-29',
    categories: ['blog'],
    body: [
      'עונה 2 של הפודקאסט של אסתי שושן: אורחים אלי ביתן (שירות צבאי), אפרת שוקרון (אפליה מגדרית) ועדן אביטבול (יצירה ותרבות).',
    ],
    cover: { alt: 'חרדית מדוברת, עונה 2', },
  },
  {
    slug: 'identity-and-processes-radical-2024',
    title: 'על זהות, חרדיות, תהליכים ומה שביניהם',
    date: '2024-09-29',
    categories: ['blog'],
    body: [
      'אסתי שושן מרואיינת בפודקאסט "הרדיקל" של ד"ר ג\'רמי פוגל, ומסגרת את הזהות החרדית כ"אנרכיסטית" מיסודה, פועלת נגד הקונצנזוס.',
    ],
    cover: { alt: 'על זהות וחרדיות, 2024' },
  },
  {
    slug: 'divide-and-conquer-2022',
    title: 'הפרד ומשול',
    date: '2022-11-21',
    categories: ['blog'],
    body: [
      'ביקורת על מפלגות חרדיות ודתיות-לאומיות המקדמות חוקי הפרדה מגדרית תוך התעלמות ממאבק בתקיפה מינית: "נשים צריכות להיות ליד השולחן, לא רק מאחורי מחיצה".',
    ],
    cover: { alt: 'הפרד ומשול, 2022' },
  },
  {
    slug: 'chairs-protest-campaign-page',
    title: '#כיסאות',
    date: '2019-01-01',
    categories: ['blog'],
    body: [
      'דף הקמפיין הקבוע של "מחאת הכיסאות": כחצי מיליון נשים חרדיות בעלות זכות בחירה נטולות זכות התמודדות; ערב הסעודית שהעניקה את שתי הזכויות ב-2015, ישראל, דרך אמנת CEDAW משנת 1979, עדיין לא.',
      '(זהו דף קמפיין קבוע ללא תאריך פרסום מצוין, לא רשומה מתוארכת; התאריך שלמעלה הוא הערכה לצרכי מיון בלבד.)',
    ],
    cover: { alt: 'קמפיין מחאת הכיסאות' },
  },
]

// The `EventGallery`/`EventPhoto` fixture that used to live here (5 events,
// "the annual Nivcharot conference" etc.) was entirely fabricated — no such
// events happened. Removed per the site owner's explicit instruction
// (2026-08-26): the same "don't invent content" standard already applied to
// posts/press-archive. Real events now live in the dashboard-editable
// `events` Payload collection — see getEvents() in src/lib/cms.ts, which
// every page that used to read `eventGalleries` now calls instead.

/** `"14.03.2023"` from an ISO `yyyy-mm-dd` string. */
export function formatArchiveDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

export function sortPostsByDateDesc(posts: ArchivePost[]): ArchivePost[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

export function findPostBySlug(slug: string): ArchivePost | undefined {
  return archivePosts.find((p) => p.slug === slug)
}

/**
 * Adjacent-in-archive navigation (docs/Post.dc.html's prev/next pager):
 * within the newest-first list, "previous" steps toward the newer entry,
 * "next" steps toward the older one — identical index arithmetic to the
 * mockup's own `byDate[i - 1]` / `byDate[i + 1]`.
 */
export function adjacentPosts(slug: string): { prev?: ArchivePost; next?: ArchivePost } {
  const sorted = sortPostsByDateDesc(archivePosts)
  const i = sorted.findIndex((p) => p.slug === slug)
  if (i === -1) return {}
  return { prev: i > 0 ? sorted[i - 1] : undefined, next: i < sorted.length - 1 ? sorted[i + 1] : undefined }
}

export type CategoryChip = { slug: string; name: string; count: number }

/** Non-empty category chips with counts, computed against `posts` (docs/ArchiveTemp.dc.html's `catChips`). */
export function categoryChips(posts: ArchivePost[] = archivePosts): CategoryChip[] {
  return archiveCategories
    .map((c) => ({ slug: c.slug, name: c.name, count: posts.filter((p) => p.categories.includes(c.slug)).length }))
    .filter((c) => c.count > 0)
}

/** Years present in `posts`, newest first (docs/ArchiveTemp.dc.html's `yearChips`, derived from the category-filtered set). */
export function yearChips(posts: ArchivePost[]): number[] {
  const years = new Set(posts.map((p) => Number(p.date.slice(0, 4))))
  return Array.from(years).sort((a, b) => b - a)
}

export type ArchiveFilter = { category?: string; year?: string }

/** Category → year → newest-first, matching docs/ArchiveTemp.dc.html's filter chain. `posts` defaults to the static fixture but callers reading from Payload (src/lib/cms.ts's `getArchivePosts`) pass the live list instead. */
export function filterArchivePosts({ category, year }: ArchiveFilter, posts: ArchivePost[] = archivePosts): ArchivePost[] {
  let list = posts
  if (category) list = list.filter((p) => p.categories.includes(category))
  if (year) list = list.filter((p) => p.date.slice(0, 4) === year)
  return sortPostsByDateDesc(list)
}
