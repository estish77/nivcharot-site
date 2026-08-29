/**
 * Typed fixture data for docs/Join.dc.html, shaped to match the `join`
 * Payload global (src/payload/globals/Join.ts), which composes `heroField()`
 * + `pillarCardsField()` from src/payload/fields/globalSections.ts.
 *
 * One documented divergence from `pillarCardsField()`: that field models a
 * single `linkLabel`/`linkHref` pair per card — flagged in this agent's
 * final report as a schema gap for `pillarCardsField()` to consider (e.g. a
 * repeatable `links` sub-array) once Payload data replaces this file.
 *
 * The closing pull-quote banner has no dedicated field anywhere in the
 * schema; it's modeled here as a `sectionIntros`-shaped entry
 * (`key: 'quote'`, using `title` for the quote text) since that field's
 * eyebrow+h2+body shape is the closest existing fit.
 */

import type { Localized } from '@/lib/i18n'

export type JoinCtaLink = {
  label: Localized
  href: Localized<string>
  variant: 'primary' | 'secondary' | 'ghost'
  external?: boolean
}

export type JoinCard = {
  id: string
  number: string
  title: Localized
  body: Localized
  links: JoinCtaLink[]
}

export const joinHero: { eyebrow: Localized; title: Localized } = {
  eyebrow: { he: 'דברו איתנו', en: 'TALK TO US' },
  title: {
    he: 'השינוי לא יקרה בלעדייך.',
    en: "Change won't happen without you.",
  },
}

export const joinCards: JoinCard[] = [
  {
    id: 'join-program',
    number: '01',
    title: { he: 'להצטרף לנבחרת', en: 'Join HaNivcheret' },
    body: {
      he: 'תוכנית המנהיגות פתוחה לנשים חרדיות מכל רחבי הארץ. מחזור חדש נפתח מדי שנה. השאירי פרטים בטופס ונחזור אלייך לקראת פתיחת ההרשמה.',
      en: "The leadership program is open to Haredi women from across the country. A new cohort opens every year. Leave your details in the form and we'll get back to you when registration opens.",
    },
    links: [
      {
        label: { he: 'לטופס ההרשמה', en: 'To the sign-up form' },
        href: { he: '/he/hanivcheret#apply', en: '/en/hanivcheret#apply' },
        variant: 'primary',
      },
    ],
  },
  {
    id: 'support',
    number: '02',
    title: { he: 'לתמוך בפעילות', en: 'Support the work' },
    body: {
      he: 'נבחרות פועלת בזכות קרנות ותורמים פרטיים. כל תרומה מממנת הכשרה, פעילות משפטית ועבודת שטח.',
      en: 'Nivcharot runs on foundations and private donors. Every donation funds training, legal action and fieldwork.',
    },
    links: [
      {
        label: { he: 'לעמוד התרומה', en: 'Donation page' },
        /**
         * Was the old WordPress donation page (nivcharot.co.il) — that site
         * is being taken offline (2026-08-13 brief, item 33), and this site
         * now has its own real /donate page, so this points there instead.
         * Locale is hardcoded per-branch (not `/${locale}/donate`) since
         * this fixture object has no `locale` in scope at definition time —
         * same constraint as this card's mailto hrefs above.
         */
        href: { he: '/he/donate', en: '/en/donate' },
        variant: 'primary',
      },
    ],
  },
  {
    id: 'newsletter',
    number: '03',
    title: { he: 'להישאר בקשר', en: 'Stay in touch' },
    body: {
      he: 'הניוזלטר שלנו מרכז עדכונים על פעילות, פרקים חדשים בפודקאסט ואירועים קרובים.',
      en: 'Our newsletter gathers updates on activity, new podcast episodes and upcoming events (Hebrew).',
    },
    links: [
      {
        label: { he: 'הרשמה לניוזלטר', en: 'Newsletter signup' },
        href: { he: 'https://lp.vp4.me/8sit', en: 'https://lp.vp4.me/8sit' },
        variant: 'secondary',
        external: true,
      },
    ],
  },
]

/**
 * The page's closing "talk to us" band (2026-08-29 brief) — replaces what
 * used to be a fourth grid card (a "journalists, researchers, institutions"
 * blurb plus a bare mailto link). It now holds a real `ContactForm` (the
 * same one `/contact` uses, saved into the `inquiries` collection) and the
 * site's own follow row, so it earns a full-width section instead of a
 * quarter of a 4-card grid.
 */
