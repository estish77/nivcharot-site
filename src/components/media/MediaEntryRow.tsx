'use client'

import { AnimatePresence, motion } from 'motion/react'

import { cn, Tag } from '@/components/ui'
import { mediaDeskText } from '@/content/media-desk'
import { t, type Locale } from '@/lib/i18n'
import type { MediaEntry } from '@/lib/mediaEntries'
import { useReducedMotion } from '@/lib/useReducedMotion'

import { PressTypeIcon } from './PressTypeIcon'

export type MediaEntryRowProps = {
  entry: MediaEntry
  /** 1-based position within the whole filtered set (not just this page) — printed as the catalogue number. */
  ordinal: number
  open: boolean
  onToggle: () => void
  locale: Locale
}

const EASE = [0.22, 0.61, 0.36, 1] as const

/**
 * One dense, expandable row in the media desk's list view.
 *
 * The redesign brief's core tension is "don't remove any data" + "make it
 * a short page". Progressive disclosure is what resolves it: collapsed, a
 * row shows the catalogue number, date, kind, title, the first two lines
 * of the summary, the outlet and any language badge; expanded in place, it
 * adds the complete summary, any extra body paragraphs, the honest source
 * note and the outbound link.
 *
 * The collapsed row was tightened to a single summary line in the first
 * pass and opened back up on the 2026-08-28 brief ("space the items out a
 * bit, and show more information in the feed before expanding"): reading a
 * row is how you decide whether to open it, and one clipped line rarely
 * carried enough to make that call.
 *
 * The whole header is one `<button>` and the outbound link lives only in
 * the expanded panel, so there is never a link nested inside a button.
 */
export function MediaEntryRow({ entry, ordinal, open, onToggle, locale }: MediaEntryRowProps) {
  const shouldReduceMotion = useReducedMotion()
  const panelId = `desk-panel-${entry.id.replace(/[^a-z0-9]/gi, '-')}`

  return (
    <article className={cn('border-b-2 border-divider transition-colors duration-200 ease-out', open && 'bg-tint-cream')}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'grid w-full grid-cols-[34px_112px_1fr_26px] items-start gap-x-5 gap-y-2 px-1 py-[26px] text-start',
          'transition-colors duration-200 ease-out hover:bg-neutral-200/70',
          'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
          'max-[720px]:grid-cols-[30px_1fr_24px]',
        )}
      >
        <span
          aria-hidden="true"
          className="pt-[3px] font-heading text-[12px] font-extrabold tabular-nums text-neutral-600 max-[720px]:pt-0"
        >
          {String(ordinal).padStart(2, '0')}
        </span>

        <span className="flex flex-col gap-[3px] pt-[2px] max-[720px]:col-start-2 max-[720px]:flex-row max-[720px]:flex-wrap max-[720px]:items-center max-[720px]:gap-2 max-[720px]:pt-0">
          <span className="flex items-center gap-1.5 text-accent-700">
            <PressTypeIcon type={entry.iconType} />
            <span className="font-heading text-[11px] font-extrabold tracking-[0.08em] text-neutral-700">
              {entry.dateLabel}
            </span>
          </span>
          {entry.kindLabel ? (
            <span className="font-heading text-[10px] font-extrabold tracking-[0.1em] text-accent-700">
              {entry.kindLabel}
            </span>
          ) : null}
        </span>

        <span className="flex min-w-0 flex-col gap-[7px] max-[720px]:col-span-2 max-[720px]:col-start-2">
          <span className={cn('font-heading text-[18px] font-extrabold leading-[1.35]', open && 'text-accent-700')}>
            {entry.title}
          </span>
          {!open && entry.summary ? (
            <span className="line-clamp-2 max-w-[760px] text-[14px] leading-[1.7] text-neutral-800">
              {entry.summary}
            </span>
          ) : null}
          {!open && (entry.outlet || entry.langBadge) ? (
            <span className="mt-0.5 flex flex-wrap items-center gap-2.5">
              {entry.outlet ? (
                <span className="font-heading text-[11.5px] font-extrabold tracking-[0.04em] text-neutral-600">
                  {entry.outlet}
                </span>
              ) : null}
              {entry.langBadge ? (
                <span className="border border-divider px-1.5 py-0.5 font-heading text-[10px] font-extrabold tracking-[0.06em] text-neutral-600">
                  {entry.langBadge}
                </span>
              ) : null}
            </span>
          ) : null}
        </span>

        <span
          aria-hidden="true"
          className={cn(
            'relative mt-[7px] block h-[13px] w-[13px] flex-none text-accent-700',
            'transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none',
            open && 'rotate-45',
            "before:absolute before:inset-0 before:m-auto before:h-[1.6px] before:w-[13px] before:bg-current before:content-['']",
            "after:absolute after:inset-0 after:m-auto after:h-[13px] after:w-[1.6px] after:bg-current after:content-['']",
            'max-[720px]:col-start-3 max-[720px]:row-start-1',
          )}
        />
        <span className="sr-only">{t(locale, open ? mediaDeskText.collapse : mediaDeskText.expand)}</span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            key="panel"
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.32, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-[34px_112px_1fr] gap-x-4 px-1 pb-6 max-[720px]:grid-cols-1">
              <span aria-hidden="true" className="max-[720px]:hidden" />
              <span aria-hidden="true" className="max-[720px]:hidden" />
              <div className="flex flex-col items-start gap-3">
                {entry.summary ? (
                  <p className="m-0 max-w-[760px] text-[14.5px] leading-[1.75] text-neutral-800">{entry.summary}</p>
                ) : null}
                {entry.paragraphs.map((paragraph, i) => (
                  <p key={i} className="m-0 max-w-[760px] text-[14.5px] leading-[1.75] text-neutral-800">
                    {paragraph}
                  </p>
                ))}
                {entry.note ? (
                  <p className="m-0 max-w-[760px] border-s-2 border-divider ps-3 text-[12.5px] leading-[1.65] text-neutral-600">
                    {entry.note}
                  </p>
                ) : null}
                {entry.youtubeId ? (
                  <div className="w-full max-w-[560px] border-2 border-niv-slate bg-[#141210]">
                    <iframe
                      title={entry.title}
                      src={`https://www.youtube.com/embed/${entry.youtubeId}?rel=0`}
                      loading="lazy"
                      className="block aspect-video w-full border-0"
                      allow="encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : null}
                <div className="flex flex-wrap items-center gap-3 pt-0.5">
                  {entry.outlet ? (
                    <Tag variant="outline" className="pointer-events-none">
                      {entry.outlet}
                    </Tag>
                  ) : null}
                  {entry.langBadge ? (
                    <span className="border border-divider px-1.5 py-0.5 font-heading text-[10px] font-extrabold tracking-[0.06em] text-neutral-600">
                      {entry.langBadge}
                    </span>
                  ) : null}
                  <a
                    href={entry.href}
                    {...(entry.external ? { target: '_blank', rel: 'noopener' } : {})}
                    className="flex items-center gap-1.5 whitespace-nowrap font-heading text-[13px] font-extrabold text-accent-700 no-underline hover:text-accent focus-visible:rounded-sm focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {entry.ctaLabel}
                    <span aria-hidden="true">{entry.external ? '↗' : '›'}</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  )
}
