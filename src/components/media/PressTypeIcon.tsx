import type { PressItemType } from '@/content/press-archive'

export type PressTypeIconProps = {
  type: PressItemType
  className?: string
}

/**
 * Small line-glyph per `PressArchiveItem.type` (document / play-circle /
 * megaphone) — the "type icon" the site owner's brief asked for on each
 * "בתקשורת" card. Drawn in-house in the same stroke-based, 24x24-viewBox
 * style as the other hand-built icons already in this codebase (see
 * `Carousel.tsx`'s `ChevronIcon`, `NavMenu.tsx`'s `CloseIcon`) rather than
 * an outlet/brand logo — no real logo assets exist in this repo to use
 * honestly, and a hand-drawn brand mark would risk misrepresenting outlets
 * this site doesn't control.
 */
export function PressTypeIcon({ type, className }: PressTypeIconProps) {
  if (type === 'video') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className={className}>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 8.3v7.4l6.2-3.7z" fill="currentColor" />
      </svg>
    )
  }

  if (type === 'podcast') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className={className}>
        <rect x="9" y="3.5" width="6" height="10.5" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M5.5 11.5v1a6.5 6.5 0 0 0 13 0v-1M12 18.5v2.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (type === 'press-mention') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className={className}>
        <path
          d="M3 10.5v3a1 1 0 0 0 1 1h1.6L10 18v-11l-4.4 3.5H4a1 1 0 0 0-1 1Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M14 9.2a3 3 0 0 1 0 5.6M17 7.3a6 6 0 0 1 0 9.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" className={className}>
      <path
        d="M6 3.5h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8.5 12h7M8.5 15.3h7M8.5 8.7h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
