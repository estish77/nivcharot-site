/**
 * Typed fixture data for docs/"Home copy.dc.html", shaped to line up with
 * the `home` Payload global (`hero` / `statTiles` / `pillarCards` /
 * `sectionIntros`, per src/payload/fields/globalSections.ts) plus the
 * `posts` collection for the media-archive teaser strip.
 *
 * Internal links are stored as route *slugs* (e.g. `'story'`), not full
 * paths — every component composes the real href as `/${locale}/${slug}`,
 * since the path segment itself doesn't change between locales in this
 * app's routing.
 *
 * Two route-naming assumptions, made because the pages they point to are
 * built by other agents in parallel and hadn't landed yet at the time this
 * was written:
 *  - Shop.dc.html's donation flow is targeted as `/${locale}/donate` (not
 *    `/shop`) — the Payload schema report lists a `donate` global but no
 *    `shop` global, which is the strongest available signal for the slug
 *    the shop/donate page agent will land on. `Footer`'s own default
 *    (`/${locale}/shop`) disagrees; that's shared UI, out of this agent's
 *    lane to reconcile.
 *  - The mockup's own "Media.dc.html#archive" link (docs/ has no file by
 *    that name — the closest is ArchiveTemp.dc.html) is ported literally as
 *    `/${locale}/media#archive`, with individual archive cards linking to
 *    `/${locale}/media/${slug}`.
 */

import type { Locale, Localized } from '@/lib/i18n'

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

export type HeroCta = { label: Localized; slug: string }

export const heroContent: {
  eyebrow: Localized
  title: Localized
  lead: Localized
  primaryCta: HeroCta
  secondaryCta: HeroCta
} = {
  eyebrow: { he: 'נבחרות · מאז 2012', en: 'NIVCHAROT · SINCE 2012' },
  title: {
    he: 'נשים חרדיות\nלייצוג, שוויון וקול.',
    en: 'Haredi women for representation, equality and voice.',
  },
  lead: {
    he: 'ממחאה ברשת, לשטח, לתודעה, עד מקום בשולחן',
    en: 'From an online protest, to the ground, to public consciousness, to a seat at the table',
  },
  primaryCta: { label: { he: 'הסיפור שלנו', en: 'Our story' }, slug: 'story' },
  secondaryCta: { label: { he: 'לתרומה', en: 'Donate' }, slug: 'donate' },
}

/** The seat-hall's outer-ring sentence (`hallSentenceHe`/`hallSentenceEn` props, with their defaults). */
export const hallSentence: Localized = {
  he: 'את רוצה להיות שם כשזה יקרה',
  en: 'BE THERE WHEN IT HAPPENS',
}

/**
 * Fixes the mockup's `aria-label=""` on the seat-hall's `role="img"`
 * wrapper (a real a11y defect) with a meaningful bilingual description.
 */
export const hallAriaLabel: Localized = {
  he: 'הדמיה אינטראקטיבית של אולם מליאת הכנסת: 156 מושבים שמאירים כשעוברים לידם, מייצגים את הדרך עד לייצוג נשי חרדי',
  en: 'Interactive visualization of the Knesset plenum hall: 156 seats that light up as you move past them, representing the road to Haredi women’s representation',
}

// ---------------------------------------------------------------------------
// Stats band (slate "in brief" strip)
// ---------------------------------------------------------------------------

export type StatTile = { value: string; description: string }

/**
 * The mockup deliberately orders these 4 facts differently per locale (the
 * Hebrew branch opens on "78 years", the English branch opens on "0 women
 * in the Haredi parties") — preserved verbatim rather than normalized to a
 * single shared order.
 */
export const statTiles: Record<Locale, StatTile[]> = {
  he: [
    { value: '78', description: 'שנים שבהן לא נבחרה אף אישה לכנסת מטעם מפלגה חרדית - מ־1948 ועד היום' },
    {
      value: '350,000',
      description: 'נשים חרדיות בעלות זכות בחירה - ולאף אחת מהן אין נציגה במפלגה שהיא מצביעה לה',
    },
    { value: '18', description: 'מנדטים למפלגות החרדיות בכנסת ה־25 - כולם גברים' },
    { value: '0', description: 'נשים חרדיות במפלגות החרדיות .' },
  ],
  en: [
    {
      value: '0',
      description: "Haredi women in the Haredi parties - not in the Knesset, and not on local councils",
    },
    {
      value: '78',
      description: 'Years without a single woman elected to the Knesset on a Haredi party list - 1948 to today',
    },
    {
      value: '350,000',
      description: "Haredi women of voting age - none of them has a woman representing her in the party she votes for",
    },
    { value: '18', description: 'Knesset seats held by the Haredi parties in the 25th Knesset - all of them men' },
  ],
}

/** Only the English branch of the mockup carries this disclaimer paragraph — a genuine asymmetry, not an omission. */
export const statsFootnoteEn: string =
  'The Haredi population numbers about 1.45 million, some 14% of Israel (Haredi Society Yearbook 2025); about half of it is under 16. The Supreme Court ordered Agudat Yisrael to amend its bylaws, but membership is still not possible, and two petitions remain pending.'

// ---------------------------------------------------------------------------
// Purpose / three pillars
// ---------------------------------------------------------------------------

export type PillarCard = {
  id: string
  number: string
  title: Localized
  body: Localized
  linkLabel: Localized
  slug: string
}

export const goalSection: { eyebrow: Localized; titleLines: Localized<string[]>; lead: Localized } = {
  eyebrow: { he: 'המטרה', en: 'Our purpose' },
  titleLines: {
    he: ['מנהיגות חרדית אלטרנטיבית, אחראית, עם נשים סביב השולחן'],
    en: ['An alternative Haredi leadership,', 'of women and men alike'],
  },
  lead: {
    he: 'כדי לייצר שינוי אנו פועלות בערוצים פנימיים וחיצוניים',
    en: 'We are not asking to replace Haredi leadership but to widen it: a leadership women take part in, equally and respectfully. Three lines of work lead there.',
  },
}

