import podcastArchive from './podcast-archive.json'

import type { Localized } from '@/lib/i18n'

/**
 * "מבזקון" — the news-ticker strip above the home page header.
 *
 * Modelled on ynet's headline ticker (2026-08-28 brief, with a screenshot):
 * a row of cards with a divider between them, arrows at both edges, a
 * "more" pill, and continuous motion. Content is the channel's Shorts.
 *
 * WHY THIS LIST IS HAND-WRITTEN
 *
 * The brief asks for half the speakers to be women. That balance cannot be
 * derived at runtime: nothing in the YouTube data marks a speaker's gender,
 * and guessing it from a Hebrew first name would be both unreliable and a
 * bad thing to be wrong about — these are real people. So the ten below
 * were picked by hand from the 296 Shorts in `podcast-archive.json`, the
 * split checked by a person, and the order alternates so the balance is
 * visible on screen and not merely true in the aggregate:
 *
 *   women (5): Hilbron, Erlich, Shainbrom, Brodbaker, Rotner
 *   men   (5): Rabinovich, Amar, Vider, Lifshitz, Sabag
 *
 * `speaker` is a real person's name, so it is NOT localized — names are
 * transliterated for `en`, never translated. `headline` is the Short's own
 * title, trimmed of emoji and of the trailing "מתוך הפרק עם X" (the speaker
 * has moved to the front of the line, the way the reference leads with the
 * source of a story).
 *
 * View count, thumbnail and URL are resolved from the archive by `videoId`
 * rather than copied here, so `npm run sync-podcast-archive` keeps the
 * numbers current without anyone editing this file.
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
]

export type MivzakonItem = MivzakonEntry & {
  videoUrl: string
  thumbnailUrl: string
  viewCount?: number
}

type ArchivedShort = {
  videoId: string
  videoUrl: string
  thumbnailUrl: string
  viewCount?: number | null
}

/**
 * Joins the curated list to the synced archive. Reads the bundled JSON, so
 * there is no network call in the home page's render — the ticker sits above
 * the header on every home visit, and the Shorts RSS feed is the endpoint
 * YouTube rate-limits hardest (it has answered 404 for stretches before,
 * see `getPodcastShorts`). An entry whose video has disappeared from the
 * archive is dropped rather than rendered without a link.
 */
export function getMivzakonItems(): MivzakonItem[] {
  const shorts = (podcastArchive.shorts ?? []) as ArchivedShort[]
  const byVideoId = new Map(shorts.map((short) => [short.videoId, short]))

  return mivzakonEntries.flatMap((entry) => {
    const short = byVideoId.get(entry.videoId)
    if (!short) return []
    return [
      {
        ...entry,
        videoUrl: short.videoUrl,
        thumbnailUrl: short.thumbnailUrl,
        viewCount: short.viewCount ?? undefined,
      },
    ]
  })
}
