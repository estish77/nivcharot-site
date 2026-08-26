import type { Localized } from '@/lib/i18n'

/**
 * "עוד פודקאסטים וכתבות וידאו" — podcasts and video/TV coverage featuring
 * Nivcharot or its people, from OTHER shows/channels, not the org's own
 * "חרדית מדוברת" podcast (that has its own dedicated /podcast page) and not
 * written press (that's `src/content/press-archive.ts`). 2026-08-13 brief:
 * "תוסיף קישורים לפודקאסטים שהם לא חרדית מדוברת... שים אותם בסקשן נפרד, שים
 * כתבות וידאו" — put these in their own section on the Media page.
 *
 * Every item here was independently re-verified (direct fetch / YouTube
 * playability check / oEmbed) against the real host platform before being
 * added — same standard as press-archive.ts. A handful of leads the
 * research turned up but couldn't pin to a single working direct-listen
 * URL (a Good People Fund episode with only cross-platform badges, a
 * Reshet Bet radio interview with no surviving audio link) were left out
 * rather than included on a broken or second-hand link.
 */

export type ElsewhereMediaKind = 'podcast' | 'video' | 'talk'

export type ElsewhereMediaItem = {
  slug: string
  kind: ElsewhereMediaKind
  title: Localized<string>
  summary: Localized<string>
  /** Show/channel name, not localized — a proper name. */
  host: string
  dateLabel: Localized<string>
  sortDate: string
  sourceLanguage: 'he' | 'en'
  url: string
  /** Honest caveat shown alongside the item — used only where one applies. */
  note?: Localized<string>
}

