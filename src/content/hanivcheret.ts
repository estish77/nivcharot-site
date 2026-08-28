import type { Localized } from '@/lib/i18n'

/**
 * Typed fixture data for the HaNivcheret leadership-programme page
 * (docs/Hanivcheret.dc.html), shaped to line up with the eventual Payload
 * sources:
 *  - hero / CTA / curriculum copy -> `hanivcheret` global (heroField/pillarCards/sectionIntros)
 *  - the six alumnae quotes       -> `alumnae-quotes` collection
 *
 * IMPORTANT — the mockup's Hebrew and English hero sections are not just a
 * text translation of each other; they differ structurally:
 *  - Hebrew hero: wordmark image + copy on one side, the decorative
 *    Knesset-seat hall SVG on the other; the video/image sits in its own
 *    section below.
 *  - English hero: a "Flagship" tag + eyebrow + literal `<h1>HaNivcheret</h1>`
 *    + copy on one side, the video/image directly on the other; there is no
 *    seat-hall SVG anywhere in the English branch of the source file.
 * `HanivcheretPage` preserves this asymmetry deliberately (see its own
 * comment) rather than inventing parity between the two locales.
 */

export const hanivcheretHero = {
  /** English-only in the source (no Hebrew equivalent tag/eyebrow above the wordmark). */
  tag: { he: 'תוכנית הדגל', en: 'Flagship' } satisfies Localized,
  eyebrow: { he: 'תוכנית מנהיגות', en: 'LEADERSHIP PROGRAM' } satisfies Localized,
  /** Rendered as the page's one <h1> in both locales (Hebrew has no literal h1 in the source — see HanivcheretPage). */
  title: { he: 'הנבחרת', en: 'HaNivcheret' } satisfies Localized,
  /**
   * Hebrew-only: the source has no literal Hebrew h1, just a wordmark
   * `<img alt="הנבחרת, עתודת מנהיגות חרדיות, מבית תנועת נבחרות">`
   * (docs/Hanivcheret.dc.html:114). Since that alt text's descriptive
   * tagline has no other home once the wordmark became a real heading (see
   * HanivcheretPage), it's carried forward as a screen-reader-only
   * continuation of the h1 rather than dropped. The English branch's own
   * literal h1 was already just "HaNivcheret" with no equivalent tagline,
   * so there's nothing to restore on that side.
   */
  titleSrOnlySuffix: { he: 'עתודת מנהיגות חרדיות, מבית תנועת נבחרות', en: '' } satisfies Localized,
  /**
   * The two body paragraphs genuinely differ in length between locales in
   * the source (English carries an extra "no open registration right now"
   * sentence that Hebrew's second paragraph doesn't) — preserved verbatim,
   * not trimmed to match.
   */
  bodyPrimary: {
    he: 'תוכנית ההכשרה הציבורית, החברתית והפוליטית של נבחרות: מסע שנתי של ידע, כלים וקהילה לנשים חרדיות שרוצות להוביל שינוי, בשכונה, ברשות המקומית, בתקשורת ובחברה האזרחית.',
    en: "Nivcharot's public, social and political leadership program: a year-long journey of knowledge, tools and community for Haredi women who want to lead change, in their neighborhood, municipality, the media and civil society.",
  } satisfies Localized,
  bodySecondary: {
    he: 'מאז המחזור הראשון ב־2018 עברו בתוכנית תשעה מחזורים ומעל מאה בוגרות.',
    en: 'The ninth cohort has finished and there is no open registration right now. Leave your details and we will be in touch when the call for the tenth cohort opens. Since the first cohort in 2018, nine cohorts and over a hundred alumnae have passed through the program.',
  } satisfies Localized,
  cta: {
    label: { he: 'אשמח להצטרף למחזור העשירי', en: 'Join the tenth cohort mailing list' } satisfies Localized,
    /** "Join.dc.html" in the mockup. */
    href: '/join',
  },
  seatHallAriaLabel: {
    he: 'מושבי הכנסת, הכיסאות שממתינים לנשים חרדיות',
    en: 'Knesset seats, the chairs waiting for Haredi women',
  } satisfies Localized,
}

/**
 * The toggleable video/image hero, modeled as fixture config mirroring the
 * mockup's `props.heroVideo` enum + `props.customVideoUrl` override
 * (docs/Hanivcheret.dc.html:533-544). Not yet a field on the `hanivcheret`
 * Payload global (only `hero.{eyebrow,title,body}` exists there) — flagging
 * as a schema gap for whoever owns that file.
 */
