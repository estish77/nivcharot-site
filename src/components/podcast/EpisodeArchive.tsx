'use client'

import { useMemo, useState } from 'react'

import { cn } from '@/components/ui'
import type { PodcastEpisode } from '@/content/podcast'
import { PODCAST_PAGE_SIZE, podcastText } from '@/content/podcast'
import type { Locale } from '@/lib/i18n'
import { arrowBack, arrowForward, dict, t } from '@/lib/i18n'

import { episodeLabel, hebrewCalendarLabel, numericDateLabel, sortForBinge } from './podcastUtils'

const LINK_CLASS =
  'border-2 border-divider px-[14px] py-2 font-heading text-[13px] font-extrabold text-text no-underline transition-colors duration-200 ease-out hover:border-accent hover:text-accent-700 focus-visible:border-accent focus-visible:text-accent-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

function ArchiveToggleIcon() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative block h-[15px] w-[15px] flex-none text-accent-700',
        'transition-[transform,color] duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none',
        'group-open:rotate-45 group-open:text-accent-700 group-hover/summary:text-accent-700',
        "before:absolute before:inset-0 before:m-auto before:h-[1.5px] before:w-[13px] before:bg-current before:content-['']",
        "after:absolute after:inset-0 after:m-auto after:h-[13px] after:w-[1.5px] after:bg-current after:content-['']",
      )}
    />
  )
}

function EpisodeRow({ episode, locale }: { episode: PodcastEpisode; locale: Locale }) {
  return (
    <details className="group border-b-2 border-divider">
      <summary
        className={cn(
          'group/summary grid cursor-pointer grid-cols-[132px_1fr] gap-6 py-5',
          'list-none [&::-webkit-details-marker]:hidden',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          'max-[860px]:grid-cols-1 max-[860px]:gap-2',
        )}
      >
        <span className="flex flex-col gap-[3px]">
          <span className="font-heading text-[13px] font-extrabold tracking-[0.06em] text-neutral-700">
            {numericDateLabel(episode.publishedAt)}
          </span>
          {/*
            Mockup bug (not in the porting brief, found while porting):
            this line's color is `var(--color-neutral-500)`, a token that
            doesn't exist anywhere in the mockup's own `:root` or in this
            project's design tokens. Per the same substitution logic the
            brief applies to `--color-accent-2-100`, resolved to a real,
            AA-safe token — `--color-neutral-700` (matching the sibling
            span above; `--color-neutral-600` would repeat the exact
            small-text contrast failure the project conventions call out).
          */}
          <span className="font-heading text-[11.5px] font-bold tracking-[0.04em] text-neutral-700">
            {hebrewCalendarLabel(episode.publishedAt)}
          </span>
        </span>
        <span className="flex flex-col items-start gap-[10px]">
          <span className="font-heading text-[19px] font-extrabold leading-[1.35] group-hover/summary:text-accent-700">
            {episodeLabel(episode, locale)}
          </span>
          <ArchiveToggleIcon />
        </span>
      </summary>
      <div className="grid grid-cols-[132px_1fr] gap-6 pb-[22px] max-[860px]:grid-cols-1 max-[860px]:gap-2">
        <span aria-hidden="true" />
        <div>
          <p className="mb-3 max-w-[760px] text-[14.5px] leading-[1.7] text-neutral-800">
            {t(locale, episode.description)}
          </p>
          <div className="flex flex-wrap gap-[10px]">
            <a href={episode.youtubeUrl} target="_blank" rel="noopener" className={LINK_CLASS}>
              {t(locale, podcastText.ctaYoutube)}
            </a>
            <a href={episode.spotifyUrl} target="_blank" rel="noopener" className={LINK_CLASS}>
              {t(locale, podcastText.ctaSpotify)}
            </a>
            <a href={episode.appleUrl} target="_blank" rel="noopener" className={LINK_CLASS}>
              {t(locale, podcastText.ctaApple)}
            </a>
          </div>
        </div>
      </div>
    </details>
  )
}

/**
 * "בינג' חרדית מדוברת" — the paginated, expandable episode list
 * (docs/Podcast.dc.html:168-203 / :331-366): 10 per page, prev/next
 * controls, each row a native `<details>`/`<summary>` (keyboard/AT
 * accessible for free, no JS toggle state needed — only the pagination
 * itself is client state, ported from the mockup's `prevPage`/`nextPage`).
 *
 * Row order (item 11 of the live-data follow-up brief, and a deliberate
 * change from the mockup's original oldest-first paging): `featured`
 * episodes first, then the rest by real popularity/recency — see
 * `sortForBinge()` (podcastUtils.ts) for the full explanation of why this
 * uses real view-count data rather than the "featured-only" proxy the
 * brief itself proposed.
 */
export function EpisodeArchive({ episodes, locale }: { episodes: PodcastEpisode[]; locale: Locale }) {
  const bingeOrder = useMemo(() => sortForBinge(episodes), [episodes])
  const pageCount = Math.max(1, Math.ceil(bingeOrder.length / PODCAST_PAGE_SIZE))
  const [requestedPage, setRequestedPage] = useState(0)
  const page = Math.min(requestedPage, pageCount - 1)
  const pageItems = bingeOrder.slice(page * PODCAST_PAGE_SIZE, page * PODCAST_PAGE_SIZE + PODCAST_PAGE_SIZE)
  const atFirst = page === 0
  const atLast = page >= pageCount - 1

  return (
    <>
      <div className="border-t-2 border-divider">
        {pageItems.map((episode) => (
          <EpisodeRow key={episode.id} episode={episode} locale={locale} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-around gap-[10px]">
        <button
          type="button"
          onClick={() => setRequestedPage((p) => Math.max(0, p - 1))}
          disabled={atFirst}
          className="border-2 border-neutral-200 px-[18px] py-[10px] font-heading text-sm font-extrabold text-text transition-colors duration-200 ease-out hover:bg-niv-slate hover:text-white focus-visible:bg-niv-slate focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text"
        >
          {arrowBack(locale)} {t(locale, dict.previous)}
        </button>
        <span className="font-heading text-[13px] font-extrabold text-neutral-700">
          {t(locale, podcastText.pageLabel)} {page + 1} {t(locale, podcastText.ofLabel)} {pageCount}
        </span>
        <button
          type="button"
          onClick={() => setRequestedPage((p) => Math.min(pageCount - 1, p + 1))}
          disabled={atLast}
          className="border-2 border-neutral-200 px-[18px] py-[10px] font-heading text-sm font-extrabold text-text transition-colors duration-200 ease-out hover:bg-niv-slate hover:text-white focus-visible:bg-niv-slate focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text"
        >
          {t(locale, dict.next)} {arrowForward(locale)}
        </button>
      </div>
    </>
  )
}
