/**
 * Typed fixture data for docs/Team.dc.html, shaped to match the
 * `team-members` Payload collection (src/payload/collections/TeamMembers.ts)
 * so this file is a drop-in stand-in until the CMS is wired up:
 *   - `name`/`role`/`bio` are localized text, matching the collection's
 *     `localized: true` fields (the collection's `bio` is `richText`; this
 *     fixture stores plain paragraph text since the mockup's bios are single
 *     paragraphs — swap for real Lexical JSON once Payload data lands).
 *   - `photo` mirrors the collection's `upload`/`relationTo: 'media'` field:
 *     a `src` + localized `alt`, or `null` when no photo could be sourced.
 *   - `order`/`active` mirror the collection's sidebar fields verbatim.
 *
 * Photo files were mirrored locally to `public/assets/team/` (2026-08-13,
 * site-owner brief item 33 — the old WordPress site is going offline, so no
 * asset may still hotlink to it) from the original
 * https://www.nivcharot.co.il/wp-content/uploads/... URLs the mockup used.
 * Served as local `/assets/team/...` paths through `next/image` in
 * `TeamMemberCard` — no `images.remotePatterns` entry needed anymore.
 *
 * 2026-08-13 brief (follow-up): the roster was unified — a separate
 * "over the years" section was folded back into one list — and expanded
 * with real people the site owner named. Photos for the newly-added people
 * were sourced from the open web (Wikipedia/Wikimedia Commons, all
 * verified free-licensed — see each `photo.src` for provenance) ONLY where
 * a specific, verifiable photo of that specific person could be confirmed.
 * Several — mostly Haredi women, consistent with the real photo-privacy
 * norm this site's own About/Story content describes — have no confirmed
 * free photo available; those stay `photo: null` (an `ImageSlot`
 * placeholder) rather than guessing.
 */

import type { Localized } from '@/lib/i18n'

export type TeamMemberPhoto = {
  src: string
  alt: Localized
}

export type TeamMember = {
  id: string
  name: Localized
  role: Localized
  /** Optional: a few historical entries have only a role/title line, no separate longer bio. */
  bio?: Localized
  /** `null` → render an `ImageSlot` instead of a photo. */
  photo: TeamMemberPhoto | null
  order: number
  active: boolean
}

export const teamHero: { eyebrow: Localized; title: Localized; lead: Localized } = {
  eyebrow: { he: 'אודות · הצוות', en: 'ABOUT · TEAM' },
  title: {
    he: 'מי שמחזיקה את זה בידיים.',
    en: 'The people holding this together.',
  },
  lead: {
    he: 'מנהלות, מנחות ופעילות שטח, לצד ועד מנהל וקהילת בוגרות רחבה. כמעט כולן עושות את זה בנוסף לעבודה, לבית ולקהילה שהן חיות בה.',
    en: 'Managers, facilitators and field activists, alongside a board and a broad alumnae community. Almost all of them do this on top of a job, a home, and the community they live in.',
  },
}

export const teamSectionIntro: { eyebrow: Localized; title: Localized } = {
  eyebrow: { he: 'מי אנחנו', en: 'WHO WE ARE' },
  title: { he: 'הצוות', en: 'The team' },
}

