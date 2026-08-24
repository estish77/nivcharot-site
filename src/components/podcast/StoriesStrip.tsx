'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'

import type { PodcastShort } from '@/content/podcast'
import { podcastText } from '@/content/podcast'
import { ImageSlot } from '@/components/ui'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'
import { StoryViewer, type StoryViewerItem } from './StoryViewer'

const RING_REST_COLOR = '#4a6d8c'
// The mockup's `--color-accent` hex, hardcoded: Motion needs a concrete
// color to interpolate between keyframes (a `var(--color-accent)` string
// reference doesn't animate smoothly), so the design token's known value
// is inlined here instead.
const RING_PEAK_COLOR = '#d8252f'
const SHADOW_REST = '0 0 0 0 rgba(216, 37, 47, 0)'
// color-mix(in srgb, var(--color-accent) 18%, transparent) mixed toward
// `transparent` interpolates premultiplied per the CSS Color 4 spec, which
// preserves hue at reduced alpha — equivalent to rgba(216,37,47,0.18).
const SHADOW_PEAK = '0 0 0 4px rgba(216, 37, 47, 0.18)'
const RING_TIMES = [0, 0.22, 0.45, 1]
const RING_DURATION_S = 7.2
const RING_EASE = [0.45, 0, 0.55, 1] as const
const RING_DELAY_STEP_S = 1.2

function captionFor(short: PodcastShort): string {
  return short.title.length > 26 ? `${short.title.slice(0, 26).trim()}…` : short.title
}

/**
 * The Instagram-style horizontal "stories" strip: up to 6 circular avatars
 * from the channel's real Shorts (2026-08-13 brief, item 30 — each story
 * IS a real YouTube Short, not a full episode), each wrapped in a ring that
 * pulses steel-blue -> accent-red and back (mockup: `@keyframes
 * nivRingLight`, 7.2s, staggered 1.2s per avatar) plus a separate
 * hover/focus outline. Tapping a story opens `StoryViewer`, an in-page
 * lightbox — not a navigation away to YouTube.
 *
 * The caption is the Short's own (truncated) title, not a parsed-out guest
 * name: titles follow a "מתוך הפרק עם X" pattern but aren't structured data
 * — regex-guessing a real person's name back out of free text risks
 * mis-cutting it, the same reason full-episode titles aren't parsed either
 * (see content/podcast.ts's `toLiveEpisode` comment). Flagged as a real,
 * open gap against the brief's "text below is the interviewee's name" ask.
 */
export function StoriesStrip({ shorts, locale }: { shorts: PodcastShort[]; locale: Locale }) {
  const shouldReduceMotion = useReducedMotion()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const shown = shorts.slice(0, 6)
  const storyItems: StoryViewerItem[] = shown.map((short) => ({
    id: short.id,
    videoId: short.videoId,
    caption: captionFor(short),
  }))

  return (
    <div
      data-stories
      className="flex gap-[22px] overflow-x-auto py-[7px] pb-[10px] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-divider"
    >
      {shown.map((short, i) => {
        const caption = captionFor(short)

        return (
          <button
            key={short.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group flex w-[104px] shrink-0 flex-col items-center gap-[9px] text-center text-text no-underline"
          >
            <motion.span
              aria-hidden="true"
              className="box-border block h-[92px] w-[92px] shrink-0 rounded-full p-[3px] outline outline-2 outline-offset-[3px] outline-transparent transition-[outline-color] duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:outline-accent group-focus-visible:outline-accent"
              initial={false}
              animate={
                shouldReduceMotion
                  ? { backgroundColor: RING_REST_COLOR, boxShadow: SHADOW_REST }
                  : { backgroundColor: [RING_REST_COLOR, RING_PEAK_COLOR, RING_PEAK_COLOR, RING_REST_COLOR], boxShadow: [SHADOW_REST, SHADOW_PEAK, SHADOW_PEAK, SHADOW_REST] }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      duration: RING_DURATION_S,
                      ease: RING_EASE,
                      times: RING_TIMES,
                      repeat: Infinity,
                      delay: i * RING_DELAY_STEP_S,
                    }
              }
            >
              <span className="block h-[86px] w-[86px] overflow-hidden rounded-full bg-tint-cream">
                {short.thumbnailUrl ? (
                  // Real per-video YouTube thumbnail (src/lib/youtube.ts) —
                  // a plain <img>, not next/image: these are remote
                  // i.ytimg.com URLs and next.config.ts has no remote
                  // pattern configured for that host (a sitewide config
                  // file outside this component's scope to edit).
                  <img
                    src={short.thumbnailUrl}
                    alt={caption}
                    width={86}
                    height={86}
                    loading="lazy"
                    className="block h-full w-full object-cover"
                  />
                ) : (
                  <ImageSlot
                    shape="circle"
                    label={t(locale, podcastText.shortPlaceholder)}
                    className="h-[86px] min-w-0 border-0"
                  />
                )}
              </span>
            </motion.span>
            <span className="text-xs font-semibold leading-[1.35]">{caption}</span>
          </button>
        )
      })}
      <StoryViewer items={storyItems} openIndex={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} locale={locale} />
    </div>
  )
}
