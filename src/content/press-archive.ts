import type { Localized } from '@/lib/i18n'

/**
 * "בתקשורת" (In the Media) fixture — every entry is real, externally
 * verifiable press coverage of the organization (`link.kind === 'external'`,
 * card links straight out to the real source).
 *
 * 2026-08-13 brief (follow-up): the internal, no-external-link entries this
 * file used to also carry (full pieces that lived only on the old
 * nivcharot.co.il site, with no live source URL — op-eds, position papers,
 * described video/radio appearances) were removed outright, per the site
 * owner's explicit instruction: this listing should hold only posts that
 * carry a real outbound link, nothing else. `PressItemLink`'s `'internal'`
 * variant and `/press/[slug]` (src/app/.../press/[slug]/page.tsx) still
 * exist in case a genuinely real, internally-hosted piece needs a home
 * again later, but nothing currently uses that path.
 *
 * `type` drives the small per-card type icon (document/megaphone); the
 * real editorial organizing axis is `category` (`PressCategory`, below).
 *
 * 2026-08-13 brief (third follow-up — "the summaries need to be
 * substantive"): every `summary` below was rewritten after actually
 * fetching and reading each source article (not just re-describing the
 * outlet/format), per a dedicated research pass. Paywalled/bot-blocked
 * pieces say so plainly in their own summary text rather than inventing
 * detail beyond what was actually visible.
 */

export type PressItemType = 'article' | 'video' | 'press-mention' | 'podcast'

/**
 * Editorial category (2026-08-13 brief, second follow-up: "לסדר לפי כתבות
 * על נבחרות, טורי דעה, ראיונות, נבחרות בפולמוס" — organize by coverage,
 * opinion columns, interviews, and Nivcharot-in-controversy). Replaces the
 * old `PressTypeFilter` (article/video/podcast bucket) as the archive's
 * real filter/organizing axis — `type` still exists for the small
 * document/megaphone icon, but the meaningful editorial grouping a reader
 * actually wants is this one.
 *
 * Classification rule for `'controversy'`: per the site owner's explicit
 * instruction ("לשים שם את כל ההתנגדויות" — put all the objections there),
 * this bucket holds pieces that themselves document opposition/backlash —
 * a rabbi's threat, a hostile op-ed, a funding attack — even when their
 * surface format would otherwise read as "opinion" or "coverage". A
 * sympathetic profile that merely quotes an opponent in passing stays in
 * its own format bucket; a piece whose actual subject IS the pushback goes
 * here.
 */
export type PressCategory = 'coverage' | 'opinion' | 'interview' | 'controversy'

export type PressItemLink = { kind: 'internal'; slug: string } | { kind: 'external'; url: string }

export type PressArchiveItem = {
  /** Stable key; doubles as the `/press/[slug]` route param for internal items. */
  slug: string
  type: PressItemType
  category: PressCategory
  title: Localized<string>
  /** A substantive paragraph — the piece's real content/argument/quotes, not a meta-description of its format. */
  summary: Localized<string>
  /** Human display date — sometimes a real range/approximation ("July 2018") rather than a fabricated exact day. */
  dateLabel: Localized<string>
  /** ISO date used ONLY for sort order / year-bucketing, never rendered as-is. Approximated to the nearest confirmed unit (day > month > year) — see individual comments. */
  sortDate: string
  /** Year bucket for the archive's year filter — always a real, confirmed year. */
  year: number
  outlet: Localized<string>
  link: PressItemLink
  /** Internal items only: full body paragraphs for `/press/[slug]`. */
  body?: Localized<string[]>
  /** Internal items only: an honest, visible caveat (missing embed, unconfirmed source URL, etc.) — never silently smoothed over. */
  note?: Localized<string>
  /**
   * The language the piece was actually written/published in (2026-08-13
   * brief, follow-up). Drives a small language badge on whichever locale
   * DIFFERS from this value — e.g. an English-original WaPo piece shows
   * "EN" on the Hebrew site (even though `title.he`/`summary.he` are real
   * translations, not the raw English), and a Hebrew-original piece shows
   * a "originally in Hebrew" badge on the English site.
   */
  sourceLanguage: 'he' | 'en'
  /**
   * Drives the home page's 4-card media teaser (`MediaArchive.tsx`). Hand-
   * picked rather than "most recent 4" (2026-08-16 brief: "בדף הבית שים
   * כתבות מגוונות לא רק כאלה עם שמי" — varied coverage, not just pieces
   * centered on the founder personally) so the strip represents the range
   * of real coverage — different outlets, formats and years — rather than
   * whichever four happen to be newest.
   */
  featured?: boolean
  /**
   * Short, hand-written blurb for the home page's 4-card strip, so cards
   * stay a consistent size regardless of how long `summary` runs. Only set
   * on featured items; `MediaArchive.tsx` falls back to a trimmed
   * `summary` when absent.
   */
  homeExcerpt?: Localized<string>
}

// The headline the piece carries today; the Post re-headlined it after it
// was first archived here (it ran as "As Israel's election nears, some
// ultra-Orthodox women seek a greater political say").
const WAPO_2020_HEADLINE =
  'Some ultra-Orthodox Jewish women in Israel are breaking with tradition to press for a political say'

