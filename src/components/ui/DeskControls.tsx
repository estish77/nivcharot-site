'use client'

import type { ReactNode } from 'react'

import { cn } from './cn'

/**
 * The shared control set for the two "desk" explorers introduced by the
 * 2026-08-27 redesign brief — `/media`'s `MediaDesk` and `/podcast`'s
 * `EpisodeDesk`. Both replace long stacked lists with one compact,
 * filterable, paginated workspace, and both need the same five controls,
 * so they live here rather than being written twice.
 *
 * Everything is drawn in the site's existing flat, hard-edged language:
 * 2px `--color-divider` rules, no radii (tags excepted, which keep the
 * shared `.tag` pill), accent-red for the selected state, `--niv-slate`
 * for the "pressed" fill the press archive already used for its own active
 * chip. No new tokens are introduced.
 */

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export type DeskTabItem = {
  key: string
  label: ReactNode
  count?: number
}

/**
 * The primary switch between the desk's buckets. Same visual shape as the
 * shared `TabBar` (equal-width cells, 2px rules, accent-filled active tab)
 * but driven by local state rather than routing, since the desk keeps its
 * search/facets when you move between buckets.
 */
export function DeskTabs({
  items,
  active,
  onSelect,
  className,
  label,
}: {
  items: DeskTabItem[]
  active: string
  onSelect: (key: string) => void
  className?: string
  label: string
}) {
  return (
    <div role="tablist" aria-label={label} className={cn('flex flex-wrap border-2 border-divider', className)}>
      {items.map((item) => {
        const selected = item.key === active
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(item.key)}
            className={cn(
              'flex flex-1 basis-[170px] items-center justify-between gap-2.5 px-[18px] py-[14px] text-start font-heading text-[14.5px] font-extrabold transition-colors duration-[250ms] ease-out',
              'border-e-2 border-divider last:border-e-0',
              'max-[720px]:basis-full max-[720px]:border-e-0 max-[720px]:border-b-2 max-[720px]:last:border-b-0',
              FOCUS,
              selected ? 'bg-accent text-white' : 'bg-transparent text-text hover:bg-neutral-200',
            )}
          >
            <span>{item.label}</span>
            {item.count !== undefined ? (
              <span
                className={cn(
                  'font-heading text-[12px] font-extrabold tabular-nums',
                  selected ? 'text-white/80' : 'text-neutral-700',
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

/** Search field with a leading glyph and a clear button that appears once typing starts. */
export function DeskSearch({
  id,
  value,
  onChange,
  label,
  placeholder,
  clearLabel,
  className,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  clearLabel: string
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-neutral-600 start-3.5"
      >
        <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M15.5 15.5 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full border-2 border-divider bg-white py-[11px] text-[14.5px] text-text ps-10 pe-10',
          'placeholder:text-neutral-600 focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          // Safari renders its own clear glyph on type=search, which would
          // sit under the button below; the button is the accessible one.
          '[&::-webkit-search-cancel-button]:hidden',
        )}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={clearLabel}
          className={cn(
            'absolute top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center end-2.5',
            'text-neutral-700 transition-colors duration-200 ease-out hover:text-accent-700',
            FOCUS,
          )}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M5 5 19 19M19 5 5 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </div>
  )
}

export type SegmentedOption<T extends string> = { value: T; label: ReactNode; title?: string }

/** Small two/three-way switch used for sort order and list/card view. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  className?: string
}) {
  return (
    <div role="group" aria-label={label} className={cn('flex border-2 border-divider', className)}>
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap px-[13px] py-[8px] font-heading text-[12.5px] font-extrabold transition-colors duration-[250ms] ease-out',
              'border-e-2 border-divider last:border-e-0',
              FOCUS,
              selected ? 'bg-niv-slate text-white' : 'text-neutral-800 hover:bg-neutral-200',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export type YearBucket = { year: number; count: number }

/**
 * The year histogram — the desk's main "special" navigation device and the
 * thing that makes fifteen years of coverage legible without scrolling
 * through it: one row per year in the range, a bar proportional to that
 * year's item count, click to filter.
 *
 * Years with nothing in them are still drawn (as a disabled, empty row)
 * rather than skipped, so the rail reads as a continuous timeline of the
 * organization's coverage — the gaps are information too.
 */
export function YearRail({
  buckets,
  active,
  onSelect,
  allLabel,
  heading,
  className,
}: {
  buckets: YearBucket[]
  active: number | null
  onSelect: (year: number | null) => void
  allLabel: string
  heading: string
  className?: string
}) {
  const max = Math.max(1, ...buckets.map((b) => b.count))
  const total = buckets.reduce((sum, b) => sum + b.count, 0)

  return (
    <div className={className}>
      <p className="m-0 mb-2.5 font-heading text-[11px] font-extrabold tracking-[0.14em] text-neutral-700">{heading}</p>
      <ul className="m-0 flex list-none flex-col p-0">
        <li>
          <button
            type="button"
            onClick={() => onSelect(null)}
            aria-pressed={active === null}
            className={cn(
              'mb-1 flex w-full items-center justify-between gap-2 border-b-2 border-divider pb-1.5 text-start',
              'font-heading text-[12px] font-extrabold transition-colors duration-200 ease-out',
              FOCUS,
              active === null ? 'text-accent-700' : 'text-neutral-800 hover:text-accent-700',
            )}
          >
            <span>{allLabel}</span>
            <span className="tabular-nums text-neutral-700">{total}</span>
          </button>
        </li>
        {buckets.map(({ year, count }) => {
          const selected = active === year
          const width = count === 0 ? 0 : Math.max(6, Math.round((count / max) * 100))
          return (
            <li key={year}>
              <button
                type="button"
                disabled={count === 0}
                onClick={() => onSelect(selected ? null : year)}
                aria-pressed={selected}
                className={cn(
                  'group flex w-full items-center gap-2 py-[3px] text-start',
                  FOCUS,
                  count === 0 && 'cursor-default opacity-45',
                )}
              >
                <span
                  className={cn(
                    'w-[34px] shrink-0 font-heading text-[11.5px] font-extrabold tabular-nums transition-colors duration-200 ease-out',
                    selected ? 'text-accent-700' : 'text-neutral-800',
                  )}
                >
                  {year}
                </span>
                <span className="relative block h-[10px] flex-1 bg-neutral-200">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-y-0 block transition-[background-color,width] duration-300 ease-out start-0',
                      selected ? 'bg-accent' : 'bg-niv-slate/45 group-hover:bg-niv-slate/75',
                    )}
                    style={{ width: `${width}%` }}
                  />
                </span>
                <span
                  className={cn(
                    'w-[20px] shrink-0 text-end font-heading text-[11px] font-extrabold tabular-nums',
                    selected ? 'text-accent-700' : 'text-neutral-700',
                  )}
                >
                  {count}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * Prev / page / next, plus a compact numeric jump list. Pagination rather
 * than "load more" is the point of the redesign: it is what keeps every
 * view of a 70-item archive about one screen tall.
 */
export function DeskPagination({
  page,
  pageCount,
  onChange,
  pageLabel,
  ofLabel,
  previousLabel,
  nextLabel,
  arrowPrev,
  arrowNext,
  className,
}: {
  page: number
  pageCount: number
  onChange: (page: number) => void
  pageLabel: string
  ofLabel: string
  previousLabel: string
  nextLabel: string
  arrowPrev: string
  arrowNext: string
  className?: string
}) {
  if (pageCount <= 1) return null

  const buttonClass = cn(
    'border-2 border-divider px-[16px] py-[9px] font-heading text-[13px] font-extrabold text-text transition-colors duration-200 ease-out',
    'hover:bg-niv-slate hover:text-white',
    'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text',
    FOCUS,
  )

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-4', className)}>
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 0} className={buttonClass}>
        {arrowPrev} {previousLabel}
      </button>

      {/*
        Eleven numbered buttons wrap onto two ragged rows on a phone, so
        below 560px they give way to a plain "page 3 of 11" readout and the
        prev/next buttons do the work.
      */}
      <span className="hidden font-heading text-[12.5px] font-extrabold tabular-nums text-neutral-700 max-[560px]:inline">
        {pageLabel} {page + 1} {ofLabel} {pageCount}
      </span>

      <div className="flex flex-wrap items-center gap-1.5 max-[560px]:hidden">
        {Array.from({ length: pageCount }, (_, i) => i).map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            aria-current={i === page ? 'true' : undefined}
            aria-label={`${pageLabel} ${i + 1} ${ofLabel} ${pageCount}`}
            className={cn(
              'h-[30px] w-[30px] border-2 font-heading text-[12px] font-extrabold tabular-nums transition-colors duration-200 ease-out',
              FOCUS,
              i === page
                ? 'border-accent bg-accent text-white'
                : 'border-divider text-neutral-800 hover:border-niv-slate hover:bg-niv-slate hover:text-white',
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount - 1}
        className={buttonClass}
      >
        {nextLabel} {arrowNext}
      </button>
    </div>
  )
}
