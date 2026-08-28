import { Reveal, Section } from '@/components/ui'
import type { PodcastEpisode } from '@/content/podcast'
import { getPodcastShorts, podcastText } from '@/content/podcast'
import type { Locale } from '@/lib/i18n'
import { arrowForward, t } from '@/lib/i18n'

import { StoriesStrip } from './StoriesStrip'

/**
 * "אורחות ואורחים · הפרקים האחרונים" — the Instagram-style stories strip
 * (docs/Podcast.dc.html:98-117 / :261-280).
 *
 * The eyebrow-style label here (`אורחות ואורחים · הפרקים האחרונים`) is a
 * plain `<div>` in the mockup already, not an `<h6>` — no heading-order fix
 * needed. It IS an a11y contrast fix though: at 11.5px on `--tint-cream`
 * (effectively identical luminance to `--color-bg`) the mockup's
 * `--color-neutral-600` fails WCAG AA for text under 16px, so this uses
 * `--color-neutral-700` per the project's contrast rule.
 *
 * Async Server Component: fetches the real, current Shorts list itself via
 * `getPodcastShorts()` (2026-08-13 brief, item 30 — a "story" must open a
 * real YouTube Short, not a full episode) rather than trusting a
 * caller-provided list, so this always renders real thumbnails/captions
 * regardless of what the page route passes in.
 */
export async function StoriesSection({
  locale,
}: {
  /** @deprecated Unused — kept optional only so callers still passing the old static `podcastEpisodes` fixture (this component now fetches live data itself) keep type-checking. */
  episodes?: PodcastEpisode[]
  locale: Locale
}) {
  const shorts = await getPodcastShorts()
  // No stories, no strip: rendering the heading over an empty row reads as a
  // broken page rather than an empty state, and this list can legitimately
  // come back empty (see `getPodcastShorts`).
  if (shorts.length === 0) return null

  return (
    <Reveal as="section">
      <Section as="div" tint="tint-cream" className="border-b-2 border-divider" paddingBlockStart="17px" paddingBlockEnd="26px">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-4">
          <p className="m-0 font-heading text-[11.5px] font-extrabold tracking-[0.14em] text-neutral-700">
            {t(locale, podcastText.storiesEyebrow)}
          </p>
          <a
            href={podcastText.allShortsHref}
            className="text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {locale === 'he' ? (
              <>
                {t(locale, podcastText.allShorts)} {arrowForward(locale)}
              </>
            ) : (
              <>
                {arrowForward(locale)} {t(locale, podcastText.allShorts)}
              </>
            )}
          </a>
        </div>
        <StoriesStrip shorts={shorts} locale={locale} />
      </Section>
    </Reveal>
  )
}
