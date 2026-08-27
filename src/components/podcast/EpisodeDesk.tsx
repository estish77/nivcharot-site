'use client'

import Image from 'next/image'
import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import {
  cn,
  DeskPagination,
  DeskSearch,
  DeskTabs,
  SegmentedControl,
} from '@/components/ui'
import { episodeDeskText, mediaDeskText } from '@/content/media-desk'
import type { PodcastEpisode, PodcastShort } from '@/content/podcast'
import { podcastText } from '@/content/podcast'
import { arrowBack, arrowForward, dict, t, type Locale } from '@/lib/i18n'
import { useReducedMotion } from '@/lib/useReducedMotion'

import { episodeLabel, guestLine, hebrewCalendarLabel, numericDateLabel, shortDateLabel, sortForBinge } from './podcastUtils'
import { StoryViewer, type StoryViewerItem } from './StoryViewer'

type TabKey = 'episodes' | 'shorts'
type SortKey = 'popular' | 'newest' | 'oldest'
type ViewKey = 'list' | 'grid'

const EPISODE_PAGE_SIZE = 12
const SHORTS_PAGE_SIZE = 10
const EASE = [0.22, 0.61, 0.36, 1] as const

const LINK_CLASS =
  'border-2 border-divider px-[13px] py-[7px] font-heading text-[12.5px] font-extrabold text-text no-underline transition-colors duration-200 ease-out hover:border-accent hover:text-accent-700 focus-visible:border-accent focus-visible:text-accent-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * `/podcast`'s single episode workspace.
 *
 * 2026-08-27 brief. This replaces three separate sections that each showed
 * a slice of the same channel — `RecentEpisodesSection` (the newest three,
 * on a dark band), `EpisodeArchiveSection` (the paginated full archive) and
 * `ShortsSection` (a ten-card Shorts grid) — with one desk holding all of
 * it: both catalogues behind two tabs, a search box, real sort orders, a
 * list/card view toggle and pagination.
 *
 * Nothing is dropped. The "recently" trio is simply the first page under
 * the default sort; every per-episode field those sections rendered (date,
 * Hebrew calendar date, guest, description, thumbnail, view count, all
 * three platform links) is still shown, and Shorts still open in the same
 * in-page `StoryViewer` lightbox rather than linking out.
 */
