'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import {
  CellGrid,
  cn,
  DeskPagination,
  DeskSearch,
  DeskTabs,
  SegmentedControl,
  YearRail,
  type YearBucket,
} from '@/components/ui'
import { mediaDeskText } from '@/content/media-desk'
import { arrowBack, arrowForward, dict, t, type Locale } from '@/lib/i18n'
import type { MediaEntry, MediaGroup } from '@/lib/mediaEntries'
import { useReducedMotion } from '@/lib/useReducedMotion'

import { MediaEntryCard } from './MediaEntryCard'
import { MediaEntryRow } from './MediaEntryRow'
import { MediaTheater } from './MediaTheater'

type TabKey = 'all' | MediaGroup
type SortKey = 'newest' | 'oldest' | 'englishFirst'
type ViewKey = 'list' | 'grid'

const PAGE_SIZE = 12
const TAB_ORDER: TabKey[] = ['all', 'press', 'watch', 'archive']
const EASE = [0.22, 0.61, 0.36, 1] as const

/**
 * The four sections this desk replaced each had their own anchor, and
 * those anchors are linked from all over the site (`/media#in-the-media`
 * from the home strip, the story timeline, `/press/[slug]`;
 * `/media#archive` from `/media/[slug]` and the activism sub-nav). Rather
 * than break them, each one now opens the desk on the bucket it used to
 * point at — the anchor targets themselves still exist on the page, so the
 * browser scrolls to the right place either way.
 */
const HASH_TO_TAB: Record<string, TabKey> = {
  '#desk': 'all',
  '#in-the-media': 'press',
  '#elsewhere': 'watch',
  '#archive': 'archive',
}

/**
 * `/media` in one section.
 *
 * Before the 2026-08-27 redesign this page was four stacked, independently
 * filtered lists — a press archive of 70+ full-height rows, three grids of
 * video/podcast embed cards, and a 39-card archive grid — well over twenty
 * screens of scrolling with no way to see the whole collection at once.
 *
 * This replaces all of it with a single explorer over the same, complete
 * data (see `buildMediaEntries`, which normalizes every source without
 * dropping a field):
 *
 * - four buckets across the top, each carrying its live count;
 * - one search box that queries titles, summaries, outlets and notes in
 *   BOTH languages at once, across every bucket;
 * - a faceted sidebar — kind chips plus the year histogram, each showing
 *   counts computed against the other filter, so a dead-end combination is
 *   visible before it is clicked;
 * - twelve results per page, rows collapsed to one line and expanding in
 *   place, so any view of the archive is about one screen tall;
 * - and, for audio/video, a stage-and-playlist theater instead of a wall
 *   of iframes (`MediaTheater`).
 */