export const pressArchiveItems: PressArchiveItem[] = [
  // ---- External: real press coverage / old-site items that were themselves just a summary + outbound link ----
  {
    slug: 'rappaport-prize-2019',
    type: 'press-mention',
    category: 'coverage',
    sourceLanguage: 'he',
    // 2026-08-16 brief: name only in interview/opinion-category titles —
    // this is coverage, so the title leads with her role, not her name.
    title: {
      he: 'מייסדת נבחרות זוכה בפרס רפפורט לנשים פורצות דרך',
      en: "Nivcharot's Founder Wins the Rappaport Prize for Trailblazing Women",
    },
    summary: {
      he: 'פרס רות רפפורט לנשים פורצות דרך, המוענק מדי שנה החל מ-2013 על ידי קרן ברוס ורות רפפורט לנשים "יוצרות שינוי בחברה הישראלית", העניק בטקס מרץ 2019 במוזיאון תל אביב לאמנות שלושה פרסים בני 60,000 ₪, לד"ר נסיה לאנג, לסיגל קנוטובסקי ולאסתי שושן, מייסדת נבחרות. עמוד הפרס עצמו, שאליו מפנה הקישור כאן, הוא דף הבית הכללי של הקרן ואינו מזכיר את שושן בשמה; פרטי זכייתה מאומתים דרך סיקור עצמאי מקביל בגלובס (ראו למטה בארכיון זה).',
      en: 'The Ruth Rappaport Prize for Trailblazing Women, awarded annually since 2013 by the Bruce and Ruth Rappaport Foundation to women "generating change in Israeli society," gave three ₪60,000 awards at a March 2019 Tel Aviv Museum of Art ceremony, to Dr. Nasia Lang, Sigal Knutofsky, and Esty Shushan, founder of Nivcharot. The prize\'s own site, linked here, is the foundation\'s general homepage and doesn\'t name Shushan directly; her win is independently confirmed by parallel Globes coverage (see further down this archive).',
    },
    dateLabel: { he: 'מרץ 2019', en: 'March 2019' },
    sortDate: '2019-03-17',
    year: 2019,
    outlet: { he: 'פרס רפורט', en: 'The Rappaport Prize' },
    link: { kind: 'external', url: 'https://www.rappaport-prize.org.il/' },
  },
  {
    slug: 'washington-post-profile-2017',
    type: 'article',
    category: 'interview',
    /** Original: English. Site owner brief (2026-08-13, follow-up): the Hebrew branch gets a real translation, not the raw English title — with a language badge on whichever locale differs from the source. */
    sourceLanguage: 'en',
    title: {
      he: "שתי פמיניסטיות חרדיות מאתגרות את הנוף הפוליטי בישראל",
      en: "Two ultra-Orthodox feminists challenge Israel's political landscape",
    },
    summary: {
      he: 'פרופיל מקיף מאת רות אגלש על אסתי שושן ואסתי רידר-אינדורסקי, שבחמש השנים שקדמו לפרסום הובילו מאבק לשילוב נשים ברשימות ש"ס ויהדות התורה, מפלגות המחזיקות יחד 13 מושבים ושלושה תיקי ממשלה, כולם בידי גברים. שושן: "כנשים חרדיות אנחנו מתמודדות עם קרבות רבים. לקח לי זמן להבין שהמאבק הזה מתחיל דווקא שם למעלה". רידר-אינדורסקי: "לדעתי השינוי הזה יקרה, השאלה היא רק מתי... כי זה קרה בכל העולם". הכתבה מתעדת גם מחיר אישי: שושן נזקקה לצו בית משפט כדי לשמור על מקום בתה בבית הספר, ובנה של רידר-אינדורסקי התחנן בפניה שתפסיק.',
      en: 'A wide Washington Post profile by Ruth Eglash on Esty Shushan and Estee Rieder-Indursky, who over the five years before publication led the push to get women onto Shas and United Torah Judaism candidate lists, parties holding 13 Knesset seats and three ministries between them, all held by men. Shushan: "As Haredi women, we face many battles. It took me awhile to realize that fighting those battles starts up there." Rieder-Indursky: "This change will happen, the question is just when... because it has happened all over the world." The piece also documents personal cost: a court order to keep Shushan\'s daughter enrolled in her school, and Rieder-Indursky\'s own son begging her to stop.',
    },
    dateLabel: { he: '23.7.2017', en: 'July 23, 2017' },
    sortDate: '2017-07-23',
    year: 2017,
    outlet: { he: 'הוושינגטון פוסט', en: 'The Washington Post' },
    link: {
      kind: 'external',
      url: 'https://www.washingtonpost.com/world/middle_east/two-ultra-orthodox-feminists-are-challenging-israels-political-landscape/2017/07/23/4695134c-6b3e-11e7-abbc-a53480672286_story.html',
    },
    featured: true,
  },
  {
    slug: 'kikar-hashabat-bagatz-2018',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'בג"ץ לאגודת ישראל: לשנות סעיף שמונע התמודדות נשים',
      en: 'High Court to Agudat Yisrael: Amend the Clause Barring Women From Running',
    },
    summary: {
      he: 'כיכר השבת מדווחת שבג"ץ, בראשות הנשיאה חיות, נתן לאגודת ישראל ארכה עד 2.9.2018 לתקן את סעיף 6 בתקנון, המגדיר חבר כ"כל יהודי גבר" ושולל בכך מנשים חברות והתמודדות. העתירה, שהגישה עו"ד תמר בן-פורת עוד ב-2015, זכתה לתמיכת "לא נבחרות – לא בוחרות"; אסתי רידר-אינדורסקי כינתה זאת "יום היסטורי": "לראות אולם בית משפט מלא בנשים חרדיות". אגודת ישראל דחתה את הפסיקה וכינתה את העותרות "הזויות".',
      en: 'Kikar HaShabat reports the High Court, led by President Hayut, gave Agudat Yisrael until Sept. 2, 2018 to amend Section 6 of its bylaws, which defines a member as "any Jewish man," barring women from membership and candidacy. The petition, filed by attorney Tamar Ben-Porat back in 2015, was backed by "Lo Nivcharot – Lo Bocharot" activists; Estee Rieder-Indursky called it "a historic day": "[To] see a courtroom full of ultra-Orthodox women." Agudat Yisrael dismissed the ruling, calling the petitioners "delusional."',
    },
    // The site owner's research filed this under its "2017" section, but
    // re-fetching the live page while building this fixture confirmed its
    // actual publish date is July 31, 2018 — used here instead (see report).
    dateLabel: { he: '31.7.2018', en: 'July 31, 2018' },
    sortDate: '2018-07-31',
    year: 2018,
    outlet: { he: 'כיכר השבת', en: 'Kikar HaShabat' },
    link: { kind: 'external', url: 'https://www.kikar.co.il/haredim-news/286152' },
  },
  {
    slug: 'washington-post-election-2020',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'en',
    title: {
      he: 'נשים חרדיות בישראל שוברות את המסורת כדי לדרוש קול פוליטי',
      en: WAPO_2020_HEADLINE,
    },
    summary: {
      he: 'כתבה בוושינגטון פוסט (פברואר 2020, לקראת מערכת הבחירות של 2020) על מספר גדל, אך עדיין קטן, של נשים חרדיות המבקשות קול פוליטי מעבר לשתי המפלגות החרדיות. הכתבה מתעדת "שיטפון של איומים" נגד נשים חרדיות בפוליטיקה, ואת תפיסת מנהיגי המפלגות ש"נשים חרדיות במפלגות הורסות את היהדות, והגברים הם השליחים הציבוריים".',
      en: 'A Washington Post piece (February 2020, ahead of the 2020 election) on a small but growing number of Haredi women seeking political voice beyond the two Haredi parties. The piece documents a "flood of threats" against Haredi women in politics, and party leaders\' view that "ultra-Orthodox women in parties are destroying Judaism, and men are the public emissaries."',
    },
    dateLabel: { he: '26.2.2020', en: 'Feb 26, 2020' },
    sortDate: '2020-02-26',
    year: 2020,
    outlet: { he: 'הוושינגטון פוסט', en: 'The Washington Post' },
    // A real, direct article URL (not a search query) — located in the
    // 2026-08-13 summary-rewrite research pass, replacing the earlier
    // WAPO_2020_SEARCH_URL fallback. Still returns 403 to automated
    // fetching (paywall), but is a genuine permanent article page rather
    // than a synthesized search link.
    link: {
      kind: 'external',
      url: 'https://www.washingtonpost.com/world/middle_east/some-ultra-orthodox-jewish-women-in-israel-are-breaking-with-tradition-to-press-for-a-political-say/2020/02/26/02b6fd88-541c-11ea-80ce-37a8d4266c09_story.html',
    },
    note: {
      he: 'הכתבה עצמה חסומה בתשלום; תוכנה אומת דרך תוצאות חיפוש מאונדקסות בלבד.',
      en: 'The article itself is paywalled; its content was verified via search-indexed snippets only.',
    },
  },
  {
    slug: 'jpost-profile-2022',
    type: 'article',
    category: 'interview',
    sourceLanguage: 'en',
    title: {
      he: 'אסתי שושן: פמיניסטית ישראלית, אישה חרדית ליברלית שנלחמת למען שינוי',
      en: 'Esty Shushan: Israeli feminist, liberal haredi woman fighting for change',
    },
    summary: {
      he: 'פרופיל מאת מעיין ג\'אף-הופמן ב"ג\'רוזלם ריפורט" (מוסף של הג\'רוזלם פוסט) על אסתי שושן, המתוארת כסמל למתחים בקהילה חרדית משתנה אך חוששת משינוי. שושן, שהקימה ב-2012 את "לא נבחרות לא בוחרות" (מ-2015, נבחרות, הארגון הפמיניסטי החרדי הראשון בישראל): "להיות מבוקרת לא אומר שאני צריכה לעזוב את הקהילה שלי. זה אומר שאני צריכה להישאר ולנסות לתקן אותה"; "המשותף לכל המפלגות האלה הוא שאין בהן נשים בכלל". הכתבה מזכירה גם את עתירת 2015 שהובילה, שלוש שנים אחר כך, לניצחון בבג"ץ.',
      en: "A Jerusalem Report profile by Maayan Jaffe-Hoffman on Esty Shushan, emblematic of tensions in a slowly changing but change-averse Haredi community. Shushan, who launched \"No Voice, No Vote\" in 2012 (Nivcharot from 2015, Israel's first Haredi feminist organization): \"Being criticized does not mean I have to leave my community. It means I have to stay and try to fix it.\" \"The common thing about these parties is that they have no women at all.\" The piece also notes the 2015 petition that led, three years later, to a Supreme Court win.",
    },
    dateLabel: { he: '15.10.2022', en: 'Oct 15, 2022' },
    sortDate: '2022-10-15',
    year: 2022,
    outlet: { he: 'הג\'רוזלם פוסט · Jerusalem Report', en: 'The Jerusalem Post · Jerusalem Report' },
    link: { kind: 'external', url: 'https://www.jpost.com/jerusalem-report/article-719538' },
  },
  {
    slug: 'jpost-petition-2017',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'en',
    title: {
      he: 'עתירה לייצוג נשים חרדיות במפלגות החרדיות מתקדמת',
      en: 'Petition for Haredi women representation in Haredi parties advances',
    },
    summary: {
      he: 'כתבה מאת ג\'רמי שרון בג\'רוזלם פוסט (דצמבר 2017) על עתירה לייצוג נשים חרדיות בתוך המפלגות החרדיות עצמן. כותרת המשנה, שנותרה נגישה מעבר לחומת התשלום: "לנשים אין את היכולת להצטרף כחברות במפלגה חרדית, ולכן אין להן יכולת להחזיק בתפקיד רשמי במפלגה או להתמודד כמועמדות". גוף הכתבה עצמו חסום בתשלום ולא היה נגיש למחקר זה מעבר לכך.',
      en: 'A Jerusalem Post article by Jeremy Sharon (December 2017) on a petition for Haredi women\'s representation within the Haredi parties themselves. The subheadline, accessible past the paywall: "Women do not have the ability to join as Haredi party members so they do not have the ability to hold formal office within the party or stand as candidates." The article\'s body itself is paywalled and wasn\'t accessible beyond that.',
    },
    dateLabel: { he: 'דצמבר 2017', en: 'December 2017' },
    sortDate: '2017-12-20',
    year: 2017,
    outlet: { he: 'הג\'רוזלם פוסט', en: 'The Jerusalem Post' },
    link: {
      kind: 'external',
      url: 'https://www.jpost.com/Israel-News/Petition-for-Haredi-women-representation-in-haredi-parties-advances-518577',
    },
  },

  // ---- 2026-08-13 brief: "a more serious scan" — 21 further items found via
  // the old nivcharot.co.il site's own press-archive listing and Hebrew
  // Wikipedia citations, each independently re-verified against the
  // original outlet's own domain (not just the org's summary of it) before
  // being added here. A handful of found-but-unconfirmed leads (Local Call,
  // Mako, Actualik, and several broadcast-only mentions with no stable
  // article URL) were deliberately left out rather than included on
  // secondhand say-so.
  {
    slug: 'ynet-manifesto-2012',
    type: 'article',
    category: 'opinion',
    sourceLanguage: 'he',
    title: {
      he: 'לא נבחרות, לא בוחרות',
      en: '"Not Elected, Not Voting"',
    },
    summary: {
      he: 'מאמר הדעה המייסד של אסתי שושן ב-Ynet (דצמבר 2012) עוסק בכך שש"ס ויהדות התורה עיגנו את הדרת הנשים ממועמדות בסעיף תקנוני קבוע, ללא איסור הלכתי ממשי. ההצדקה "מקומה של האישה במקום אחר", לטענתה, נשענת על "קודים חברתיים" בלבד. המאמר מצביע על הפער שבין השניים: המפלגות מעסיקות נשים לתעמולה בטלוויזיה אך אינן מאפשרות להן קבלת החלטות: "נשים ראויות לפקח ולנהל... אבל חברת כנסת זה תפקיד השמור רק לגברים חרדים". המאמר קורא להימנעות מהצבעה עד שהמפלגות יכירו בזכות ההתמודדות, המניפסט שממנו צמחה נבחרות.',
      en: 'Esty Shushan\'s founding manifesto op-ed in Ynet (December 2012) addresses how Shas and United Torah Judaism enshrined women\'s exclusion from candidacy in a standing bylaw clause despite no real halachic prohibition. The "a woman\'s place is elsewhere" justification, she argues, rests on "social codes" alone. The piece points to the gap between the two: parties use women for TV campaign appearances but do not allow them decision-making power: "Women are worthy of supervising and managing... but Knesset member is a position reserved only for Haredi men." She calls for withholding votes until the parties recognize the right to run, the manifesto Nivcharot grew out of.',
    },
    dateLabel: { he: '31.12.2012', en: 'Dec 31, 2012' },
    sortDate: '2012-12-31',
    year: 2012,
    outlet: { he: 'Ynet', en: 'Ynet' },
    link: { kind: 'external', url: 'https://www.ynet.co.il/articles/0,7340,L-4326016,00.html' },
  },
  {
    slug: 'ynet-protest-profile-2013',
    type: 'article',
    category: 'interview',
    sourceLanguage: 'he',
    title: {
      he: 'מחאת הפעילה החרדית: בצמתים כן, ובכנסת לא?',
      en: '"The Ultra-Orthodox Activist\'s Protest: At the Junctions, Yes; In the Knesset, No?"',
    },
    summary: {
      he: 'כתבה מאת קובי נחשוני (ינואר 2013) על רות קוליאן, סטודנטית למשפטים, שהתנדבה לפעילות שטח בש"ס כדי לחשוף לדבריה סתירה: המפלגה מוכנה להיעזר בנשים ל"עבודה מלוכלכת" אך אוסרת את מועמדותן. קוליאן, שקיבלה ברכת ח"כ אריה דרעי על פעילותה: "לא צנוע שאישה תיכנס לבתים זרים, אבל לעשות עבודה מלוכלכת, להדביק מדבקות ולתלות שלטים, זה כן מקובל?". ש"ס הגיבה שנוכחות נשים בזירה הציבורית "מנוגדת למסורת היהודית".',
      en: 'A Kobi Nahshoni article (January 2013) profiles Rut Kolian, a law student who volunteered for Shas field work in order to expose, in her telling, a contradiction: the party is willing to use women for "dirty work" but bars their candidacy. Kolian, who received MK Aryeh Deri\'s blessing for her efforts: "It\'s not modest for a woman to enter strangers\' houses, but doing dirty work, sticking stickers on cars and hanging signs, that\'s acceptable?" Shas responded that women\'s presence in the public sphere "contradicts Jewish tradition."',
    },
    dateLabel: { he: '17.1.2013', en: 'Jan 17, 2013' },
    sortDate: '2013-01-17',
    year: 2013,
    outlet: { he: 'Ynet', en: 'Ynet' },
    link: { kind: 'external', url: 'https://www.ynet.co.il/articles/0,7340,L-4333573,00.html' },
  },
  {
    slug: 'bhol-rabbi-threat-2014',
    type: 'press-mention',
    category: 'controversy',
    sourceLanguage: 'he',
    title: {
      he: '"אישה לא תעז להתקרב למפלגה חילונית"',
      en: '"A Woman Would Not Dare Go Near a Secular Party"',
    },
    summary: {
      he: 'כתבה מאת אלי כהן (דצמבר 2014) מתעדת הצהרה של הרב מרדכי בלוי, בכיר ביהדות התורה, נגד נשים חרדיות הפונות למפלגות שלא בהנהגת "גדולי ישראל": מי שתעשה זאת "תצא בלא כתובה" ותיאסר על לימוד במוסדות הקהילה. בלוי: "אני ערב בלי נדר לקיים את כל הנ"ל, וזה חל גם על גברים"; מי שמתריס נגד גדולי ישראל, לדבריו, "אינו חרדי אמיתי". תיעוד ישיר של איום רבני כלפי פעילות מהסוג שנבחרות מייצגת.',
      en: 'An article by Eli Cohen (December 2014) documents a declaration by Rabbi Mordechai Bloi, a senior United Torah Judaism figure, against Haredi women approaching parties not led by the "great sages": a woman who does so, he said, "will leave without a ketubah" and be barred from communal education. Bloi: "I guarantee, without a vow, to enforce all of the above, and this applies to men as well"; anyone defying the sages, he added, "is not truly Haredi." A direct record of rabbinic threat aimed at the kind of activism Nivcharot represents.',
    },
    dateLabel: { he: '7.12.2014', en: 'Dec 7, 2014' },
    sortDate: '2014-12-07',
    year: 2014,
    outlet: { he: 'בחדרי חרדים', en: 'Behadrei Haredim' },
    link: { kind: 'external', url: 'https://www.bhol.co.il/news/160256' },
  },
  {
    slug: 'ynet-satire-poster-2014',
    type: 'press-mention',
    category: 'controversy',
    sourceLanguage: 'he',
    title: {
      he: 'אהה! הפמיניסטיות החרדיות בלבלו את החרדים',
      en: '"Aha! The Haredi Feminists Confused the Haredim"',
    },
    summary: {
      he: 'כתבה מאת קובי נחשוני (דצמבר 2014) על קמפיין פוסטרים סאטירי שהריצו תומכי "לא נבחרות לא בוחרות" בארבע ערים חרדיות, שחיקה בכוונה מודעות אמיתיות נגד שילוב נשים. האותיות הקטנות חשפו את הפרודיה. התרגיל הצליח יתר על המידה: כמה כלי תקשורת חרדיים, ובראשם כיכר השבת, לא זיהו את הסאטירה ופרסמו אותה כידיעה אמיתית, מה שהפך את המהלך עצמו לסיפור על תגובת התקשורת החרדית לקמפיין.',
      en: 'A Kobi Nachshoni article (December 2014) covers a satirical poster campaign run by "Lo Nivcharot Lo Bocharot" supporters in four Haredi cities, deliberately mimicking genuine anti-women-in-politics flyers, with the fine print revealing the parody. The prank worked too well: several Haredi outlets, Kikar HaShabat chief among them, mistook it for real news and published it as such, turning the stunt itself into a story about how Haredi media reacted to the campaign.',
    },
    dateLabel: { he: '25.12.2014', en: 'Dec 25, 2014' },
    sortDate: '2014-12-25',
    year: 2014,
    outlet: { he: 'Ynet', en: 'Ynet' },
    link: { kind: 'external', url: 'https://www.ynet.co.il/articles/0,7340,L-4607973,00.html' },
  },
  {
    slug: 'times-of-israel-bigger-role-2014',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'en',
    title: {
      he: 'החרדים בישראל שוקלים תפקיד גדול יותר לנשים',
      en: "Israel's ultra-Orthodox mull bigger role for women",
    },
    summary: {
      he: 'כתבה מאת טיה גולדנברג (דצמבר 2014) בוחנת תסיסה סביב ייצוג נשים חרדיות: מעל 20% מחברי הכנסת הן נשים, אך אף לא אחת מש"ס או יהדות התורה. שושן (בת 37 באותה עת): "יש מצב אבסורדי בישראל שבו נשים לא יכולות להתמודד עבור שתי מפלגות". הכתבה מזכירה גם את עדינה בר-שלום, בתו של הרב עובדיה יוסף, שדוחפת לשינוי מכיוון אחר. איומה לעבור מפלגה הוביל את ש"ס להקים מועצת נשים ולמנות אותה ליו"ר-שותפה.',
      en: "A Tia Goldenberg piece (December 2014) examines ferment over Haredi women's representation: over 20% of Knesset members are women, but none from Shas or United Torah Judaism. Shushan, then 37: \"There is an absurd situation in Israel where women cannot run for two political parties.\" The piece also notes Adina Bar-Shalom, Rabbi Ovadia Yosef's daughter, pushing for change from a different angle. Her threat to defect pushed Shas to create a women's advisory council and name her its co-chair.",
    },
    dateLabel: { he: '26.12.2014', en: 'Dec 26, 2014' },
    sortDate: '2014-12-26',
    year: 2014,
    outlet: { he: 'טיימס אוף ישראל', en: 'The Times of Israel' },
    link: { kind: 'external', url: 'https://www.timesofisrael.com/israels-ultra-orthodox-mull-bigger-role-for-women/' },
  },
  {
    slug: 'kikar-rabbi-ravitz-2015',
    type: 'press-mention',
    category: 'interview',
    sourceLanguage: 'he',
    title: {
      he: 'יצחק רביץ: "בכפוף להלכה, אישה יכולה להיות בכנסת"',
      en: 'Yitzchak Ravitz: "Subject to Halacha, a Woman Could Serve in the Knesset"',
    },
    summary: {
      he: 'ראיון מאת ישראל כהן (ינואר 2015), לציון שש שנים לפטירת ח"כ אברהם רביץ, עם בנו הרב יצחק רביץ, יו"ר דגל התורה. רביץ מציב את השאלה כשאלה הלכתית ולא עקרונית: נשים "עושות הכול, מנהלות בתי ספר ומנהלות חברות גדולות בהצלחה"; "הכנסת היא כמו ועד בית, אז אולי אישה כן יכולה לנהל אותה". אך מדגיש שאינו פוסק הלכה בעצמו ושהקביעה שייכת לגדולי התורה. קורא לקהילה "לעבוד קשה יותר" לשילוב אזרחים חרדים עובדים בכלל.',
      en: 'An Israel Cohen interview (January 2015), marking six years since MK Avraham Ravitz\'s death, with his son Rabbi Yitzchak Ravitz, chairman of Degel HaTorah. He frames the question as a halachic one rather than a matter of principle: women "do everything, manage schools and run large companies successfully"; "the Knesset is like a building committee, so maybe a woman could manage it". But stresses that he himself isn\'t a halachic decisor and that the ruling belongs to the Torah sages. He calls on the community more broadly to "work harder" at integrating working Haredi citizens.',
    },
    dateLabel: { he: '20.1.2015', en: 'Jan 20, 2015' },
    sortDate: '2015-01-20',
    year: 2015,
    outlet: { he: 'כיכר השבת', en: 'Kikar HaShabbat' },
    link: { kind: 'external', url: 'https://www.kikar.co.il/html/161700' },
  },
  {
    slug: 'kikar-women-speak-2015',
    type: 'article',
    category: 'interview',
    sourceLanguage: 'he',
    title: {
      he: 'לא נבחרות, לא בוחרות: נשים חרדיות מדברות',
      en: '"Lo Nivcharot, Lo Bocharot": Haredi Women Speak',
    },
    summary: {
      he: 'כתבה (פברואר 2015) הנותנת במה לנשים חרדיות שונות. שושן: "לא הייתי עושה צעד כזה, שגובה מחיר כבד, אם לא הייתי יודעת עד כמה זה הכרחי לאישה החרדית". טלי פרקש מסבירה שהמטרה "לשקף את הצרכים של הנשים החרדיות, כ-5% מהחברה". לצד הקולות התומכים מובאת גם עמדה ביקורתית מפי עו"ד רבקה שוורץ: "ההלכה קובעת בעניין הזה. אם מטרת הקמפיין היא לפתוח דלתות נעולות, הוא כבר הצליח". כתבה מרובת-נקודות-מבט, לא מגמתית לכיוון אחד.',
      en: 'A February 2015 feature gives voice to a range of Haredi women. Shushan: "I would not take such a step, one that carries a heavy price, had I not known how necessary it is for the Haredi woman." Tali Farkash explains the goal is "to reflect the needs of Haredi women, about 5% of society." Alongside supportive voices, the piece also carries a skeptical take from attorney Rebecca Schwartz: "Religious law determines this matter. If the campaign\'s goal is to open closed doors, it has already succeeded". A genuinely multi-perspective piece, not tilted toward one side.',
    },
    dateLabel: { he: '12.2.2015', en: 'Feb 12, 2015' },
    sortDate: '2015-02-12',
    year: 2015,
    outlet: { he: 'כיכר השבת', en: 'Kikar HaShabbat' },
    link: { kind: 'external', url: 'https://www.kikar.co.il/465/245580' },
  },
  {
    slug: 'kikar-opposition-oped-2015',
    type: 'article',
    category: 'controversy',
    sourceLanguage: 'he',
    title: {
      he: 'למה אני מתנגדת לקמפיין החרדיות לכנסת',
      en: 'Why I Oppose the Haredi-Women-to-Knesset Campaign',
    },
    summary: {
      he: 'טור דעה מאת שיפי חריטון (פברואר 2015) נגד הקמפיין, מפרט שלוש טענות: היעדר גיבוי רבני מפורש למהלך; טקטיקה שאינה מקובלת עליה: "אני רואה את הדרישה הלוחמנית של נשות הקמפיין וחושבת שהן פועלות כמו הגברים שאיתם הן נלחמות"; וטענה שהמסר מרחיק דווקא את הנשים החרדיות שהוא אמור לייצג. חריטון עצמה בעד קידום נשים חרדיות, אך דרך ערוצים אחרים ותוך היוועצות עם רבנים, התנגדות מפורטת ולא סתמית.',
      en: 'A Shiffi Chariton opinion column (February 2015) against the campaign lays out three arguments: no explicit rabbinic backing for the move; tactics she does not agree with: "I see the militant demand of the campaign\'s women and think they\'re acting like the men they\'re fighting"; and a claim that the messaging alienates the very Haredi women it claims to represent. Chariton herself favors advancing Haredi women, but through other, rabbi-consulted channels, a detailed objection, not a dismissive one.',
    },
    dateLabel: { he: '12.2.2015', en: 'Feb 12, 2015' },
    sortDate: '2015-02-12',
    year: 2015,
    outlet: { he: 'כיכר השבת', en: 'Kikar HaShabbat' },
    link: { kind: 'external', url: 'https://www.kikar.co.il/465/245571' },
  },
  {
    slug: 'kikar-funding-investigation-2015',
    type: 'article',
    category: 'controversy',
    sourceLanguage: 'he',
    title: {
      he: 'מי מממן את "לא נבחרות לא בוחרות"?',
      en: 'Who Funds "Lo Nivcharot Lo Bocharot"?',
    },
    summary: {
      he: 'כתבה חוקרת מאת אמילי עמרוסי (פברואר 2015) על מקורות המימון של הקמפיין: זיקת שתי מובילות למכון "שח"ר לפוליטיקה חדשה", הנתמך על ידי הקרן החדשה לישראל, רידר-אינדורסקי כעמיתת מחקר, איבנבוים לשעבר כחברת דירקטוריון. הקמפיין הכחיש כל תלות: "אף גוף לא מממן, מנהל או מפעיל אותנו"; הקרן החדשה לישראל השיבה בדומה: "אין שום קשר בינינו לקמפיין". כתבה שמטרתה המוצהרת לערער על עצמאות הקמפיין.',
      en: 'An Emily Amrosi investigation (February 2015) into the campaign\'s funding traces two leaders\' ties to the Shachar Institute for New Politics, backed by the New Israel Fund, Rieder-Indursky as a research fellow, Ivenboim a former board member. The campaign flatly denied any dependency: "No body funds, manages, or operates us"; the New Israel Fund answered similarly: "There is no connection between us and the campaign." An investigation whose evident aim is to cast doubt on the campaign\'s independence.',
    },
    dateLabel: { he: '22.2.2015', en: 'Feb 22, 2015' },
    sortDate: '2015-02-22',
    year: 2015,
    outlet: { he: 'כיכר השבת', en: 'Kikar HaShabbat' },
    link: { kind: 'external', url: 'https://www.kikar.co.il/465/245643' },
  },
  {
    slug: 'haaretz-bagatz-bylaws-2016',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'בג"ץ הורה לאגודת ישראל להסביר את הסעיף המפלה נשים בתקנון המפלגה',
      en: "High Court Orders Agudat Yisrael to Explain the Party Bylaw Clause Discriminating Against Women",
    },
    summary: {
      he: 'כתבה מאת ירדן סקופ (אוקטובר 2016) על צו על-תנאי המחייב את אגודת ישראל להסביר תוך 75 יום מדוע לא יבוטל סעיף 6, המגדיר חבר מפלגה כ"כל איש יהודי... השומר תורה ומצוות". השופט עוזי פוגלמן, שחתם על הצו: "ברור שאישה חרדית תתקשה לעמוד בפני המפלגה ולהיחשף". גוף הכתבה חסום בתשלום מעבר לפרטים אלה.',
      en: 'A Yarden Skop article (October 2016) covers a conditional order requiring Agudat Yisrael to justify, within 75 days, why Section 6 of its bylaws, defining a member as "every Jewish man... who observes Torah and mitzvot," shouldn\'t be struck. Justice Uzi Fogelman, who signed the order: "It is clear that a Haredi woman would find it difficult to stand before the party and be exposed." The article\'s body is paywalled beyond these details.',
    },
    dateLabel: { he: '28.10.2016', en: 'Oct 28, 2016' },
    sortDate: '2016-10-28',
    year: 2016,
    outlet: { he: 'הארץ', en: 'Haaretz' },
    link: {
      kind: 'external',
      url: 'https://www.haaretz.co.il/news/education/2016-10-28/ty-article/.premium/0000017f-dc8a-df62-a9ff-dcdf2f750000',
    },
    featured: true,
  },
  {
    slug: 'maariv-19-elections-2014',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'אחרי 19 מערכות בחירות של הדרה, לנשים החרדיות נמאס לשתוק',
      en: 'After 19 Elections of Exclusion, Haredi Women Are Done Staying Silent',
    },
    summary: {
      he: 'כתבה מאת תמר דרסלר, לקראת מערכת הבחירות של 2015, על יוזמה שכבר צברה למעלה מ-3,000 תומכות: "אם לא תשלבו אישה בשורותיכם, לא תקבלו את הפתק שלנו". הכתבה מזהה את שושן, קולנוענית ואם לארבעה, לצד מיכל צ\'רנוביצקי, איבנבוים ואסתי רידר-אינדורסקי, ומציינת ש-75.7% מהנשים החרדיות עובדות, לעומת אפס מושבים חרדיים בידי נשים. הרב מרדכי בלוי מאיים בסנקציות קהילתיות; גורם ביהדות התורה מבטל את הקמפיין כ"שוליים בתוך שוליים".',
      en: 'A Tamar Dressler article, ahead of the 2015 election, on an initiative that had already gathered over 3,000 supporters: "If you don\'t include a woman in your ranks, you won\'t get our vote." The piece names Shushan, a filmmaker and mother of four, alongside Michal Chernovitzky, Ivenboim, and Estee Rieder-Indursky, and notes that 75.7% of Haredi women work, against zero Haredi-party Knesset seats held by women. Rabbi Mordechai Bloi threatens communal sanctions; a UTJ official dismisses the campaign as "margins within the margins."',
    },
    // The article's own byline reads Dec. 9, 2014 — not July 2017 as this
    // item was previously filed (an error inherited from the org's own
    // archive listing). Re-dated, and the slug/sort position updated to
    // match, per the 2026-08-13 summary-rewrite research pass; the "19
    // elections" framing (looking ahead to the 20th Knesset, elected March
    // 2015) is itself consistent with a late-2014 date.
    dateLabel: { he: '9.12.2014', en: 'Dec 9, 2014' },
    sortDate: '2014-12-09',
    year: 2014,
    outlet: { he: 'מעריב', en: 'Maariv' },
    link: { kind: 'external', url: 'https://www.maariv.co.il/news/israel/article-456204' },
  },
  {
    slug: 'globes-bagatz-bylaws-2018',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'בג"ץ הורה למפלגת אגודת ישראל לשנות את התקנון המפלה נשים',
      en: 'High Court Orders Agudat Yisrael to Change the Party Bylaw Discriminating Against Women',
    },
    summary: {
      he: 'כתבה מאת טל שניידר (31.7.2018), סיקור מאותו יום ממש כמו כתבת כיכר השבת למעלה: הרכב מורחב של חמישה שופטים חייב את אגודת ישראל לתקן תוך 30 יום את הסעיף המונע חברות נשים, או למחקו. עו"ד נטע לוי, שייצגה את העותרות: "האווירה באולם הייתה חיובית מאוד... השופטים השאירו למפלגה אופציה סופית". טענת העתירה עצמה: "המפלגה, גם אם היא חרדית, אינה גוף דתי".',
      en: 'A Tal Schneider article (July 31, 2018), same-day coverage as the Kikar HaShabat item above: a five-justice panel ordered Agudat Yisrael to amend or strike, within 30 days, the clause barring women\'s membership. Attorney Neta Levi, who represented the petitioners: "The atmosphere in the courtroom was very positive... the judges left the party one final option." The petition\'s own argument: "The party, even if it is Haredi, is not a religious body."',
    },
    dateLabel: { he: '31.7.2018', en: 'July 31, 2018' },
    sortDate: '2018-07-31',
    year: 2018,
    outlet: { he: 'גלובס', en: 'Globes' },
    link: { kind: 'external', url: 'https://www.globes.co.il/news/article.aspx?did=1001248251' },
  },
  {
    slug: 'times-of-israel-court-urges-2018',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'en',
    title: {
      he: 'בית המשפט קורא למפלגה חרדית לאפשר לנשים להתמודד לתפקידים ציבוריים',
      en: 'Court Urges Ultra-Orthodox Party to Allow Women to Run for Public Office',
    },
    summary: {
      he: 'כתבת סגל בטיימס אוף ישראל (1.8.2018): בג"ץ הורה לאגודת ישראל לאפשר מועמדות נשים עד 2.9, אחרת "ניאלץ להוציא פסק דין". העתירה הוגשה על ידי תמר בן-פורת ועשרה ארגונים, בהם נבחרות, המוזכרת בשמה. שושן: "החלטה היסטורית... אנחנו מרגישות שקרה פה משהו גדול". עורך דין המפלגה הודה בבית המשפט: "אין בעיה הלכתית בייצוג נשים, אבל זה לא ראוי". רידר-אינדורסקי: "עבורנו זו לא 2018. זו 1918".',
      en: 'A Times of Israel staff report (August 1, 2018): the Court ordered Agudath Israel to allow women candidates by September 2, or "we will be forced to issue a legal ruling." The petition was filed by Tamar Ben-Porat and ten organizations, including Nivcharot, named directly. Shushan: "a historic decision... we feel something big happened today." The party\'s own lawyer conceded in court: "there is no halachic problem [with women\'s representation], but it is inappropriate." Rieder-Indursky: "For us it is not 2018. It is 1918."',
    },
    dateLabel: { he: '1.8.2018', en: 'Aug 1, 2018' },
    sortDate: '2018-08-01',
    year: 2018,
    outlet: { he: 'טיימס אוף ישראל', en: 'The Times of Israel' },
    link: {
      kind: 'external',
      url: 'https://www.timesofisrael.com/court-urges-ultra-orthodox-party-to-allow-women-to-run-for-public-office/',
    },
  },
  {
    slug: 'religion-news-partial-victory-2018',
    type: 'article',
    category: 'interview',
    sourceLanguage: 'en',
    title: {
      he: 'נשים חרדיות בישראל זוכות בניצחון חלקי במאבק על הזכות להתמודד לתפקידים',
      en: "Israel's Ultra-Orthodox Women Win Partial Victory in Fight to Run for Office",
    },
    summary: {
      he: 'כתבה מאת מישל חבין (אוגוסט 2018), הבנויה ברובה על ציטוטי שושן. שושן: "אנחנו הנשים מהוות 50 אחוז מהאוכלוסייה החרדית, אבל אין לנו גישה לשולחן קבלת ההחלטות"; "לנשים חרדיות מותר להיות משווקות, עורכות דין, עיתונאיות, אבל המקום היחיד שאליו הן לא יכולות להיכנס הוא פוליטיקה". על המחיר האישי: "יש אנשים בקהילה שמתעלמים מאיתנו או מבזים אותנו". ובכל זאת: "המפלגות ימצאו דרך לעקוף את זה, אבל אני מרגישה את השינוי".',
      en: 'A Michele Chabin article (August 2018), built largely around Shushan\'s own quotes. Shushan: "We women are 50 percent of the haredi population but we have no access at the decision-making table"; "Haredi women are allowed to become marketers, lawyers, journalists, but the one place they can\'t enter is politics." On the personal cost: "There are people in the community who either ignore us or shame us." Still: "The parties will find a way to get around it, but I feel the change in our community."',
    },
    dateLabel: { he: '24.8.2018', en: 'Aug 24, 2018' },
    sortDate: '2018-08-24',
    year: 2018,
    outlet: { he: 'Religion News Service', en: 'Religion News Service' },
    link: {
      kind: 'external',
      url: 'https://religionnews.com/2018/08/24/israels-ultra-orthodox-women-win-partial-victory-in-fight-to-run-for-office/',
    },
  },
  {
    slug: 'times-of-israel-ban-end-2018',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'en',
    title: {
      he: 'מפלגה חרדית קואליציונית תבטל את האיסור על נשים, אך אומרת שדבר לא ישתנה',
      en: 'Ultra-Orthodox Coalition Party to End Ban on Women, but Says Nothing Will Change',
    },
    summary: {
      he: 'כתבת סגל בטיימס אוף ישראל (4.9.2018): אגודת ישראל תבטל את הסעיף המונע חברות נשים, אך המפלגה עצמה מבהירה כי "השינוי בתקנון לא יוביל לשום שינוי מעשי בקבלה למפלגה", בעקבות הוראת בג"ץ ועתירת בן-פורת ועשרת הארגונים, בהם נבחרות. אסתי רידר-אינדורסקי, בראיון לערוץ i24: "עבורנו זו לא 2018. זו 1918", אזהרה שהניצחון המשפטי אינו ניצחון בפועל.',
      en: 'A Times of Israel staff report (September 4, 2018): Agudath Israel will remove the clause barring women\'s membership, but the party itself makes clear "the change in the regulations will not bring about any actual change in acceptance to the party," following the Court order and Ben-Porat\'s petition with the ten organizations, including Nivcharot. Estee Rieder-Indursky, in an i24 interview: "For us it is not 2018. It is 1918," a warning that the legal win isn\'t yet a real one.',
    },
    dateLabel: { he: '4.9.2018', en: 'Sept 4, 2018' },
    sortDate: '2018-09-04',
    year: 2018,
    outlet: { he: 'טיימס אוף ישראל', en: 'The Times of Israel' },
    link: {
      kind: 'external',
      url: 'https://www.timesofisrael.com/ultra-orthodox-party-to-end-ban-on-women-but-says-nothing-will-change/',
    },
  },
  {
    slug: 'hadassah-magazine-no-voice-2018',
    type: 'article',
    category: 'interview',
    sourceLanguage: 'en',
    title: {
      he: '"אין קול, אין הצבעה", כך אומרות נשים פמיניסטיות חרדיות בישראל',
      en: '"No Voice, No Vote," Say Feminist Haredi Women in Israel',
    },
    summary: {
      he: 'פרופיל מאת אטה פרינס-גיבסון (ספטמבר 2018) על נבחרות, שהקימו שושן (41) ורידר-אינדורסקי (44) שש שנים קודם לכן. בעקבות ניצחון הבג"ץ מ-31.7.2018, שושן: "ניצחנו! עשינו היסטוריה!"; רידר-אינדורסקי: "זה בשביל כל הנשים החרדיות!... הסופרג\'יסטיות האחרונות בעולם המודרני". הכתבה מתעדת גם את המחיר: קריאות רבניות לגירושין ללא מזונות, וילדים שגורשו מבתי ספר. סקר Hiddush מ-2016 מצוטט: 80% מהיהודים בישראל תומכים בעצם הזכות.',
      en: 'An Eetta Prince-Gibson profile (September 2018) of Nivcharot, founded by Shushan (41) and Rieder-Indursky (44) six years earlier. Following the July 31, 2018 court win, Shushan: "We won! We made history!"; Rieder-Indursky: "This is for all haredi women!... the last of the suffragists in the modern world." The piece also documents the cost: rabbinic calls for divorce without alimony, and children expelled from schools. A cited 2016 Hiddush survey: 80% of Israeli Jews support the right itself.',
    },
    dateLabel: { he: '5.9.2018', en: 'Sept 5, 2018' },
    sortDate: '2018-09-05',
    year: 2018,
    outlet: { he: 'Hadassah Magazine', en: 'Hadassah Magazine' },
    link: {
      kind: 'external',
      url: 'https://www.hadassahmagazine.org/2018/09/05/no-voice-no-vote-say-feminist-haredi-women-israel/',
    },
  },
  {
    slug: 'lady-globes-20-activists-2018',
    type: 'press-mention',
    category: 'interview',
    sourceLanguage: 'he',
    title: {
      he: 'ליידי גלובס מציג: 20 האקטיביסטיות המשפיעות בישראל, 2018',
      en: 'Lady Globes Presents: 20 Influential Female Activists in Israel, 2018',
    },
    summary: {
      he: 'ברשימת "ליידי גלובס: 20 האקטיביסטיות המשפיעות, 2018" מתוארת שושן כמובילת המאבק, וקוראת בעצמה להדרת הנשים החרדיות "טריטוריה גברית סגורה, מוצהרת ומגודרת": "אין שום סיבה הלכתית, אפילו לא תרבותית, שצריכה למנוע מאיתנו כל כך באופן מוחלט מהשתתפות בקבלת ההחלטות". היא מזהה כמה גורמים לכך: אפליה עדתית, כשלי הנהגה, אלימות במשפחה והשתקת פגיעה מינית, ומודה שנשים רבות תומכות בה בפרטיות בלבד, מחשש לחשיפה פומבית.',
      en: 'In Globes\' "Lady Globes: 20 Influential Activists, 2018," Shushan is profiled as leading the fight, and herself calls the exclusion of Haredi women "a closed, declared, and fenced-off male territory": "There is no halachic reason, not even a cultural one, that should prevent us so absolutely from participation in decision-making." She names several drivers: ethnic discrimination, leadership failures, domestic violence, and silenced abuse, and admits many women support her only privately, fearing public exposure.',
    },
    dateLabel: { he: '2018', en: '2018' },
    sortDate: '2018-06-01',
    year: 2018,
    outlet: { he: 'גלובס · ליידי גלובס', en: 'Globes · Lady Globes' },
    link: { kind: 'external', url: 'https://www.globes.co.il/news/home.aspx?fid=9880' },
    note: {
      he: 'תאריך פרסום מדויק אינו מוצג בעמוד; העמוד הנגיש מציג את הכתבה על שושן עצמה מתוך רשימת ה-20.',
      en: "No exact publish date is shown on the page; the accessible page shows Shushan's own entry from the list of 20.",
    },
  },
  {
    slug: 'globes-rappaport-prize-2019',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'הרשת החברתית: הוענק פרס רפפורט לנשים פורצות דרך',
      en: 'The Social Network: The Rappaport Prize for Trailblazing Women, Awarded',
    },
    summary: {
      he: 'כתבה מאת מיכל רז-חיימוביץ\' (11.3.2019) על טקס פרס רפפורט: שלושה פרסים בני 60,000 ₪, לד"ר נסיה לאנג, סיגל קנוטובסקי ואסתי שושן. אלונה בר-און, יו"ר גלובס, בנאום הטקס: "הוכחנו שנשים קיימות וראויות להכרה... אבל יש מחלה שנקראת צניעות, ביטול עצמי". הטקס במוזיאון תל אביב לאמנות שילב גם עיסוק במורשת פרידה קאלו וחשיפת דגם רכב לקסוס חדש, כתבה חברתית-אירועית ולא רק עיתונות מדיניות.',
      en: 'A Michal Raz-Chaimovich article (March 11, 2019) on the Rappaport Prize ceremony: three ₪60,000 awards, to Dr. Nasia Lang, Sigal Knutofsky, and Esty Shushan. Globes chair Alona Bar-On, in her ceremony remarks: "We proved that women exist and deserve recognition... but there\'s a disease called modesty, self-erasure." The Tel Aviv Museum of Art ceremony also touched on Frida Kahlo\'s legacy and unveiled a new Lexus model, society-pages coverage, not straight policy journalism.',
    },
    dateLabel: { he: '11.3.2019', en: 'March 11, 2019' },
    sortDate: '2019-03-11',
    year: 2019,
    outlet: { he: 'גלובס', en: 'Globes' },
    link: { kind: 'external', url: 'https://www.globes.co.il/news/article.aspx?did=1001277536' },
  },
  {
    slug: 'haaretz-en-feminist-revolt-2021',
    type: 'article',
    category: 'interview',
    sourceLanguage: 'en',
    title: {
      he: 'האישה הישראלית שמובילה מרד פמיניסטי בחברה החרדית',
      en: 'The Israeli Woman Leading a Feminist Revolt in Ultra-Orthodox Society',
    },
    summary: {
      he: 'פרופיל מאת ג\'ודי מלץ (3.11.2021), בזיקה לסרט התיעודי "אשת חיל". בפסקת הפתיחה, הנגישה מעבר לחומת התשלום: שושן, בכורה מבין 12 ילדים, גדלה בבית שאסר לימוד גמרא לבנות, וסופרה כילדה: "אל תטרידי את ראשך היפה בנושאים ששייכים רק לגברים", ובמקומם עודדו אותה לפתח "כישורי בישול ואפייה, כדי למצוא בעל טוב". גוף הכתבה חסום בתשלום מעבר לפתיחה זו.',
      en: 'A Judy Maltz profile (November 3, 2021), tied to the documentary "Women of Valor." In the accessible opening paragraph: Shushan, eldest of 12 children, grew up in a home that barred girls from Talmud study, and was told as a child: "Don\'t bother your pretty little head with subjects only men can understand," instead encouraged toward "cooking and baking skills, the better to find yourself a nice husband." The article is paywalled beyond this opening.',
    },
    dateLabel: { he: '3.11.2021', en: 'Nov 3, 2021' },
    sortDate: '2021-11-03',
    year: 2021,
    outlet: { he: 'Haaretz (מהדורה באנגלית)', en: 'Haaretz (English edition)' },
    link: {
      kind: 'external',
      url: 'https://www.haaretz.com/israel-news/2021-11-03/ty-article/.highlight/the-israeli-woman-leading-a-feminist-revolt-in-ultra-orthodox-society/0000017f-dbdb-d3ff-a7ff-fbfb31ab0000',
    },
  },
  {
    slug: 'ynet-laisha-divorcee-profile',
    type: 'article',
    category: 'interview',
    sourceLanguage: 'he',
    /** No exact publish date shown on the page itself; internal evidence (proximity to the "Women of Valor" HOT8 broadcast) points to roughly November 2021. */
    title: {
      he: 'אסתי שושן, שנאבקה על ייצוג חרדיות בכנסת: "אני נושאת את התואר גרושה בסבבה"',
      en: 'Esty Shushan, Who Fought for Haredi Women\'s Representation in the Knesset: "I Wear the Title Divorcée With Ease"',
    },
    summary: {
      he: 'פרופיל אישי מאת תהיה ברק (ככל הנראה נובמבר 2021, בסמוך לשידור "אשת חיל" בערוץ HOT8) על שושן, אז בת 44. "לא ידעתי אז שיום אחד אני אוביל תנועה פמיניסטית חרדית". הכתבה חושפת פרטים אישיים לא-פוליטיים: נישאה בגיל 18 וחצי, התגרשה תוך חמישה חודשים, נישאה שוב בגיל 19, ולאחר 25 שנה וארבעה ילדים נפרדה שוב בתקופת הסגר, בלי עורכי דין. שושן: "בזהות שלי אני חרדית בעומק הכי גדול. אני עדיין משלמת את מס החרדיות שלי". כיום מתגוררת ברעננה, שכונה חילונית, עם חתול.',
      en: 'A personal profile by Tahiya Barak (likely November 2021, around the "Women of Valor" broadcast on HOT8) of Shushan, then 44. "I didn\'t know back then that one day I\'d lead a Haredi feminist movement." The piece opens up non-political personal details: married at 18 and a half, divorced within five months, remarried at 19, and after 25 years and four children separated again during Covid lockdown, without lawyers. Shushan: "In my identity I am Haredi at the deepest level. I still pay my Haredi tax". Now living in secular Ra\'anana, with a cat.',
    },
    dateLabel: { he: 'בערך נובמבר 2021', en: 'c. November 2021' },
    sortDate: '2021-11-10',
    year: 2021,
    outlet: { he: 'Ynet · לאשה', en: 'Ynet · Laisha' },
    link: { kind: 'external', url: 'https://www.ynet.co.il/laisha/article/rkcvl80py' },
  },

  // ---- 2026-08-13 brief (third follow-up): "סריקה יותר רצינית... מאוקטובר
  // 2012" — a second, deeper research pass specifically covering October
  // 2012 onward (the campaign's real start, predating even the Dec 2012
  // manifesto above) and specifically hunting for opposition/controversy
  // coverage, not just sympathetic pieces. 32 further verified items below.
  // A larger set of leads the same research turned up were deliberately
  // left out: exact duplicates of items already in this file; a handful
  // whose only real-outlet URL came back truncated/incomplete (better to
  // omit than publish a link that might 404); several with no independent
  // outlet URL at all, only a same-origin nivcharot.co.il mirror (same
  // "real outbound link only" standard applied to the very first batch
  // above); one Reuters-wire piece that likely duplicates same-day ToI
  // coverage already listed; and one piece about Esty Shushan's film that
  // never actually mentions Nivcharot. Full accounting of what was left
  // out and why lives in this research pass's own report, not restated
  // item-by-item here.
  {
    slug: 'kikar-shoshan-parties-not-option-2012',
    type: 'article',
    category: 'opinion',
    sourceLanguage: 'he',
    title: {
      he: 'המפלגות החרדיות כבר לא אופציה',
      en: 'The Haredi Parties Are No Longer an Option',
    },
    summary: {
      he: 'אחד מטורי הדעה המוקדמים ביותר של אסתי שושן, מאוקטובר 2012, עוד לפני המניפסט מדצמבר אותה שנה שממנו נחשבת נבחרות לצמוח רשמית. הטור טוען שהמפלגות החרדיות הפכו לנציגות בלתי ראויות, המציעות רק הבטחות ל"עולם הבא" במקום טובות הנאה אמיתיות בהווה.',
      en: "One of Esty Shushan's earliest opinion columns, from October 2012, predating even the December manifesto of that year Nivcharot is usually dated from. The column argues the Haredi parties have become unfit representatives, offering only promises of \"the world to come\" instead of real present-day benefits.",
    },
    dateLabel: { he: '24.10.2012', en: 'Oct 24, 2012' },
    sortDate: '2012-10-24',
    year: 2012,
    outlet: { he: 'כיכר השבת', en: 'Kikar HaShabbat' },
    link: { kind: 'external', url: 'https://www.kikar.co.il/political-news/103575' },
  },
  {
    slug: 'kikar-shushan-vs-shas-2012',
    type: 'press-mention',
    category: 'controversy',
    sourceLanguage: 'he',
    // 2026-08-16 brief: name only in interview/opinion-category titles.
    title: {
      he: 'מייסדת נבחרות נגד מפלגת ש"ס',
      en: "Nivcharot's Founder vs. Shas",
    },
    summary: {
      he: 'כתבה מדצמבר 2012 שבה שושן אומרת במפורש כי ש"ס ויהדות התורה מתנהלות ב"הנהגה דו-פרצופית", וקוראת לנשים: "אל תצביעו למי שלא בוחר בכן".',
      en: 'A December 2012 piece in which Shushan says outright that Shas and United Torah Judaism practise "two-faced leadership," and calls on women voters: "do not vote for those who do not choose you."',
    },
    dateLabel: { he: '27.12.2012', en: 'Dec 27, 2012' },
    sortDate: '2012-12-27',
    year: 2012,
    outlet: { he: 'כיכר השבת', en: 'Kikar HaShabbat' },
    link: { kind: 'external', url: 'https://www.kikar.co.il/political-news/108006' },
  },
  {
    slug: 'mako-womens-representation-2012',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'הנשים החרדיות דורשות ייצוג בכנסת',
      en: 'Haredi Women Demand Representation in the Knesset',
    },
    summary: {
      he: 'כתבה מאת לירון שם (דצמבר 2012) על הגל הראשון של קמפיין "לא נבחרות – לא בוחרות", שהתפשט אז במאה שערים, אלעד ובני ברק.',
      en: 'A Liron Sham article (December 2012) on the earliest wave of the "Lo Nivcharot Lo Bocharot" campaign, then spreading through Meah Shearim, Elad, and Bnei Brak.',
    },
    dateLabel: { he: '25.12.2012', en: 'Dec 25, 2012' },
    sortDate: '2012-12-25',
    year: 2012,
    outlet: { he: 'Mako', en: 'Mako' },
    link: { kind: 'external', url: 'https://www.mako.co.il/news-elections-2013/articles/Article-a1e96149751db31006.htm' },
    note: {
      he: 'אתר Mako חוסם גישה אוטומטית לתוכן; הכותרת והכתובת אומתו דרך אינדוקס גוגל, ולא נשלפו ישירות.',
      en: "Mako blocks automated access to its content; the headline and URL were confirmed via Google's index rather than direct retrieval.",
    },
  },
  {
    slug: 'ynet-elad-womens-list-2013',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'לראשונה: מפלגת אמהות חרדיות באלעד',
      en: 'For the First Time: A Party of Haredi Mothers in Elad',
    },
    summary: {
      he: 'כתבה (ספטמבר 2013) על רשימה עירונית של נשים חרדיות בלבד שהתמודדה באלעד, תוך ציון שמועמדות נשים בערים חרדיות אחרות פרשו "בעקבות לחצים ואיומים", עדות לקושי הרחב יותר שממנו צמח מאבק הייצוג.',
      en: 'An article (September 2013) on an all-women Haredi municipal list running in Elad, noting that women candidates in other Haredi towns had withdrawn under "pressure and threats," evidence of the wider difficulty the representation struggle grew out of.',
    },
    dateLabel: { he: '29.9.2013', en: 'Sep 29, 2013' },
    sortDate: '2013-09-29',
    year: 2013,
    outlet: { he: 'Ynet', en: 'Ynet' },
    link: { kind: 'external', url: 'https://www.ynet.co.il/articles/0,7340,L-4434346,00.html' },
  },
  {
    slug: 'ynet-hiyon-mens-interest-2014',
    type: 'article',
    category: 'opinion',
    sourceLanguage: 'he',
    title: {
      he: 'גברים, ח"כית חרדית זה גם האינטרס שלכם',
      en: 'Men, a Haredi Woman MK Is Also in Your Interest',
    },
    summary: {
      he: 'טור דעה מאת אליעזר היון (דצמבר 2014), מפרי עטו של כותב גבר, הטוען שגברים חרדים צריכים לתמוך בייצוג נשי בכנסת כאינטרס משותף, ומצטט תקדימים היסטוריים של הכרה רבנית בזכות בחירה לנשים.',
      en: 'An Eliezer Hiyon opinion column (December 2014), written by a male commentator, argues Haredi men should support women\'s Knesset representation as a shared communal interest, citing historical precedent of rabbinic acceptance of women\'s suffrage.',
    },
    dateLabel: { he: '18.12.2014', en: 'Dec 18, 2014' },
    sortDate: '2014-12-18',
    year: 2014,
    outlet: { he: 'Ynet', en: 'Ynet' },
    link: { kind: 'external', url: 'http://www.ynet.co.il/articles/0,7340,L-4604884,00.html' },
  },
  {
    slug: 'kikar-shoshan-automatic-finger-2014',
    type: 'article',
    category: 'opinion',
    sourceLanguage: 'he',
    title: {
      he: 'נשים הן לא אצבע אוטומטית',
      en: 'Women Are Not an Automatic Vote',
    },
    summary: {
      he: 'טור דעה מאת אסתי שושן (דצמבר 2014) הטוען שנשים חרדיות אינן צריכות להיחשב "קול מובטח" עבור המפלגות שלהן, ושמגיע להן סוכנות אמיתית בבחירה הפוליטית.',
      en: 'An Esty Shushan opinion column (December 2014) argues Haredi women shouldn\'t be treated as an "automatic vote" for their parties, and deserve real agency in their political choices.',
    },
    dateLabel: { he: '5.12.2014', en: 'Dec 5, 2014' },
    sortDate: '2014-12-05',
    year: 2014,
    outlet: { he: 'כיכר השבת', en: 'Kikar HaShabbat' },
    link: { kind: 'external', url: 'https://www.kikar.co.il/haredim-news/158042' },
  },
  {
    slug: 'bhol-ravitz-investigation-2015',
    type: 'press-mention',
    category: 'controversy',
    sourceLanguage: 'he',
    title: {
      he: 'הפרקליטות שוקלת: חקירת הרב מרדכי בלוי',
      en: 'State Attorney Considers: Investigating Rabbi Mordechai Bloi',
    },
    summary: {
      he: 'כתבה מאת אלי שלזינגר (ינואר 2015) על בחינת סגן פרקליט המדינה אפשרות להעמדה לדין של הרב מרדכי בלוי, בעקבות איומיו הפומביים נגד נשים חרדיות המעורבות פוליטית.',
      en: 'An Eli Shlesinger article (January 2015) reports the Deputy State Attorney examining possible criminal charges against Rabbi Mordechai Bloi, over his public threats against Haredi women engaging politically.',
    },
    dateLabel: { he: '22.1.2015', en: 'Jan 22, 2015' },
    sortDate: '2015-01-22',
    year: 2015,
    outlet: { he: 'בחדרי חרדים', en: 'Behadrei Haredim' },
    link: { kind: 'external', url: 'https://www.bhol.co.il/news/164458' },
  },
  {
    slug: 'kolchai-ravitz-clarification-2015',
    type: 'press-mention',
    category: 'controversy',
    sourceLanguage: 'he',
    title: {
      he: 'בעקבות המהומה: רביץ שיגר מכתב הבהרה לחברי הכנסת',
      en: 'Following the Uproar: Ravitz Sent a Clarification Letter to Fellow MKs',
    },
    summary: {
      he: 'כתבה מאת ארי וידר (ינואר 2015) על מכתב הבהרה ששיגר ח"כ יצחק רביץ לחברי דגל התורה, לאחר הביקורת שספג. המכתב מאשר שהוא עדיין מתנגד לכהונת נשים ככנסת מטעמים הלכתיים, חרף הודאתו שנשים מסוגלות לתפקיד.',
      en: 'An Ari Vider article (January 2015) covers a clarification letter MK Yitzhak Ravitz sent to fellow Degel HaTorah MKs after facing backlash. The letter confirms he still opposes women serving as MKs on halakhic grounds, despite conceding women are capable of the role.',
    },
    dateLabel: { he: '22.1.2015', en: 'Jan 22, 2015' },
    sortDate: '2015-01-22',
    year: 2015,
    outlet: { he: 'קול חי', en: 'Kol Chai Radio' },
    link: { kind: 'external', url: 'https://www.emess.co.il/radio/165194/' },
  },
  {
    slug: 'saloona-shushan-interview-2015',
    type: 'article',
    category: 'interview',
    sourceLanguage: 'he',
    title: {
      he: 'לא נבחרות לא בוחרות - יש פמיניזם חרדי',
      en: '"Lo Nivcharot Lo Bocharot" - There Is Such a Thing as Haredi Feminism',
    },
    summary: {
      he: 'ראיון מאת יעל ברזילי (מרץ 2015) עם אסתי שושן על הבחירה לפעול בתוך המפלגות הקיימות במקום להקים מפלגת נשים נפרדת; שושן משתפת גם בביקורת שספגה מפמיניסטיות מזרחיות ומקורבות לש"ס.',
      en: 'A Yael Barzilai interview (March 2015) with Esty Shushan on the choice to work within existing parties rather than found a separate women\'s party; Shushan also discusses criticism she faced from Mizrahi feminists and Shas-aligned circles.',
    },
    dateLabel: { he: '15.3.2015', en: 'Mar 15, 2015' },
    sortDate: '2015-03-15',
    year: 2015,
    outlet: { he: 'סלונה', en: 'Saloona' },
    link: { kind: 'external', url: 'http://saloona.co.il/yaelbapina/2015/03/15/lonilobo/' },
  },
  {
    slug: 'kikar-shoshan-rebuttal-amrusi-2015',
    type: 'article',
    category: 'controversy',
    sourceLanguage: 'he',
    title: {
      he: 'אמילי עמרוסי פרסמה רמיזות שקריות',
      en: 'Emily Amrusi Published False Insinuations',
    },
    summary: {
      he: 'תגובתה הישירה של אסתי שושן (פברואר 2015) לטענות העיתונאית אמילי עמרוסי בדבר מימון נסתר לקמפיין. שושן מכחישה כל תלות ארגונית ומאיימת בתביעת דיבה. פרסום נפרד מכתבת החקירה המקורית של עמרוסי, המתועדת בנפרד בארכיון זה.',
      en: "Esty Shushan's direct rebuttal (February 2015) to journalist Emily Amrusi's claims of hidden campaign funding. Shushan denies any organizational dependency and threatens defamation action. A separate publication from Amrusi's original investigative piece, documented separately in this archive.",
    },
    dateLabel: { he: '22.2.2015', en: 'Feb 22, 2015' },
    sortDate: '2015-02-22',
    year: 2015,
    outlet: { he: 'כיכר השבת', en: 'Kikar HaShabbat' },
    link: { kind: 'external', url: 'https://www.kikar.co.il/465/245642' },
  },
  {
    slug: 'kikar-tedx-2015',
    type: 'article',
    category: 'interview',
    sourceLanguage: 'he',
    title: {
      he: 'לראשונה: אישה חרדית על בימת TED',
      en: 'For the First Time: A Haredi Woman on the TED Stage',
    },
    summary: {
      he: 'כתבה מאת יערית אלבז (מאי 2015) על הרצאת ה-TEDxJerusalem של אסתי שושן, הראשונה מסוגה מפי אישה חרדית, שבה סיפרה את סיפור הקמת התנועה.',
      en: "A Yearit Albaz article (May 2015) covers Shushan's TEDxJerusalem talk, the first ever by a Haredi woman, in which she recounted the movement's founding story.",
    },
    dateLabel: { he: '28.5.2015', en: 'May 28, 2015' },
    sortDate: '2015-05-28',
    year: 2015,
    outlet: { he: 'כיכר השבת', en: 'Kikar HaShabbat' },
    link: { kind: 'external', url: 'https://www.kikar.co.il/465/246041' },
  },
  {
    slug: 'walla-haredi-feminism-launch-2015',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'הפמיניזם החרדי יצא לדרך',
      en: 'Haredi Feminism Has Launched',
    },
    summary: {
      he: 'ניתוח מאת רויטל אמירן (פברואר 2015) הטוען שקמפיין "לא נבחרות לא בוחרות" מסמן נקודת מפנה בלתי הפיכה: השתתפותן הגוברת של נשים חרדיות בשוק העבודה הופכת את הדרתן הפוליטית לבלתי ניתנת להחזקה עוד. הכתבה מכנה את הקמפיין "הירייה הפותחת של הפמיניזם החרדי".',
      en: 'An analysis by Roytal Amiran (February 2015) argues the "Lo Nivcharot Lo Bochrot" campaign marks an irreversible turning point: Haredi women\'s growing workforce participation is making their political exclusion increasingly untenable. The piece calls the campaign "the opening salvo of Haredi feminism."',
    },
    dateLabel: { he: '12.2.2015', en: 'Feb 12, 2015' },
    sortDate: '2015-02-12',
    year: 2015,
    outlet: { he: 'וואלה', en: 'Walla' },
    link: { kind: 'external', url: 'http://elections.walla.co.il/item/2829181' },
  },
  {
    slug: 'walla-cherem-retrospective-2016',
    type: 'article',
    category: 'controversy',
    sourceLanguage: 'he',
    title: {
      he: 'חרם חרם תרדוף: הנשק של החרדים - שמבטיח ציות לכללי הרבנים',
      en: 'Boycott, Boycott, Shalt Thou Pursue: The Haredi Weapon That Guarantees Obedience to Rabbinic Rules',
    },
    summary: {
      he: 'כתבה מקיפה מאת יאקי אדמקר (אוקטובר 2016), מבט לאחור על ניסיון הנידוי הקהילתי נגד שושן: בכירים חרדים איימו על מעמדם הלימודי של ילדיה, ושושן העבירה אותם מראש לבתי ספר חלופיים. שושן: "הם הבינו שאין להם נשק", לאחר שהאיום נכשל בהשתקתה.',
      en: 'A comprehensive Yaki Adamker article (October 2016), a retrospective look at the attempted communal boycott (cherem) against Shushan: Haredi officials threatened her children\'s educational placement, and she preemptively moved them to alternative schools. Shushan: "They realized they had no weapon," once the threat failed to silence her.',
    },
    dateLabel: { he: '11.10.2016', en: 'Oct 11, 2016' },
    sortDate: '2016-10-11',
    year: 2016,
    outlet: { he: 'וואלה', en: 'Walla' },
    link: { kind: 'external', url: 'https://news.walla.co.il/item/3004524' },
  },
  {
    slug: 'mekomit-shushan-revolution-2017',
    type: 'article',
    category: 'opinion',
    sourceLanguage: 'he',
    title: {
      he: 'כך נראית מהפכה: מנהיגות המאבקים שמטלטלים את סדר היום החרדי',
      en: 'This Is What a Revolution Looks Like: The Women Leading the Struggles Shaking Up the Haredi Agenda',
    },
    summary: {
      he: 'טור אורח מאת אסתי שושן (אפריל 2017) הממקם את נבחרות בתוך גל רחב יותר של מאבקי נשים חרדיות פנימיים: על אפליית שכר, ניצולות הטרדה, עובדות מעונות יום, ומזכיר את שרה שנירר כסמל היסטורי למהפכה חינוכית-נשית קודמת.',
      en: 'A guest column by Esty Shushan (April 2017) situates Nivcharot within a wider wave of internal Haredi women\'s struggles: wage discrimination, harassment survivors, daycare workers, invoking Sarah Schenirer as a historical symbol of an earlier women\'s educational revolution.',
    },
    dateLabel: { he: '26.4.2017', en: 'Apr 26, 2017' },
    sortDate: '2017-04-26',
    year: 2017,
    outlet: { he: 'מקומית', en: 'Mekomit' },
    link: { kind: 'external', url: 'https://mekomit.co.il/%D7%9B%D7%A0%D7%A1-%D7%A0%D7%91%D7%97%D7%A8%D7%95%D7%AA/' },
  },
  {
    slug: 'timesofisrael-blogs-strichman-2018',
    type: 'article',
    category: 'opinion',
    sourceLanguage: 'en',
    title: {
      he: 'אין קול, אין הצבעה',
      en: 'No Voice, No Vote',
    },
    summary: {
      he: 'טור דעה מאת נשי סטריכמן (יולי 2018) בבלוגים של טיימס אוף ישראל, מתחקה אחר הקמת נבחרות, פנייתה לבג"ץ ולאו"ם, ומצייר מקבילה למאבק הסופרג\'יסטיות.',
      en: "A Nancy Strichman opinion column (July 2018) on The Times of Israel's blogs traces Nivcharot's founding, its Supreme Court and UN advocacy, and draws a suffragette-movement parallel.",
    },
    dateLabel: { he: '9.7.2018', en: 'Jul 9, 2018' },
    sortDate: '2018-07-09',
    year: 2018,
    outlet: { he: 'בלוגים של טיימס אוף ישראל', en: 'The Times of Israel Blogs' },
    link: { kind: 'external', url: 'https://blogs.timesofisrael.com/no-voice-no-vote/' },
  },
  {
    slug: 'globes-bylaws-amendment-2019',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'בלחץ בג"ץ: אישה תוכל להתקבל כחברה למפלגת אגודת ישראל',
      en: 'Under Court Pressure: A Woman Can Now Join Agudat Yisrael as a Member',
    },
    summary: {
      he: 'כתבה מאת מנחם שטאוב (ינואר 2019) המדווחת על התיקון הפורמלי בתקנון אגודת ישראל, הסרת המילה "איש" מסעיף החברות, בעקבות הלחץ מבג"ץ. שלב מאוחר ונפרד מהוראת בית המשפט מיולי 2018 שכבר מתועדת בארכיון זה: כאן מדובר בשינוי התקנון בפועל.',
      en: "A Menahem Staub article (January 2019) reports on Agudat Yisrael's formal bylaw amendment, removing the word \"man\" from its membership clause, under Supreme Court pressure. A later, distinct procedural stage from the July 2018 court order already covered elsewhere in this archive: this is the actual bylaw change taking effect.",
    },
    dateLabel: { he: '10.1.2019', en: 'Jan 10, 2019' },
    sortDate: '2019-01-10',
    year: 2019,
    outlet: { he: 'גלובס', en: 'Globes' },
    link: { kind: 'external', url: 'https://www.globes.co.il/news/article.aspx?did=1001268610' },
  },
  {
    slug: 'ynet-shoshan-violence-against-women-2019',
    type: 'article',
    category: 'opinion',
    sourceLanguage: 'he',
    title: {
      he: 'פוליטיקאים חרדים, תכירו: אלימות נגד נשים',
      en: 'Haredi Politicians, Meet: Violence Against Women',
    },
    summary: {
      he: 'טור דעה מאת אסתי שושן (ינואר 2019) הטוען שחברי כנסת חרדים נמנעים באופן שיטתי מקידום חקיקה נגד אלימות במשפחה ותקיפה מינית, ומקשר זאת ישירות להיעדר נשים ברשימות המפלגות החרדיות.',
      en: 'An Esty Shoshan opinion column (January 2019) argues Haredi MKs systematically avoid advancing domestic-violence and sexual-assault legislation, and ties this directly to the absence of women on Haredi party lists.',
    },
    dateLabel: { he: '9.1.2019', en: 'Jan 9, 2019' },
    sortDate: '2019-01-09',
    year: 2019,
    outlet: { he: 'Ynet', en: 'Ynet' },
    link: { kind: 'external', url: 'https://www.ynet.co.il/articles/0,7340,L-5443751,00.html' },
  },
  {
    slug: 'timesofisrael-blogs-pellach-2019',
    type: 'article',
    category: 'opinion',
    sourceLanguage: 'en',
    title: {
      he: 'אין קול, אין הצבעה',
      en: 'No Voice, No Vote',
    },
    summary: {
      he: 'טור נוסף תחת אותה כותרת, מאת פטה ג\'ונס פלאך (ינואר 2019), סוקר את סיסמת נבחרות ואת ניצחונותיה המשפטיים נגד סעיפי תקנון מפלים; מצטט את אסתי רידר-אינדורסקי על ההשוואה לתנועת הסופרג\'יסטיות.',
      en: "A separate column under the same title, by Peta Jones Pellach (January 2019), covers Nivcharot's slogan and its legal wins against discriminatory bylaw clauses; quotes co-activist Estee Rieder-Indursky on the suffragist comparison.",
    },
    dateLabel: { he: '11.1.2019', en: 'Jan 11, 2019' },
    sortDate: '2019-01-11',
    year: 2019,
    outlet: { he: 'בלוגים של טיימס אוף ישראל', en: 'The Times of Israel Blogs' },
    link: { kind: 'external', url: 'https://blogs.timesofisrael.com/no-voice-no-vote-2/' },
  },
  {
    slug: 'ynet-nishalel-agudat-compliance-2019',
    type: 'article',
    category: 'opinion',
    sourceLanguage: 'he',
    title: {
      he: 'אגודת ישראבלוף והצפצוף החרדי על נשים',
      en: 'The "Agudat Yisrabluff" and the Haredi Shrug at Women',
    },
    summary: {
      he: 'טור דעה חד מאת אורית לוי נשלל (פברואר 2019) הטוען ש"ציות" אגודת ישראל לתיקון התקנון היה קוסמטי בלבד. הטור מזכה במפורש את נבחרות ואת אסתי שושן בכפיית הנושא לסדר היום, ושואל מה בעצם מפחיד את ההנהגה החרדית במעורבות אזרחית של נשים.',
      en: "A sharp Orit Levi Nishalel opinion column (February 2019) argues Agudat Yisrael's bylaw \"compliance\" was cosmetic. The column explicitly credits Nivcharot and Esty Shushan with forcing the issue onto the agenda, and asks what exactly Haredi leadership fears about women's civic involvement.",
    },
    dateLabel: { he: '7.2.2019', en: 'Feb 7, 2019' },
    sortDate: '2019-02-07',
    year: 2019,
    outlet: { he: 'Ynet', en: 'Ynet' },
    link: { kind: 'external', url: 'https://www.ynet.co.il/articles/0,7340,L-5459540,00.html' },
  },
  {
    slug: 'srugim-survey-2019',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'שליש מהחרדים: לא נצביע למפלגה ללא נשים',
      en: "A Third of Haredim: We Won't Vote for a Party Without Women",
    },
    summary: {
      he: 'כתבה (פברואר 2019) על סקר טלפוני של מכון גיאוקרטוגרפיה: כ-40% מהנשים החרדיות וכ-33% מהגברים החרדים משיבים שלא יצביעו למפלגה שמדירה נשים ממועמדות. 79% מהציבור הכללי תומך בעמדה הזו.',
      en: "An article (February 2019) on a Geocartography Institute phone survey: roughly 40% of Haredi women and 33% of Haredi men say they won't vote for a party that bars women from candidacy. 79% of the general public agrees.",
    },
    dateLabel: { he: '21.2.2019', en: 'Feb 21, 2019' },
    sortDate: '2019-02-21',
    year: 2019,
    outlet: { he: 'סרוגים', en: 'Srugim' },
    link: { kind: 'external', url: 'https://www.srugim.co.il/316606' },
  },
  {
    slug: 'onlife-survey-2019',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'סקר: 39% מהנשים החרדיות ו-33% מהגברים החרדים לא יצביעו למפלגות המדירות נשים',
      en: "Survey: 39% of Haredi Women and 33% of Haredi Men Won't Vote for Parties That Exclude Women",
    },
    summary: {
      he: 'כתבה בבלינת אסתי שושן עצמה (בערך פברואר 2019) על אותו סקר גיאוקרטוגרפיה, מזווית של כלי תקשורת נוסף: 59% מכלל הציבור הישראלי היו רוצים לראות נשים חרדיות כחברות כנסת.',
      en: "An article bylined by Esty Shushan herself (approx. February 2019) on the same Geocartography survey, from a second outlet: 59% of the general Israeli public said they would like to see Haredi women serving as MKs.",
    },
    dateLabel: { he: 'פברואר 2019', en: 'Feb 2019' },
    sortDate: '2019-02-15',
    year: 2019,
    outlet: { he: 'Onlife', en: 'Onlife' },
    link: { kind: 'external', url: 'https://www.onlife.co.il/news/politics/185089' },
  },
  {
    slug: 'atmag-shushan-benporat-2019',
    type: 'article',
    category: 'interview',
    sourceLanguage: 'he',
    title: {
      he: 'אסתי שושן ותמר בן פורת מוכיחות שקיים פמיניזם חרדי',
      en: 'Esty Shushan and Tamar Ben Porat Prove Haredi Feminism Exists',
    },
    summary: {
      he: 'פרופיל מאת הדס בשן (מרץ 2019) על שושן לצד עורכת הדין החילונית תמר בן-פורת, ששתיהן הובילו יחד את השינוי בתקנון אגודת ישראל.',
      en: 'A Hadas Bashan profile (March 2019) of Shushan alongside secular attorney Tamar Ben Porat, who together drove the Agudat Yisrael bylaw change.',
    },
    dateLabel: { he: '5.3.2019', en: 'Mar 5, 2019' },
    sortDate: '2019-03-05',
    year: 2019,
    outlet: { he: 'את מגזין', en: 'At Magazine' },
    link: { kind: 'external', url: 'https://www.atmag.co.il/%D7%90%D7%A1%D7%AA%D7%99-%D7%A8%D7%99%D7%93%D7%A8-%D7%AA%D7%9E%D7%A8-%D7%91%D7%9F-%D7%A4%D7%95%D7%A8%D7%AA/' },
  },
  {
    slug: 'themarker-black-panthers-2020',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'פנתרות שחורות: לנשים החרדיות נמאס, אז הן החליטו לצאת למלחמה',
      en: 'Black Panthers: Haredi Women Got Fed Up, So They Went to War',
    },
    summary: {
      he: 'כתבה מאת חגי עמית (פברואר 2020) המציגה כמה פעילות חרדיות: שושן, אסתר טברסקי, תרצה בלוך-אסתרזון, הילה חסן-לפקוביץ, אפרת שוקרון ויעל אלימלך, כמפרנסות עיקריות במשפחותיהן הנלחמות בהדרה. הכתבה מסגרת את הנכונות שלהן להסתכן בנידוי דתי כמחיר המאבק.',
      en: 'A Hagai Amit article (February 2020) profiles several Haredi women activists: Shushan, Ester Tavarski, Tirtza Bloch-Estherzon, Hila Hasan-Lefkowitz, Efrat Shokron, and Yael Elimelech, as primary breadwinners fighting exclusion. The piece frames their willingness to risk religious ostracism as the price of the struggle.',
    },
    dateLabel: { he: '14.2.2020', en: 'Feb 14, 2020' },
    sortDate: '2020-02-14',
    year: 2020,
    outlet: { he: 'דה מרקר', en: 'TheMarker' },
    link: { kind: 'external', url: 'https://www.themarker.com/markerweek/.premium-MAGAZINE-1.8530530' },
  },
  {
    slug: 'ynet-chairs-protest-2019',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: '"מחאת הכיסאות" של החרדיות: "אנחנו שקופות"',
      en: 'The Haredi Women\'s "Chairs Protest": "We Are Invisible"',
    },
    summary: {
      he: 'כתבה מאת יצחק טסלר (ספטמבר 2019) על "מחאת הכיסאות" של נבחרות לקראת מערכת הבחירות: ספסלים מסומנים "לגברים בלבד", כאשר פעילות מתארות הטרדה כשניסו לשוחח עם חברי כנסת חרדים.',
      en: 'A Yitzhak Tessler article (September 2019) covers Nivcharot\'s "chairs protest" ahead of the election: benches labeled "for men only," with activists describing harassment when trying to engage Haredi MKs directly.',
    },
    dateLabel: { he: '12.9.2019', en: 'Sep 12, 2019' },
    sortDate: '2019-09-12',
    year: 2019,
    outlet: { he: 'Ynet', en: 'Ynet' },
    link: { kind: 'external', url: 'https://www.ynet.co.il/articles/0,7340,L-5587296,00.html' },
  },
  {
    slug: 'maariv-shuteland-2021',
    type: 'article',
    category: 'interview',
    sourceLanguage: 'he',
    title: {
      he: 'מה שרואים כיום זה לא המראות של החברה החרדית',
      en: "What We See Today Isn't the Mirror of Haredi Society",
    },
    summary: {
      he: 'כתבה מאת אילנה שוטלנד (ינואר 2021) עם מנהיגות דעה חרדיות צעירות בעקבות מהומות הסגר בבני ברק; שושן, מוצגת כ"בת 43, מייסדת ומנכ"לית נבחרות", טוענת שההנהגה הפוליטית החרדית צריכה להפעיל לחץ על הסמכות הרבנית באותו אופן שבו היא מגייסת בוחרים.',
      en: 'An Ilana Shuteland article (January 2021) with young Haredi opinion-leaders following the COVID-lockdown riots in Bnei Brak; Shushan, identified as "43, founder and director of Nivcharot," argues Haredi political leadership should pressure rabbinic authority the same way it mobilizes voters.',
    },
    dateLabel: { he: '26.1.2021', en: 'Jan 26, 2021' },
    sortDate: '2021-01-26',
    year: 2021,
    outlet: { he: 'מעריב', en: 'Maariv' },
    link: { kind: 'external', url: 'https://www.maariv.co.il/corona/corona-israel/Article-817565' },
  },
  {
    slug: 'shakuf-mens-only-parties-2021',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'בישראל 2021 עדיין רצות לכנסת מפלגות לגברים בלבד',
      en: 'In Israel 2021, Men-Only Parties Are Still Running for Knesset',
    },
    summary: {
      he: 'כתבה מאת יעל פינקלשטיין (ינואר 2021), לקראת מערכת הבחירות, מצטטת את שושן (מוצגת כמנכ"לית נבחרות) המתארת "מדיניות ממושכת ומכוונת" שמדירה נשים ממשאבים וממוקדי קבלת החלטות.',
      en: 'A Yael Finkelstein article (January 2021), ahead of the election, quotes Shushan (identified as Nivcharot\'s director) describing "a deliberate, long-standing policy" that excludes women from resources and decision-making.',
    },
    dateLabel: { he: '26.1.2021', en: 'Jan 26, 2021' },
    sortDate: '2021-01-26',
    year: 2021,
    outlet: { he: 'שקוף', en: 'Shakuf' },
    link: { kind: 'external', url: 'https://shakuf.co.il/15231' },
  },
  {
    slug: 'davar-daycare-cuts-2021',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'מומחים ופעילים חרדים נגד הקיצוץ במעונות היום',
      en: 'Haredi Experts and Activists Against the Daycare Subsidy Cut',
    },
    summary: {
      he: 'כתבה (יולי 2021) על התנגדות לקיצוץ מתוכנן בסבסוד מעונות יום. שושן טוענת שהקיצוץ פוגע בדיוק במי שהכי זקוקות לו, וקוראת להפניית התקציב לחיזוק לימודי הליבה בבתי ספר ממלכתיים-חרדיים במקום.',
      en: 'An article (July 2021) on opposition to a proposed daycare-subsidy cut. Shushan argues the cut hurts exactly the women who need it most, and calls instead for the budget to support core-curriculum studies in Haredi state schools.',
    },
    dateLabel: { he: '8.7.2021', en: 'Jul 8, 2021' },
    sortDate: '2021-07-08',
    year: 2021,
    outlet: { he: 'דבר', en: 'Davar' },
    link: { kind: 'external', url: 'https://www.davar1.co.il/319087/' },
  },
  {
    slug: 'timesofisrael-blogs-levypaz-2021',
    type: 'article',
    category: 'opinion',
    sourceLanguage: 'en',
    title: {
      he: 'אז איך, למעשה, מתנהגות נשים חרדיות?',
      en: 'So How, in Fact, Do Haredi Women Behave?',
    },
    summary: {
      he: 'טור מאת גיתית לוי-פז (דצמבר 2021) הטוען שנבחרות מייצגת פמיניזם חרדי אותנטי שצומח מבפנים, ולא שינוי הנכפה מבחוץ, בהתייחסות לסרט התיעודי על התנועה.',
      en: 'A Gitit Levy-Paz column (December 2021) argues Nivcharot represents genuine internal Haredi feminism rather than externally-imposed change, referencing the documentary made about the movement.',
    },
    dateLabel: { he: '3.12.2021', en: 'Dec 3, 2021' },
    sortDate: '2021-12-03',
    year: 2021,
    outlet: { he: 'בלוגים של טיימס אוף ישראל', en: 'The Times of Israel Blogs' },
    link: { kind: 'external', url: 'https://blogs.timesofisrael.com/so-how-in-fact-do-haredi-women-behave/' },
  },
  {
    slug: 'ynet-decade-retrospective-2025',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: '"יבוא יום וזה יקרה": מתי נראה נשים במפלגות חרדיות?',
      en: '"A Day Will Come and It Will Happen": When Will We See Women in Haredi Parties?',
    },
    summary: {
      he: 'כתבה מאת אליעזר היון (מרץ 2025), מבט לאחור עשור: הישגי נבחרות המוקדמים בכפיית שינויי תקנון, לצד העובדה שעדיין לא נבחרה אף אישה ממפלגה חרדית לכנסת. הכתבה מציינת שינוי בזירה המוניציפלית: 14 נשים חרדיות התמודדו לאחרונה בבחירות מקומיות, שתיים נבחרו.',
      en: "An Eliezer Hiyon article (March 2025), a decade-later retrospective: Nivcharot's early wins forcing bylaw changes, alongside the fact that no woman has yet been elected to the Knesset from a Haredi party. The piece notes movement at the municipal level: 14 Haredi women recently ran in local elections, two won.",
    },
    dateLabel: { he: '23.3.2025', en: 'Mar 23, 2025' },
    sortDate: '2025-03-23',
    year: 2025,
    outlet: { he: 'Ynet', en: 'Ynet' },
    link: { kind: 'external', url: 'https://www.ynet.co.il/judaism/discourse/article/ryqcled2je' },
    featured: true,
  },

  // ---- 2026-08-14 brief: "בנה רשימת מילות חיפוש... וסרוק את כל הרשת" — a
  // third, keyword-driven research pass covering outlets and years the
  // first two passes hadn't reached (Mako/N12, Israel Hayom, 103fm,
  // Makor Rishon more thoroughly, and the film-release press cluster
  // around "חשבונות שמיים" in Feb 2026). 28 further verified items below,
  // each independently fetched before being added; one duplicate the same
  // sweep turned up (a second copy of the already-listed Dec 2012 Mako
  // piece) was dropped rather than double-counted.
  {
    slug: 'mako-uvda-ilana-dayan-2015',
    type: 'video',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'זה מסוכן מה שאנחנו עושות פה',
      en: "It's Dangerous What We're Doing Here",
    },
    summary: {
      he: 'כתבת תחקיר נרחבת בתוכנית "עובדה" של אילנה דיין (ערוץ 12) מאת בן שני (פברואר 2015), העוקבת אחר שושן, אסתי רידר-אינדורסקי, רחלי איבנבוים וטלי פרקש במאה שערים ובני ברק במאבקן לייצוג. הכתבה ממסגרת את הקמפיין כ"מלחמה של ממש".',
      en: 'An extensive investigative segment on Ilana Dayan\'s flagship newsmagazine "Uvda" (Channel 12), by Ben Shani (February 2015), following Shushan, Esty Rieder Indursky, Racheli Ivenboim, and Tali Farkash through Mea Shearim and Bnei Brak in their fight for representation. The piece frames the campaign as "a real war."',
    },
    dateLabel: { he: '9.2.2015', en: 'Feb 9, 2015' },
    sortDate: '2015-02-09',
    year: 2015,
    outlet: { he: 'עובדה · ערוץ 12', en: '"Uvda" · Channel 12' },
    link: {
      kind: 'external',
      url: 'https://www.mako.co.il/tv-ilana_dayan/2015-c1d2ae2d1896b410/Article-05f1861886f6b41006.htm',
    },
    featured: true,
  },
  {
    slug: 'bhol-ten-candidates-2015',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: '"לא נבחרות" מציגות: 10 המועמדות שלנו לכנסת',
      en: '"Lo Nivcharot" Presents: Our 10 Candidates for Knesset',
    },
    summary: {
      he: 'כתבה מאת אלי כהן (ינואר 2015) על פרסום רשימת עשר נשים חרדיות שהקמפיין ממליץ עליהן כמועמדות לכנסת, בהן עדינה בר-שלום, רבקה רביץ ויהודית יוסף, בעקבות חלוקת עלונים ועימותים פומביים.',
      en: 'An Eli Cohen article (January 2015) on the campaign publishing its slate of ten recommended Haredi women for Knesset candidacy, including Adina Bar-Shalom, Rivka Ravitz, and Yehudit Yosef, following flyer distribution and public confrontations.',
    },
    dateLabel: { he: '8.1.2015', en: 'Jan 8, 2015' },
    sortDate: '2015-01-08',
    year: 2015,
    outlet: { he: 'בחדרי חרדים', en: 'Behadrei Haredim' },
    link: { kind: 'external', url: 'https://www.bhol.co.il/news/163301' },
  },
  {
    slug: 'haaretz-day-in-life-klingbeil-2019',
    type: 'article',
    category: 'interview',
    sourceLanguage: 'he',
    title: {
      he: 'יום בחיי אסתי שושן: אין קופסה לכל הזהויות שלי, אבל בסה"כ "אישה כשרה"',
      en: 'A Day in the Life of Esty Shushan: No Box for All My Identities, but Overall a "Kosher Woman"',
    },
    summary: {
      he: 'פרופיל "יום בחיים" מאת סיוון קלינגביל (מרץ 2019) על שושן כאם לארבעה בת 41 בפתח תקווה: משפחתה, כתיבת שירה כפורקן, וההתנגדות שלה להיכנס לקטגוריית זהות אחת.',
      en: 'A "day in the life" profile by Sivan Klingbeil (March 2019) of Shushan as a 41-year-old mother of four in Petach Tikva: her family, her poetry as an outlet, and her resistance to being boxed into one identity category.',
    },
    dateLabel: { he: '25.3.2019', en: 'Mar 25, 2019' },
    sortDate: '2019-03-25',
    year: 2019,
    outlet: { he: 'הארץ', en: 'Haaretz' },
    link: { kind: 'external', url: 'https://www.haaretz.co.il/blogs/sivanklingbail/2019-03-25/ty-article/0000017f-f8d3-ddde-abff-fcf7eb3f0000' },
  },
  {
    slug: 'mako-gender-segregation-law-2022',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'הפרדה מגדרית בחסות החוק? "צריך להבין, זה לא עניין דתי"',
      en: 'Gender Segregation Under Cover of Law? "You Need to Understand, This Isn\'t a Religious Matter"',
    },
    summary: {
      he: 'כתבה על משא ומתן קואליציוני סביב חקיקת הפרדה מגדרית (נובמבר 2022), המצטטת את שושן בשמה כמייסדת נבחרות: "להפרדה יש כוח לגדול... פתאום אפשר לחשוב על פתיחת רדיו שרק גברים מדברים בו", טוענת שההדרות אינן מצוות הלכתית.',
      en: 'An article on coalition negotiations over proposed gender-segregation legislation (November 2022), quoting Shushan by name as Nivcharot\'s founder: "Separation has power to grow... one could suddenly think of opening a radio station where only men speak," arguing the exclusions aren\'t religiously mandated.',
    },
    dateLabel: { he: '21.11.2022', en: 'Nov 21, 2022' },
    sortDate: '2022-11-21',
    year: 2022,
    outlet: { he: 'Mako · N12', en: 'Mako · N12' },
    link: { kind: 'external', url: 'https://www.mako.co.il/news-politics/2022_q4/Article-f9d26078b969481027.htm' },
  },
  {
    slug: 'mako-magazine-male-rule-2022',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'ממשלת הגברים: מדוע בממשלת נתניהו החדשה לא יהיו כמעט שרות',
      en: "A government of men: why Netanyahu's new cabinet will have almost no women ministers",
    },
    summary: {
      he: 'כתבת תחקיר מאת מאי פכט ועמית קמינסקי (דצמבר 2022) על התדרדרות ישראל בדירוגי ייצוג נשים עולמיים; שושן מפרטת את ניצחונות נבחרות המשפטיים ואת הדחיות שממשיכות: "22 נשים הגישו בקשות רשמיות למפלגות חרדיות וקיבלו סירוב".',
      en: 'An investigative piece by Mai Pacht and Amit Kaminski (December 2022) on Israel\'s collapse in global gender-representation rankings; Shushan details Nivcharot\'s legal wins and continued rejections: "Twenty-two women submitted formal requests to ultra-Orthodox parties and received rejections."',
    },
    dateLabel: { he: '23.12.2022', en: 'Dec 23, 2022' },
    sortDate: '2022-12-23',
    year: 2022,
    outlet: { he: 'Mako · מגזין N12', en: 'Mako · N12 Magazine' },
    link: { kind: 'external', url: 'https://www.mako.co.il/news-n12_magazine/2022_q4/Article-9a9dc2228663581026.htm' },
  },
  {
    slug: 'ynet-shaham-judicial-reform-2023',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'אני אומרת לעם ישראל - אתמול הדירו אותנו, מעכשיו ידירו את כל הנשים בארץ',
      en: "I'm Telling the People of Israel: Yesterday They Excluded Us, From Now On They'll Exclude All Women in the Country",
    },
    summary: {
      he: 'כתבה מאת עדי שחם (פברואר 2023) על סכנות הרפורמה המשפטית לזכויות נשים; מצטטת בהרחבה את "אסתי שושן-ביטון, מייסדת נבחרות" המזהירה שהפרדה מגדרית עלולה להתפשט מאוטובוסים חרדיים לאקדמיה ולמקומות עבודה באופן רחב: "אתמול הדירו אותנו, היום מדירים את כולן".',
      en: 'An Adi Shaham article (February 2023) on judicial-reform dangers to women\'s rights; quotes "Esty Shushan-Biton, founder of Nivcharot" at length warning that gender segregation now threatens to expand from Haredi buses into academia and workplaces broadly: "Yesterday they excluded us; today they\'re excluding everyone."',
    },
    dateLabel: { he: '24.2.2023', en: 'Feb 24, 2023' },
    sortDate: '2023-02-24',
    year: 2023,
    outlet: { he: 'Ynet', en: 'Ynet' },
    link: { kind: 'external', url: 'https://www.ynet.co.il/dating/gender/article/s11cttmai' },
  },
  {
    slug: 'kan-news-lobby-exclusion-2023',
    type: 'article',
    category: 'controversy',
    sourceLanguage: 'he',
    title: {
      he: 'ארגוני הנשים החרדיות הגדולים - לא הורשו להיכנס לשדולה בכנסת בנושא',
      en: 'The Major Haredi Women\'s Organizations Were Not Allowed Into the Knesset Lobby on the Issue',
    },
    summary: {
      he: 'כתבה מאת נופר משה פרדו וורד פלמנו (יולי 2023): נבחרות, קולך והמרכז לצדק לנשים לא הורשו להשתתף בשדולה חדשה של הכנסת "לנשים חרדיות ודתיות" שהקימה ח"כ לימור סון הר-מלך; מארגני השדולה טענו שהארגונים הקיימים "לא מייצגים" את הנשים שרצו לייצג.',
      en: 'A Nofar Moshe Pardu and Ward Palmano article (July 2023) reports that Nivcharot, Kolech, and the Center for Justice for Women were barred from a new Knesset "Lobby for Haredi and Religious Women" convened by MK Limor Son Har-Melech; organizers said the existing groups "do not represent" the women they wanted to represent.',
    },
    dateLabel: { he: '10.7.2023', en: 'Jul 10, 2023' },
    sortDate: '2023-07-10',
    year: 2023,
    outlet: { he: 'כאן חדשות', en: 'Kan News' },
    link: { kind: 'external', url: 'https://www.kan.org.il/content/kan-news/local/440279/' },
  },
  {
    slug: 'toi-anti-domestic-violence-campaign-2019',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'en',
    title: {
      he: 'נשים חרדיות בישראל משיקות קמפיין נגד אלימות במשפחה',
      en: 'Israeli Ultra-Orthodox Women Launch Anti-Domestic Violence Campaign',
    },
    summary: {
      he: 'כתבה מאת אלכסנדרה ורדי (נובמבר 2019) על קמפיין נבחרות "אם את מפחדת, זה לא שלום בית" ליום הבינלאומי למיגור האלימות נגד נשים; מדווחת שלארגון היו אז כ-15,000 תומכים, ומתארת את הדימויים המקודדים תרבותית (יין שנשפך, לא אלימות) שנועדו להגיע לנשים חרדיות בוואטסאפ.',
      en: 'An Alexandra Vardi article (November 2019) covers Nivcharot\'s "If you are scared, that is not shlom bayit" campaign for the Int\'l Day for Elimination of Violence Against Women; reports the org\'s "around 15,000 supporters" at the time and describes the culturally-coded imagery (spilled wine, not violence) used to reach Haredi women via WhatsApp.',
    },
    dateLabel: { he: '21.11.2019', en: 'Nov 21, 2019' },
    sortDate: '2019-11-21',
    year: 2019,
    outlet: { he: 'טיימס אוף ישראל', en: 'The Times of Israel' },
    link: { kind: 'external', url: 'https://www.timesofisrael.com/ultra-orthodox-women-launch-anti-domestic-violence-campaign/' },
  },
  {
    slug: 'toi-walder-six-months-2022',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'en',
    title: {
      he: 'שישה חודשים אחרי פרשת וולדר, האם החברה החרדית השתנתה?',
      en: 'Six Months After the Walder Abuse Scandal Broke, Has the Haredi World Seen Change?',
    },
    summary: {
      he: 'כתבה מאת איימי ספירו (מאי 2022) על ההשלכות ארוכות הטווח של פרשת חיים וולדר; שושן, מייסדת ומנכ"לית נבחרות, מתארת את ההכחשה הראשונית בקהילה: "אנשים לא רצו להאמין שזה מה שקרה".',
      en: 'An Amy Spiro article (May 2022) on the Chaim Walder affair\'s aftermath; Shushan, Nivcharot\'s founder and CEO, describes the community\'s initial denial: "people didn\'t want to believe that this is what had happened."',
    },
    dateLabel: { he: '16.5.2022', en: 'May 16, 2022' },
    sortDate: '2022-05-16',
    year: 2022,
    outlet: { he: 'טיימס אוף ישראל', en: 'The Times of Israel' },
    link: { kind: 'external', url: 'https://www.timesofisrael.com/6-months-after-the-walder-abuse-scandal-broke-has-the-haredi-world-seen-change/' },
  },
  {
    slug: 'haaretz-shas-revolution-rotem-2015',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'האם ש"ס עוברת מהפכה נשית?',
      en: 'Is Shas Undergoing a Women\'s Revolution?',
    },
    summary: {
      he: 'כתבה מאת תמר רותם (נובמבר 2015) על השאלה אם ש"ס עוברת שינוי אמיתי כלפי נשים; שושן, לצד העיתונאית אביבה גולן, מביעה ספקנות שמכסות סמליות של צירות בקונגרס הציוני מייצגות ציות פרוצדורלי, לא שינוי אמיתי.',
      en: 'A Tamar Rotem article (November 2015) on whether Shas is undergoing genuine change for women; Shushan, alongside journalist Aviva Golan, offers a skeptical view that token Zionist Congress delegate quotas represent procedural compliance, not real transformation.',
    },
    dateLabel: { he: '4.11.2015', en: 'Nov 4, 2015' },
    sortDate: '2015-11-04',
    year: 2015,
    outlet: { he: 'הארץ', en: 'Haaretz' },
    link: { kind: 'external', url: 'https://www.haaretz.co.il/labels/avi-chai/2015-11-04/ty-article-labels/00000180-8db7-df2b-af95-9dbf180e0000' },
  },
  {
    slug: 'kikar-shushan-new-politics-oped-2015',
    type: 'article',
    category: 'opinion',
    sourceLanguage: 'he',
    title: {
      he: 'פוליטיקה חרדית חדשה? רק עם נשים',
      en: 'A New Haredi Politics? Only With Women',
    },
    summary: {
      he: 'טור דעה מאת אסתי שושן (ינואר 2015) הטוען שאין שום סיבה להדיר נשים מהשפעה פוליטית, בהפניה לרואנדה כמודל של פרלמנט ברוב נשי, תוך הכרה בביקורת שספג הקמפיין על לבוש הפעילות ואורח חייהן.',
      en: 'An Esty Shushan opinion column (January 2015) argues there\'s "no reason whatsoever to exclude women from influencing politics," citing Rwanda\'s female-majority parliament as a model and acknowledging the backlash the campaign faced over women\'s dress and lifestyle criticism.',
    },
    dateLabel: { he: '18.1.2015', en: 'Jan 18, 2015' },
    sortDate: '2015-01-18',
    year: 2015,
    outlet: { he: 'כיכר השבת', en: 'Kikar HaShabbat' },
    link: { kind: 'external', url: 'https://www.kikar.co.il/161510.html' },
  },
  {
    slug: 'globes-shushan-male-politics-oped-2020',
    type: 'article',
    category: 'opinion',
    sourceLanguage: 'he',
    title: {
      he: 'הנשים החרדיות אינן זקוקות לגברים שידברו בשמן',
      en: "Haredi Women Don't Need Men to Speak for Them",
    },
    summary: {
      he: 'טור דעה מאת אסתי שושן (ינואר 2020) הטוען שהפוליטיקה החרדית "גברית במהותה", ומקשר בין רשימות המפלגות הגבריות בלבד לבין תרבות שמאפשרת לפוגעים, בהתייחסות לפרשות הרב ברלנד ומלכה לייפר, לחמוק מאחריות בהיעדר נשים בחדר.',
      en: 'An Esty Shushan opinion column (January 2020) argues Haredi politics is "male in its essence," linking the all-male party lists to a culture that lets abusers, citing the Rabbi Berland and Malka Leifer cases, escape accountability because no women are in the room.',
    },
    dateLabel: { he: '22.1.2020', en: 'Jan 22, 2020' },
    sortDate: '2020-01-22',
    year: 2020,
    outlet: { he: 'גלובס', en: 'Globes' },
    link: { kind: 'external', url: 'https://www.globes.co.il/news/article.aspx?did=1001315634' },
  },
  {
    slug: 'globes-shushan-meron-disaster-oped-2021',
    type: 'article',
    category: 'opinion',
    sourceLanguage: 'he',
    title: {
      he: 'כשהקיצוניים מכתיבים את סדר היום - בריאות הציבור מופקרת',
      en: 'When Extremists Dictate the Agenda - Public Safety Is Abandoned',
    },
    summary: {
      he: 'טור דעה מאת אסתי שושן (מאי 2021), שנכתב בעקבות אסון מירון; שושן מספרת על סירובו רב-השנים של אביה עצמו להשתתף בעלייה לרגל ביום ל"ג בעומר, וטוענת שגורמים קיצוניים המכתיבים החלטות בטיחות באירועים, ללא פיקוח ממשלתי, הם שגרמו לאסון.',
      en: "An Esty Shushan opinion column (May 2021), written in the wake of the Mount Meron disaster; Shushan cites her own father's longstanding refusal to attend the Lag B'Omer pilgrimage and argues extremist factions dictating event-safety decisions, unchecked by government oversight, caused the tragedy.",
    },
    dateLabel: { he: '2.5.2021', en: 'May 2, 2021' },
    sortDate: '2021-05-02',
    year: 2021,
    outlet: { he: 'גלובס', en: 'Globes' },
    link: { kind: 'external', url: 'https://www.globes.co.il/news/article.aspx?did=1001369517' },
  },
  {
    slug: 'globes-shushan-tech-wage-gap-oped-2019',
    type: 'article',
    category: 'opinion',
    sourceLanguage: 'he',
    title: {
      he: 'התנאים הייטק; העושק לואוטק',
      en: 'The Conditions Are High-Tech; the Exploitation Is Low-Tech',
    },
    summary: {
      he: 'טור דעה מאת אסתי שושן (מרץ 2019) הטוען שנשים חרדיות בהייטק מרוויחות רק 68% ממה שגברים חרדים מרוויחים (ומחצית משכר גברים חילונים), ומתארת ניצול חמור עוד יותר של נשים בידי מעסיקים חרדים "דתיים" בעמותות רווחה וחינוך, המנצלים את היותן מפרנסות יחידות לכודות.',
      en: 'An Esty Shushan opinion column (March 2019) argues Haredi women in tech earn only 68% of what Haredi men earn (and half of secular men), and describes worse exploitation of women by "religious" Haredi employers in welfare/education nonprofits who count on women being trapped as sole breadwinners.',
    },
    dateLabel: { he: '5.3.2019', en: 'Mar 5, 2019' },
    sortDate: '2019-03-05',
    year: 2019,
    outlet: { he: 'גלובס', en: 'Globes' },
    link: { kind: 'external', url: 'https://www.globes.co.il/news/article.aspx?did=1001276621' },
  },
  {
    slug: 'maariv-103fm-shushan-radio-interview-2022',
    type: 'article',
    category: 'interview',
    sourceLanguage: 'he',
    title: {
      he: 'אין שום נימוק הלכתי דתי להדרה הזאת',
      en: 'There Is No Halachic Religious Justification for This Exclusion',
    },
    summary: {
      he: 'ראיון רדיו (103fm, אוקטובר 2022) עם שושן, המזוהה כ"מנכ"לית נבחרות", לקראת בחירות 2022, על קמפיין העלונים בשכונות חרדיות: "אין שום נימוק הלכתי-דתי להדרה הזאת; הם עושים את זה כי הם יכולים".',
      en: 'A radio interview (103fm, October 2022) with Shushan, identified as "CEO of Nivcharot," ahead of the 2022 election, on the flyer campaign in Haredi neighborhoods: "There is no religious justification for this exclusion; they do it because they can."',
    },
    dateLabel: { he: '31.10.2022', en: 'Oct 31, 2022' },
    sortDate: '2022-10-31',
    year: 2022,
    outlet: { he: '103FM · מעריב', en: '103fm · Maariv Radio' },
    link: { kind: 'external', url: 'https://103fm.maariv.co.il/programs/media.aspx?ZrqvnVq=IMGGJK&c41t4nzVQ=FJF' },
  },
  {
    // 2026-08-16 brief: "כתבות על חשבונות שמים רק את הכתבה בווינט שהתפרסמה"
    // — of the Feb 2026 film-press cluster (this item, plus a Makor Rishon
    // and a Srugim piece), the site owner asked to keep only the Ynet
    // article. The other two were removed outright, not merged in here.
    slug: 'ynet-shushan-oct7-interview-2026',
    type: 'article',
    category: 'interview',
    sourceLanguage: 'he',
    title: {
      he: 'מאז 7 באוקטובר הציבור החרדי נמצא על המוקד מול ביקורת קשה ומוצדקת',
      en: 'Since October 7, Haredi Society Has Been Under the Spotlight, Facing Harsh and Justified Criticism',
    },
    summary: {
      he: 'ראיון נרחב מאת סמדר שילוני (פברואר 2026) סביב בכורת "חשבונות שמיים", סרטה העלילתי הראשון של שושן, על זוג הורים חרדים המתמודדים עם אבל אחרי שילדם נשכח ברכב ונפטר. שושן מתארת את הסרט כ"מראה" ולא כבידור, עדות לשאלות קשות של אמונה ואחריות בתוך החברה החרדית, לאור אסונות אחרונים. על הביקורת על החברה החרדית מאז 7 באוקטובר: "מוצדקת"; היא מדמה את אסון מירון ל"7 באוקטובר החרדי", נקודת שבר שחשפה כשלים מערכתיים באחריותיות קהילתית.',
      en: 'A wide-ranging Samadar Shiloni interview (February 2026) around the premiere of "Cheshbonot Shamayim" ("Heavenly Accounts"), Shushan\'s first narrative feature, about a Haredi couple grieving after their young son is forgotten in a car and dies. Shushan describes the film as "a mirror," not entertainment, raising hard questions about faith and accountability within Haredi society in light of recent tragedies. On post-October-7 criticism of Haredi society: "justified"; she likens the Meron disaster to "the Haredi October 7," a breaking point that exposed systemic failures of communal accountability.',
    },
    dateLabel: { he: 'פברואר 2026', en: 'Feb 2026' },
    sortDate: '2026-02-16',
    year: 2026,
    outlet: { he: 'Ynet · בידור', en: 'Ynet · Entertainment' },
    link: { kind: 'external', url: 'https://www.ynet.co.il/entertainment/article/sy04zoxdbl' },
  },
  {
    slug: 'haaretz-kaplansky-gender-studies-backlash-2022',
    type: 'article',
    category: 'controversy',
    sourceLanguage: 'he',
    // 2026-08-16 brief: name only in interview/opinion-category titles.
    title: {
      he: 'האשימו אותי שאני יורקת לבאר, אבל אני לא שתיתי מהבאר הזו',
      en: '"They accused me of spitting into the well, but I never drank from that well"',
    },
    summary: {
      he: 'כתבה מאת תמר קפלנסקי (יולי 2022) על זווית פולמוס בלתי צפויה: אחרי ששושן פרסמה שיר ("תזה"), הביקורת הפעם הגיעה ממעגלים פמיניסטיים/אקדמיים העוסקים בלימודי מגדר, לא מרבנים חרדים, ציר התנגדות נוסף: מודרת בתוך החברה החרדית על פמיניזם שלה, ומודרת באקדמיה החילונית כאישה מזרחית.',
      en: 'A Tamar Kaplansky article (July 2022) notable because the backlash here comes from an unexpected direction: after Shushan published a poem ("Thesis"), criticism came from feminist/gender-studies circles rather than Haredi rabbis, a second axis of controversy: marginalized within Haredi society for her feminism, and within secular academia\'s gender-studies circles as a Mizrahi woman.',
    },
    dateLabel: { he: '20.7.2022', en: 'Jul 20, 2022' },
    sortDate: '2022-07-20',
    year: 2022,
    outlet: { he: 'הארץ · מגזין', en: 'Haaretz · Magazine' },
    link: {
      kind: 'external',
      url: 'https://www.haaretz.co.il/gallery/galleryfriday/2022-07-20/ty-article-magazine/.highlight/00000182-15b0-dd24-a98e-bff35fc70000',
    },
  },

  // ---- 2026-08-14 brief (fourth follow-up): "לא להכניס ביקורות סרט חשבונות
  // שמים, כן להכניס כתבות על הסרט אשת חיל" — the Cheshbonot Shamayim film
  // reviews above were removed; these two are real coverage of the OTHER
  // film, the 2021 documentary "Women of Valor" (dir. Anna Somershaf) about
  // Shushan and Nivcharot's founding — found via a dedicated follow-up
  // search and independently verified.
  {
    slug: 'jpost-jerusalem-highlights-woman-of-valor-2025',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'en',
    title: {
      he: 'רגעים נבחרים בירושלים: 7–14 בנובמבר',
      en: 'Jerusalem Highlights: November 7-14',
    },
    summary: {
      he: 'כתבה מאת הגיא הכהן (נובמבר 2025) הכוללת פרסום להקרנת הסרט התיעודי "אשת חיל" (2021, בימוי אנה סומרשף) על אסתי שושן, המתוארת כ"פעילה בולטת ומקדמת שינוי בתוך החברה החרדית" שקראה בגלוי לנשים חרדיות שלא להצביע למפלגות ללא מועמדות. ההקרנה כללה מפגש עם שושן בסיומה.',
      en: 'A Hagay Hacohen article (November 2025) includes a listing for a screening of the 2021 documentary "Woman of Valor" (dir. Anna Somershaf) about Esty Shushan, described as "a prominent activist and promoter of change within the ultra-Orthodox society" who has "openly called on haredi women not to vote for political parties in which no women were among the candidates." The screening included a post-film meeting with Shushan.',
    },
    dateLabel: { he: '7.11.2025', en: 'Nov 7, 2025' },
    sortDate: '2025-11-07',
    year: 2025,
    outlet: { he: 'הג\'רוזלם פוסט', en: 'The Jerusalem Post' },
    link: { kind: 'external', url: 'https://www.jpost.com/must/article-873028' },
  },
  {
    slug: 'portfolio-woman-of-valor-jff-review-2021',
    type: 'article',
    category: 'coverage',
    sourceLanguage: 'he',
    title: {
      he: 'סקירת פסטיבל ירושלים 2021: "אשת חיל" כמסמך אקטואלי חשוב',
      en: '2021 Jerusalem Film Festival round-up: "Woman of Valor" as a significant contemporary document',
    },
    summary: {
      he: 'מתוך סקירת פסטיבל ירושלים מאת מרלין וניג (אוגוסט 2021): הסרט התיעודי "אשת חיל" מתואר כ"מסמך אקטואלי משמעותי" על שאיפתן של נשים חרדיות להשתלב במפלגות החרדיות בכנסת. שושן מתוארת כ"אישה חרדית אינטלקטואלית שתודעתה הפמיניסטית מתפתחת דרך ניסיונות ליצור שינוי"; בחירתה של הבמאית אנה סומרשף לעקוב אחריה כעדה שקטה יוצרת תחושה ש"המצלמה היא אחת מסוכנות המאבק".',
      en: 'From a Jerusalem Film Festival roundup by Marlyn Vinig (August 2021): the documentary "Woman of Valor" is described as "a significant contemporary document" on Haredi women\'s aspiration to integrate into Haredi Knesset parties. Shushan is portrayed as "an intellectual Haredi woman whose feminist consciousness develops through attempts to create change"; director Anna Somershaf\'s choice to follow her as a silent witness creates the sense that "the camera is one of the struggle\'s agents."',
    },
    dateLabel: { he: '26.8.2021', en: 'Aug 26, 2021' },
    sortDate: '2021-08-26',
    year: 2021,
    outlet: { he: 'מגזין פורטפוליו', en: 'Portfolio Magazine' },
    link: { kind: 'external', url: 'https://www.prtfl.co.il/archives/152020' },
  },
]

