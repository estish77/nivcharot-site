import podcastArchive from './podcast-archive.json'

import type { Localized } from '@/lib/i18n'

/**
 * "מבזקון" — the headline ticker on the home page, under the hero.
 *
 * Modelled on ynet's headline ticker (2026-08-28 brief, with a screenshot):
 * a row of cards with a rule between them, arrows at both edges, a "more"
 * pill, and continuous motion. Content is the channel's Shorts.
 *
 * HEADLINES ONLY. No thumbnail, no view count (2026-08-28 follow-up) — a
 * row of images reads as a gallery rather than a ticker, and the number
 * competed with the sentence for the same glance.
 *
 * WHY THIS LIST IS HAND-WRITTEN
 *
 * Two things the data can't give us:
 *
 * 1. The brief asks for half the speakers to be women. Nothing in the
 *    YouTube data marks a speaker's gender, and guessing it from a Hebrew
 *    first name would be unreliable about real people. So the split was
 *    checked by a person, and the order alternates woman/man so the balance
 *    is visible on screen rather than only true in the aggregate.
 *
 * 2. The brief asks the subjects to keep varying. Ranking by view count
 *    alone clusters — the same few popular guests recur, and one guest can
 *    hold three of the top ten Shorts. These twenty are picked so no
 *    speaker appears twice and no two neighbours share a subject: abuse and
 *    its exposure, art, marriage, hasidic life, religion and state, ethnic
 *    discrimination, earning a living, social media, education, early
 *    motherhood — against investigative work, addiction, party politics,
 *    gender, leaving religion, faith, admissions discrimination,
 *    conscription, family, and philosophy.
 *
 * To add to the rotation, append a pair (one woman, one man) so the
 * alternation and the balance both survive.
 *
 * `speaker` is a real person's name, so it is NOT localized — names are
 * transliterated for `en`, never translated. `headline` is the Short's own
 * title, trimmed of emoji and of the trailing "מתוך הפרק עם X": the speaker
 * has moved to the front of the line, the way the reference leads with the
 * source of a story.
 *
 * The video URL is resolved from the archive by `videoId` rather than
 * copied here, so `npm run sync-podcast-archive` keeps links current
 * without anyone editing this file.
 */
export type MivzakonEntry = {
  videoId: string
  /** Real name — transliterated for `en`, never translated. */
  speaker: Localized
  headline: Localized
}

