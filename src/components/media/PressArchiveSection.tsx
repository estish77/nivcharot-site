'use client'

import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/components/ui'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { t, type Locale } from '@/lib/i18n'
import { pressArchiveText, type PressArchiveItem, type PressCategory } from '@/content/press-archive'

import { PressItemCard } from './PressItemCard'

export type PressArchiveSectionProps = {
  items: PressArchiveItem[]
  locale: Locale
}

const EASE = [0.22, 0.61, 0.36, 1] as const

const CATEGORY_ORDER: PressCategory[] = ['coverage', 'opinion', 'interview', 'controversy']

/** Loose, accent-insensitive-enough match: lowercases both sides (works for English; Hebrew has no case to fold, so this is a no-op there, matching plain substring search). */
function matchesQuery(item: PressArchiveItem, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [item.title.he, item.title.en, item.summary.he, item.summary.en, item.outlet.he, item.outlet.en]
    .join(' \n ')
    .toLowerCase()
  return haystack.includes(q)
}

/**
 * The "בתקשורת" list: category filter (2026-08-13 brief, second follow-up
 * — "לסדר לפי כתבות, טורי דעה, ראיונות, נבחרות בפולמוס", replacing the
 * previous article/video/podcast type chips, which never showed more than
 * one real bucket) + free-text search + a year-grouped "ציר זמן" layout so
 * a long, growing archive stays easy to scan rather than one flat list.
 * Plain local `useState`, no `?query=`/`?cat=` URL params — this section's
 * existing soft, no-reload filter convention (distinct from the query-
 * string-driven `ArchiveFilters` used for the archive-posts grid below it
 * on the same page).
 */
export function PressArchiveSection({ items, locale }: PressArchiveSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<PressCategory | null>(null)
  const [query, setQuery] = useState('')
  const shouldReduceMotion = useReducedMotion()

  const counts = useMemo(() => {
    const map = new Map<PressCategory, number>()
    for (const item of items) {
      map.set(item.category, (map.get(item.category) ?? 0) + 1)
    }
    return map
  }, [items])

  const filtered = useMemo(() => {
    return items
      .filter((item) => selectedCategory === null || item.category === selectedCategory)
      .filter((item) => matchesQuery(item, query))
  }, [items, selectedCategory, query])

  const yearGroups = useMemo(() => {
    const byYear = new Map<number, PressArchiveItem[]>()
    for (const item of filtered) {
      const bucket = byYear.get(item.year)
      if (bucket) bucket.push(item)
      else byYear.set(item.year, [item])
    }
    return Array.from(byYear.entries()).sort((a, b) => b[0] - a[0])
  }, [filtered])

  const resultsKey = `${selectedCategory ?? 'all'}::${query.trim().toLowerCase()}`

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label htmlFor="niv-press-search" className="sr-only">
          {t(locale, pressArchiveText.searchLabel)}
        </label>
        <div className="relative flex-1" style={{ minWidth: 220, maxWidth: 380 }}>
          <SearchIcon className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-neutral-600 start-3.5" />
          <input
            id="niv-press-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t(locale, pressArchiveText.searchPlaceholder)}
            className="w-full border-2 border-divider bg-white py-[11px] text-[14.5px] text-text placeholder:text-neutral-600 focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ps-10 pe-4"
          />
        </div>
      </div>

      <div
        role="group"
        aria-label={t(locale, pressArchiveText.categoryFilter.all)}
        className="flex flex-wrap gap-2.5 border-b-2 border-divider pb-[18px]"
      >
        <CategoryChip active={selectedCategory === null} onClick={() => setSelectedCategory(null)}>
          {t(locale, pressArchiveText.categoryFilter.all)} ({items.length})
        </CategoryChip>
        {CATEGORY_ORDER.filter((c) => (counts.get(c) ?? 0) > 0).map((category) => (
          <CategoryChip key={category} active={selectedCategory === category} onClick={() => setSelectedCategory(category)}>
            {t(locale, pressArchiveText.categoryFilter[category])} ({counts.get(category)})
          </CategoryChip>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={resultsKey}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: EASE }}
        >
          {yearGroups.length > 0 ? (
            <div className="mt-2 flex flex-col gap-9">
              {yearGroups.map(([year, yearItems]) => (
                <div key={year}>
                  <div className="mb-1 flex items-center gap-3">
                    <span className="font-heading text-[26px] font-extrabold leading-none text-accent-700">{year}</span>
                    <span aria-hidden="true" className="h-px flex-1 bg-divider" />
                  </div>
                  <div className="flex flex-col">
                    {yearItems.map((item) => (
                      <PressItemCard key={item.slug} item={item} locale={locale} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-7 text-[15px] text-neutral-700">
              {t(locale, query.trim() ? pressArchiveText.emptyForSearch : pressArchiveText.emptyForFilter)}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-current={active ? 'true' : undefined}
      onClick={onClick}
      className={cn(
        // Active = solid niv-slate fill (matches the reference design's dark
        // "הכל" pill), not the site's more common accent-red `.tag-accent` —
        // a deliberate, page-specific choice per that reference.
        active ? 'tag border-niv-slate bg-niv-slate text-white' : 'tag tag-outline',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
      )}
    >
      {children}
    </button>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15.5 15.5 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
