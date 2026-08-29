'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'
import { t, type Locale } from '@/lib/i18n'

export type StoryViewerItem = {
  id: string
  videoId: string
  caption: string
  /** The Short's own YouTube description (first paragraph, real text) — omitted (not translated) for English, see `StoriesStrip`. */
  summary?: string
}

export type StoryViewerProps = {
  items: StoryViewerItem[]
  openIndex: number | null
  onClose: () => void
  onNavigate: (index: number) => void
  locale: Locale
}

const CLOSE_LABEL = { he: 'סגירה', en: 'Close' }
const PREV_LABEL = { he: 'הקודם', en: 'Previous' }
const NEXT_LABEL = { he: 'הבא', en: 'Next' }

/**
 * An Instagram-style story viewer for the podcast "stories" strip
 * (2026-08-13 brief, item 30): a full-screen overlay with a per-item
 * progress bar row at the top, playing one YouTube video at a time
 * (portrait-framed), with click zones on either side to move
 * prev/next and Escape/backdrop/× to close. Opens IN the page — no
 * navigation away to YouTube — which is the whole point of a "story".
 *
 * Autoplays via the embed's own `autoplay=1` param; there's no reliable
 * cross-origin "video ended" event from a plain iframe embed without the
 * YouTube IFrame Player API, so this doesn't auto-advance on end — the
 * visitor taps through, same as the click-to-advance zones already provide.
 */
export function StoryViewer({ items, openIndex, onClose, onNavigate, locale }: StoryViewerProps) {
  const shouldReduceMotion = useReducedMotion()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const isOpen = openIndex !== null
  const current = isOpen ? items[openIndex] : null

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate(locale === 'he' ? (openIndex! - 1 + items.length) % items.length : (openIndex! + 1) % items.length)
      if (e.key === 'ArrowLeft') onNavigate(locale === 'he' ? (openIndex! + 1) % items.length : (openIndex! - 1 + items.length) % items.length)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, openIndex])

  return (
    <AnimatePresence>
      {isOpen && current ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          onClick={onClose}
        >
          <div
            className="relative flex h-full max-h-[860px] w-full max-w-[420px] flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex gap-1.5" aria-hidden="true">
              {items.map((item, i) => (
                <div key={item.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
                  {i === openIndex ? <div className="h-full w-full bg-white" /> : null}
                  {i < openIndex! ? <div className="h-full w-full bg-white" /> : null}
                </div>
              ))}
            </div>

            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="m-0 truncate text-[14px] font-semibold text-white">{current.caption}</p>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 flex-none items-center justify-center text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className="sr-only">{t(locale, CLOSE_LABEL)}</span>
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden rounded-lg bg-black">
              <iframe
                key={current.videoId}
                src={`https://www.youtube.com/embed/${current.videoId}?autoplay=1&playsinline=1&rel=0`}
                title={current.caption}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
              <button
                type="button"
                aria-label={t(locale, PREV_LABEL)}
                onClick={() => onNavigate((openIndex! - 1 + items.length) % items.length)}
                className="absolute inset-y-0 start-0 w-1/3 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
              />
              <button
                type="button"
                aria-label={t(locale, NEXT_LABEL)}
                onClick={() => onNavigate((openIndex! + 1) % items.length)}
                className="absolute inset-y-0 end-0 w-1/3 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
              />
            </div>

            {/* The Short's own YouTube description (2026-08-29 brief: "תחת כל שורט את התקציר שלו") — real text, so capped and scrollable rather than assumed to always fit in one glance. */}
            {current.summary ? (
              <p className="m-0 mt-3 max-h-[88px] flex-none overflow-y-auto text-[13px] leading-[1.6] text-white/80">
                {current.summary}
              </p>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