export function EpisodeDesk({
  episodes,
  shorts,
  locale,
}: {
  episodes: PodcastEpisode[]
  shorts: PodcastShort[]
  locale: Locale
}) {
  const shouldReduceMotion = useReducedMotion()
  const resultsRef = useRef<HTMLDivElement>(null)

  const [tab, setTab] = useState<TabKey>('episodes')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('popular')
  const [view, setView] = useState<ViewKey>('list')
  const [openId, setOpenId] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [openShort, setOpenShort] = useState<number | null>(null)

  const numberFormat = useMemo(() => new Intl.NumberFormat(locale === 'he' ? 'he-IL' : 'en-US'), [locale])

  const filteredEpisodes = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matched = q
      ? episodes.filter((episode) =>
          [episode.title.he, episode.title.en, episode.description.he, episode.description.en, episode.guestName]
            .join(' \n ')
            .toLowerCase()
            .includes(q),
        )
      : episodes
    if (sort === 'popular') return sortForBinge(matched)
    return [...matched].sort((a, b) =>
      sort === 'newest'
        ? b.publishedAt.localeCompare(a.publishedAt)
        : a.publishedAt.localeCompare(b.publishedAt),
    )
  }, [episodes, query, sort])

  const filteredShorts = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matched = q
      ? shorts.filter((short) => `${short.title} \n ${short.summary}`.toLowerCase().includes(q))
      : shorts
    // Shorts carry no view count, so "popular" has nothing real behind it
    // here — it falls through to newest rather than inventing an order.
    return [...matched].sort((a, b) =>
      sort === 'oldest' ? a.publishedAt.localeCompare(b.publishedAt) : b.publishedAt.localeCompare(a.publishedAt),
    )
  }, [shorts, query, sort])

  const pageSize = tab === 'episodes' ? EPISODE_PAGE_SIZE : SHORTS_PAGE_SIZE
  const total = tab === 'episodes' ? filteredEpisodes.length : filteredShorts.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const episodePage = filteredEpisodes.slice(safePage * pageSize, safePage * pageSize + pageSize)
  const shortsPage = filteredShorts.slice(safePage * pageSize, safePage * pageSize + pageSize)
  const rangeStart = total === 0 ? 0 : safePage * pageSize + 1
  const rangeEnd = safePage * pageSize + (tab === 'episodes' ? episodePage.length : shortsPage.length)

  // The viewer indexes into the visible page, so its own prev/next stays in
  // step with what the visitor is actually looking at.
  const storyItems: StoryViewerItem[] = shortsPage.map((short) => ({
    id: short.id,
    videoId: short.videoId,
    caption: short.title,
  }))

  function scrollToResults() {
    const node = resultsRef.current
    if (!node) return
    const top = node.getBoundingClientRect().top + window.scrollY - 120
    window.scrollTo({ top, behavior: shouldReduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <div>
      <DeskTabs
        label={t(locale, episodeDeskText.title)}
        items={[
          { key: 'episodes', label: t(locale, episodeDeskText.tabEpisodes), count: episodes.length },
          // The Shorts playlist is fetched live and legitimately comes back
          // empty when that request fails (there is no fallback fixture for
          // it) — in that case the tab isn't offered at all rather than
          // opening onto nothing.
          ...(shorts.length > 0
            ? [{ key: 'shorts', label: t(locale, episodeDeskText.tabShorts), count: shorts.length }]
            : []),
        ]}
        active={tab}
        onSelect={(next) => {
          setTab(next as TabKey)
          setOpenId(null)
          setPage(0)
          // "Most watched" only exists for full episodes — the Shorts feed
          // carries no view counts — so switching tabs falls back to the
          // order that does mean something there.
          if (next === 'shorts' && sort === 'popular') setSort('newest')
        }}
      />

      <div className="mb-6 mt-5 flex flex-wrap items-center justify-between gap-3">
        <DeskSearch
          id="niv-episode-desk-search"
          value={query}
          onChange={(next) => {
            setQuery(next)
            setPage(0)
          }}
          label={t(locale, episodeDeskText.searchLabel)}
          placeholder={t(locale, episodeDeskText.searchPlaceholder)}
          clearLabel={t(locale, mediaDeskText.clearSearch)}
          className="min-w-[220px] max-w-[420px] flex-1"
        />
        <div className="flex flex-wrap items-center gap-2.5">
          <SegmentedControl<SortKey>
            label={t(locale, mediaDeskText.sortLabel)}
            value={sort}
            onChange={(next) => {
              setSort(next)
              setPage(0)
            }}
            options={[
              ...(tab === 'episodes'
                ? [{ value: 'popular' as const, label: t(locale, episodeDeskText.sortPopular) }]
                : []),
              { value: 'newest', label: t(locale, episodeDeskText.sortNewest) },
              { value: 'oldest', label: t(locale, episodeDeskText.sortOldest) },
            ]}
          />
          {tab === 'episodes' ? (
            <SegmentedControl<ViewKey>
              label={t(locale, mediaDeskText.viewLabel)}
              value={view}
              onChange={setView}
              options={[
                { value: 'list', label: t(locale, mediaDeskText.viewList) },
                { value: 'grid', label: t(locale, mediaDeskText.viewGrid) },
              ]}
            />
          ) : null}
        </div>
      </div>

      <div ref={resultsRef}>
        <p className="m-0 mb-1 border-b-2 border-divider pb-2.5 font-heading text-[12.5px] font-extrabold tracking-[0.04em] text-neutral-700">
          {t(locale, mediaDeskText.showingRange)} {rangeStart}–{rangeEnd} {t(locale, mediaDeskText.outOf)} {total}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${tab}:${sort}:${view}:${safePage}:${query.trim().toLowerCase()}`}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: EASE }}
          >
            {total === 0 ? (
              <p className="py-12 text-center text-[15px] text-neutral-700">{t(locale, episodeDeskText.empty)}</p>
            ) : tab === 'shorts' ? (
              <div className="grid grid-cols-2 gap-4 pt-5 min-[640px]:grid-cols-3 min-[960px]:grid-cols-5">
                {shortsPage.map((short, i) => (
                  <ShortCard
                    key={short.id}
                    short={short}
                    label={t(locale, episodeDeskText.playShort)}
                    onPlay={() => setOpenShort(i)}
                  />
                ))}
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-3 gap-x-6 gap-y-8 pt-6 max-[860px]:grid-cols-2 max-[560px]:grid-cols-1">
                {episodePage.map((episode) => (
                  <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    locale={locale}
                    viewsLabel={
                      episode.viewCount != null
                        ? `${numberFormat.format(episode.viewCount)} ${t(locale, episodeDeskText.views)}`
                        : null
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="border-t-2 border-divider">
                {episodePage.map((episode, i) => (
                  <EpisodeRow
                    key={episode.id}
                    episode={episode}
                    locale={locale}
                    ordinal={safePage * pageSize + i + 1}
                    open={openId === episode.id}
                    onToggle={() => setOpenId(openId === episode.id ? null : episode.id)}
                    viewsLabel={
                      episode.viewCount != null
                        ? `${numberFormat.format(episode.viewCount)} ${t(locale, episodeDeskText.views)}`
                        : null
                    }
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <DeskPagination
          page={safePage}
          pageCount={pageCount}
          onChange={(next) => {
            setPage(next)
            setOpenId(null)
            scrollToResults()
          }}
          pageLabel={t(locale, mediaDeskText.page)}
          ofLabel={t(locale, mediaDeskText.outOf)}
          previousLabel={t(locale, dict.previous)}
          nextLabel={t(locale, dict.next)}
          arrowPrev={arrowBack(locale)}
          arrowNext={arrowForward(locale)}
          className="mt-7"
        />
      </div>

      <StoryViewer
        items={storyItems}
        openIndex={openShort}
        onClose={() => setOpenShort(null)}
        onNavigate={setOpenShort}
        locale={locale}
      />
    </div>
  )
}

function PlatformLinks({ episode, locale }: { episode: PodcastEpisode; locale: Locale }) {
  return (
    <div className="flex flex-wrap gap-2">
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
  )
}

function EpisodeRow({
  episode,
  locale,
  ordinal,
  open,
  onToggle,
  viewsLabel,
}: {
  episode: PodcastEpisode
  locale: Locale
  ordinal: number
  open: boolean
  onToggle: () => void
  viewsLabel: string | null
}) {
  const shouldReduceMotion = useReducedMotion()
  const panelId = `episode-panel-${episode.id}`
  const guest = guestLine(episode, locale)

  return (
    <article className={cn('border-b-2 border-divider transition-colors duration-200 ease-out', open && 'bg-tint-cream')}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'grid w-full grid-cols-[34px_112px_1fr_26px] items-start gap-x-4 gap-y-1 px-1 py-[15px] text-start',
          'transition-colors duration-200 ease-out hover:bg-neutral-200/70',
          'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
          'max-[720px]:grid-cols-[30px_1fr_24px]',
        )}
      >
        <span
          aria-hidden="true"
          className="pt-[3px] font-heading text-[12px] font-extrabold tabular-nums text-neutral-600 max-[720px]:pt-0"
        >
          {String(ordinal).padStart(2, '0')}
        </span>
        <span className="flex flex-col gap-[3px] pt-[2px] max-[720px]:col-start-2 max-[720px]:flex-row max-[720px]:flex-wrap max-[720px]:items-center max-[720px]:gap-2 max-[720px]:pt-0">
          <span className="font-heading text-[12.5px] font-extrabold tracking-[0.06em] text-neutral-700">
            {numericDateLabel(episode.publishedAt)}
          </span>
          <span className="font-heading text-[11px] font-bold tracking-[0.04em] text-neutral-700">
            {hebrewCalendarLabel(episode.publishedAt)}
          </span>
        </span>
        <span className="flex min-w-0 flex-col gap-[5px] max-[720px]:col-span-2 max-[720px]:col-start-2">
          <span className={cn('font-heading text-[17.5px] font-extrabold leading-[1.33]', open && 'text-accent-700')}>
            {episodeLabel(episode, locale)}
          </span>
          {!open ? (
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] leading-[1.5] text-neutral-700">
              {guest ? <span className="font-semibold">{guest}</span> : null}
              {viewsLabel ? <span className="tabular-nums text-neutral-600">{viewsLabel}</span> : null}
            </span>
          ) : null}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'relative mt-[6px] block h-[13px] w-[13px] flex-none text-accent-700',
            'transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none',
            open && 'rotate-45',
            "before:absolute before:inset-0 before:m-auto before:h-[1.6px] before:w-[13px] before:bg-current before:content-['']",
            "after:absolute after:inset-0 after:m-auto after:h-[13px] after:w-[1.6px] after:bg-current after:content-['']",
            'max-[720px]:col-start-3 max-[720px]:row-start-1',
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            key="panel"
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.32, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-[34px_112px_1fr] gap-x-4 px-1 pb-6 max-[720px]:grid-cols-1">
              <span aria-hidden="true" className="max-[720px]:hidden" />
              <span aria-hidden="true" className="max-[720px]:hidden" />
              <div className="flex flex-col items-start gap-3">
                {guest || viewsLabel ? (
                  <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-neutral-700">
                    {guest ? <span className="font-semibold">{guest}</span> : null}
                    {viewsLabel ? <span className="tabular-nums text-neutral-600">{viewsLabel}</span> : null}
                  </p>
                ) : null}
                <p className="m-0 max-w-[760px] text-[14.5px] leading-[1.75] text-neutral-800">
                  {t(locale, episode.description)}
                </p>
                <PlatformLinks episode={episode} locale={locale} />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  )
}

function EpisodeCard({
  episode,
  locale,
  viewsLabel,
}: {
  episode: PodcastEpisode
  locale: Locale
  viewsLabel: string | null
}) {
  const guest = guestLine(episode, locale)
  return (
    <article className="flex flex-col gap-2.5">
      <div className="relative aspect-video w-full overflow-hidden border-2 border-divider bg-tint-cream">
        {episode.thumbnailUrl ? (
          <Image
            src={episode.thumbnailUrl}
            alt={episodeLabel(episode, locale)}
            fill
            sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 33vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <span className="font-heading text-[11px] font-extrabold tracking-[0.1em] text-accent-700">
        {shortDateLabel(episode.publishedAt, locale)}
      </span>
      <h3 className="m-0 text-[18px] leading-[1.3]">{episodeLabel(episode, locale)}</h3>
      {guest ? <div className="text-[13px] font-semibold text-neutral-700">{guest}</div> : null}
      <p className="m-0 line-clamp-3 text-[14px] leading-[1.65] text-neutral-800">{t(locale, episode.description)}</p>
      {viewsLabel ? (
        <span className="font-heading text-[11.5px] font-extrabold tabular-nums text-neutral-600">{viewsLabel}</span>
      ) : null}
      <div className="mt-auto pt-1">
        <PlatformLinks episode={episode} locale={locale} />
      </div>
    </article>
  )
}

function ShortCard({ short, label, onPlay }: { short: PodcastShort; label: string; onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`${label}: ${short.title}`}
      className="group flex flex-col gap-3 border-2 border-divider bg-white p-3 text-start transition-colors duration-200 ease-out hover:border-accent focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className="relative block aspect-[9/16] w-full overflow-hidden bg-tint-cream">
        {short.thumbnailUrl ? (
          <Image
            src={short.thumbnailUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 960px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        ) : null}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-accent">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M6 4.5v15l14-7.5-14-7.5Z" />
            </svg>
          </span>
        </span>
      </span>
      <span className="block font-heading text-[14px] font-extrabold leading-[1.35]">{short.title}</span>
      <span className="line-clamp-3 block text-[12.5px] leading-[1.6] text-neutral-700">{short.summary}</span>
    </button>
  )
}
