import type { Localized } from '@/lib/i18n'

/**
 * `/accessibility` — the legally-required accessibility statement
 * (הצהרת נגישות) under the Equal Rights for Persons with Disabilities Law
 * and its service regulations (תקנות שוויון זכויות לאנשים עם מוגבלות
 * (התאמות נגישות לשירות), התשע"ג-2013). Deliberately NOT CMS-backed
 * (unlike `/mishpat`'s richText fallback pattern) — this is a compliance
 * document, not marketing copy, so it's a plain static fixture a
 * non-technical editor can't accidentally soften or blank out from
 * `/admin`. Content here must stay honest about what's actually been
 * done (see `knownLimitations`) rather than over-claim certified
 * compliance — a statement that doesn't match reality is worse than no
 * statement when it's the thing standing between the org and a claim.
 *
 * `lastReviewed` is a plain display string (not computed) so it only
 * changes when a real review happens — see `README` note in this file's
 * git history before bumping it without a matching review.
 */

export const accessibilityHero = {
  eyebrow: { he: 'נגישות', en: 'Accessibility' } satisfies Localized,
  title: { he: 'הצהרת נגישות', en: 'Accessibility statement' } satisfies Localized,
  lastReviewed: { he: 'עודכן לאחרונה: 2 באוקטובר 2026', en: 'Last updated: October 2, 2026' } satisfies Localized,
}

export const accessibilityIntro: Localized = {
  he: 'עמותת נבחרות פועלת להנגיש את אתר האינטרנט שלה לאנשים עם מוגבלות, מתוך אמונה שלכל אדם מגיעה גישה שוויונית למידע ולשירות. האתר נבנה ומתוחזק מתוך כוונה לעמוד בתקן הישראלי ת"י 5568 להנגשת תכנים באינטרנט, המבוסס על הנחיות WCAG 2.0 בדרגת AA, ובהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013.',
  en: 'Nivcharot works to make its website accessible to people with disabilities, in the belief that everyone is entitled to equal access to information and service. The site is built and maintained with the intention of meeting Israeli Standard 5568 for web accessibility (based on WCAG 2.0 level AA), in accordance with the Equal Rights for Persons with Disabilities Regulations (Service Accessibility Adjustments), 2013.',
}

export const accessibilityAccommodations = {
  heading: { he: 'התאמות הנגישות שבוצעו באתר', en: 'Accessibility accommodations on this site' } satisfies Localized,
  items: [
    {
      he: 'מבנה כותרות עקבי בכל עמוד, לניווט נוח עם קוראי מסך.',
      en: 'A consistent heading structure on every page, for easy screen-reader navigation.',
    },
    {
      he: 'טקסט חלופי (alt) לתמונות תוכן.',
      en: 'Alternative text (alt) for content images.',
    },
    {
      he: 'תוויות מחוברות לכל שדה בטפסים, כולל הודעות שגיאה המחוברות לשדה הרלוונטי עבור קוראי מסך.',
      en: 'Labels linked to every form field, including error messages tied to the relevant field for screen readers.',
    },
    {
      he: 'ניווט מלא במקלדת: קישור "דלג לתוכן" בראש כל עמוד, לכידת מיקוד (focus) בתוך תפריטים וחלונות קופצים, וסגירתם במקש Escape.',
      en: 'Full keyboard navigation: a "skip to content" link at the top of every page, focus trapped inside open menus and pop-ups, and Escape-to-close for them.',
    },
    {
      he: 'סמן מיקוד (focus) נראה לעין על כל רכיב אינטראקטיבי.',
      en: 'A visible focus indicator on every interactive element.',
    },
    {
      he: 'ניגודיות צבעים לטקסט בהתאם לדרישות התקן.',
      en: "Text color contrast that meets the standard's requirements.",
    },
    {
      he: 'כיווניות טקסט נכונה בהתאם לשפת העמוד — עברית מימין לשמאל, אנגלית משמאל לימין.',
      en: "Correct text direction for the page's language — Hebrew right-to-left, English left-to-right.",
    },
    {
      he: 'תמיכה בקוראי מסך ברכיבים דינמיים (תפריט, אקורדיון, קרוסלה, חלונות סטורי) באמצעות תקני ARIA.',
      en: 'Screen-reader support for dynamic components (menu, accordion, carousel, story viewer) via ARIA standards.',
    },
  ] satisfies Localized[],
}

export const accessibilityLimitations = {
  heading: { he: 'מגבלות נגישות ידועות', en: 'Known accessibility limitations' } satisfies Localized,
  items: [
    {
      he: 'הצהרה זו מבוססת על בדיקה פנימית של צוות האתר, ועדיין לא עברה בדיקה של בודק/ת נגישות מוסמך/ת חיצוני/ת. העמותה פועלת להשלים בדיקה כזו.',
      en: "This statement is based on the site team's own internal review, and has not yet been audited by an external certified accessibility auditor. The organization is working to arrange one.",
    },
    {
      he: 'קבצי ה-PDF המקושרים מעמוד "הלכה" עדיין לא נבדקו לנגישות מלאה לקוראי מסך.',
      en: 'The PDF files linked from the Halakha page have not yet been verified for full screen-reader accessibility.',
    },
    {
      he: 'סרטוני וידאו המוטמעים מיוטיוב (בעמוד הפודקאסט ובתצוגת ה"סטורי") מופעלים בנגן החיצוני של יוטיוב, שנגישותו תלויה בפלטפורמה החיצונית ואינה בשליטתנו.',
      en: "Embedded YouTube videos (on the podcast page and in the story viewer) play inside YouTube's own player, whose accessibility depends on that external platform and isn't within our control.",
    },
  ] satisfies Localized[],
}

export const accessibilityContact = {
  heading: { he: 'פנייה בנושא נגישות', en: 'Accessibility contact' } satisfies Localized,
  body: {
    he: 'נתקלתן/תם בבעיית נגישות באתר, או שיש לכן/ם הצעה לשיפור? נשמח שתפנו לרכזת הנגישות של העמותה:',
    en: "Did you run into an accessibility problem on this site, or have a suggestion? We'd welcome you contacting the organization's accessibility coordinator:",
  } satisfies Localized,
  coordinatorName: { he: 'אסתי שושן, רכזת הנגישות', en: 'Esty Shushan, Accessibility Coordinator' } satisfies Localized,
  coordinatorEmail: 'estish@nivcharot.com',
}

export const accessibilityEscalation = {
  heading: { he: 'פנייה לנציבות שוויון זכויות לאנשים עם מוגבלות', en: 'Appealing to the Commission for Equal Rights of Persons with Disabilities' } satisfies Localized,
  body: {
    he: 'אם פנייתכן/ם לרכזת הנגישות לא הניבה מענה הולם, ניתן לפנות גם לנציבות שוויון זכויות לאנשים עם מוגבלות במשרד המשפטים.',
    en: "If your request to the accessibility coordinator didn't get an adequate response, you can also contact the Commission for Equal Rights of Persons with Disabilities at the Ministry of Justice.",
  } satisfies Localized,
}
