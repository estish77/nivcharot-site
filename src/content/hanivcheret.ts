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
export type HeroVideoKey = 'estiStory' | 'hareditMeduberet' | 'nonTypicalLeadership' | 'none'

const HERO_VIDEO_IDS: Record<Exclude<HeroVideoKey, 'none'>, string> = {
  estiStory: 'C2SQgyVKo_c',
  hareditMeduberet: 'RXdFa9ghP4U',
  nonTypicalLeadership: 'Io2XwQxpKcM',
}

export type HanivcheretHeroMediaConfig = {
  heroVideo: HeroVideoKey
  customVideoUrl?: string
}

/** Default selection — matches the mockup's `default: 'הסיפור האישי של אסתי'`. */
export const hanivcheretHeroMedia: HanivcheretHeroMediaConfig = {
  heroVideo: 'estiStory',
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