export function MediaDesk({ entries, locale }: { entries: MediaEntry[]; locale: Locale }) {
  const shouldReduceMotion = useReducedMotion()
  const resultsRef = useRef<HTMLDivElement>(null)

  const [tab, setTab] = useState<TabKey>('all')
  const [query, setQuery] = useState('')
  const [facet, setFacet] = useState<string | null>(null)
  const [year, setYear] = useState<number | null>(null)
  /*
   * Default order (2026-08-28 brief), and it differs by locale on purpose:
   *
   *   Hebrew — oldest first. The archive reads as a chronology of the
   *   movement's coverage, and starting at the beginning is how you follow it.
   *
   *   English — English-language sources first. Most of this archive is
   *   Hebrew-language material shown untranslated, so an English reader
   *   landing on a chronological list meets a wall of Hebrew before
   *   reaching anything they can read. Within each language group the
   *   chronological order still holds.
   *
   * Either way it is only a default; every order stays one click away.
   */
  const [sort, setSort] = useState<SortKey>(locale === 'en' ? 'englishFirst' : 'oldest')
  const [view, setView] = useState<ViewKey>('list')
  const [openId, setOpenId] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  const counts = useMemo(
    () => ({
      all: entries.length,
      press: entries.filter((e) => e.group === 'press').length,
      watch: entries.filter((e) => e.group === 'watch').length,
      archive: entries.filter((e) => e.group === 'archive').length,
    }),
    [entries],
  )

  /**
   * Only buckets that actually hold something are offered. The archive-post
   * bucket is empty while `archivePostsVisible` is off (see
   * src/content/media-visibility.ts), and an empty tab is a dead end, not a
   * filter — so it simply isn't rendered, and turning those posts back on
   * brings its tab back with no change here.
   */
  const availableTabs = useMemo(
    () => TAB_ORDER.filter((key) => key === 'all' || counts[key] > 0),
    [counts],
  )

  useEffect(() => {
    function applyHash() {
      const next = HASH_TO_TAB[window.location.hash]
      // A hash pointing at a bucket that isn't offered any more (e.g.
      // `#archive` while archive posts are hidden) falls back to "everything"
      // rather than selecting a tab that isn't there.
      if (!next || !availableTabs.includes(next)) return
      setTab(next)
      setFacet(null)
      setYear(null)
      setOpenId(null)
      setPage(0)
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [availableTabs])

  const tabEntries = useMemo(
    () => (tab === 'all' ? entries : entries.filter((e) => e.group === tab)),
    [entries, tab],
  )

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return tabEntries
    return tabEntries.filter((entry) => entry.search.includes(q))
  }, [tabEntries, query])

  /** Kind chips, counted against everything the OTHER filter (year) allows. */
  const facetOptions = useMemo(() => {
    const pool = year === null ? searched : searched.filter((e) => e.year === year)
    const map = new Map<string, { slug: string; name: string; count: number }>()
    for (const entry of pool) {
      for (const f of entry.facets) {
        const existing = map.get(f.slug)
        if (existing) existing.count += 1
        else map.set(f.slug, { slug: f.slug, name: f.name, count: 1 })
      }
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count)
  }, [searched, year])

  /** Year rail, counted against everything the OTHER filter (kind) allows. */
  const yearBuckets = useMemo<YearBucket[]>(() => {
    const pool = facet === null ? searched : searched.filter((e) => e.facets.some((f) => f.slug === facet))
    if (pool.length === 0) return []
    const counted = new Map<number, number>()
    for (const entry of pool) counted.set(entry.year, (counted.get(entry.year) ?? 0) + 1)
    const years = Array.from(counted.keys())
    const min = Math.min(...years)
    const max = Math.max(...years)
    // Every year in the range, including the empty ones — the gaps in the
    // coverage timeline are information, not noise to be compacted away.
    return Array.from({ length: max - min + 1 }, (_, i) => max - i).map((y) => ({
      year: y,
      count: counted.get(y) ?? 0,
    }))
  }, [searched, facet])

  const filtered = useMemo(() => {
    const list = searched
      .filter((entry) => facet === null || entry.facets.some((f) => f.slug === facet))
      .filter((entry) => year === null || entry.year === year)
    return [...list].sort((a, b) => {
      if (sort === 'englishFirst' && a.sourceLanguage !== b.sourceLanguage) {
        return a.sourceLanguage === 'en' ? -1 : 1
      }
      return sort === 'newest' ? b.sortDate.localeCompare(a.sortDate) : a.sortDate.localeCompare(b.sortDate)
    })
  }, [searched, facet, year, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageItems = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)
  const rangeStart = filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1
  const rangeEnd = safePage * PAGE_SIZE + pageItems.length
  const filtersActive = facet !== null || year !== null || query.trim() !== ''

  function scrollToResults() {
    const node = resultsRef.current
    if (!node) return
    const top = node.getBoundingClientRect().top + window.scrollY - 120
    window.scrollTo({ top, behavior: shouldReduceMotion ? 'auto' : 'smooth' })
  }

  function selectTab(next: string) {
    setTab(next as TabKey)
    setFacet(null)
    setYear(null)
    setOpenId(null)
    setPage(0)
  }

  function resetFilters() {
    setQuery('')
    setFacet(null)
    setYear(null)
    setPage(0)
  }

  const filtersPanel = (
    <>
      <div className="mb-6">
        <p className="m-0 mb-2.5 font-heading text-[11px] font-extrabold tracking-[0.14em] text-neutral-700">
          {t(locale, mediaDeskText.kindHeading)}
        </p>
        <div className="flex flex-wrap gap-2">
          <FacetChip active={facet === null} onClick={() => { setFacet(null); setPage(0) }}>
            {t(locale, mediaDeskText.allKinds)} ({searched.length})
          </FacetChip>
          {facetOptions.map((option) => (
            <FacetChip
              key={option.slug}
              active={facet === option.slug}
              onClick={() => {
                setFacet(facet === option.slug ? null : option.slug)
                setPage(0)
              }}
            >
              {option.name} ({option.count})
            </FacetChip>
          ))}
        </div>
      </div>

      {yearBuckets.length > 0 ? (
        <YearRail
          buckets={yearBuckets}
          active={year}
          onSelect={(next) => {
            setYear(next)
            setPage(0)
          }}
          allLabel={t(locale, mediaDeskText.allYears)}
          heading={t(locale, mediaDeskText.yearHeading)}
          className="mb-5"
        />
      ) : null}

      {filtersActive ? (
        <button
          type="button"
          onClick={resetFilters}
          className="font-heading text-[12.5px] font-extrabold text-accent-700 underline underline-offset-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t(locale, mediaDeskText.reset)}
        </button>
      ) : null}
    </>
  )

  return (
    <div>
      <DeskTabs
        label={t(locale, mediaDeskText.title)}
        items={availableTabs.map((key) => ({
          key,
          label: t(locale, mediaDeskText.tabs[key]),
          count: counts[key],
        }))}
        active={tab}
        onSelect={selectTab}
      />

      <p className="mb-5 mt-3 max-w-[720px] text-[13.5px] leading-[1.65] text-neutral-700 max-[560px]:mb-3.5 max-[560px]:mt-2.5 max-[560px]:text-[12.5px]">
        {t(locale, mediaDeskText.tabHints[tab])}
      </p>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <DeskSearch
          id="niv-media-desk-search"
          value={query}
          onChange={(next) => {
            setQuery(next)
            setPage(0)
          }}
          label={t(locale, mediaDeskText.searchLabel)}
          placeholder={t(locale, mediaDeskText.searchPlaceholder)}
          clearLabel={t(locale, mediaDeskText.clearSearch)}
          className="min-w-[220px] max-w-[420px] flex-1 max-[560px]:w-full max-[560px]:min-w-0 max-[560px]:max-w-none"
        />
        {/*
          Sort and view used to wrap onto two more rows on a phone. They stay
          side by side now, with the view control dropping to icons only
          below 560px — the icons already carry the meaning and the control
          keeps its accessible name.
        */}
        <div className="flex flex-nowrap items-center gap-2.5 max-[560px]:w-full max-[560px]:gap-2">
          <SegmentedControl<SortKey>
            label={t(locale, mediaDeskText.sortLabel)}
            value={sort}
            onChange={(next) => {
              setSort(next)
              setPage(0)
            }}
            options={[
              // Offered on the English page only: on the Hebrew page nearly
              // every item is already a Hebrew source, so the option would
              // sort almost nothing.
              ...(locale === 'en'
                ? [{ value: 'englishFirst' as const, label: t(locale, mediaDeskText.sortEnglishFirst) }]
                : []),
              { value: 'newest', label: t(locale, mediaDeskText.sortNewest) },
              { value: 'oldest', label: t(locale, mediaDeskText.sortOldest) },
            ]}
          />
          {tab !== 'watch' ? (
            <SegmentedControl<ViewKey>
              label={t(locale, mediaDeskText.viewLabel)}
              value={view}
              onChange={setView}
              options={[
                {
                  value: 'list',
                  label: (
                    <>
                      <ListIcon /> <span className="max-[560px]:hidden">{t(locale, mediaDeskText.viewList)}</span>
                    </>
                  ),
                },
                {
                  value: 'grid',
                  label: (
                    <>
                      <GridIcon /> <span className="max-[560px]:hidden">{t(locale, mediaDeskText.viewGrid)}</span>
                    </>
                  ),
                },
              ]}
            />
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-[230px_minmax(0,1fr)] items-start gap-x-9 max-[960px]:grid-cols-1 max-[960px]:gap-x-0">
        <aside
          className="sticky border-e-2 border-divider pe-7 max-[960px]:hidden"
          style={{ top: 'calc(var(--site-notice-height, 0px) + 96px)' }}
        >
          {filtersPanel}
        </aside>

        <details className="mb-5 hidden border-2 border-divider max-[960px]:block">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-heading text-[13.5px] font-extrabold focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
            <span>{t(locale, mediaDeskText.filtersHeading)}</span>
            <span className="font-heading text-[11.5px] font-extrabold text-accent-700">
              {filtersActive ? t(locale, mediaDeskText.activeFilters) : `${filtered.length}`}
            </span>
          </summary>
          <div className="border-t-2 border-divider p-4">{filtersPanel}</div>
        </details>

        <div ref={resultsRef}>
          <div className="mb-1 flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-divider pb-2.5">
            <p className="m-0 font-heading text-[12.5px] font-extrabold tracking-[0.04em] text-neutral-700">
              {tab === 'watch' ? (
                <>
                  {filtered.length} {t(locale, mediaDeskText.resultsCount)}
                </>
              ) : (
                <>
                  {t(locale, mediaDeskText.showingRange)} {rangeStart}–{rangeEnd} {t(locale, mediaDeskText.outOf)}{' '}
                  {filtered.length}
                </>
              )}
            </p>
            {filtersActive ? (
              <button
                type="button"
                onClick={resetFilters}
                className="font-heading text-[12px] font-extrabold text-accent-700 underline underline-offset-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t(locale, mediaDeskText.reset)}
              </button>
            ) : null}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${tab}:${facet ?? ''}:${year ?? ''}:${sort}:${view}:${safePage}:${query.trim().toLowerCase()}`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: EASE }}
            >
              {filtered.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="m-0 mb-3 text-[15px] text-neutral-700">{t(locale, mediaDeskText.empty)}</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="font-heading text-[13px] font-extrabold text-accent-700 underline underline-offset-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {t(locale, mediaDeskText.emptyAction)}
                  </button>
                </div>
              ) : tab === 'watch' ? (
                <MediaTheater entries={filtered} locale={locale} />
              ) : view === 'grid' ? (
                <CellGrid cols={3} bottomDivider className="border-t-2 border-divider">
                  {pageItems.map((entry, i) => (
                    <MediaEntryCard key={entry.id} entry={entry} ordinal={safePage * PAGE_SIZE + i + 1} />
                  ))}
                </CellGrid>
              ) : (
                <div className="border-t-2 border-divider">
                  {pageItems.map((entry, i) => (
                    <MediaEntryRow
                      key={entry.id}
                      entry={entry}
                      ordinal={safePage * PAGE_SIZE + i + 1}
                      open={openId === entry.id}
                      onToggle={() => setOpenId(openId === entry.id ? null : entry.id)}
                      locale={locale}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {tab !== 'watch' ? (
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
          ) : null}
        </div>
      </div>
    </div>
  )
}

function FacetChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        // Solid niv-slate for the selected chip — the same page-specific
        // choice the previous press-archive filter row made, kept so the
        // redesign doesn't silently change what "selected" looks like here.
        active ? 'tag border-niv-slate bg-niv-slate text-white' : 'tag tag-outline',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
      )}
    >
      {children}
    </button>
  )
}

function ListIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
      <path d="M4 6.5h16M4 12h16M4 17.5h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="7" height="7" />
        <rect x="13" y="4" width="7" height="7" />
        <rect x="4" y="13" width="7" height="7" />
        <rect x="13" y="13" width="7" height="7" />
      </g>
    </svg>
  )
}
