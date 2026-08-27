/**
 * Typed fixture data for the Donate page (docs/Shop.dc.html).
 *
 * Shaped to mirror where this content will eventually live in Payload:
 * - `donateHero` mirrors the `donate` global's `hero` group
 *   (src/payload/fields/globalSections.ts: eyebrow/title/body).
 * - `donationLinks` and `bankDetails` mirror `site-settings.donation` /
 *   `site-settings.bank` (src/payload/globals/SiteSettings.ts) — duplicated
 *   here as a local fixture since that global isn't wired to the frontend
 *   yet. `bankDetails.branch`/`accountNumber` are NOT currently fields on
 *   `site-settings.bank` (it only has bankName/accountHolder/iban/swift) —
 *   docs/Shop.dc.html renders בנק/סניף/חשבון/על שם/IBAN/SWIFT, six rows, so
 *   two fields are missing from that global. Flagged for the schema agent.
 * - `transparencyItems` / `standingOrderOption` / `cardOption` /
 *   `bankOption` are page-specific content with no exact one-to-one global
 *   field (the generic `pillarCards`/`statTiles` shapes don't carry the
 *   CTA links or bank table this page needs), so they're modeled as plain
 *   typed fixtures instead of forced into a shape that doesn't fit.
 */

import type { Locale, Localized } from '@/lib/i18n'

/** Preset one-time/standing-order amounts in NIS, matching docs/Shop.dc.html's `amounts` state. */
export const donateAmounts = [18, 36, 54, 90, 180] as const
export type DonateAmount = (typeof donateAmounts)[number]

/**
 * One Morning ("מורנינג") standing-order checkout per preset amount
 * (2026-08-27, links supplied by the site owner).
 *
 * Until now every amount button led to the SAME checkout link — the 180 ₪
 * one — so the picker changed only the closing banner's headline while the
 * donor was always sent to a 180 ₪ form. Each amount now opens its own
 * pre-filled recurring form; all five were opened and confirmed to show
 * the matching sum and monthly wording before being added here.
 */
export const donateStandingOrderLinks: Record<DonateAmount, string> = {
  18: 'https://mrng.to/t96gJ11kNv',
  36: 'https://mrng.to/lmlRcB0Ewa',
  54: 'https://mrng.to/Mb3esFCGko',
  90: 'https://mrng.to/51fTXKzMi9',
  180: 'https://mrng.to/WJUIrZs6F9',
}

/**
 * The amount the page leads with — preselected on load and flagged with a
 * "מומלץ" badge (site owner's call, 2026-08-27). It is a suggestion, not a
 * restriction: every other amount stays one click away and equally usable.
 */
export const donatePreferredAmount: DonateAmount = 90

export const preferredAmountBadge: Localized = { he: 'מומלץ', en: 'Recommended' }

export const donateHero: {
  eyebrow: Localized
  title: Localized
  body: Localized
  taxNote: Localized
} = {
  eyebrow: { he: 'תומכים.ות בנבחרות', en: 'SUPPORT NIVCHAROT' },
  title: {
    he: 'השינוי הזה קורה בזכותך!',
    en: 'This change is happening thanks to you!',
  },
  body: {
    he: 'נבחרות פועלת מכספי תרומות. תמיכה חודשית קבועה היא מה שמאפשר לנו לתכנן קדימה: הכשרת מנהיגות, פעילות משפטית, לובי בכנסת ועבודת שטח בקהילה.',
    en: 'Nivcharot runs on donations. Steady monthly support is what lets us plan ahead: leadership training, legal action, lobbying in the Knesset and fieldwork in the community.',
  },
  taxNote: {
    he: 'כל תרומה מזכה בהחזר מס לפי סעיף 46.',
    en: 'Donations from Israel are tax-deductible under Section 46.',
  },
}

export type GivingOption = {
  number: string
  title: Localized
  body: Localized
}

export const standingOrderOption: GivingOption = {
  number: '01',
  title: { he: 'הוראת קבע חודשית', en: 'Monthly standing order' },
  body: {
    he: 'הדרך המשמעותית ביותר לתמוך. בוחרים סכום ומגדירים הוראת קבע מאובטחת דרך מורנינג. אפשר לבטל בכל רגע.',
    en: 'The most meaningful way to support us. Pick an amount and set up a secure standing order through Morning. Cancel anytime.',
  },
}

export const cardOption: GivingOption = {
  number: '02',
  title: { he: 'תרומה בכרטיס אשראי', en: 'Credit card' },
  body: {
    he: 'תרומה מאובטחת דרך מערכת הסליקה של מורנינג, חד־פעמית או חודשית. הקבלה נשלחת אוטומטית למייל.',
    en: "A secure donation through Morning's payment system, one-time or monthly. The receipt is emailed automatically.",
  },
}

export const bankOption: GivingOption = {
  number: '03',
  title: { he: 'העברה בנקאית', en: 'Bank transfer' },
  body: {
    he: 'להעברה ישירה, כולל תרומות גדולות וקרנות.',
    en: 'For direct transfers, including major gifts and foundations.',
  },
}

/**
 * Mirrors `site-settings.donation` (SiteSettings.ts).
 *
 * `standingOrderUrl` is now the FALLBACK for the standing-order CTA: the
 * per-amount map above is what the amount picker actually links to, and
 * this dashboard-editable value is only used for an amount that has no
 * entry there (none today).
 */
