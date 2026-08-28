import { Eyebrow, Reveal, Section } from '@/components/ui'
import { episodeDeskText } from '@/content/media-desk'
import { getPodcastShorts, podcastText } from '@/content/podcast'
import { arrowForward, t, type Locale } from '@/lib/i18n'

import { TopShortsFeed } from './TopShortsFeed'

/** How many tiles the grid shows — two full rows at the widest breakpoint. */
const TOP_SHORTS_COUNT = 12

/**
 * Server half of the most-watched Shorts feed (2026-08-28 brief), which
 * replaced the "מהארכיון · מגזין ווידאו" strip at the foot of the podcast
 * page.
 *
 * Ranking happens here rather than in the client component so the grid
 * arrives already ordered and the browser is never handed 296 Shorts to
 * sort. Shorts with no view count sort last rather than being dropped —
 * missing data shouldn't promote a clip above one with a real number, but
 * it shouldn't hide it either.
 */
export async function TopShortsSection({ locale }: { locale: Locale }) {
  const shorts = await getPodcastShorts()
  if (shorts.length === 0) return null

  const mostWatched = [...shorts]
    .sort((a, b) => (b.viewCount ?? -1) - (a.viewCount ?? -1))
    .slice(0, TOP_SHORTS_COUNT)

  return (
    <Reveal as="section">
      <Section as="div" borderBlockStart paddingBlockStart="50px" paddingBlockEnd="66px">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div className="max-w-[680px]">
            <Eyebrow className="mb-3">{t(locale, episodeDeskText.topShortsEyebrow)}</Eyebrow>
            <h2 className="max-[860px]:text-[clamp(24px,7vw,34px)]">{t(locale, episodeDeskText.topShortsTitle)}</h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-neutral-800">
              {t(locale, episodeDeskText.topShortsLead)}
            </p>
          </div>
          <a
            href={podcastText.allShortsHref}
            target="_blank"
            rel="noopener"
            className="whitespace-nowrap font-heading text-[13.5px] font-extrabold text-accent-700 no-underline hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t(locale, episodeDeskText.allShortsOnYoutube)} {arrowForward(locale)}
          </a>
        </div>
        <TopShortsFeed shorts={mostWatched} locale={locale} />
      </Section>
    </Reveal>
  )
}
