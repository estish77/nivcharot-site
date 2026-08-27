import Image from 'next/image'

import { ImageSlot, Reveal, Section } from '@/components/ui'
import type { PodcastEpisode } from '@/content/podcast'
import { getPodcastEpisodes, podcastText } from '@/content/podcast'
import type { Locale } from '@/lib/i18n'
import { arrowForward, t } from '@/lib/i18n'

import { episodeLabel, guestLine, shortDateLabel, truncate } from './podcastUtils'

/**
 * "חרדית מדוברת - מה קורה לאחרונה?" — the 3-episode highlight grid on the
 * dark section (docs/Podcast.dc.html:133-149 / :296-312).
 *
 * The eyebrow here ("ואל תשכחו לשים עוקב") is deliberately rendered with
 * `--color-accent-300` rather than the shared `<Eyebrow>` component's
 * `--color-accent-700` — `Eyebrow` is calibrated for light backgrounds
 * (`--color-bg`), but this instance sits on the dark `--niv-slate`
 * background, where brand red measures only ~2:1 against slate and fails
 * WCAG AA; the lighter -300 tint (~5.2:1) is the on-dark-background variant.
 *
 * The grid collapses 3 -> 1 columns at 860px with NO intermediate 2-column
 * step — this page's responsive `<style>` block differs from the other
 * twelve mockups here (`[style*="grid-template-columns:repeat(3, 1fr)"] {
 * grid-template-columns: minmax(0, 1fr) !important }`), so the shared
 * `CellGrid` (which collapses 3 -> 2 -> 1) isn't used; this grid also needs
 * a translucent cream divider color `CellGrid` doesn't support.
 *
 * Async Server Component: fetches the real, current episode list itself
 * via `getPodcastEpisodes()` (live YouTube RSS, falls back to the
 * hardcoded fixture on failure — see src/content/podcast.ts), the same
 * single source of truth every other podcast section now reads from.
 */
export async function RecentEpisodesSection({
  locale,
}: {
  /** @deprecated Unused — kept optional only so callers still passing the old static `podcastEpisodes` fixture (this component now fetches live data itself) keep type-checking. */
  episodes?: PodcastEpisode[]
  locale: Locale
}) {
  const episodes = await getPodcastEpisodes()
  const featured = episodes.slice(0, 3)

  return (
    <Reveal as="section">
      <Section as="div" tint="niv-slate" borderBlock paddingBlockStart="60px" paddingBlockEnd="64px">
        <p className="m-0 mb-[10px] font-heading text-[13px] font-extrabold tracking-[0.08em] text-accent-300">
          {t(locale, podcastText.recentEyebrow)}
        </p>
        <h2 className="mb-[30px] text-niv-cream max-[860px]:text-[clamp(24px,7vw,34px)]">
          {t(locale, podcastText.recentTitle)}
        </h2>
        <div className="grid grid-cols-3 gap-0 max-[860px]:grid-cols-1">
          {featured.map((episode, i) => (
            <div
              key={episode.id}
              className="flex flex-col gap-3 px-[26px] py-2"
              style={{
                borderInlineEnd: i !== featured.length - 1 ? '2px solid rgba(249, 218, 187, 0.28)' : undefined,
              }}
            >
              <div className="relative aspect-video w-full overflow-hidden border-2 border-[rgba(249,218,187,0.28)] bg-[#141210]">
                {episode.thumbnailUrl ? (
                  <Image src={episode.thumbnailUrl} alt={episodeLabel(episode, locale)} fill sizes="(max-width: 860px) 100vw, 33vw" className="object-cover" />
                ) : (
                  <ImageSlot
                    label={t(locale, { he: 'תמונת הפרק', en: 'Episode image' })}
                    className="absolute inset-0 h-full w-full border-0 bg-transparent text-[#e3ded7]"
                  />
                )}
              </div>
              <span className="font-heading text-[11px] font-extrabold tracking-[0.12em] text-accent-300">
                {shortDateLabel(episode.publishedAt, locale)}
              </span>
              <h3 className="m-0 text-[23px] leading-[1.25] text-niv-cream">{episodeLabel(episode, locale)}</h3>
              <div className="text-[13.5px] font-semibold text-[#e3ded7]">{guestLine(episode, locale)}</div>
              <p className="m-0 text-[14.5px] leading-[1.7] text-[rgba(227,222,215,0.86)]">
                {truncate(t(locale, episode.description))}
              </p>
              <a
                href={episode.appleUrl}
                className="mt-auto pt-[10px] text-sm font-semibold text-niv-cream no-underline hover:text-accent-300 focus-visible:text-accent-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {locale === 'he' ? (
                  <>
                    {t(locale, podcastText.listen)} {arrowForward(locale)}
                  </>
                ) : (
                  <>
                    {arrowForward(locale)} {t(locale, podcastText.listen)}
                  </>
                )}
              </a>
            </div>
          ))}
        </div>
      </Section>
    </Reveal>
  )
}
