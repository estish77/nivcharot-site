import { Eyebrow, Reveal, Section } from '@/components/ui'
import type { PodcastEpisode } from '@/content/podcast'
import { getPodcastEpisodes, PODCAST_SPOTIFY_SHOW_ID, podcastText } from '@/content/podcast'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'

import { PlatformLinksRow } from './PlatformLinksRow'
import { episodeLabel, guestLine, shortDateLabel } from './podcastUtils'

/**
 * "הפרק האחרון שעלה השבוע" — the embedded Spotify player for the newest
 * episode (docs/Podcast.dc.html:150-167 / :313-330).
 *
 * REAL BUG, ported faithfully then fixed: the mockup's iframe `style`
 * attribute sets `border: 2px solid var(--niv-slate)` and then, later in
 * the SAME style string, overrides it with `border-color: var(--color-
 * accent-2-100)` — a CSS custom property that is never defined anywhere in
 * the mockup. Per the porting brief this is substituted with
 * `--color-neutral-200` (a real token). The brief calls this out only on
 * the pagination buttons (below, in `EpisodeArchive`), but the identical
 * undefined-variable bug also appears here on the iframe (both locale
 * branches) — the same substitution is applied here too for consistency,
 * flagged in the final report.
 *
 * Async Server Component, `episodes[0]` = "the latest episode": fetched via
 * `getPodcastEpisodes()` (live YouTube RSS, newest-first, falls back to the
 * hardcoded fixture on failure — see src/content/podcast.ts), the same
 * single source every other podcast section reads from. This is also what
 * reconciles this section's hero text with the Spotify iframe right below
 * it: the iframe embeds the whole SHOW (`embed/show/<id>`), not one pinned
 * episode — there's no real per-episode Spotify id in this data to lock it
 * to instead — so Spotify itself always surfaces its own actual newest
 * episode there. The only way the hero text can't drift out of sync with
 * that is for it to also always be the true newest episode rather than a
 * hand-maintained fixture, which is exactly what fetching live here gives.
 */
export async function LatestEpisodeSection({
  locale,
}: {
  /** @deprecated Unused — kept optional only so callers still passing the old static `podcastEpisodes` fixture (this component now fetches live data itself) keep type-checking. */
  episodes?: PodcastEpisode[]
  locale: Locale
}) {
  const episodes = await getPodcastEpisodes()
  const latest = episodes[0]
  if (!latest) return null

  return (
    <Reveal as="section">
      <Section as="div" borderBlock paddingBlockStart="58px" paddingBlockEnd="62px">
        <Eyebrow className="mb-3">{t(locale, podcastText.latestEyebrow)}</Eyebrow>
        <h2 className="mb-[10px] max-w-[900px] max-[860px]:text-[clamp(24px,7vw,34px)]">
          {episodeLabel(latest, locale)}
        </h2>
        <div className="mb-4 font-heading text-[13px] font-extrabold tracking-[0.06em] text-neutral-700">
          {[shortDateLabel(latest.publishedAt, locale), guestLine(latest, locale)].filter(Boolean).join(' · ')}
        </div>
        <p className="mb-[26px] max-w-[780px] text-[15.5px] leading-[1.75] text-neutral-800">
          {t(locale, latest.description)}
        </p>
        <iframe
          title={t(locale, podcastText.playerTitle)}
          src={`https://open.spotify.com/embed/show/${PODCAST_SPOTIFY_SHOW_ID}?theme=0`}
          height={352}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="block w-full border-2 border-neutral-200 bg-bg"
        />
        <PlatformLinksRow />
      </Section>
    </Reveal>
  )
}
