'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'

import type { PodcastShort } from '@/content/podcast'
import { podcastText } from '@/content/podcast'
import { cn, ImageSlot } from '@/components/ui'
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

/**
 * Best-effort guest-name extraction from the Short's freeform YouTube
 * title. Real titles from the channel follow several different shapes —
 * sampled 25 real Shorts titles while building this: about 10 match
 * "…מתוך הפרק (החדש) עם NAME[, more text]", 2 match the pipe-delimited
 * "חרדית מדוברת | NAME | … | SHORT" format, and the rest embed the name as
 * a plain sentence subject with no consistent marker at all (e.g. "יהודית
 * יפרח מספרת איך…") — those can't be told apart from ordinary prose by
 * regex without real risk of mis-cutting a person's name, so this only
 * extracts the two patterns confirmed reliable and returns `null`
 * otherwise, leaving the caller to fall back to the title itself.
 */
function guestNameFrom(title: string): string | null {
  const pipeParts = title
    .split('|')
    .map((p) => p.trim())
    .filter(Boolean)
  if (pipeParts.length >= 2 && /^short$/i.test(pipeParts[pipeParts.length - 1])) {
    return pipeParts[1] || null
  }

  // Stops at a comma, a period, " על " ("about" — several titles run
  // straight from the name into "X על TOPIC" with no punctuation between
  // them), or the end of the string.
  const match = title.match(/מתוך הפרק(?: החדש)? עם ([^.,]+?)(?:,|\.|\s+על\s|$)/)
  return match ? match[1].trim() : null
}

function captionFor(short: PodcastShort): string {
  const guestName = guestNameFrom(short.title)
  if (guestName) return guestName
  return short.title.length > 26 ? `${short.title.slice(0, 26).trim()}…` : short.title
}

/** Matches the widest column count below, so the row is always exactly full. */
const MAX_STORIES = 10

/**
 * The strip's story list: the channel's MOST-WATCHED Shorts, at most one
 * per guest, preferring the ones we can actually put a name to.
 *
 * Ranked by real YouTube view counts rather than by date (2026-08-28
 * brief) - the strip is the page's introduction to the show, so it should
 * lead with the conversations that actually travelled.
 *
 * 2026-08-27 brief ("more stories at the top, don't repeat the same name
 * twice"). Two things make that harder than a `slice`:
 *
 *   - The channel regularly cuts several Shorts from one episode, so the
 *     newest few routinely feature the same guest. The strip reads as a row
 *     of PEOPLE, and a repeated face looks broken.
 *   - `guestNameFrom` only recognises the two title shapes it can parse
 *     safely (see its comment), so some Shorts fall back to a truncated
 *     title as their caption. Deduplicating on the caption alone therefore
 *     missed real repeats: "אלי ביתאן" and "אלי ביתאן עושה לאסתי שושן…"
 *     are the same person but two different captions.
 *
 * So named Shorts are taken first, one per name; then, only if there is
 * still room, title-captioned ones — and those are skipped when an already
 * chosen guest's name appears anywhere in the title, which is what catches
 * the case above.
 */
/**
 * Shorts whose YouTube thumbnail frames the HOST rather than the named
 * guest (2026-08-28: "in the story, crop the interviewee, not me").
 *
 * This can't be fixed by cropping. YouTube picks the thumbnail frame, and
 * on these clips the guest is not in the frame at all — it is Esty alone,
 * mid-question. The circle then shows her under someone else's name, which
 * is the part that actually reads as wrong.
 *
 * So they're skipped, and that guest falls through to their next
 * most-watched Short. Nor can this be detected in code: nothing in the
 * data says who is on screen, so each entry here was checked by eye
 * against her photo. Add an id when a circle shows the wrong person.
 */
const HOST_FRAMED_SHORTS = new Set<string>([
  '5dckgt-xivA', // captioned "יעקב וידר"
  'j9PqsemL3iI', // captioned "מוישי ליפשיץ"
  'jLZWsPEluyQ', // captioned "מלכי רוטנר"
  '1EEB4ilJyVs', // captioned "אורי צייטלין"
])

