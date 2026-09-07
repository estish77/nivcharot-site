'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { Figure } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import type { GalleryContent } from '@/lib/cms'

export type CampaignCarouselProps = { images: GalleryContent['images']; title: string; locale: Locale }

/**
 * Same RTL-flip rule as `Carousel.tsx`'s own `ChevronIcon`: a "next" glyph
 * points toward the end (flips under `rtl:`) and a "prev" glyph starts
 * mirrored and flips back under `rtl:`, so each arrow always points toward
 * the side it's docked on regardless of writing direction.
 */
function ArrowIcon({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className={flip ? '-scale-x-100 rtl:scale-x-100' : 'rtl:-scale-x-100'}>
      <path
        d="m9 5 7 7-7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
      />
    </svg>
  )
}

/**
 * The image area of a Campaigns post card, swipeable like a real Instagram
 * carousel (2026-09-07 brief: "הגלריה צריכה להיות מוצגת כמו פוסט קרוסלה...
 * מספיק גדול וקריא" — displayed like a carousel post, big enough and
 * legible). One full-width slide per image with scroll-snap (touch swipe
 * works natively), dot indicators tracking the current slide via
 * `IntersectionObserver`, and prev/next buttons for pointer/keyboard users.
 * A single image just renders as one static slide with no controls.
 */
export function CampaignCarousel({ images, title, locale }: CampaignCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track || images.length < 2) return

    const slides = Array.from(track.children) as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(slides.indexOf(visible.target as HTMLElement))
      },
      { root: track, threshold: 0.6 },
    )
    slides.forEach((slide) => observer.observe(slide))
    return () => observer.disconnect()
  }, [images.length])

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current
      if (!track) return
      const slide = track.children[index] as HTMLElement | undefined
      slide?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    },
    [],
  )

  if (images.length === 0) return null

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {images.map((image, i) => (
          // `aspect-square` lives on the slide itself, not the track: a
          // slide's height used to come only from the track's own
          // `aspect-square` via flex-stretch, and Chromium was found to
          // drop that stretched height to 0 after a scroll-triggered
          // layout (the image would vanish mid-swipe). Self-sizing each
          // slide matches how `Figure` is used everywhere else in this
          // codebase (aspect ratio directly on the positioned element, not
          // inherited from a flex-stretched ancestor).
          <div key={image.url} className="relative aspect-square w-full flex-none overflow-hidden" style={{ scrollSnapAlign: 'start' }}>
            <Figure
              className="absolute inset-0 h-full w-full"
              src={image.url}
              alt={image.alt || title}
              mediaClassName="absolute inset-0 h-full w-full object-cover"
            />
            <span className="sr-only">{`${i + 1}/${images.length}`}</span>
          </div>
        ))}
      </div>

      {images.length > 1 ? (
        <>
          {active > 0 ? (
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label={t(locale, { he: 'התמונה הקודמת', en: 'Previous image' })}
              className="absolute inset-y-0 start-0 flex w-10 items-center justify-center text-white opacity-0 transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
            >
              <ArrowIcon flip />
            </button>
          ) : null}
          {active < images.length - 1 ? (
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label={t(locale, { he: 'התמונה הבאה', en: 'Next image' })}
              className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-white opacity-0 transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
            >
              <ArrowIcon />
            </button>
          ) : null}

          <span className="absolute end-2.5 top-2.5 rounded-full bg-niv-slate/70 px-2 py-0.5 text-[11px] font-semibold text-white">
            {active + 1}/{images.length}
          </span>

          <div className="absolute bottom-2.5 start-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((image, i) => (
              <button
                key={image.url}
                type="button"
                onClick={() => goTo(i)}
                aria-label={t(locale, { he: `עברי לתמונה ${i + 1}`, en: `Go to image ${i + 1}` })}
                aria-current={i === active}
                className={`h-[6px] w-[6px] rounded-full transition-colors duration-150 ${i === active ? 'bg-white' : 'bg-white/45'}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