export function findPressItemBySlug(slug: string): PressArchiveItem | undefined {
  return pressArchiveItems.find((item) => item.link.kind === 'internal' && item.slug === slug)
}

/** Resolves a `PressItemLink` to a real href + whether it's an outbound (external, new-tab) link — shared by every "from the archive" strip that reuses this fixture. */
export function pressItemHref(link: PressItemLink, locale: string): { href: string; external: boolean } {
  if (link.kind === 'external') return { href: link.url, external: true }
  return { href: `/${locale}/press/${link.slug}`, external: false }
}

/**
 * Home page card text for one featured item: the hand-written `homeExcerpt`
 * when set, otherwise `summary` trimmed to its first couple of sentences so
 * the card never displays a full, multi-quote archive paragraph. Always
 * ends on a real sentence boundary (never mid-word/mid-clause) so a card
 * without a dedicated excerpt still reads as a complete thought.
 */
export function homeCardExcerpt(item: PressArchiveItem, locale: 'he' | 'en', maxChars = 160): string {
  const excerpt = item.homeExcerpt?.[locale]
  if (excerpt) return excerpt

  const full = item.summary[locale]
  if (full.length <= maxChars) return full

  const sentences = full.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [full]
  let out = ''
  for (const sentence of sentences) {
    if (out && out.length + sentence.length > maxChars) break
    out += sentence
  }
  return (out || sentences[0]).trim()
}