export const joinTalkToUs = {
  eyebrow: { he: 'כתבו לנו', en: 'WRITE TO US' } satisfies Localized,
  title: { he: 'יש לך שאלה, או רעיון?', en: 'Have a question, or an idea?' } satisfies Localized,
  lead: {
    he: 'שיתוף פעולה, הצעה, או סתם רצית להגיד שלום? מלאו את הטופס ונחזור אליכן.',
    en: "A collaboration, a suggestion, or just want to say hi? Fill out the form and we'll get back to you.",
  } satisfies Localized,
  /**
   * Intro line above the two follow-link groups (2026-08-29 brief: "כתבו
   * טקסט מזמין לבוא לעקוב ולהביע תמיכה") — an invitation to follow and
   * show support, not just a bare "follow us" label.
   */
  followIntro: {
    he: 'כל עוקבת, כל לייק וכל שיתוף עוזרים לקול שלנו להישמע רחוק יותר. בואו לעקוב ולהראות תמיכה.',
    en: 'Every follower, every like and every share helps our voice carry further. Come follow us and show your support.',
  } satisfies Localized,
  /** Sub-headings for the two separated follow-link groups (see `buildNivcharotLinks`/`buildHareditLinks`). */
  followNivcharot: { he: 'נבחרות', en: 'Nivcharot' } satisfies Localized,
  followHaredit: { he: 'חרדית מדוברת', en: 'Haredit Meduberet' } satisfies Localized,
}

/**
 * The closing pull-quote banner. English keeps the single static movement
 * quote below; Hebrew instead rotates through `joinAlumnaeQuotes` (real,
 * Hebrew-only testimonials — see `AlumnaeQuoteBanner`), since translating a
 * real person's words would mean rewriting what she actually said.
 */
export const joinQuote: Localized = {
  he: '"כל עוד יש נשים חרדיות שרוצות לקחת חלק, צריך לתמוך בהן."',
  en: '"As long as there are Haredi women who want to take part, they must be supported."',
}

export type AlumnaQuote = {
  /** The quote itself, verbatim — not edited/shortened. */
  text: string
  /** First name only (2026-08-29 brief: drop the surname initial everywhere alumnae are quoted). */
  name: string
  /** "הנבחרת, מחזור X, שנה" — cohort context, never dropped. */
  cohort: string
}

/** Real alumnae testimonials for the Hebrew Join page's rotating quote banner (2026-08-29 brief). Verbatim — do not edit. */
export const joinAlumnaeQuotes: AlumnaQuote[] = [
  {
    text: 'שהקול שלי מעניין. שיש לי תפקיד וחובה ושליחות לחולל שינוי, ואין לי את הזכות לומר "אני לא יודעת" ולשבת מהצד.',
    name: 'שושנה',
    cohort: 'הנבחרת, מחזור 9, 2026',
  },
  {
    text: 'השינוי המרכזי שחל בי זה האמון בעצמי, והיכולת שלי, כבר עכשיו, לדבר ולהרים עיניים. להבין שרוצים לשמוע את דעתי, והכי חשוב: לדעת לפתח דעה עצמאית.',
    name: 'פייגי',
    cohort: 'הנבחרת, מחזור 6, 2023',
  },
  {
    text: 'יש מקום לשינוי בהלכה, והרצון לשינוי לא הופך אותי לרפורמית.',
    name: 'פייגא',
    cohort: 'הנבחרת, מחזור 9, 2026',
  },
  {
    text: 'גיליתי והבנתי שעוד לא אבדה תקווה, ויש מקום לשינויים מהפכניים בחברה החרדית. כל עוד יש כאלה כמוני שמדברות על העוולות והפגמים ורוצות לשנות אותן. בלי לפחד.',
    name: 'אפרת',
    cohort: 'הנבחרת, מחזור 2, 2019',
  },
  {
    text: 'התובנה המרכזית היא שחייבים נשים בפוליטיקה, אבל מסובך להגיע לשם. ובדרך לשם יש המון עשייה חברתית ועמדות השפעה נוספות, ולא פחות חשובות.',
    name: 'רות',
    cohort: 'הנבחרת, מחזור 5, 2022',
  },
  {
    text: 'שהיכולת לעשות שינוי הרבה יותר נגישה ממה שזה נראה מרחוק.',
    name: 'שושנה',
    cohort: 'הנבחרת, מחזור 8, 2025',
  },
  {
    text: 'שהכל אפשרי. שחייבת סבלנות והתמדה כדי לראות תוצאות.',
    name: 'הדר',
    cohort: 'הנבחרת, מחזור 5, 2022',
  },
]