export const otherPodcasts: ElsewhereMediaItem[] = [
  {
    slug: 'kan-medabrim-patuach',
    kind: 'podcast',
    host: 'מדברים פתוח · כאן',
    sourceLanguage: 'he',
    title: {
      he: 'פרק 52: אסתי שושן',
      en: 'Episode 52: Esty Shushan',
    },
    summary: {
      he: 'אסתי שושן אצל עמירם כהן, על הגזענות שחוותה, הקמת נבחרות ו"לא נבחרות לא בוחרות", והסרט "חשבונות שמיים".',
      en: 'Esty Shushan talks to host Amiram Cohen about the racism she faced, founding Nivcharot and "Lo Nivcharot Lo Bocharot," and her film "Cheshbonot Shamayim."',
    },
    dateLabel: { he: '16.4.2026', en: 'Apr 16, 2026' },
    sortDate: '2026-04-16',
    url: 'https://www.kan.org.il/content/kan/podcasts/p-857058/1029352/',
  },
  {
    slug: 'kan-shnayim-eshkol-nevo',
    kind: 'podcast',
    host: 'שניים עם אשכול נבו · כאן',
    sourceLanguage: 'he',
    title: { he: 'אסתי שושן', en: 'Esty Shushan' },
    summary: {
      he: 'שיחה אישית עם אשכול נבו, בפודקאסט הריאיונות "שניים" של תאגיד השידור כאן.',
      en: "A personal conversation with Eshkol Nevo, on Kan public broadcaster's interview podcast \"Two.\"",
    },
    dateLabel: { he: '21.4.2023', en: 'Apr 21, 2023' },
    sortDate: '2023-04-21',
    url: 'https://www.kan.org.il/content/kan/podcasts/p-8326/30849/',
  },
  {
    slug: 'kan-kotevet-umochelet-ahava',
    kind: 'podcast',
    host: 'כותבת ומוחקת אהבה · כאן',
    sourceLanguage: 'he',
    title: {
      he: 'אסתי שושן | "נשים חרדיות זה המגזר שהכי קל לעשוק"',
      en: 'Esty Shushan | "Haredi Women Are the Easiest Sector to Exploit"',
    },
    summary: {
      he: 'שיחה עם ענת לב אדלר בפודקאסט "כותבת ומוחקת אהבה" של כאן.',
      en: 'A conversation with host Anat Lev Adler on Kan\'s "Kotevet U\'Mochekhet Ahava" podcast.',
    },
    dateLabel: { he: '21.4.2023', en: 'Apr 21, 2023' },
    sortDate: '2023-04-21',
    url: 'https://www.kan.org.il/content/kan/podcasts/p-8693/18991/',
  },
  {
    slug: 'radical-haredi-feminism',
    kind: 'podcast',
    host: 'הרדיקל',
    sourceLanguage: 'he',
    title: {
      he: 'פרק 10: אסתי שושן - פמיניזם חרדי',
      en: 'Episode 10: Esty Shushan - Haredi Feminism',
    },
    summary: {
      he: 'שיחה עם ד"ר ג\'רמי פוגל, עונה 1 פרק 10 של "הרדיקל".',
      en: 'A conversation with host Dr. Jeremy Fogel, season 1 episode 10 of "The Radical."',
    },
    dateLabel: { he: 'אוגוסט 2024', en: 'Aug 2024' },
    sortDate: '2024-08-01',
    url: 'https://www.youtube.com/watch?v=Q4Nse7AdjsU',
  },
  {
    slug: 'israel-from-the-inside-daniel-gordis',
    kind: 'podcast',
    host: 'Israel from the Inside with Daniel Gordis',
    sourceLanguage: 'en',
    title: {
      he: 'אסתי שושן היא חרדית · מאבק פוגש מאבק',
      en: 'Esty Shusan Is Haredi (Ultra-Orthodox)',
    },
    summary: {
      he: 'ראיון באנגלית עם דניאל גורדיס, מקושר ישירות מהאתר של נבחרות.',
      en: "An English-language interview with Daniel Gordis, linked directly from Nivcharot's own site.",
    },
    dateLabel: { he: '26.4.2024', en: 'Apr 26, 2024' },
    sortDate: '2024-04-26',
    url: 'https://danielgordis.substack.com/p/esty-shusan-is-haredi-ultra-orthodox-4cb',
  },
  {
    slug: 'looks-like-work-chedva-ludmir',
    kind: 'podcast',
    host: 'Looks Like Work with Chedva Ludmir',
    sourceLanguage: 'en',
    title: {
      he: 'לצאת מהמצרים שלך ולקחת אחרים איתך',
      en: 'Exiting Your Own Egypt and Taking Others With You',
    },
    summary: {
      he: 'ראיון באנגלית עם אסתי (ביטון) שושן, מקושר מהאתר של נבחרות.',
      en: "An English-language interview with Esty (Bitton) Shushan, referenced on Nivcharot's own site.",
    },
    dateLabel: { he: '', en: '' },
    sortDate: '2023-01-01',
    url: 'https://open.spotify.com/episode/6tMurOGvm3VVBCphQe7pOp',
    note: {
      he: 'תאריך פרסום מדויק לא אותר.',
      en: 'Exact publish date not located.',
    },
  },
  {
    slug: 'hakol-patuach-avi-shushan',
    kind: 'podcast',
    host: 'הכול פתוח',
    sourceLanguage: 'he',
    title: {
      he: 'אסתי שושן: "היו לי משברי אמונה"',
      en: 'Esty Shushan: "I Had Crises of Faith"',
    },
    summary: {
      he: 'שיחה על משברי אמונה ועל הבמוי הראשון שלה, "חשבונות שמיים".',
      en: 'A conversation about her crises of faith and her directorial debut, "Cheshbonot Shamayim."',
    },
    dateLabel: { he: '', en: '' },
    sortDate: '2022-01-01',
    url: 'https://open.spotify.com/episode/4SeIOb8MVn9TdVHjzzh26t',
    note: {
      he: 'תאריך פרסום מדויק לא אותר.',
      en: 'Exact publish date not located.',
    },
  },
  {
    slug: 'kol-hakla-fim-moshe-redman',
    kind: 'podcast',
    host: 'כל הקלפים על השולחן · משה רדמן',
    sourceLanguage: 'he',
    title: {
      he: 'חמישים גוונים של שחור-לבן! עם האקטיביסטית והיוצרת החרדית אסתי שושן',
      en: 'Fifty Shades of Black-and-White - With Haredi Activist and Filmmaker Esty Shushan',
    },
    summary: {
      he: 'שיחה ארוכה עם משה רדמן; קטע קצר מאותו פרק זמין גם בנפרד.',
      en: 'A long conversation with host Moshe Redman; a short excerpt from the same episode is also available separately.',
    },
    dateLabel: { he: '25.12.2024', en: 'Dec 25, 2024' },
    sortDate: '2024-12-25',
    url: 'https://www.youtube.com/watch?v=NoLZMmB_TmQ',
  },
  {
    slug: 'parashat-drachim-all-in',
    kind: 'podcast',
    host: 'פרשת דרכים · All•in',
    sourceLanguage: 'he',
    title: {
      he: 'אסתי שושן, אקטיביסטית חרדית | על מנהיגות לא טיפוסית',
      en: 'Esty Shushan, Haredi Activist | On Atypical Leadership',
    },
    summary: {
      he: 'שיחה ברשת הפודקאסטים "All•in, הבית של הפודקאסטים".',
      en: 'A conversation on the "All•in" podcast network.',
    },
    dateLabel: { he: '13.8.2025', en: 'Aug 13, 2025' },
    sortDate: '2025-08-13',
    url: 'https://www.youtube.com/watch?v=Io2XwQxpKcM',
  },
]

