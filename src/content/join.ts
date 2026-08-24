/**
 * Typed fixture data for docs/Join.dc.html, shaped to match the `join`
 * Payload global (src/payload/globals/Join.ts), which composes `heroField()`
 * + `pillarCardsField()` from src/payload/fields/globalSections.ts.
 *
 * One documented divergence from `pillarCardsField()`: that field models a
 * single `linkLabel`/`linkHref` pair per card, but the mockup's "Talk to
 * us" card renders two CTAs (an email button and a Facebook button). This
 * fixture's `JoinCard.links` is an array to capture that — flagged in this
 * agent's final report as a schema gap for `pillarCardsField()` to consider
 * (e.g. a repeatable `links` sub-array) once Payload data replaces this file.
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
  /** In-page anchor id for the "contact" card only — the mockup uses two different ids per locale (`contact` / `contact-en`). */
  anchorId?: Localized<string>
}

export const joinHero: { eyebrow: Localized; title: Localized; lead: Localized } = {
  eyebrow: { he: 'בואו לקחת חלק', en: 'TAKE PART' },
  title: {
    he: 'השינוי לא יקרה בלעדייך.',
    en: "Change won't happen without you.",
  },
  lead: {
    he: 'יש הרבה דרכים להיות חלק מנבחרות, להצטרף לתוכנית המנהיגות, לפעול בשטח, לעקוב ולשתף, או לתמוך בפעילות. כל אחת מהן מקרבת את היום שבו נשים חרדיות יושבות ליד השולחן.',
    en: 'There are many ways to be part of Nivcharot, join the leadership program, act on the ground, follow and share, or support the work. Each one brings closer the day Haredi women sit at the table.',
  },
}

export const joinCards: JoinCard[] = [
  {
    id: 'join-program',
    number: '01',
    title: { he: 'להצטרף לנבחרת', en: 'Join HaNivcheret' },
    body: {
      he: 'מחזור חדש של תוכנית המנהיגות נפתח מדי שנה. ספרי לנו על עצמך ונחזור אלייך לקראת פתיחת ההרשמה.',
      en: "A new leadership cohort opens every year. Tell us about yourself and we'll get back to you when registration opens.",
    },
    links: [
      {
        label: { he: 'כתבי לנו', en: 'Write to us' },
        href: {
          he: 'mailto:estish@nivcharot.com?subject=' + encodeURIComponent('הצטרפות לתוכנית הנבחרת'),
          en: 'mailto:estish@nivcharot.com?subject=' + encodeURIComponent('Joining HaNivcheret'),
        },
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
  {
    id: 'contact',
    number: '04',
    title: { he: 'לדבר איתנו', en: 'Talk to us' },
    body: {
      he: 'עיתונאיות, חוקרים, רשויות וארגונים, נשמח לשתף פעולה. וגם סתם לשמוע מכן.',
      en: "Journalists, researchers, institutions and organizations, we're glad to collaborate. Or just say hello.",
    },
    anchorId: { he: 'contact', en: 'contact-en' },
    links: [
      {
        label: { he: 'estish@nivcharot.com', en: 'estish@nivcharot.com' },
        href: { he: 'mailto:estish@nivcharot.com', en: 'mailto:estish@nivcharot.com' },
        variant: 'secondary',
      },
      {
        label: { he: 'פייסבוק', en: 'Facebook' },
        href: {
          he: 'https://www.facebook.com/NoVoiceNoVote/',
          en: 'https://www.facebook.com/NoVoiceNoVote/',
        },
        variant: 'ghost',
        external: true,
      },
    ],
  },
]

/** The closing accent-red pull-quote banner. */
export const joinQuote: Localized = {
  he: '"כל עוד יש נשים חרדיות שרוצות לקחת חלק, צריך לתמוך בהן."',
  en: '"As long as there are Haredi women who want to take part, they must be supported."',
}
