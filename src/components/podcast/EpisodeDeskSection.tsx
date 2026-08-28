import { Eyebrow, Reveal, Section } from '@/components/ui'
import { episodeDeskText } from '@/content/media-desk'
import { getPodcastEpisodes, getPodcastShorts } from '@/content/podcast'
import { t, type Locale } from '@/lib/i18n'

import { EpisodeDesk } from './EpisodeDesk'

/**
 * Server half of the episode desk: fetches both live catalogues (the
 * channel's full episodes and its Shorts playlist — see src/lib/youtube.ts,
 * each falling back the way its own getter defines) and hands them to the
 * interactive `EpisodeDesk`.
 *
 * Replaces `RecentEpisodesSection` + `EpisodeArchiveSection` +
 * `ShortsSection`, which each fetched the same feed separately and each
 * rendered a section of their own.
 */
export async function EpisodeDeskSection({ locale }: { locale: Locale }) {
  const [episodes, shorts] = await Promise.all([getPodcastEpisodes(), getPodcastShorts()])

  return (
    <Reveal as="section">
      <Section as="div" id="episodes" borderBlockStart paddingBlockStart="50px" paddingBlockEnd="66px">
        <div className="mb-7 max-w-[720px]">
          <Eyebrow className="mb-3">{t(locale, episodeDeskText.eyebrow)}</Eyebrow>
          {/* Deliberately larger than a normal section h2 — the brief asked for a big title here. */}
          <h2 className="text-[clamp(32px,4.4vw,52px)] leading-[1.08] max-[860px]:text-[clamp(26px,8.5vw,40px)]">
            {t(locale, episodeDeskText.title)}
          </h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-neutral-800">{t(locale, episodeDeskText.lead)}</p>
        </div>
        <EpisodeDesk episodes={episodes} shorts={shorts} locale={locale} />
      </Section>
    </Reveal>
  )
}