/**
 * `estiStory` (the founder's personal-story clip) was removed on the
 * 2026-08-28 brief — that video now lives only on the media page, with the
 * rest of the video coverage. `programPromo` replaces it as the default:
 * the programme's own trailer is what this page is actually about.
 */
export type HeroVideoKey = 'programPromo' | 'hareditMeduberet' | 'nonTypicalLeadership' | 'none'

const HERO_VIDEO_IDS: Record<Exclude<HeroVideoKey, 'none'>, string> = {
  // "הנבחרת - את רוצה להיות שם כשזה קורה!" — the programme's own trailer,
  // from Nivcharot's media channel.
  programPromo: 'TSpKYym-CBI',
  hareditMeduberet: 'RXdFa9ghP4U',
  nonTypicalLeadership: 'Io2XwQxpKcM',
}

export type HanivcheretHeroMediaConfig = {
  heroVideo: HeroVideoKey
  customVideoUrl?: string
}

/** Default selection — the programme's own trailer (2026-08-28 brief). */
export const hanivcheretHeroMedia: HanivcheretHeroMediaConfig = {
  heroVideo: 'programPromo',
}

export type ResolvedHeroMedia =
  | { showVideo: true; showImage: false; embedUrl: string }
  | { showVideo: false; showImage: true }

/**
 * Mirrors the mockup's `__renderValsOrig()` video-id resolution exactly: a
 * `customVideoUrl` (any standard YouTube URL shape) overrides the enum pick
 * when it contains a recognizable 11-char video id.
 */
