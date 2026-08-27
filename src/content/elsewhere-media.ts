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
  /** Optional cover image. Podcasts without one fall back to the waveform icon tile. */
  image?: { src: string; alt: string }
}

export const otherPodcasts: ElsewhereMediaItem[] = [
  {
    slug: 'kan-medabrim-patuach',
    kind: 'podcast',
    host: 'מדברים פתוח · כאן',
    sourceLanguage: 'he',
    title: {
      he: 'על הגזענות בסמינר, הקמת נבחרות והסרט "חשבונות שמיים"',
      en: 'On racism at seminary, founding Nivcharot, and the film "Cheshbonot Shamayim"',
    },
    summary: {
      he: 'בשיחה עם עמירם כהן: הגזענות שספגה בסמינר בבני ברק, הקמת תנועת נבחרות וקמפיין "לא נבחרות לא בוחרות", התמיכה והעלבונות שהגיעו בעקבותיו, ההסכת המצולם "חרדית מדוברת" והסרט "חשבונות שמיים" שיצא באותה שנה. 51 דקות.',
      en: 'A conversation with host Amiram Cohen: the racism she faced at seminary in Bnei Brak, founding Nivcharot and the "Lo Nivcharot Lo Bocharot" campaign, the support and the abuse that followed it, the filmed podcast "Haredit Meduberet," and her film "Cheshbonot Shamayim," released that year. 51 minutes.',
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
    title: {
      he: 'בכורה במשפחה בת 12 ילדים, והדרך לתנועת מחאה',
      en: 'The eldest of twelve, and the road to a protest movement',
    },
    summary: {
      he: 'שיחה אישית עם אשכול נבו: ילדות כאחות הבכורה במשפחה חרדית בת 12 ילדים ותחושת אי-השייכות שליוותה אותה, ומשם לייסוד תנועת המחאה "לא נבחרות לא בוחרות", להכשרת מנהיגות נשים בחברה החרדית ולמאבק בהדרתן ממוקדי קבלת ההחלטות. 26 דקות.',
      en: 'A personal conversation with Eshkol Nevo: growing up as the eldest of twelve children in a Haredi family and the sense of not belonging that came with it, and from there to founding the "Lo Nivcharot Lo Bocharot" protest movement, training women leaders in Haredi society and fighting their exclusion from decision-making. 26 minutes.',
    },
    dateLabel: { he: '11.2.2022', en: 'Feb 11, 2022' },
    sortDate: '2022-02-11',
    url: 'https://www.kan.org.il/content/kan/podcasts/p-8326/30849/',
  },
  {
    slug: 'kan-kotevet-umochelet-ahava',
    kind: 'podcast',
    host: 'כותבת ומוחקת אהבה · כאן',
    sourceLanguage: 'he',
    title: {
      he: '"נשים חרדיות זה המגזר שהכי קל לעשוק"',
      en: '"Haredi women are the easiest sector to exploit"',
    },
    summary: {
      he: 'שיחה עם ענת לב אדלר, בהשתתפות ד"ר גלי סמבירא, סביב השאלה שכאן מנסחת כך: מה היא יותר, חרדית או פמיניסטית - ולמה ממש לא דחוף לה להכריע. 45 דקות.',
      en: 'A conversation with host Anat Lev Adler, with Dr. Gali Sambira, around the question Kan itself poses: which is she more, Haredi or feminist - and why she is in no hurry to decide. 45 minutes.',
    },
    dateLabel: { he: '10.7.2017', en: 'July 10, 2017' },
    sortDate: '2017-07-10',
    url: 'https://www.kan.org.il/content/kan/podcasts/p-8693/18991/',
  },
  {
    slug: 'radical-haredi-feminism',
    kind: 'podcast',
    host: 'הרדיקל',
    sourceLanguage: 'he',
    title: {
      he: 'מעמד הנשים בחברה החרדית והמורכבות של פמיניזם חרדי',
      en: "Women's status in Haredi society and the complexity of Haredi feminism",
    },
    summary: {
      he: 'פרק 10 של "הרדיקל": ד"ר ג׳רמי פוגל בשיחה על מעמד הנשים בחברה החרדית ועל המורכבויות של פמיניזם חרדי.',
      en: 'Episode 10 of "The Radical": Dr. Jeremy Fogel in conversation on the status of women in Haredi society and the complexities of Haredi feminism.',
    },
    dateLabel: { he: '7.8.2024', en: 'Aug 7, 2024' },
    sortDate: '2024-08-07',
    url: 'https://www.youtube.com/watch?v=Q4Nse7AdjsU',
  },
  {
    slug: 'israel-from-the-inside-daniel-gordis',
    kind: 'podcast',
    host: 'Israel from the Inside with Daniel Gordis',
    sourceLanguage: 'en',
    title: {
      he: 'חרדית, אקטיביסטית, יוצרת קולנוע - ואם לחיילים',
      en: 'Haredi, a political activist, a film-maker - and the mother of soldiers',
    },
    summary: {
      he: 'ריאיון באנגלית אצל דניאל גורדיס, שמציג את האורחת כמי ש"מנפצת כל דעה קדומה" ולדבריו מציעה תקווה באשר לחברה החרדית בישראל - בעוד שההנהגה החרדית, כלשונו, רואה בה משהו אחר לגמרי.',
      en: 'An English-language interview with Daniel Gordis, who introduces his guest as a woman who "breaks all preconceptions" and, in his words, offers a beacon of hope regarding Israel\'s Haredi population - while to Haredi leadership she is "something else altogether."',
    },
    dateLabel: { he: '10.4.2024', en: 'Apr 10, 2024' },
    sortDate: '2024-04-10',
    url: 'https://danielgordis.substack.com/p/esty-shusan-is-haredi-ultra-orthodox-4cb',
    note: {
      he: 'הפרק המלא פתוח למנויים משלמים בלבד; התקציר כאן נכתב מהחלק הפתוח לקריאה ומתיאור הפרק.',
      en: 'The full episode is for paid subscribers only; this summary is written from the freely readable portion and the episode description.',
    },
  },
  {
    slug: 'looks-like-work-chedva-ludmir',
    kind: 'podcast',
    host: 'Looks Like Work with Chedva Ludmir',
    sourceLanguage: 'en',
    title: {
      he: 'לצאת מהמצרים שלך ולקחת אחרים איתך',
      en: 'Exiting your own Egypt and taking others with you',
    },
    summary: {
      he: 'שיחה באנגלית עם חדוה לודמיר בפודקאסט "Looks Like Work", על יציאה מהמקום שגדלת בו בלי לנתק את הקשר עם הקהילה, ועל לקיחת אחרים איתך בדרך.',
      en: 'An English-language conversation with Chedva Ludmir on the "Looks Like Work" podcast, about leaving the place you grew up in without severing ties to your community, and taking others with you on the way.',
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
      he: '"היו לי משברי אמונה"',
      en: '"I have had crises of faith"',
    },
    summary: {
      he: 'ריאיון בפודקאסט "הכול פתוח" של אבי שושן, שכותרתו הרשמית היא הציטוט "היו לי משברי אמונה".',
      en: 'An interview on Avi Shushan\'s podcast "Hakol Patuach," whose official episode title is the quote "I have had crises of faith."',
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
      he: 'חמישים גוונים של שחור-לבן: על חרדיות ליברלית ופוליטיקה חרדית',
      en: 'Fifty shades of black and white: liberal Haredi identity and Haredi politics',
    },
    summary: {
      he: 'שיחה מעמיקה עם משה רדמן ב"כל הקלפים על השולחן" על החברה החרדית, על חרדיות ליברלית, על השוני והדמיון בין חילונים לחרדים, על נבחרי ציבור ועל פוליטיקה חרדית.',
      en: 'An in-depth conversation with Moshe Redman on "Kol HaKlafim Al HaShulchan" about Haredi society, liberal Haredi identity, the differences and similarities between secular and Haredi Israelis, elected officials, and Haredi politics.',
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
      he: 'מנהיגות לא טיפוסית: בין משה למאבק הנשים החרדיות',
      en: "Atypical leadership: from Moses to the Haredi women's struggle",
    },
    summary: {
      he: 'קריאה משותפת עם רחל עזריה בפרשת עקב: ניתוח מחודש של דברי משה לעם רגע לפני הכניסה לארץ, ומשם לאתגרי ההווה - גיוס החרדים והפערים בתפיסות בין המגזרים.',
      en: "A joint reading of Parashat Eikev with Rachel Azaria: a fresh analysis of Moses's address to the people on the eve of entering the land, and from there to the present - Haredi conscription and the gaps in outlook between Israel's sectors.",
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
    title: {
      he: 'אשת חיל - טריילר הסרט התיעודי על הקמת נבחרות',
      en: 'Eshet Hail - trailer for the documentary on the founding of Nivcharot',
    },
    summary: {
      he: 'הטריילר ל"אשת חיל", סרט תיעודי המתעד את התהוותה של תנועת נבחרות, הפועלת לקידום, ייצוג וקול של נשים חרדיות. סרט הביכורים של הבמאית אנה סומרשף; הוקרן בהוט 8 ובסינמטקים ברחבי הארץ.',
      en: 'The trailer for "Eshet Hail," a documentary following the emergence of Nivcharot, which works for the advancement, representation and voice of Haredi women. The debut film of director Anna Somershaf; screened on HOT 8 and at cinematheques across Israel.',
    },
    dateLabel: { he: '16.1.2022', en: 'Jan 16, 2022' },
    sortDate: '2022-01-16',
    url: 'https://www.youtube.com/watch?v=iUYqRXVwz9o',
  },
  {
    slug: 'channel14-nidah-controversy-2022',
    kind: 'video',
    host: 'ערוץ 14',
    sourceLanguage: 'he',
    title: {
      he: 'סערת פרסום הנידה: "אנחנו לא אמורים למכור את היהדות שלנו"',
      en: 'The niddah-advert storm: "We are not supposed to sell off our Judaism"',
    },
    summary: {
      he: 'ריאיון בערוץ 14 בעקבות סערת פרסומת הנידה, שבו נטען כי אין למסחר את ההלכה ואת סמליה - "אנחנו לא אמורים למכור את היהדות שלנו".',
      en: 'A Channel 14 interview following the storm over a niddah-themed advertisement, arguing that Jewish law and its symbols should not be commercialised - "we are not supposed to sell off our Judaism."',
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
      he: 'הפרדוקס הנשי: למה מפלגות חרדיות הן המקום האחרון להשפעה',
      en: 'The paradox: why Haredi parties are the last place a Haredi woman can influence',
    },
    summary: {
      he: 'פאנל במהדורת יום האישה הבינלאומי של דמוקרטTV עם טל שניידר וגדי סוקניק, לצד מועמדת "עם שלם" הילה חסן-לפקוביץ, סביב הפרדוקס: נשים חרדיות יכולות להשפיע רק מתוך המפלגות החרדיות - שהן בדיוק המקום שבו הכי קשה להן להשפיע.',
      en: 'A panel on DemocraTV\'s International Women\'s Day edition with Tal Schneider and Gadi Sukenik, alongside "Am Shalem" candidate Hila Hasan-Lifkovitz, on the paradox: Haredi women can only exert influence from inside the Haredi parties - which are precisely where it is hardest for them to do so.',
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
      he: 'הקשרים בין פוליטיקאים חרדים ל"רב" ברלנד',
      en: 'The ties between Haredi politicians and "Rabbi" Berland',
    },
    summary: {
      he: 'ריאיון לחברת החדשות בעקבות החשיפה על הקשרים בין פוליטיקאים חרדים ל"רב" ברלנד: "ההתנהלות של העסקנות החרדית הפוליטית, זו התנהלות של חברה דתית סגורה" - ומדוע כניסת נשים למפלגות החרדיות תשים לכך קץ.',
      en: 'An interview with the Israeli News Company following the exposure of ties between Haredi politicians and "Rabbi" Berland: "the conduct of Haredi political operators is the conduct of a closed religious society" - and why bringing women into the Haredi parties would put an end to it.',
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
      he: 'הסיפור האישי שהוביל להקמת נבחרות',
      en: 'The personal story behind the founding of Nivcharot',
    },
    summary: {
      he: 'שיחה בערוץ "שביון SHEvyon" על הסיפור האישי שהוביל להקמת תנועת נבחרות.',
      en: 'A conversation on the "SHEvyon" channel about the personal story that led to the founding of the Nivcharot movement.',
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
    title: {
      he: 'No Voice No Vote: מדף פייסבוק לתנועה פמיניסטית חרדית',
      en: 'No Voice No Vote: from a Facebook page to a Haredi feminist movement',
    },
    summary: {
      he: 'הרצאת TEDxJerusalem, הראשונה מסוגה מפי אישה חרדית: כשההדרה וההגבלות על נשים בחברה החרדית הפכו לנורמה, נפתח קמפיין "לא נבחרות לא בוחרות" לשילוב נשים במפלגות החרדיות. ההרצאה מתארת את הדרך מאישה אחת מול דף פייסבוק ועד תנועה פמיניסטית חרדית - ואת הפער שבו נשים חרדיות רשאיות לבחור אך לא להיבחר.',
      en: 'A TEDxJerusalem talk, the first of its kind by a Haredi woman: when exclusion and severe restrictions on women became the norm in Haredi society, the "Lo Nivcharot Lo Bocharot" campaign was launched to integrate women into the Haredi parties. The talk traces the road from one woman in front of a Facebook page to a Haredi feminist movement - and the gap in which Haredi women may vote but not stand for election.',
    },
    dateLabel: { he: '27.5.2015', en: 'May 27, 2015' },
    sortDate: '2015-05-27',
    url: 'https://www.youtube.com/watch?v=CDYPibOZgHU',
  },
  {
    slug: 'wizo-egm-shushan-2016',
    kind: 'talk',
    host: 'World WIZO',
    sourceLanguage: 'he',
    title: {
      he: 'נאום באסיפה הכללית של ויצו העולמית, 2016',
      en: 'Address to the World WIZO General Meeting, 2016',
    },
    summary: {
      he: 'נאום באסיפה הכללית המיוחדת (EGM) של ארגון ויצו העולמי, שכותרתו אצל ויצו היא "No Voice, No Vote" - פמיניזם חרדי.',
      en: 'An address to the World WIZO Extraordinary General Meeting, billed by WIZO as "No Voice, No Vote" - ultra-Orthodox feminism.',
    },
    dateLabel: { he: '1.3.2016', en: 'Mar 1, 2016' },
    sortDate: '2016-03-01',
    url: 'https://www.youtube.com/watch?v=Pa6L-U8bvFg',
  },
  {
    slug: 'rappaport-prize-ceremony-video-2019',
    kind: 'talk',
    host: 'קרן רפפורט (Rappaport Prizes)',
    sourceLanguage: 'he',
    title: {
      he: 'פרס רפפורט 2019: נשים יוצרות שינוי',
      en: 'The 2019 Rappaport Prize: Women Generating Change',
    },
    summary: {
      he: 'הווידאו הרשמי של קרן רפפורט מטקס הפרס לנשים פורצות דרך (מוזיאון תל אביב לאמנות, מרץ 2019). אותו אירוע מתועד גם בכתבה בארכיון התקשורת שבעמוד זה.',
      en: "The Rappaport Foundation's official video from the prize ceremony for trailblazing women (Tel Aviv Museum of Art, March 2019). The same event is also documented in a press item elsewhere on this page.",
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
