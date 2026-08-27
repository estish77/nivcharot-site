import Image from 'next/image'

import { Cell, Tag } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import { elsewhereMediaText, type ElsewhereMediaItem } from '@/content/elsewhere-media'

import { PressTypeIcon } from './PressTypeIcon'

export type ElsewhereMediaCardProps = { item: ElsewhereMediaItem; locale: Locale }

/**
 * Extracts a YouTube video id from any of the URL shapes this content
 * actually uses (`watch?v=`, `youtu.be/`, `/shorts/`) so the card can embed
 * a real player instead of just linking out (2026-08-13 brief, third
 * follow-up: "איזור הפודקאסטים להטמיע וידאו מיוטיוב"). Returns `null` for
 * everything else (Spotify, Kan, Substack, a self-hosted mp4 page) — those
 * keep the plain outbound-link card, since there's no YouTube id to embed.
 */
function youtubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1) || null
    if (!parsed.hostname.endsWith('youtube.com')) return null
    if (parsed.pathname === '/watch') return parsed.searchParams.get('v')
    const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/]+)/)
    return shortsMatch ? shortsMatch[1] : null
  } catch {
    return null
  }
}

/** The podcast tile's visual centerpiece — a waveform glyph standing in for the video thumbnail an audio-only piece doesn't have. */
function AudioWaveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" width="40" height="27" aria-hidden="true" className={className}>
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

function CardMeta({ item, locale }: { item: ElsewhereMediaItem; locale: Locale }) {
  const isTranslated = item.sourceLanguage !== locale
  return (
    <div className="flex flex-wrap items-center gap-2 text-accent-700">
      <PressTypeIcon type={item.kind === 'podcast' ? 'podcast' : 'video'} />
      {t(locale, item.dateLabel) ? (
        <span className="font-heading text-[11px] font-extrabold tracking-[0.1em] text-neutral-700">
          {t(locale, item.dateLabel)}
        </span>
      ) : null}
      {isTranslated ? (
        <span className="border border-divider px-1.5 py-0.5 font-heading text-[10px] font-extrabold tracking-[0.06em] text-neutral-600">
          {t(locale, elsewhereMediaText.originalLanguageBadge[item.sourceLanguage])}
        </span>
      ) : null}
    </div>
  )
}

export function ElsewhereMediaCard({ item, locale }: ElsewhereMediaCardProps) {
  const cta = t(locale, item.kind === 'podcast' ? elsewhereMediaText.listenLabel : elsewhereMediaText.watchLabel)
  // Podcasts never get a video embed, even when the episode also happens to
  // have a YouTube upload (e.g. a video-podcast episode) — 2026-08-16 brief:
  // "כתבות אודיו לשים בסקשן נפרד ובעיצוב שונה מוידאו" (audio pieces need
  // their own, visually distinct-from-video treatment). The waveform tile
  // below plays that role; only video/talk footage gets the iframe.
  const videoId = item.kind === 'podcast' ? null : youtubeVideoId(item.url)

  if (item.kind === 'podcast') {
    return (
      <Cell href={item.url} target="_blank" rel="noopener" hoverTint className="gap-2.5">
        <div className="relative flex aspect-video w-full flex-col items-center justify-center gap-2 overflow-hidden border-2 border-accent-700 bg-tint-cream">
          {item.image ? (
            <Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 860px) 100vw, 33vw" className="object-cover" />
          ) : (
            <>
              <AudioWaveIcon className="text-accent-700" />
              <span className="font-heading text-[13px] font-extrabold tracking-[0.08em] text-accent-700">{cta}</span>
            </>
          )}
        </div>
        <CardMeta item={item} locale={locale} />
        <h3 className="text-[18px] leading-[1.3]">{t(locale, item.title)}</h3>
        <p className="text-[14px] leading-[1.65] text-neutral-800">{t(locale, item.summary)}</p>
        {item.note ? <p className="text-[12px] leading-[1.5] text-neutral-600">{t(locale, item.note)}</p> : null}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <Tag variant="outline" className="pointer-events-none">
            {item.host}
          </Tag>
          <span aria-hidden="true" className="ms-auto whitespace-nowrap font-heading text-[13px] font-extrabold text-accent-700">
            {cta}
          </span>
        </div>
      </Cell>
    )
  }

  if (videoId) {
    return (
      <Cell hoverTint className="gap-2.5">
        <div className="aspect-video w-full border-2 border-niv-slate bg-[#141210]">
          <iframe
            title={t(locale, item.title)}
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            loading="lazy"
            className="block h-full w-full border-0"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
        <CardMeta item={item} locale={locale} />
        <h3 className="text-[18px] leading-[1.3]">{t(locale, item.title)}</h3>
        <p className="text-[14px] leading-[1.65] text-neutral-800">{t(locale, item.summary)}</p>
        {item.note ? <p className="text-[12px] leading-[1.5] text-neutral-600">{t(locale, item.note)}</p> : null}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <Tag variant="outline" className="pointer-events-none">
            {item.host}
          </Tag>
          <a
            href={item.url}
            target="_blank"
            rel="noopener"
            className="ms-auto whitespace-nowrap font-heading text-[13px] font-extrabold text-accent-700 no-underline hover:text-accent focus-visible:rounded-sm focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t(locale, { he: 'ביוטיוב ↗', en: 'On YouTube ↗' })}
          </a>
        </div>
      </Cell>
    )
  }

  return (
    <Cell href={item.url} target="_blank" rel="noopener" hoverTint className="gap-2">
      <CardMeta item={item} locale={locale} />
      <h3 className="text-[18px] leading-[1.3]">{t(locale, item.title)}</h3>
      <p className="text-[14px] leading-[1.65] text-neutral-800">{t(locale, item.summary)}</p>
      {item.note ? <p className="text-[12px] leading-[1.5] text-neutral-600">{t(locale, item.note)}</p> : null}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <Tag variant="outline" className="pointer-events-none">
          {item.host}
        </Tag>
        <span aria-hidden="true" className="ms-auto font-heading text-[13px] font-extrabold text-accent-700">
          {cta}
        </span>
      </div>
    </Cell>
  )
}
