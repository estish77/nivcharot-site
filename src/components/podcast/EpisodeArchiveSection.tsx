import { Eyebrow, Reveal, Section } from '@/components/ui'
import type { PodcastEpisode } from '@/content/podcast'
import { getPodcastEpisodes, podcastText } from '@/content/podcast'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'

import { EpisodeArchive } from './EpisodeArchive'

/**
 * "כל הפרקים · בינג' חרדית מדוברת" (docs/Podcast.dc.html:168-203 / :331-366).
 *
 * Async Server Component: fetches the real, current episode list itself
 * via `getPodcastEpisodes()` (live YouTube RSS, falls back to the
 * hardcoded fixture on failure — see src/content/podcast.ts), then hands
 * it to the client-side `EpisodeArchive` for pagination. Same single
 * source of truth every other podcast section now reads from.
 */
export async function EpisodeArchiveSection({
  locale,
}: {
  /** @deprecated Unused — kept optional only so callers still passing the old static `podcastEpisodes` fixture (this component now fetches live data itself) keep type-checking. */
  episodes?: PodcastEpisode[]
  locale: Locale
}) {
  const episodes = await getPodcastEpisodes()
  return (
    <Reveal as="section">
      <Section as="div">
        <Eyebrow className="mb-[10px]">{t(locale, podcastText.archiveEyebrow)}</Eyebrow>
        <h2 className="mb-6 max-[860px]:text-[clamp(24px,7vw,34px)]">{t(locale, podcastText.archiveTitle)}</h2>
        <EpisodeArchive episodes={episodes} locale={locale} />
      </Section>
    </Reveal>
  )
}