export const teamMembers: TeamMember[] = [
  {
    id: 'esty-shushan',
    name: { he: 'אסתי שושן', en: 'Esty Shushan' },
    role: {
      he: 'מייסדת ומנכ"לית, חברת עמותה וחברת קבוצת ההיגוי',
      en: 'Founder and CEO, association member and steering-group member',
    },
    bio: {
      he: 'אשת תקשורת, תסריטאית ויוצרת סרטים, חרדית מזרחית ואם לארבעה. מייסדת תנועת המחאה "לא נבחרות לא בוחרות" ועמותת נבחרות.',
      en: 'A media professional, screenwriter and filmmaker, a Mizrahi-Haredi woman and mother of four. Founder of the "No Voice, No Vote" protest movement and of Nivcharot.',
    },
    photo: {
      src: '/assets/team/esty-shushan.jpg',
      alt: { he: 'Esty Shushan', en: 'Esty Shushan' },
    },
    order: 1,
    active: true,
  },
  {
    id: 'hila-yalon',
    name: { he: 'הילה ילון', en: 'Hila Yalon' },
    role: { he: 'חברת ועד מנהל', en: 'Board member' },
    bio: {
      he: 'עובדת עם הצוות הישראלי של הפדרציה היהודית של סן פרנסיסקו. למעלה מעשרים שנות עבודת שטח וניהול בתחומי עלייה וקליטה, חינוך ותעסוקה. מנחת תיאטרון קהילתי ובוגרת מדיניות ציבורית.',
      en: 'Works with the Israeli team of the Jewish Federation of San Francisco. Over twenty years of fieldwork and management in immigration and absorption, education and employment. A community-theatre director and public-policy graduate.',
    },
    photo: {
      src: '/assets/team/hila-yalon.png',
      alt: { he: 'Hila Yalon', en: 'Hila Yalon' },
    },
    order: 2,
    active: true,
  },
  {
    id: 'hila-hasan-lefkowitz',
    name: { he: 'הילה חסן לפקוביץ', en: 'Hila Hasan Lefkowitz' },
    role: {
      he: 'לשעבר מנהלת פרויקטים וקשרי ממשל, חברת עמותה וחברת קבוצת ההיגוי',
      en: 'Former projects and government-relations manager, association member and steering-group member',
    },
    bio: {
      he: 'כיום יושבת ראש המועצה הדתית בכפר יונה. מאמנת נשים להשמיע את קולן הפנימי, פעילה חברתית הנוכחת בוועדות הכנסת שעניינן נשים חרדיות.',
      en: 'Today chair of the religious council in Kfar Yona. Coaches women to voice their inner voice, a social activist present in Knesset committees concerning Haredi women.',
    },
    photo: {
      src: '/assets/team/hila-hasan-lefkowitz.png',
      alt: { he: 'Hila Hasan Lefkowitz', en: 'Hila Hasan Lefkowitz' },
    },
    order: 3,
    active: true,
  },
  {
    id: 'tirtza-bloch-esterzon',
    name: { he: 'תרצה בלוך אסתרזון', en: 'Tirtza Bloch Esterzon' },
    role: {
      he: 'מנהלת קהילה ומנהלת קבוצות "אחותנו את", חברת עמותה וחברת קבוצת ההיגוי',
      en: 'Community manager and manager of the "Achotenu At" groups, association member and steering-group member',
    },
    bio: {
      he: 'אם לחמישה, כתבת תוכן, מתרגמת ומשווקת דיגיטלית. פעילה קהילתית בתחומי בריאות, רווחה ונשים חרדיות, מקדמת יזמות למשפחות חד־הוריות ולנשים בשוק העבודה.',
      en: 'Mother of five, a content writer, translator and digital marketer. A community activist on health, welfare and Haredi women, promoting initiatives for single-parent families and women in the workforce.',
    },
    photo: {
      src: '/assets/team/tirtza-bloch-esterzon.jpg',
      alt: { he: 'Tirtza Bloch Esterzon', en: 'Tirtza Bloch Esterzon' },
    },
    order: 4,
    active: true,
  },
  {
    id: 'efrat-shukrun',
    name: { he: 'אפרת שוקרון', en: 'Efrat Shukrun' },
    role: {
      he: 'מנחת התוכנית, חברת עמותה וחברת קבוצת ההיגוי',
      en: 'Program facilitator, association member and steering-group member',
    },
    bio: {
      he: 'אשת תקשורת ופאנליסטית, פמיניסטית חרדית ופעילה חברתית בנושאי הדרה עדתית, לימודי ליבה וייצוג נשים חרדיות במוקדי קבלת ההחלטות.',
      en: "A media professional and panelist, a Haredi feminist and social activist on ethnic discrimination, core-curriculum studies and Haredi women's representation in decision-making.",
    },
    photo: {
      src: '/assets/team/efrat-shukrun.png',
      alt: { he: 'Efrat Shukrun', en: 'Efrat Shukrun' },
    },
    order: 5,
    active: true,
  },
  {
    id: 'sara-yanetz',
    name: { he: 'שרה ינץ', en: 'Sara Yanetz' },
    role: {
      he: 'מנהלת סושיאל 2024–25, תחקירנית ומפיקה ב"חרדית מדוברת" 2025–6',
      en: 'Social media manager 2024–25; researcher and producer for "Haredit Meduberet" 2025–6',
    },
    bio: {
      he: 'אחראית על נוכחות נבחרות ברשתות החברתיות, ועל ההפקה והתחקיר של הפודקאסט.',
      en: "Responsible for Nivcharot's presence on social media, and for the podcast's production and research.",
    },
    photo: null,
    order: 6,
    active: true,
  },
  {
    id: 'esty-reader-indursky',
    name: { he: 'אסתי רידר אינדורסקי', en: 'Esty Reader Indursky' },
    role: {
      he: 'מנכ"לית משותפת, 2016–2018',
      en: 'Co-CEO, 2016–2018',
    },
    bio: {
      he: 'שותפה למהלכים המשפטיים והתקשורתיים שנעשו בשנות כהונתה. חוקרת וסופרת, כתבה את "ושאינן נראות", הספר הראשון שניסח את מושג הפמיניזם החרדי.',
      en: "Partner in the legal and media efforts of her years leading the organization. A researcher and author, she wrote \"And They Are Not Seen,\" the first book to articulate the concept of Haredi feminism.",
    },
    photo: {
      src: '/assets/team/esty-reader-indursky.jpg',
      alt: { he: 'אסתי רידר אינדורסקי', en: 'Esty Reader Indursky' },
    },
    order: 13,
    active: true,
  },
  {
    id: 'racheli-ibenboim',
    name: { he: 'רחלי איבנבוים', en: 'Racheli Ibenboim' },
    role: {
      he: 'מייסדת שותפה של ארגון "מעורבות", פעילה בקמפיין "לא נבחרות לא בוחרות", 2015',
      en: 'Co-founded "Meoravot" with Esty Shushan; activist in the "No Voice, No Vote" campaign, 2015',
    },
    photo: null,
    order: 9,
    active: true,
  },
  {
    id: 'tali-farkash',
    name: { he: 'טלי פרקש', en: 'Tali Farkash' },
    role: {
      he: 'פעילה בקמפיין "לא נבחרות לא בוחרות", 2015',
      en: 'Activist in the "No Voice, No Vote" campaign, 2015',
    },
    bio: {
      he: 'עיתונאית חרדית, כותבת טור דעה בשער "יהדות" באתר ynet.',
      en: 'A Haredi journalist, writes an opinion column in the Judaism section of Ynet.',
    },
    photo: {
      src: '/assets/team/tali-farkash.jpg',
      alt: { he: 'טלי פרקש', en: 'Tali Farkash' },
    },
    order: 10,
    active: true,
  },
  {
    id: 'racheli-rushgold-gottlieb',
    name: { he: 'רחלי רושגולד גוטליב', en: 'Racheli Rushgold Gottlieb' },
    role: { he: 'מנהלת קשרי ממשל, 2018', en: 'Government-relations manager, 2018' },
    photo: null,
    order: 14,
    active: true,
  },
  {
    id: 'michal-chernovitzky',
    name: { he: 'מיכל צ\'רנוביצקי', en: 'Michal Chernovitzky' },
    role: {
      he: 'פעילה בקמפיין "לא נבחרות לא בוחרות", 2015',
      en: 'Activist in the "No Voice, No Vote" campaign, 2015',
    },
    photo: null,
    order: 11,
    active: true,
  },
  {
    id: 'malki-rotner',
    name: { he: 'מלכי רוטנר', en: 'Malki Rotner' },
    role: { he: 'מנחת "הנבחרת", 2022 ו-2026', en: '"HaNivcheret" facilitator, 2022 and 2026' },
    photo: null,
    order: 20,
    active: true,
  },
  {
    id: 'sheli-rappaport',
    name: { he: 'שלי רפופורט', en: 'Sheli Rappaport' },
    role: {
      he: 'מנחת "הנבחרת", 2019, בשיתוף ויצו',
      en: '"HaNivcheret" facilitator, 2019, in partnership with WIZO',
    },
    photo: null,
    order: 17,
    active: true,
  },
  {
    id: 'mira-zohar',
    name: { he: 'מירה זוהר', en: 'Mira Zohar' },
    role: {
      he: 'מנחת "הנבחרת", 2018, בשיתוף ויצו והשגרירות האמריקאית',
      en: '"HaNivcheret" facilitator, 2018, in partnership with WIZO and the U.S. Embassy',
    },
    photo: null,
    order: 15,
    active: true,
  },
  {
    id: 'tzipi-lavi',
    name: { he: 'ציפי לביא', en: 'Tzipi Lavi' },
    role: { he: 'מנהלת פרויקטים וקשרי ממשל, 2024', en: 'Projects and government-relations manager, 2024' },
    photo: null,
    order: 21,
    active: true,
  },
  {
    id: 'leah-shainbrom',
    name: { he: 'לאה שיינברום', en: 'Leah Shainbrom' },
    role: { he: 'מנהלת קבוצות "שיח.ה"', en: 'Manager of the "Sicha" discussion groups' },
    photo: null,
    order: 18,
    active: true,
  },
  {
    id: 'raaya-mari',
    name: { he: 'רעיה מרי', en: 'Raaya Mari' },
    role: {
      he: 'מנהלת פרויקטים, 2022–2025, ועותרת ראשית בתיק נגד ש"ס',
      en: 'Projects manager, 2022–2025, and lead petitioner in the case against Shas',
    },
    photo: null,
    order: 19,
    active: true,
  },
  {
    id: 'esther-kramer',
    name: { he: 'אסתר קרמר', en: 'Esther Kramer' },
    role: {
      he: 'בוגרת "הנבחרת" 1, מרצה בתוכניות לענייני קשרי ממשל ועבודת ועדות הכנסת',
      en: 'HaNivcheret cohort 1 alumna; lecturer on government relations and Knesset committee work',
    },
    photo: null,
    order: 16,
    active: true,
  },
  {
    id: 'miri-rosen',
    name: { he: 'מירי רוזן', en: 'Miri Rosen' },
    role: { he: 'פעילה ומנכ"לית "מעורבות", 2015', en: 'Activist and CEO of "Meoravot", 2015' },
    photo: null,
    order: 12,
    active: true,
  },
  {
    id: 'reuven-bitton',
    name: { he: 'עו"ד ראובן ביטון', en: 'Adv. Reuven Bitton' },
    role: { he: 'יועץ משפטי', en: 'Legal advisor' },
    photo: null,
    order: 8,
    active: true,
  },
  {
    id: 'yoav-lalum',
    name: { he: 'עו"ד יואב ללום', en: 'Adv. Yoav Lalum' },
    role: { he: 'חבר ועד מנהל', en: 'Board member' },
    bio: {
      he: 'עורך דין, מייסד עמותת "נוער כהלכה" הפועלת נגד הפליה עדתית וחוסר שקיפות בקבלה למוסדות חינוך בציבור החרדי.',
      en: 'A lawyer, founder of the "Noar KaHalacha" association working against ethnic discrimination and lack of transparency in admissions to Haredi educational institutions.',
    },
    photo: {
      src: '/assets/team/yoav-lalum.jpg',
      alt: { he: 'עו"ד יואב ללום', en: 'Adv. Yoav Lalum' },
    },
    order: 7,
    active: true,
  },
]
