import type { Localized } from '@/lib/i18n'

/**
 * Real feedback from HaNivcheret graduates — 20 responses across cohorts
 * 2 to 9 (2019–2026), supplied by the movement on 2026-08-29.
 *
 * These REPLACE the six placeholder quotes this page shipped with, which
 * were the mockup's own dummy text attributed to "שם הבוגרת · בוגרת מחזור N".
 *
 * Names are given as the graduates themselves signed them — a first name
 * and a surname initial — and are transliterated for `en`, never
 * translated. One response came in unsigned and is credited to the cohort
 * rather than given an invented name.
 *
 * The year is not stored per entry: every cohort runs the year after
 * `2017 + cohort` would suggest, which `alumnaYear()` derives, so the two
 * can't fall out of step.
 */
export type AlumnaTestimonial = {
  id: string
  cohort: number
  /** As signed by the graduate. Transliterated for `en`, not translated. */
  name: Localized
  quote: Localized
}

/** Cohort 2 ran in 2019, cohort 9 in 2026 — one cohort a year, no gaps in between. */
export function alumnaYear(cohort: number): number {
  return 2017 + cohort
}

export const alumnaeTestimonials: AlumnaTestimonial[] = [
  {
    id: 'c2-efrat',
    cohort: 2,
    name: { he: 'אפרת ג׳.', en: 'Efrat G.' },
    quote: {
      he: 'גיליתי והבנתי שעוד לא אבדה תקווה, ויש מקום לשינויים מהפכניים בחברה החרדית. כל עוד יש כאלה כמוני שמדברות על העוולות והפגמים ורוצות לשנות אותן. בלי לפחד.',
      en: 'I discovered that hope is not lost, and that there is room for revolutionary change in Haredi society — as long as there are women like me who name the wrongs and the flaws and want to change them. Without being afraid.',
    },
  },
  {
    id: 'c2-lali',
    cohort: 2,
    name: { he: 'ללי ש.', en: 'Lali S.' },
    quote: {
      he: 'רוב הדברים שהיו מבחינתי מובנים מאליהם — ייתכן שהם ממש לא כך. השקפות, דעות קדומות ומוסכמות שנופצו לי במהלך הקורס. למדתי שהעולם לא בדיוק שחור ולבן כפי שחונכתי. למדתי להיעצר, לחשוב ולבחון מחדש דברים שפעם לא העזתי בכלל.',
      en: 'Most of what I took for granted may be nothing of the sort. Outlooks, prejudices and received wisdom were all broken open for me during the course. I learned that the world is not quite as black and white as I was raised to believe. I learned to stop, to think, and to re-examine things I once would not have dared to.',
    },
  },
  {
    id: 'c2-riki',
    cohort: 2,
    name: { he: 'ריקי ל.', en: 'Riki L.' },
    quote: {
      he: 'ההבנה מי אני, מה אני רוצה לקדם, ואיזה מחירים אני מוכנה לשלם. אני רוצה להיכנס לפוליטיקה ולעשות שינויים.',
      en: 'Understanding who I am, what I want to advance, and what price I am willing to pay for it. I want to go into politics and make change.',
    },
  },
  {
    id: 'c2-shoshi',
    cohort: 2,
    name: { he: 'שושי א.', en: 'Shoshi A.' },
    quote: {
      he: 'התוכנית עשתה לי סדר בראש — גם מבחינה מקצועית וגם מבחינת הדעות הפוליטיות והחברתיות שלי. השינוי הגדול: לא למתג ולא לשפוט אף אדם באשר הוא.',
      en: 'The programme put my thinking in order — professionally, and in my political and social views. The big change: not to label and not to judge any person, whoever they are.',
    },
  },
  {
    id: 'c4-meital',
    cohort: 4,
    name: { he: 'מיטל צ.', en: 'Meital Tz.' },
    quote: {
      he: 'לא תיארתי לעצמי שאיחשף למגוון כזה רחב של ידע, לקבוצת נשים שלכאורה נראות "רגילות" והן כל כך שונות ומיוחדות. התוכנית גרמה לי להבין שאני מסוגלת ויכולה, ושהדעה שלי חשובה.',
      en: 'I never imagined I would meet such a breadth of knowledge, or a group of women who look "ordinary" and are each so different and remarkable. The programme made me understand that I am capable, and that my opinion matters.',
    },
  },
  {
    id: 'c4-anon',
    cohort: 4,
    // Came in unsigned; credited to the cohort rather than given a name.
    name: { he: 'בוגרת מחזור 4', en: 'Cohort 4 alumna' },
    quote: {
      he: 'ביטחון עצמי. הבעת עמדה ללא צורך בהתנצלות. גאווה על היותי אישה חרדית.',
      en: 'Self-confidence. Stating a position without needing to apologise for it. Pride in being a Haredi woman.',
    },
  },
  {
    id: 'c5-ayala',
    cohort: 5,
    name: { he: 'אילה מ.', en: 'Ayala M.' },
    quote: {
      he: 'פעם ראשונה שאני חלק ממעגל נשים — וזה מדהים!',
      en: 'The first time I have been part of a circle of women — and it is extraordinary!',
    },
  },
  {
    id: 'c5-hadar',
    cohort: 5,
    name: { he: 'הדר ל.', en: 'Hadar L.' },
    quote: {
      he: 'שהכל אפשרי. שחייבת סבלנות והתמדה כדי לראות תוצאות.',
      en: 'That everything is possible. That it takes patience and persistence to see results.',
    },
  },
  {
    id: 'c5-ruth',
    cohort: 5,
    name: { he: 'רות כ.', en: 'Ruth C.' },
    quote: {
      he: 'התובנה המרכזית היא שחייבים נשים בפוליטיקה — אבל מסובך להגיע לשם. ובדרך לשם יש המון עשייה חברתית ועמדות השפעה נוספות, ולא פחות חשובות.',
      en: 'The central insight is that we need women in politics — but getting there is complicated. And on the way there is a great deal of social work and other positions of influence, no less important.',
    },
  },
  {
    id: 'c6-faigy',
    cohort: 6,
    name: { he: 'פייגי ג.', en: 'Faigy G.' },
    quote: {
      he: 'השינוי המרכזי שחל בי זה האמון בעצמי, והיכולת שלי — כבר עכשיו — לדבר ולהרים עיניים. להבין שרוצים לשמוע את דעתי, והכי חשוב: לדעת לפתח דעה עצמאית.',
      en: 'The main change in me is trust in myself, and my ability — already now — to speak and to raise my eyes. To understand that people want to hear what I think, and above all: to know how to form an opinion of my own.',
    },
  },
  {
    id: 'c6-hodaya',
    cohort: 6,
    name: { he: 'הודיה ב.', en: 'Hodaya B.' },
    quote: {
      he: 'התחדדה לי ההבנה בגודל הנחיצות בהתפקדות של כל אישה חרדית לעשייה חברתית וציבורית, קטנה כגדולה — בהשמעת קולנו ובקידום האינטרסים שלנו.',
      en: 'It sharpened my sense of how badly every Haredi woman is needed in social and public work, small or large — in making our voices heard and advancing our interests.',
    },
  },
  {
    id: 'c6-chaya',
    cohort: 6,
    name: { he: 'חיה פ.', en: 'Chaya P.' },
    quote: {
      he: 'קיבלתי אומץ לעשות שינויים קטנים שחששתי מהם. עובדת על עצמי להיות יותר אמיצה לחלוק את הדעה שלי — ופחות לספור אנשים ומוסדות.',
      en: 'I gained the courage to make small changes I had been afraid of. I am working on being braver about sharing what I think — and on counting people and institutions less.',
    },
  },
  {
    id: 'c7-tzvia',
    cohort: 7,
    name: { he: 'צביה ב.', en: 'Tzvia B.' },
    quote: {
      he: 'קיבלתי אומץ להביע את הדעות שלי מבלי להתנצל. מעודדת את הקולגות שלי לעמוד על שלהן מבחינת השכר.',
      en: 'I gained the courage to express my views without apologising. I encourage my colleagues to stand their ground on pay.',
    },
  },
  {
    id: 'c7-sarah',
    cohort: 7,
    name: { he: 'שרה ח.', en: 'Sarah Ch.' },
    quote: {
      he: 'בעבר חשבתי שאם אין לי פתרון למשהו — חבל על האנרגיה של לדבר עליו בכלל. כאן קיבלתי תפנית בחשיבה: להיות ערה לסביבה שלי, לא להתעלם מדברים לא הוגנים גם אם אין להם פתרון, לדבר עליהם.',
      en: 'I used to think that if I had no solution to something, it was a waste of energy to talk about it at all. Here my thinking turned around: to stay alert to what is around me, not to look away from what is unfair even when there is no solution, and to speak about it.',
    },
  },
  {
    id: 'c8-ora',
    cohort: 8,
    name: { he: 'אורה כ.', en: 'Ora C.' },
    quote: {
      he: 'שלא צריך לבחור. לא בין הלכה לחשיבה, לא בין צניעות לעוצמה, לא בין שקט פנימי לקול חיצוני. הנבחרת לא נתנה לי "עוד כלים" — היא שמה לי מראה מול הפנים, והבנתי שאני לא צריכה להצטמצם כדי להשתלב.',
      en: 'That you do not have to choose. Not between halakha and thinking, not between modesty and strength, not between inner quiet and an outward voice. HaNivcheret did not hand me "more tools" — it held up a mirror, and I understood that I do not have to make myself smaller in order to fit in.',
    },
  },
  {
    id: 'c8-shoshana-g',
    cohort: 8,
    name: { he: 'שושנה ג.', en: 'Shoshana G.' },
    quote: {
      he: 'שהיכולת לעשות שינוי הרבה יותר נגישה ממה שזה נראה מרחוק.',
      en: 'That the ability to make change is far more within reach than it looks from a distance.',
    },
  },
  {
    id: 'c8-edith',
    cohort: 8,
    name: { he: 'אדית ק.', en: 'Edith K.' },
    quote: {
      he: 'לנשים יש הרבה יותר כוחות ממה שהן חושבות, ולכל אחת יש נקודה שבה היא יכולה להשפיע. אני אישית קיבלתי חיזוק על ההזדהות שלי בתור אישה חרדית.',
      en: 'Women have far more strength than they think, and every one of them has a point where she can make a difference. Personally, it strengthened how I identify as a Haredi woman.',
    },
  },
  {
    id: 'c9-faiga',
    cohort: 9,
    name: { he: 'פייגא ט.', en: 'Faiga T.' },
    quote: {
      he: 'יש מקום לשינוי בהלכה — והרצון לשינוי לא הופך אותי לרפורמית.',
      en: 'There is room for change within halakha — and wanting change does not make me a Reform Jew.',
    },
  },
  {
    id: 'c9-irina',
    cohort: 9,
    name: { he: 'אירינה ד.', en: 'Irina D.' },
    quote: {
      he: 'מנהיגות אינה תפקיד או תואר, אלא בחירה לקחת אחריות ולהשפיע. הבנתי שגם כאישה חרדית אפשר לשמור על הערכים, הצניעות והזהות שלנו — ובמקביל להשמיע קול, להוביל תהליכים ולהיות חלק ממעגלי קבלת ההחלטות.',
      en: 'Leadership is not a role or a title but a choice to take responsibility and to have an effect. I understood that as a Haredi woman I can hold on to our values, our modesty and our identity — and at the same time speak up, lead processes and be part of the circles where decisions are made.',
    },
  },
  {
    id: 'c9-shoshana-s',
    cohort: 9,
    name: { he: 'שושנה ס.', en: 'Shoshana S.' },
    quote: {
      he: 'שהקול שלי מעניין. שיש לי תפקיד וחובה ושליחות לחולל שינוי — ואין לי את הזכות לומר "אני לא יודעת" ולשבת מהצד.',
      en: 'That my voice is worth hearing. That I have a role, a duty and a mission to bring about change — and that I do not have the right to say "I don\'t know" and sit on the sidelines.',
    },
  },
]

/**
 * Interleaves the cohorts so neighbouring cards are rarely from the same
 * year (2026-08-29 brief: "mix them"). Deals the testimonials out
 * round-robin, one per cohort per pass, which spreads eight cohorts across
 * the wall instead of showing four cohort-2 cards in a row.
 *
 * Deterministic on purpose — a shuffle would render differently on the
 * server and the client and break hydration.
 */
export function interleavedTestimonials(items: AlumnaTestimonial[] = alumnaeTestimonials): AlumnaTestimonial[] {
  const byCohort = new Map<number, AlumnaTestimonial[]>()
  for (const item of items) {
    const bucket = byCohort.get(item.cohort)
    if (bucket) bucket.push(item)
    else byCohort.set(item.cohort, [item])
  }

  const queues = [...byCohort.entries()].sort(([a], [b]) => a - b).map(([, bucket]) => bucket)
  const out: AlumnaTestimonial[] = []
  for (let round = 0; out.length < items.length; round++) {
    for (const queue of queues) {
      if (round < queue.length) out.push(queue[round])
    }
  }
  return out
}