/**
 * The mockup's English branch tags each card with a `tag-accent` "Line"
 * pill; the Hebrew branch has no equivalent tag at all (an empty slot in
 * the source markup, not a translation gap this agent filled in) — modeled
 * as an empty Hebrew string, which simply renders nothing.
 */
export const pillarTagLabel: Localized = { he: '', en: 'Line' }

export const pillarCards: PillarCard[] = [
  {
    id: 'awareness',
    number: '01',
    title: { he: 'העלאת מודעות', en: 'Raising awareness' },
    body: {
      he: 'להפוך את סוגיית הייצוג מטאבו לשיחה. האמצעים:  כתיבה בתקשורת החרדית והכללית, כנסים ומעגלי שיח בקהילה עבודת סושיאל. בפודקאסט "חרדית מדוברת" אנו מרחיבות את הסוגיות הדורשות טיפול ומייצרות שדרת מנהיגות ומנהיגים אלטרנטיבית.',
      en: 'Turning representation from a taboo into a conversation. The means: the podcast Haredit Meduberet, writing in the Haredi and general press, conferences and community circles.',
    },
    linkLabel: { he: 'לפודקאסט', en: 'The podcast' },
    slug: 'podcast',
  },
  {
    id: 'training',
    number: '02',
    title: { he: 'הכשרת מנהיגות', en: 'Training leadership' },
    body: {
      he: '"הנבחרת", תוכנית המנהיגות שלנו: תשעה מחזורים מאז 2018, כ־20 אקטיביסטיות בכל מחזור. הבוגרות מפיצות את הרעיונות הלאה ובונות שיתופי פעולה, פרוייקטים ויוזמות שמרחיבים את השיח החרדי־פמיניסטי.',
      en: 'HaNivcheret, our leadership program: nine cohorts since 2018, about 20 activists in each. Alumnae carry the ideas onward and build the partnerships that widen Haredi feminist discourse.',
    },
    linkLabel: { he: 'לעמוד הנבחרת', en: 'The program' },
    slug: 'hanivcheret',
  },
  {
    id: 'law',
    number: '03',
    title: { he: 'חקיקה, משפט והלכה', en: 'Law, policy and halakha' },
    body: {
      he: 'מהעתירות נגד תקנוני המפלגות, דרך ניירות עמדה ולובי בכנסת, ועד בירור עמדת ההלכה עצמה בשאלת שילוב נשים.',
      en: 'From the petitions against exclusionary party bylaws, through position papers and Knesset lobbying, to clarifying what halakha itself says about women in politics.',
    },
    linkLabel: { he: 'לפעילות', en: 'Advocacy' },
    slug: 'activism',
  },
]

// ---------------------------------------------------------------------------
// Timeline (condensed, 4 milestones)
// ---------------------------------------------------------------------------

export type TimelineItem = { year: string; body: Localized }

export const timelineSection: { title: Localized; linkLabel: Localized } = {
  title: { he: 'מ־2012 ועד היום', en: 'From 2012 to today' },
  linkLabel: { he: 'לציר הזמן המלא', en: 'Full timeline' },
}

export const timelineItems: TimelineItem[] = [
  {
    year: '2012',
    body: {
      he: 'דף הפייסבוק "לא נבחרות לא בוחרות" יוצא לדרך לקראת הבחירות לכנסת ה־19. אסתי שושן פותחת את הדף ומזניקה את תנועת הפמיניזם החרדי.',
      en: 'The "No Voice, No Vote" Facebook page launches ahead of the 19th Knesset elections.',
    },
  },
  {
    year: '2015',
    body: {
      he: 'מתנועת מחאה לעמותה רשומה: "נבחרות" קמה, והמאבק המשפטי בתקנוני המפלגות מתחיל.',
      en: 'From protest movement to registered NGO, and the legal battle over party bylaws begins.',
    },
  },
  {
    year: '2019',
    body: {
      he: 'בג"ץ מורה לאגודת ישראל לבטל כל מניעה לקבלת נשים כחברות מפלגה.',
      en: 'The Supreme Court orders Agudat Yisrael to remove every barrier to women’s membership.',
    },
  },
  {
    year: '2026',
    body: {
      he: 'המחזור התשיעי של "הנבחרת" נפגש, רשת הבוגרות צומחת, והפודקאסט מגיע לקהלים חדשים.',
      en: 'HaNivcheret 9 meets, the alumnae network grows, and the podcast reaches new audiences.',
    },
  },
]

// ---------------------------------------------------------------------------
// Donate / support CTA band (accent-red)
// ---------------------------------------------------------------------------

export const donateBand: {
  title: Localized
  primaryCta: { label: Localized; slug: string }
} = {
  title: {
    he: 'בואו להיות חלק מהשינוי שנבחרות עושה בעולם',
    en: 'Come be part of the change Nivcharot is making in the world',
  },
  /** This whole section IS the home page's donate banner (2026-08-13 brief, item 18) — one statement, one CTA. */
  primaryCta: { label: { he: 'למסלולי התמיכה', en: 'Support tracks' }, slug: 'donate' },
}

// ---------------------------------------------------------------------------
// Media archive strip
// ---------------------------------------------------------------------------

export const mediaArchiveSection: { title: Localized; linkLabel: Localized } = {
  title: { he: 'נבחרות במדיה', en: 'Nivcharot in the media' },
  linkLabel: { he: 'לכל הכתבות', en: 'All coverage' },
}