function pickStories(shorts: PodcastShort[]): PodcastShort[] {
  const usedNames = new Set<string>()
  const picked: PodcastShort[] = []
  // Shorts with no view count sort last rather than being dropped: missing
  // data shouldn't outrank a real number, but it shouldn't hide a clip either.
  const byViews = [...shorts]
    .filter((short) => !HOST_FRAMED_SHORTS.has(short.videoId))
    .sort((a, b) => (b.viewCount ?? -1) - (a.viewCount ?? -1))

  for (const short of byViews) {
    const name = guestNameFrom(short.title)?.trim()
    if (!name || usedNames.has(name)) continue
    usedNames.add(name)
    picked.push(short)
    if (picked.length === MAX_STORIES) return picked
  }

  const usedCaptions = new Set(picked.map((s) => captionFor(s)))
  for (const short of byViews) {
    if (picked.includes(short)) continue
    if ([...usedNames].some((name) => short.title.includes(name))) continue
    const caption = captionFor(short).trim()
    if (!caption || usedCaptions.has(caption)) continue
    usedCaptions.add(caption)
    picked.push(short)
    if (picked.length === MAX_STORIES) break
  }

  return picked
}

/**
 * The Instagram-style horizontal "stories" strip: up to 12 circular avatars
 * from the channel's real Shorts (2026-08-13 brief, item 30 — each story
 * IS a real YouTube Short, not a full episode), each wrapped in a ring that
 * pulses steel-blue -> accent-red and back (mockup: `@keyframes
 * nivRingLight`, 7.2s, staggered 1.2s per avatar) plus a separate
 * hover/focus outline. Tapping a story opens `StoryViewer`, an in-page
 * lightbox — not a navigation away to YouTube.
 *
 * The caption is the guest's name where `captionFor()`/`guestNameFrom()`
 * above can confidently pull one out of the Short's freeform YouTube
 * title, falling back to the (truncated) title itself otherwise.
 *
 * `hqdefault.jpg` thumbnails for these (vertical, Shorts-format) videos
 * come back as a landscape 480x360 frame with the real content letterboxed
 * into a narrow strip in the middle, blurred/darkened copies of itself
 * padding the sides (confirmed by fetching real thumbnails from the
 * channel while building this) — plain `object-cover` alone still leaves
 * those blurred bars visible inside the circle, so the `<img>` below also
 * gets a fixed extra zoom to crop in past them onto just the real content.
 */
export function StoriesStrip({ shorts, locale }: { shorts: PodcastShort[]; locale: Locale }) {
  const shouldReduceMotion = useReducedMotion()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const shown = pickStories(shorts)
  const storyItems: StoryViewerItem[] = shown.map((short) => ({
    id: short.id,
    videoId: short.videoId,
    caption: captionFor(short),
  }))

  return (
    <div
      data-stories
      /*
       * Exactly one row, at every width, with no horizontal scrolling
       * (2026-08-28 brief). A scroller hid half the guests behind a gesture
       * that isn't obvious on a desktop, and wrapping to a second row was
       * not what was wanted either.
       *
       * So: a grid whose column count steps with the viewport, plus
       * nth-child rules that hide whatever wouldn't fit on that single row.
       * Rendering ten and hiding the surplus in CSS keeps the markup (and
       * the story-viewer indices) identical at every breakpoint, which a
       * JS-measured slice would not.
       */
      className={cn(
        'grid grid-cols-4 gap-x-3 py-[7px] pb-[10px]',
        'min-[560px]:grid-cols-6 min-[860px]:grid-cols-8 min-[1100px]:grid-cols-10',
        '[&>*:nth-child(n+5)]:hidden',
        'min-[560px]:[&>*:nth-child(n+5)]:flex min-[560px]:[&>*:nth-child(n+7)]:hidden',
        'min-[860px]:[&>*:nth-child(n+7)]:flex min-[860px]:[&>*:nth-child(n+9)]:hidden',
        'min-[1100px]:[&>*:nth-child(n+9)]:flex',
      )}
    >
      {shown.map((short, i) => {
        const caption = captionFor(short)

        return (
          <button
            key={short.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group flex min-w-0 flex-col items-center gap-[9px] text-center text-text no-underline"
          >
            <motion.span
              aria-hidden="true"
              className="box-border block aspect-square w-full max-w-[92px] rounded-full p-[3px] outline outline-2 outline-offset-[3px] outline-transparent transition-[outline-color] duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:outline-accent group-focus-visible:outline-accent"
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
              <span className="block h-full w-full overflow-hidden rounded-full bg-tint-cream">
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
                    // scale-[1.7] on top of object-cover: cropping a 480x360
                    // hqdefault.jpg straight into this 1:1 circle already
                    // crops in on the (centered) real content, but not far
                    // enough — the blurred side padding (see this
                    // component's own doc comment) is still wide enough to
                    // show inside the circle at plain object-cover. 1.7x
                    // was picked by inspecting real thumbnails: comfortably
                    // clears the padding without zooming in past the guest's
                    // face.
                    className="block h-full w-full scale-[1.7] object-cover"
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