export const videoArticles: ElsewhereMediaItem[] = [
  {
    slug: 'women-of-valor-trailer',
    kind: 'video',
    host: 'Women of Valor · אשת חיל (טריילר)',
    sourceLanguage: 'he',
    title: { he: 'אשת חיל - טריילר', en: 'Women of Valor - Trailer' },
    summary: {
      he: 'הטריילר לסרט התיעודי "אשת חיל", מהערוץ הרשמי של נבחרות ביוטיוב.',
      en: "The trailer for the documentary \"Women of Valor,\" from Nivcharot's own official YouTube channel.",
    },
    dateLabel: { he: '', en: '' },
    sortDate: '2020-01-01',
    url: 'https://www.youtube.com/watch?v=iUYqRXVwz9o',
  },
  {
    slug: 'channel14-nidah-controversy-2022',
    kind: 'video',
    host: 'ערוץ 14',
    sourceLanguage: 'he',
    title: {
      he: 'אסתי שושן, מנכ"לית נבחרות, על סערת פרסום הנידה',
      en: "Esty Shushan, Nivcharot's Director, on the Nidah Publication Controversy",
    },
    summary: {
      he: 'ראיון חדשותי בערוץ 14.',
      en: 'A news interview on Channel 14.',
    },
    dateLabel: { he: '6.7.2022', en: 'July 6, 2022' },
    sortDate: '2022-07-06',
    url: 'https://www.youtube.com/watch?v=KMqx94QXw8Y',
  },
  {
    slug: 'democratv-women-influence',
    kind: 'video',
    host: 'DemocraTV',
    sourceLanguage: 'he',
    title: {
      he: 'הקול שלהן חשוב: הילה חסן-לפקוביץ ואסתי שושן על ההשפעה הנשית בקהילה החרדית',
      en: "Their Voice Matters: Hila Hasan-Lefkowitz and Esty Shushan on Women's Influence in the Haredi Community",
    },
    summary: {
      he: 'שיחת וידאו על מקומן של נשים חרדיות בקהילה.',
      en: "A video conversation on Haredi women's place in their community.",
    },
    dateLabel: { he: '8.3.2021', en: 'March 8, 2021' },
    sortDate: '2021-03-08',
    url: 'https://www.youtube.com/watch?v=vEH029Ua6kA',
  },
  {
    slug: 'nivcharot-media-berland-2019',
    kind: 'video',
    host: 'מדיה נבחרות (הערוץ הרשמי)',
    sourceLanguage: 'he',
    title: {
      he: 'אסתי ביטון שושן, מנכ"ל נבחרות, בראיון בנושא פרשת ברלנד',
      en: "Esty Bitton Shushan, Nivcharot's Director, Interviewed on the Berland Affair",
    },
    summary: {
      he: 'ראיון מהערוץ הרשמי השני של נבחרות ביוטיוב, "מדיה נבחרות".',
      en: 'An interview from Nivcharot\'s second official YouTube channel, "Media Nivcharot."',
    },
    dateLabel: { he: '17.1.2019', en: 'Jan 17, 2019' },
    sortDate: '2019-01-17',
    url: 'https://www.youtube.com/watch?v=dMfmlEsLaFs',
  },
  {
    slug: 'shevyon-personal-story-2020',
    kind: 'video',
    host: 'הגיע זמן SHEvyon',
    sourceLanguage: 'he',
    title: {
      he: 'אסתי שושן ביטון - על סיפורה האישי שהוביל להקמת תנועת "נבחרות"',
      en: 'Esty Shushan Bitton - On the Personal Story That Led to Founding the "Nivcharot" Movement',
    },
    summary: {
      he: 'שיחה על המסע האישי שהוביל להקמת התנועה.',
      en: 'A conversation on the personal journey that led to founding the movement.',
    },
    dateLabel: { he: '19.11.2020', en: 'Nov 19, 2020' },
    sortDate: '2020-11-19',
    url: 'https://www.youtube.com/watch?v=C2SQgyVKo_c',
  },
]

