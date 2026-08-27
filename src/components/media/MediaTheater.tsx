'use client'

import { useState } from 'react'

import { cn, Tag } from '@/components/ui'
import { mediaDeskText } from '@/content/media-desk'
import { t, type Locale } from '@/lib/i18n'
import type { MediaEntry } from '@/lib/mediaEntries'

import { PressTypeIcon } from './PressTypeIcon'

/** Waveform glyph standing in for the thumbnail an audio-only piece doesn't have. */
function AudioWaveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" width="72" height="48" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M4 16v0" />
        <path d="M11 11v10" />
        <path d="M18 5v22" />
        <path d="M25 9v14" />
        <path d="M32 2v28" />
        <path d="M39 9v14" />
        <path d="M46 14v4" />
      </g>
    </svg>
  )
}

/**
 * The "שמע ווידאו" tab: a stage + playlist instead of a grid of eighteen
 * separate embed cards.
 *
 * The old layout stacked three `CellGrid`s of `aspect-video` iframes, which
 * was both the tallest thing on the page and the slowest (every embed
 * loaded at once). Here one item plays at a time in the stage, and the
 * whole catalogue sits beside it as a scrollable list — the entire section
 * is about one screen tall, no matter how many items the list grows to,
 * and only the selected embed is ever mounted.
 *
 * Audio items keep the visually distinct waveform treatment the 2026-08-16
 * brief asked for (no iframe: their platforms — Kan, Spotify, Substack —
 * aren't embeddable here), with a prominent link out to the real player.
 */
export function MediaTheater({ entries, locale }: { entries: MediaEntry[]; locale: Locale }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // The filtered list can change under us (search/facet/year). Resolving
  // the selection by lookup on every render — rather than syncing it into
  // state — means an item that filters out simply hands the stage back to
  // whatever now leads the list, with no effect and no stale id.
  const selected = entries.find((entry) => entry.id === selectedId) ?? entries[0]

  if (!selected) return null

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_360px] border-2 border-divider max-[960px]:grid-cols-1">
      <div className="border-e-2 border-divider p-6 max-[960px]:border-e-0 max-[960px]:border-b-2 max-[560px]:p-4">
        <p className="m-0 mb-3 font-heading text-[11px] font-extrabold tracking-[0.14em] text-accent-700">
          {t(locale, mediaDeskText.nowPlaying)}
        </p>

        {selected.youtubeId ? (
          <div className="mb-5 border-2 border-niv-slate bg-[#141210]">
            <iframe
              key={selected.youtubeId}
              title={selected.title}
              src={`https://www.youtube.com/embed/${selected.youtubeId}?rel=0`}
              className="block aspect-video w-full border-0"
              allow="encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="mb-5 flex aspect-video w-full flex-col items-center justify-center gap-3 border-2 border-accent-700 bg-tint-cream px-6 text-center">
            <AudioWaveIcon className="text-accent-700" />
            <span className="font-heading text-[12px] font-extrabold tracking-[0.08em] text-neutral-700">
              {t(locale, mediaDeskText.audioOnly)}
            </span>
            <a
              href={selected.href}
              target="_blank"
              rel="noopener"
              className="btn btn-primary px-[22px] py-[11px] text-[15px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {selected.ctaLabel}
            </a>
          </div>
        )}

        <div className="mb-2 flex flex-wrap items-center gap-2 text-accent-700">
          <PressTypeIcon type={selected.iconType} />
          <span className="font-heading text-[11px] font-extrabold tracking-[0.1em] text-neutral-700">
            {selected.dateLabel}
          </span>
          <span className="font-heading text-[10px] font-extrabold tracking-[0.1em] text-accent-700">
            {selected.kindLabel}
          </span>
          {selected.langBadge ? (
            <span className="border border-divider px-1.5 py-0.5 font-heading text-[10px] font-extrabold tracking-[0.06em] text-neutral-600">
              {selected.langBadge}
            </span>
          ) : null}
        </div>

        <h3 className="mb-2 text-[22px] leading-[1.28]">{selected.title}</h3>
        <p className="m-0 mb-3 max-w-[720px] text-[14.5px] leading-[1.75] text-neutral-800">{selected.summary}</p>
        {selected.note ? (
          <p className="m-0 mb-3 max-w-[720px] border-s-2 border-divider ps-3 text-[12.5px] leading-[1.65] text-neutral-600">
            {selected.note}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          {selected.outlet ? (
            <Tag variant="outline" className="pointer-events-none">
              {selected.outlet}
            </Tag>
          ) : null}
          <a
            href={selected.href}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1.5 whitespace-nowrap font-heading text-[13px] font-extrabold text-accent-700 no-underline hover:text-accent focus-visible:rounded-sm focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {selected.youtubeId ? t(locale, mediaDeskText.openOnYoutube) : selected.ctaLabel}
          </a>
        </div>
      </div>

      <div className="flex min-h-0 flex-col">
        <div className="flex items-baseline justify-between gap-3 border-b-2 border-divider px-5 py-[14px]">
          <p className="m-0 font-heading text-[11px] font-extrabold tracking-[0.14em] text-neutral-700">
            {t(locale, mediaDeskText.playlist)}
          </p>
          <span className="font-heading text-[12px] font-extrabold tabular-nums text-neutral-700">{entries.length}</span>
        </div>
        <ul className="m-0 max-h-[560px] list-none overflow-y-auto p-0 max-[960px]:max-h-[380px]">
          {entries.map((entry, i) => {
            const active = entry.id === selected.id
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(entry.id)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'flex w-full items-start gap-3 border-b-2 border-divider px-5 py-[13px] text-start transition-colors duration-200 ease-out',
                    'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
                    active ? 'bg-tint-cream' : 'hover:bg-neutral-200/70',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'mt-[3px] block h-[34px] w-[3px] flex-none',
                      active ? 'bg-accent' : 'bg-divider',
                    )}
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex items-center gap-1.5 text-accent-700">
                      <PressTypeIcon type={entry.iconType} />
                      <span className="font-heading text-[10.5px] font-extrabold tracking-[0.08em] text-neutral-700">
                        {entry.dateLabel}
                      </span>
                    </span>
                    <span
                      className={cn(
                        'line-clamp-2 font-heading text-[14px] font-extrabold leading-[1.35]',
                        active && 'text-accent-700',
                      )}
                    >
                      {entry.title}
                    </span>
                    <span className="line-clamp-1 text-[12px] leading-[1.5] text-neutral-600">{entry.outlet}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-[3px] font-heading text-[11px] font-extrabold tabular-nums text-neutral-600"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