export function resolveHeroMedia(config: HanivcheretHeroMediaConfig): ResolvedHeroMedia {
  if (config.heroVideo === 'none') {
    return { showVideo: false, showImage: true }
  }
  let videoId = HERO_VIDEO_IDS[config.heroVideo]
  const custom = config.customVideoUrl?.trim()
  if (custom) {
    const match = custom.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)
    if (match) videoId = match[1]
  }
  return { showVideo: true, showImage: false, embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0` }
}

export const hanivcheretHeroImageSlot = {
  id: 'niv-hero',
  label: { he: 'תמונה, מפגש הנבחרת', en: 'Image, a HaNivcheret session' } satisfies Localized,
}

export const hanivcheretHeroVideoTitle = {
  he: 'סרטון, הנבחרת',
  en: 'Video, HaNivcheret',
} satisfies Localized

export type CurriculumItem = {
  id: string
  title: Localized
  body: Localized
}

export const hanivcheretCurriculumEyebrow = { he: 'מה בתוכנית', en: 'Inside the program' } satisfies Localized

export const hanivcheretCurriculum: CurriculumItem[] = [
  {
    id: 'knowledge',
    title: { he: 'ידע', en: 'Knowledge' },
    body: {
      he: 'פוליטיקה ישראלית, שלטון מקומי, מגדר והלכה, תקשורת ותקציבים, עם מיטב המרצות והמרצים.',
      en: 'Israeli politics, local government, gender and halacha, media and budgets, with leading lecturers.',
    },
  },
  {
    id: 'tools',
    title: { he: 'כלים', en: 'Tools' },
    body: {
      he: 'הופעה מול קהל ומצלמה, כתיבת עמדה, קמפיינים, ארגון קהילה ועבודה מול מוסדות.',
      en: 'Public speaking and camera work, position writing, campaigns, community organizing and working with institutions.',
    },
  },
  {
    id: 'community',
    title: { he: 'קהילה', en: 'Community' },
    body: {
      he: 'קבוצת עמיתות של נשים חזקות מכל גוני החברה החרדית, חברויות שנמשכות הרבה אחרי סיום המחזור.',
      en: 'A peer group of strong women from across Haredi society, friendships that last long after the cohort ends.',
    },
  },
  {
    id: 'action',
    title: { he: 'עשייה', en: 'Action' },
    body: {
      he: 'כל משתתפת יוצאת עם מיזם או זירת פעולה משלה, מוועדות הכנסת ועד יוזמות מקומיות.',
      en: 'Every participant leaves with a project or arena of her own, from Knesset committees to local initiatives.',
    },
  },
]

export type AlumnaQuote = {
  id: string
  cohort: number
  quote: Localized
}

export const hanivcheretQuotesEyebrow = { he: 'בוגרות מספרות', en: 'Alumnae voices' } satisfies Localized

/**
 * All six attributions are explicit placeholders in the mockup itself —
 * "שם הבוגרת · בוגרת מחזור N" / "Name · Cohort N alumna" — kept verbatim,
 * not filled in with invented names. `name` is intentionally not part of
 * this fixture's per-quote data (unlike the `alumnae-quotes` Payload
 * collection, whose `name` field is real and NOT localized per its own
 * schema comment); the placeholder label is rendered as static locale text
 * by `HanivcheretPage` instead.
 */
export const hanivcheretQuotes: AlumnaQuote[] = [
  {
    id: 'q2',
    cohort: 2,
    quote: {
      he: 'ביטחון לדבר במרחב הציבורי החרדי, וחברויות שאני עדיין שומרת עליהן.',
      en: 'Confidence to speak in the Haredi public sphere, and friendships I still keep.',
    },
  },
  {
    id: 'q4',
    cohort: 4,
    quote: {
      he: 'שיש לי את הכוח להשפיע, ושכוח פוליטי עבור מודרים אינו נוגד חיים מבוססי תורה.',
      en: 'I have the power to influence, and political power for the excluded does not contradict a Torah life.',
    },
  },
  {
    id: 'q5',
    cohort: 5,
    quote: {
      he: 'שאישה יכולה לחצוב באבן.',
      en: 'That a woman can carve through stone.',
    },
  },
  {
    id: 'q6',
    cohort: 6,
    quote: {
      he: 'למדתי לקרוא תקציב עירוני, ופתאום הבנתי שאני יכולה לשאול שאלות בוועדה ולא רק להתלונן בבית.',
      en: 'I learned to read a municipal budget, and suddenly I could ask questions in committee instead of complaining at home.',
    },
  },
  {
    id: 'q7',
    cohort: 7,
    quote: {
      he: 'הגעתי בטוחה שאני היחידה שחושבת ככה. יצאתי עם עשרים נשים שחושבות ככה.',
      en: 'I arrived certain I was the only one who thought this way. I left with twenty women who think this way.',
    },
  },
  {
    id: 'q9',
    cohort: 9,
    quote: {
      he: 'הכי מפתיע היה לגלות שהקול שלי לא מפריע לאף אחד. פשוט לא שמעו אותו קודם.',
      en: 'The surprise was finding that my voice bothers no one. It simply had not been heard before.',
    },
  },
]

export const hanivcheretAlumnaPlaceholder = {
  he: (cohort: number) => `שם הבוגרת · בוגרת מחזור ${cohort}`,
  en: (cohort: number) => `Name · Cohort ${cohort} alumna`,
}

/**
 * The programme's own facts, and the sign-up form's chrome (2026-08-28
 * brief). Structure, topics, session count, format and cost are taken from
 * Nivcharot's registration landing page (lp.vp4.me/ifrk).
 *
 * NO DATES ARE STATED. That page describes the cycle that ran May-July 2026,
 * with a March 2026 application deadline — both already past — so repeating
 * them here would advertise a closed cycle as the upcoming one. The form
 * below is therefore an expression of interest in the NEXT cycle, and the
 * copy says exactly that. Add the real dates here once they are set.
 */
export const hanivcheretProgram = {
  eyebrow: { he: 'עתודת מנהיגות חרדיות', en: 'A HAREDI WOMEN’S LEADERSHIP RESERVE' } satisfies Localized,
  title: { he: 'מה יש בתוכנית', en: 'What the programme holds' } satisfies Localized,
  lead: {
    he: 'תוכנית הכשרה לנשים חרדיות, לקידום מעורבות במוקדי קבלת החלטות ובזירה הציבורית.',
    en: "A training programme for Haredi women, to advance their involvement in decision-making centres and in public life.",
  } satisfies Localized,
  facts: [
    {
      label: { he: 'מפגשים', en: 'Sessions' } satisfies Localized,
      value: { he: 'עשרה מפגשים פרונטליים', en: 'Ten in-person sessions' } satisfies Localized,
    },
    {
      label: { he: 'מתכונת', en: 'Format' } satisfies Localized,
      value: {
        he: 'מפגש שבועי בימי ראשון אחר הצהריים, ומתוכם יום עיון מלא בכנסת',
        en: 'Weekly on Sunday afternoons, including one full study day at the Knesset',
      } satisfies Localized,
    },
    {
      label: { he: 'מיקום', en: 'Location' } satisfies Localized,
      value: { he: 'מרכז הארץ', en: 'Central Israel' } satisfies Localized,
    },
    {
      label: { he: 'למי', en: 'Who for' } satisfies Localized,
      value: { he: 'נשים חרדיות מכל רחבי הארץ', en: 'Haredi women from across the country' } satisfies Localized,
    },
  ],
  topicsTitle: { he: 'הנושאים', en: 'The topics' } satisfies Localized,
  topics: [
    { he: 'היסטוריה מגזרית ונשים בעמדות השפעה', en: 'Sectoral history, and women in positions of influence' } satisfies Localized,
    { he: 'תיאוריות מנהיגות ויחסי מגדר', en: 'Leadership theory and gender relations' } satisfies Localized,
    { he: 'מפגשי השראה עם מנהיגות', en: 'Inspiration sessions with women leaders' } satisfies Localized,
    { he: 'קונפליקטים וחסמים ייחודיים לנשים חרדיות', en: 'Conflicts and barriers specific to Haredi women' } satisfies Localized,
    { he: 'פמיניזם הלכתי וזרמים בהגות הפמיניסטית', en: 'Halakhic feminism and streams of feminist thought' } satisfies Localized,
    { he: 'אסטרטגיה פוליטית ובניית רשת קשרים', en: 'Political strategy and network building' } satisfies Localized,
    { he: 'רשתות חברתיות למנהיגות אזרחית', en: 'Social media for civic leadership' } satisfies Localized,
    { he: 'סביבות עבודה מוניציפליות וארציות', en: 'Municipal and national working environments' } satisfies Localized,
  ],
  mentoringNote: {
    he: 'המפגשים כוללים מנטורינג קבוצתי ודיונים מעמיקים.',
    en: 'Sessions include group mentoring and in-depth discussion.',
  } satisfies Localized,
} as const

export const hanivcheretApply = {
  eyebrow: { he: 'הרשמה למחזור הבא', en: 'NEXT COHORT' } satisfies Localized,
  title: { he: 'רוצה להיות שם כשזה קורה?', en: 'Want to be there when it happens?' } satisfies Localized,
  lead: {
    he: 'המחזור הבא טרם נפתח להרשמה. השאירי פרטים ונחזור אלייך עם הפתיחה, לפני כולם.',
    en: "Registration for the next cohort isn't open yet. Leave your details and we'll come back to you when it opens, before anyone else.",
  } satisfies Localized,
  processNote: {
    he: 'תהליך הקבלה במחזורים הקודמים כלל טופס פרטים, שאלון, וראיון אישי בזום עם מנהלות התוכנית.',
    en: 'In previous cohorts the admissions process was a details form, a questionnaire, and a personal Zoom interview with the programme managers.',
  } satisfies Localized,

  nameLabel: { he: 'שם מלא', en: 'Full name' } satisfies Localized,
  emailLabel: { he: 'כתובת אימייל', en: 'Email address' } satisfies Localized,
  phoneLabel: { he: 'טלפון', en: 'Phone' } satisfies Localized,
  motivationLabel: { he: 'למה את חושבת שהתוכנית מתאימה לך?', en: 'Why do you think this programme suits you?' } satisfies Localized,
  submitLabel: { he: 'שליחת פרטים', en: 'Send my details' } satisfies Localized,
  submittingLabel: { he: 'שולחת...', en: 'Sending...' } satisfies Localized,

  requiredError: { he: 'נא למלא את כל השדות', en: 'Please fill in every field' } satisfies Localized,
  emailError: { he: 'נא להזין כתובת אימייל תקינה', en: 'Please enter a valid email address' } satisfies Localized,
  phoneError: { he: 'נא להזין מספר טלפון תקין', en: 'Please enter a valid phone number' } satisfies Localized,
  submitError: {
    he: 'הפרטים לא נשלחו. אפשר לנסות שוב, או לכתוב ישירות ל-',
    en: 'Your details could not be sent. Please try again, or write directly to ',
  } satisfies Localized,
  successNote: {
    he: 'הפרטים נשמרו אצלנו. נחזור אלייך כשההרשמה למחזור הבא תיפתח.',
    en: "Your details are saved with us. We'll be in touch when registration for the next cohort opens.",
  } satisfies Localized,
} as const
