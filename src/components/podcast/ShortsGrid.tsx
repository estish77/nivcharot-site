'use client'

import { useState } from 'react'

import { Eyebrow, ImageSlot, Reveal, Section } from '@/components/ui'
import type { PodcastShort } from '@/content/podcast'
import { t, type Locale } from '@/lib/i18n'
import { StoryViewer, type StoryViewerItem } from './StoryViewer'

const TEXT = {
  eyebrow: { he: 'שורטים', en: 'SHORTS' },
  title: { he: 'רגעים קצרים מהפרקים', en: 'Short moments from the episodes' },
}

function ShortCard({ short, onPlay }: { short: PodcastShort; onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      className="group flex flex-col gap-3 border-2 border-divider bg-white p-3 text-start transition-colors duration-200 ease-out hover:border-accent focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className="relative block aspect-[9/16] w-full overflow-hidden bg-tint-cream">
        {short.thumbnailUrl ? (
          <img
            src={short.thumbnailUrl}
            alt={short.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <ImageSlot label={short.title} className="absolute inset-0 h-full w-full border-0" />
        )}
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
      <span className="block text-[12.5px] leading-[1.6] text-neutral-700">{short.summary}</span>
    </button>
  )
}

/**
 * The interactive half of `ShortsSection`: a responsive card grid, each
 * showing the Short's real thumbnail + summary, opening in the same
 * in-page `StoryViewer` lightbox the top stories strip uses (so "embedded
 * on the site" holds here too, not a link out to YouTube).
 */
export function ShortsGrid({ shorts, locale }: { shorts: PodcastShort[]; locale: Locale }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const shown = shorts.slice(0, 10)
  const storyItems: StoryViewerItem[] = shown.map((short) => ({
    id: short.id,
    videoId: short.videoId,
    caption: short.title,
  }))

  return (
    <Reveal as="section">
      <Section as="div" borderBlock paddingBlockStart="48px" paddingBlockEnd="56px">
        <Eyebrow className="mb-2.5">{t(locale, TEXT.eyebrow)}</Eyebrow>
        <h2 className="mb-6">{t(locale, TEXT.title)}</h2>
        <div className="grid grid-cols-2 gap-4 min-[640px]:grid-cols-3 min-[960px]:grid-cols-5">
          {shown.map((short, i) => (
            <ShortCard key={short.id} short={short} onPlay={() => setOpenIndex(i)} />
          ))}
        </div>
      </Section>
      <StoryViewer items={storyItems} openIndex={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} locale={locale} />
    </Reveal>
  )
}
