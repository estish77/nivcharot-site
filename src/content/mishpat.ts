import type { Localized } from '@/lib/i18n'

/**
 * `/mishpat` — a placeholder "Law" page for now: a brief overview of
 * Nivcharot's legal tools. Real material is meant to be added later
 * directly through the `Mishpat` Payload global (a free-text `body`
 * richText field) — this file only supplies the hero copy and the
 * fallback body shown until an editor writes the real one, grounded in
 * what's already documented/verified elsewhere on the site (the
 * 2015–2019 Supreme Court petition and the position-papers work in
 * `src/content/activism.ts`), not invented.
 */

export const mishpatHero: { eyebrow: Localized; title: Localized; lead: Localized } = {
  eyebrow: { he: 'משפט', en: 'LAW' },
  title: { he: 'הכלים המשפטיים של נבחרות', en: "Nivcharot's legal tools" },
  /*
   * The trailing "this page will be expanded" sentence was dropped on
   * 2026-08-29: the page now carries a full article, so the line
   * contradicted what sits directly beneath it. Removed in both languages,
   * since both said it.
   */
  lead: {
    he: 'לצד הפעילות הציבורית, נבחרות פועלת גם בזירה המשפטית לקידום ייצוג נשים חרדיות.',
    en: "Alongside its public activity, Nivcharot also works in the legal arena to advance Haredi women's representation.",
  },
}

export const mishpatFallbackBody: string[] = [
  'מ־2015 הייתה נבחרות שותפה למאבק משפטי נגד סעיפי תקנון במפלגות חרדיות שמנעו מנשים להתמודד בהן. ב־2019, לאחר ארבע שנים, הורה בית המשפט העליון (בג"ץ) לאגודת ישראל לבטל כל מניעה לקבלת אישה כחברה במפלגה.',
  'נבחרות גם מגישה לאורך זמן ניירות עמדה לגורמים ציבוריים ומחוקקים בנושאי ייצוג, וממשיכה לעקוב אחרי חקיקה ורגולציה הנוגעות לכך.',
  'עמוד זה ירוכז בהמשך בפירוט נוסף על הכלים המשפטיים העומדים לרשות נבחרות ועל התיקים והפניות הפעילים.',
]