export function sortPressItemsDesc(items: PressArchiveItem[]): PressArchiveItem[] {
  return [...items].sort((a, b) => (a.sortDate < b.sortDate ? 1 : a.sortDate > b.sortDate ? -1 : 0))
}

/** Every distinct year present, newest first — drives the archive's year-filter chips. */
export function pressArchiveYears(): number[] {
  return Array.from(new Set(pressArchiveItems.map((item) => item.year))).sort((a, b) => b - a)
}

export const pressArchiveItemsSorted = sortPressItemsDesc(pressArchiveItems)

/** Type-icon + outbound-arrow chrome, and the section's own headings — kept local since not reused elsewhere. */
export const pressArchiveText = {
  eyebrow: { he: 'נבחרות בתקשורת', en: 'IN THE MEDIA' } satisfies Localized,
  title: { he: 'בתקשורת', en: 'In the Media' } satisfies Localized,
  lead: {
    he: 'כתבות, ריאיונות וניירות עמדה, מהארכיון של נבחרות ומהתקשורת החיצונית שסיקרה את הארגון, לפי מה שאותר ואומת במחקר. לא כל מה שנמצא היה שלם דיו כדי להופיע כאן; זה מה שכן.',
    en: "Articles, interviews and position papers, from Nivcharot's own archive and from outside press coverage of the organization, drawn from what research located and verified. Not everything found was complete enough to include here; this is what was.",
  } satisfies Localized,
  allYears: { he: 'כל השנים', en: 'All years' } satisfies Localized,
  typeLabel: {
    article: { he: 'כתבה', en: 'Article' } satisfies Localized,
    video: { he: 'וידאו / רדיו', en: 'Video / radio' } satisfies Localized,
    'press-mention': { he: 'אזכור בתקשורת', en: 'Press mention' } satisfies Localized,
    podcast: { he: 'פודקאסט', en: 'Podcast' } satisfies Localized,
  } as Record<PressItemType, Localized>,
  /**
   * Category-filter chips (2026-08-13 brief, second follow-up — replaces
   * the old article/video/podcast type-filter chips, which never showed
   * more than one real bucket since every item here is an article or
   * press-mention: video/podcast coverage lives in its own section,
   * `src/content/elsewhere-media.ts`). This is the real editorial axis a
   * reader browsing a press archive actually wants: straight coverage vs.
   * opinion vs. interview vs. the pieces documenting pushback.
   */
  categoryFilter: {
    all: { he: 'הכל', en: 'All' } satisfies Localized,
    coverage: { he: 'כתבות', en: 'Coverage' } satisfies Localized,
    opinion: { he: 'טורי דעה', en: 'Opinion' } satisfies Localized,
    interview: { he: 'ראיונות', en: 'Interviews' } satisfies Localized,
    controversy: { he: 'נבחרות בפולמוס', en: 'In controversy' } satisfies Localized,
  } as Record<'all' | PressCategory, Localized>,
  /** Small per-card category badge, same labels as the filter chips minus "הכל". */
  categoryLabel: {
    coverage: { he: 'כתבה', en: 'Coverage' } satisfies Localized,
    opinion: { he: 'טור דעה', en: 'Opinion' } satisfies Localized,
    interview: { he: 'ראיון', en: 'Interview' } satisfies Localized,
    controversy: { he: 'פולמוס', en: 'Controversy' } satisfies Localized,
  } as Record<PressCategory, Localized>,
  searchPlaceholder: { he: 'חיפוש בכתבות…', en: 'Search articles…' } satisfies Localized,
  searchLabel: { he: 'חיפוש בארכיון התקשורת', en: 'Search the press archive' } satisfies Localized,
  outboundLabel: { he: 'לכתבה במקור', en: 'To the source' } satisfies Localized,
  internalLabel: { he: 'לקריאה באתר', en: 'Read on this site' } satisfies Localized,
  emptyForFilter: { he: 'אין פריטים בסינון הזה.', en: 'No items match this filter.' } satisfies Localized,
  emptyForSearch: { he: 'אין תוצאות לחיפוש הזה.', en: 'No results for this search.' } satisfies Localized,
  backToArchive: { he: 'חזרה לארכיון', en: 'Back to the archive' } satisfies Localized,
  fromArchive: { he: 'מהארכיון של נבחרות', en: "from Nivcharot's archive" } satisfies Localized,
  /** Shown when the current locale differs from the item's real `sourceLanguage` (2026-08-13 brief, follow-up). */
  originalLanguageBadge: {
    he: { he: 'במקור בעברית', en: 'Originally in Hebrew' } satisfies Localized,
    en: { he: 'במקור באנגלית', en: 'Originally in English' } satisfies Localized,
  },
} as const