export const donationLinks = {
  standingOrderUrl: 'https://mrng.to/WJUIrZs6F9',
  cardUrl: 'https://mrng.to/KPpOoC6rJ2',
} as const

/** Mirrors `site-settings.bank` (SiteSettings.ts) — see file header note on the two extra fields. */
export const bankDetails: {
  bankName: Localized
  branch: string
  accountNumber: string
  accountHolder: Localized
  iban: string
  swift: string
  note: Localized
} = {
  bankName: { he: 'מזרחי טפחות (20)', en: 'Mizrahi Tefahot (20)' },
  branch: '550',
  accountNumber: '238975',
  accountHolder: { he: 'נבחרות (ע״ר) 580619120', en: 'Nivcharot (NGO) 580619120' },
  iban: 'IL32 0205 5000 0000 0238 975',
  swift: 'MIZBILIT',
  note: {
    he: 'אחרי ההעברה שלחו לנו מייל ונשלח קבלה.',
    en: "Email us after the transfer and we'll send a receipt.",
  },
}

export type TransparencyItem = { title: Localized; body: Localized }

export const transparencyEyebrow: Localized = { he: 'שקיפות', en: 'TRANSPARENCY' }
export const transparencyHeading: Localized = {
  he: 'נבחרות (ע״ר) 580619120',
  en: 'Nivcharot (NGO) 580619120',
}

export const transparencyItems: TransparencyItem[] = [
  {
    title: { he: 'סעיף 46', en: 'Section 46' },
    body: {
      he: 'לעמותה אישור לפי סעיף 46 לפקודת מס הכנסה. כל תרומה מזכה בהחזר מס.',
      en: 'We hold Section 46 status under the Israeli Income Tax Ordinance, so donations are tax-deductible.',
    },
  },
  {
    title: { he: 'ניהול תקין', en: 'Proper management' },
    body: {
      he: 'אישור ניהול תקין מרשם העמותות, מתחדש מדי שנה.',
      en: 'A certificate of proper management from the Registrar of Non-Profits, renewed annually.',
    },
  },
  {
    title: { he: 'ניהול ספרים', en: 'Bookkeeping' },
    body: {
      he: 'אישור ניהול ספרים ופטור מניכוי מס במקור.',
      en: 'Certified bookkeeping and an exemption from tax withholding at source.',
    },
  },
  {
    title: { he: 'דוחות', en: 'Reports' },
    body: {
      he: 'הדוחות הכספיים מוגשים לרשם העמותות ופתוחים לעיון הציבור.',
      en: 'Annual financial statements are filed with the Registrar and open to the public.',
    },
  },
]

/**
 * Chrome for the 2026-08-27 redesign of this page (see `DonateGiving`).
 *
 * Every line below restates something the page already said rather than
 * introducing a new claim: "cancel anytime" comes from
 * `standingOrderOption.body`, the automatic receipt from `cardOption.body`
 * / `closingCta.note`, and the Section 46 deduction from
 * `donateHero.taxNote`. Collecting them under the one button they actually
 * qualify is what makes the primary action readable at a glance.
 */
export const givingText = {
  chooseAmountLabel: { he: 'בחירת סכום חודשי', en: 'Choose a monthly amount' } satisfies Localized,
  perMonth: { he: '₪ לחודש', en: 'NIS / month' } satisfies Localized,
  standingOrderCta: { he: 'לפתיחת הוראת קבע', en: 'Set up a standing order' } satisfies Localized,
  finePrint: {
    he: 'אפשר לבטל בכל רגע · הקבלה נשלחת אוטומטית למייל · החזר מס לפי סעיף 46',
    en: 'Cancel anytime · The receipt is emailed automatically · Tax-deductible under Section 46',
  } satisfies Localized,
  otherWaysEyebrow: { he: 'לא מתאים הוראת קבע?', en: 'PREFER NOT TO COMMIT MONTHLY?' } satisfies Localized,
  otherWaysHeading: { he: 'דרכים נוספות לתרום', en: 'Other ways to give' } satisfies Localized,
  cardHighlight: {
    he: 'תרומה חד-פעמית בכרטיס אשראי, בלי התחייבות. הדרך המהירה ביותר.',
    en: 'A one-time card donation, no commitment. The quickest way to give.',
  } satisfies Localized,
  cardCta: { he: 'לתרומה מאובטחת בכרטיס אשראי', en: 'Donate securely by card' } satisfies Localized,
  /** Where to write for a receipt after a bank transfer (2026-08-27 brief). */
  receiptLabel: { he: 'לקבלת קבלה, כתבו לנו:', en: 'For a receipt, write to us:' } satisfies Localized,
} as const

export const closingCta = {
  note: {
    he: 'הכפתור מוביל למערכת התרומות המאובטחת של מורנינג. הקבלה נשלחת אוטומטית למייל.',
    en: "The button opens Morning's secure donation system. The receipt is emailed automatically.",
  },
  buttonLabel: { he: 'מצטרפים.ות עכשיו', en: 'Join now' },
} as const

/** `"הוראת קבע של 54 ₪ בחודש"` / `"A standing order of 54 NIS a month"` — the closing banner's headline. */
export function donationSummary(locale: Locale, amount: number): string {
  return locale === 'he' ? `הוראת קבע של ${amount} ₪ בחודש` : `A standing order of ${amount} NIS a month`
}