export const mivzakonEntries: MivzakonEntry[] = [
  {
    videoId: 'DKDPwJn2TXg',
    speaker: { he: 'אביגיל הילברון', en: 'Avigail Hilbron' },
    headline: {
      he: 'למה לקח כל כך הרבה זמן לחשוף את מעשיו של חיים ולדר',
      en: 'Why it took so long to expose what Chaim Walder did',
    },
  },
  {
    videoId: 'OI7_w1pQUZI',
    speaker: { he: 'אהרון רבינוביץ׳', en: 'Aharon Rabinovich' },
    headline: { he: 'אין אחד שלא נפגע', en: 'There is no one who was not hurt' },
  },
  {
    videoId: 'rXTcsH8aETw',
    speaker: { he: 'מינדי ארליך', en: 'Mindy Erlich' },
    headline: {
      he: 'מה שכולם מנסים לטאטא מתחת לשולחן, דרך אמנות ושיח פתוח',
      en: 'What everyone tries to sweep under the rug, through art and open conversation',
    },
  },
  {
    videoId: 'O6Dt1U2oWHE',
    speaker: { he: 'יעקב ישראל עמר', en: 'Yaakov Yisrael Amar' },
    headline: {
      he: 'איך תלמיד כולל הופך למכור להימורים',
      en: 'How a kollel student becomes a gambling addict',
    },
  },
  {
    videoId: '7K0f8AayouA',
    speaker: { he: 'לאה שיינברום', en: 'Leah Shainbrom' },
    headline: { he: '״את צריכה להיות כנועה לבעלך״', en: '"You have to be submissive to your husband"' },
  },
  {
    videoId: '5dckgt-xivA',
    speaker: { he: 'יעקב וידר', en: 'Yaakov Vider' },
    headline: {
      he: 'מפלגות חרדיות פוגעות בציבור החרדי?',
      en: 'Are the Haredi parties hurting the Haredi public?',
    },
  },
  {
    videoId: 'RkFPXNlE0UY',
    speaker: { he: 'הניה ברודבקר', en: 'Henya Brodbaker' },
    headline: { he: 'מה מייחד את חסידות גור', en: 'What sets Gur hasidism apart' },
  },
  {
    videoId: 'j9PqsemL3iI',
    speaker: { he: 'מוישי ליפשיץ', en: 'Moishy Lifshitz' },
    headline: { he: 'יותר כיף להיות בחורה חרדית', en: 'It is more fun to be a Haredi girl' },
  },
  {
    videoId: 'Pr1ncramYz8',
    speaker: { he: 'מלכי רוטנר', en: 'Malki Rotner' },
    headline: {
      he: 'אנחנו כחרדיות לא יכולות להתקיים במדינה דתית',
      en: 'As Haredi women we cannot exist in a religious state',
    },
  },
  {
    videoId: 'Drz2UrNTjmA',
    speaker: { he: 'יוסי סבג', en: 'Yossi Sabag' },
    headline: {
      he: 'החיים הכפולים בתהליך יציאה בשאלה',
      en: 'The double life of leaving religion',
    },
  },
  {
    videoId: 'V0FJ_938bkE',
    speaker: { he: 'שירה נרינסקי', en: 'Shira Nerinsky' },
    headline: {
      he: 'על הגזענות העדתית שחוותה בבני ברק',
      en: 'On the ethnic discrimination she met in Bnei Brak',
    },
  },
  {
    videoId: 'zDCy0i9Z7ik',
    speaker: { he: 'הרב ד״ר מיכאל אברהם', en: 'Rabbi Dr Michael Avraham' },
    headline: { he: 'מה עושה אדם שאיבד את האמונה שלו', en: 'What does a person do who has lost their faith' },
  },
  {
    videoId: 'pMv0ropnCFQ',
    speaker: { he: 'פייני סוקניק', en: 'Faini Sokenik' },
    headline: {
      he: '״רוצים שאני אפרנס? אז תנו לי ללמוד ולעבוד״',
      en: '"You want me to provide? Then let me study and work"',
    },
  },
  {
    videoId: 'B0yZTAuxkg8',
    speaker: { he: 'עו״ד יואב ללום', en: 'Adv. Yoav Laloum' },
    headline: {
      he: 'על בתו שלא התקבלה ללימודים מטעמי גזענות',
      en: 'On his daughter, refused a school place on racist grounds',
    },
  },
  {
    videoId: 'm_BAO1upCTU',
    speaker: { he: 'סימי הרשקופ', en: 'Simi Hershkopf' },
    headline: { he: 'מה המטרה של עמוד הבידור ״דוס סלבס״', en: 'What the "Dos Slebs" entertainment page is for' },
  },
  {
    videoId: 'iRx6P_aMN54',
    speaker: { he: 'הרב ד״ר בניהו טבילה', en: 'Rabbi Dr Benayahu Tavila' },
    headline: {
      he: 'הגיע הזמן לקחת אחריות על ההקצנה בחברה',
      en: 'It is time to take responsibility for the radicalisation in society',
    },
  },
  {
    videoId: 'PYzArgA_i54',
    speaker: { he: 'נעמי אברהם', en: 'Naomi Avraham' },
    headline: { he: '״לא משנה מה נעשה, אנחנו פחות״', en: '"Whatever we do, we are lesser"' },
  },
  {
    videoId: 'Y9nTe_ls3BQ',
    speaker: { he: 'אורי צייטלין', en: 'Uri Zeitlin' },
    headline: { he: 'עוד יש תקווה לשלום', en: 'There is still hope for peace' },
  },
  {
    videoId: 'hWdB7h_iStQ',
    speaker: { he: 'ציפי הורביץ', en: 'Tzipi Horowitz' },
    headline: {
      he: 'תמיד היו לה שאלות, גם על מחירי האימהות המוקדמת',
      en: 'She always had questions, including about the price of early motherhood',
    },
  },
  {
    videoId: 'uEsJYygf2bo',
    speaker: { he: 'ג׳רמי פוגל', en: 'Jeremy Fogel' },
    headline: {
      he: 'יהודים תמיד השפיעו והושפעו מסביבה תרבותית רחבה',
      en: 'Jews have always shaped, and been shaped by, a wider culture',
    },
  },
]

export type MivzakonItem = MivzakonEntry & { videoUrl: string }

type ArchivedShort = { videoId: string; videoUrl: string }

/**
 * Joins the curated list to the synced archive. Reads the bundled JSON, so
 * there is no network call in the home page's render — the Shorts RSS feed
 * is the endpoint YouTube rate-limits hardest and has answered 404 for
 * stretches before (see `getPodcastShorts`). An entry whose video has
 * disappeared from the archive is dropped rather than rendered without a
 * working link.
 */
export function getMivzakonItems(): MivzakonItem[] {
  const shorts = (podcastArchive.shorts ?? []) as ArchivedShort[]
  const byVideoId = new Map(shorts.map((short) => [short.videoId, short]))

  return mivzakonEntries.flatMap((entry) => {
    const short = byVideoId.get(entry.videoId)
    if (!short) return []
    return [{ ...entry, videoUrl: short.videoUrl }]
  })
}
