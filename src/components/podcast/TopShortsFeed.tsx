'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

import { cn } from '@/components/ui'
import { episodeDeskText } from '@/content/media-desk'
import type { PodcastShort } from '@/content/podcast'
import { t, type Locale } from '@/lib/i18n'

import { StoryViewer, type StoryViewerItem } from './StoryViewer'

/** Instagram's Reels-tile signature: a play glyph with the view count beside it. */
function PlayCountIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true" className="flex-none">
      <path d="M6 4.5v15l14-7.5-14-7.5Z" />
    </svg>
  )
}

/**
 * The channel's most-watched Shorts, as a social-style tile grid.
 *
 * 2026-08-28 brief ("a feed of the most-watched shorts from YouTube, in a
 * cool Instagram-style social design"). The borrowed conventions are the
 * ones that carry meaning rather than the ones that would just look like
 * Instagram: a dense grid of 9:16 portrait tiles, the play-glyph-plus-view-
 * count overlay Reels tiles use, and a tap that opens the clip in place.
 * Everything else stays in this site's own flat language — 2px rules, brand
 * red, no rounded corners — so it reads as part of the page.
 *
 * Ranked by real YouTube view counts (synced offline into
 * `podcast-archive.json`), not by recency, which is the whole point: these
 * are the moments that actually travelled.
 *
 * Clips open in the same in-page `StoryViewer` the stories strip uses, so a
 * visitor never gets handed off to YouTube mid-browse.
 */
export function TopShortsFeed({ shorts, locale }: { shorts: PodcastShort[]; locale: Locale }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Compact ("35.9K"), the way a social feed writes view counts — a raw
  // 35,870 in a 13px overlay is harder to read at a glance than the number
  // is worth.
  const compact = useMemo(
    () => new Intl.NumberFormat(locale === 'he' ? 'he-IL' : 'en-US', { notation: 'compact', maximumFractionDigits: 1 }),
    [locale],
  )

  const storyItems: StoryViewerItem[] = shorts.map((short) => ({
    id: short.id,
    videoId: short.videoId,
    caption: short.title,
  }))

  return (
    <>
      <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 min-[640px]:grid-cols-3 min-[900px]:grid-cols-4 min-[1100px]:grid-cols-6">
        {shorts.map((short, i) => (
          <li key={short.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`${t(locale, episodeDeskText.playShort)}: ${short.title}`}
              className={cn(
                'group relative block w-full overflow-hidden border-2 border-divider bg-tint-cream',
                'aspect-[9/16] transition-colors duration-200 ease-out hover:border-accent',
                'focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              )}
            >
              {short.thumbnailUrl ? (
                <Image
                  src={short.thumbnailUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, (max-width: 1100px) 25vw, 16vw"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                />
              ) : null}

              {/* Bottom scrim: keeps the white count legible over any frame. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent"
              />

              {short.viewCount != null ? (
                <span className="absolute bottom-2 flex items-center gap-1 font-heading text-[12px] font-extrabold text-white start-2.5">
                  <PlayCountIcon />
                  <span className="tabular-nums">{compact.format(short.viewCount)}</span>
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      <StoryViewer
        items={storyItems}
        openIndex={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
        locale={locale}
      />
    </>
  )
}