export const talksAndConferences: ElsewhereMediaItem[] = [
  {
    slug: 'tedx-jerusalem-shushan-2015',
    kind: 'talk',
    host: 'TEDxJerusalem',
    sourceLanguage: 'he',
    title: { he: 'No Voice No Vote | אסתי שושן', en: 'No Voice No Vote | Esty Shushan' },
    summary: {
      he: 'ההרצאה של אסתי שושן ב-TEDxJerusalem, הראשונה מסוגה מפי אישה חרדית, שבה סיפרה את סיפור הקמת נבחרות.',
      en: "Esty Shushan's TEDxJerusalem talk, the first of its kind by a Haredi woman, recounting Nivcharot's founding story.",
    },
    dateLabel: { he: '2015', en: '2015' },
    sortDate: '2015-05-28',
    url: 'https://www.youtube.com/watch?v=CDYPibOZgHU',
  },
  {
    slug: 'wizo-egm-shushan-2016',
    kind: 'talk',
    host: 'World WIZO',
    sourceLanguage: 'he',
    title: { he: 'אסתי שושן באסיפה הכללית של WIZO, 2016', en: 'Esty Shushan at the World WIZO EGM, 2016' },
    summary: {
      he: 'אסתי שושן נואמת באסיפה הכללית המיוחדת (EGM) של ארגון WIZO העולמי.',
      en: "Esty Shushan speaks at World WIZO's Extraordinary General Meeting.",
    },
    dateLabel: { he: '2016', en: '2016' },
    sortDate: '2016-01-01',
    url: 'https://www.youtube.com/watch?v=Pa6L-U8bvFg',
  },
  {
    slug: 'rappaport-prize-ceremony-video-2019',
    kind: 'talk',
    host: 'קרן רפפורט (Rappaport Prizes)',
    sourceLanguage: 'he',
    title: { he: 'אסתי שושן - פרס רפפורט 2019, נשים יוצרות שינוי', en: 'Esty Shushan - 2019 Rappaport Prize, Women Generating Change' },
    summary: {
      he: 'הווידאו הרשמי של טקס פרס רפפורט (מוזיאון תל אביב לאמנות, מרץ 2019), שגם מתועד בכתבה בארכיון התקשורת של האתר.',
      en: "The official video from the Rappaport Prize ceremony (Tel Aviv Museum of Art, March 2019), the same event already covered in the site's press archive.",
    },
    dateLabel: { he: 'מרץ 2019', en: 'March 2019' },
    sortDate: '2019-03-17',
    url: 'https://www.youtube.com/watch?v=aPzBhVCDa6Q',
  },
]

export const elsewhereMediaText = {
  eyebrow: { he: 'עוד ברשת', en: 'ELSEWHERE ONLINE' } satisfies Localized,
  title: { he: 'פודקאסטים וכתבות וידאו נוספים', en: 'More podcasts & video coverage' } satisfies Localized,
  lead: {
    he: 'נבחרות ואנשיה בפודקאסטים ובערוצי וידאו אחרים, לא כולל את "חרדית מדוברת", לפודקאסט שלנו יש עמוד משלה.',
    en: 'Nivcharot and its people on other podcasts and video channels, not including "Haredit Meduberet," our own podcast, which has its own page.',
  } satisfies Localized,
  podcastsTitle: { he: 'פודקאסטים', en: 'Podcasts' } satisfies Localized,
  videoTitle: { he: 'וידאו וטלוויזיה', en: 'Video & TV' } satisfies Localized,
  talksTitle: { he: 'הרצאות וכנסים', en: 'Talks & conferences' } satisfies Localized,
  listenLabel: { he: 'להאזנה ↗', en: 'Listen ↗' } satisfies Localized,
  watchLabel: { he: 'לצפייה ↗', en: 'Watch ↗' } satisfies Localized,
  ourPodcastLinkLabel: { he: 'לעמוד הפודקאסט שלנו', en: 'Our own podcast page' } satisfies Localized,
  /** Shown when the current locale differs from the item's real `sourceLanguage` — same convention as `press-archive.ts`'s badge. */
  originalLanguageBadge: {
    he: { he: 'במקור בעברית', en: 'Originally in Hebrew' } satisfies Localized,
    en: { he: 'במקור באנגלית', en: 'Originally in English' } satisfies Localized,
  },
} as const
