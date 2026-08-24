import type { CSSProperties } from 'react'

import { cn } from './cn'

export type ImageSlotProps = {
  /** @default 'rect' */
  shape?: 'rect' | 'circle'
  /** Placeholder description — also doubles as the accessible name (`aria-label`), since this stands in for a future real image's `alt` text. */
  label: string
  /** CSS `aspect-ratio`, e.g. `'16/9'`. Ignored for `shape="circle"` (always 1/1). Omit to size purely via `style`/`className` (width+height), matching how the mockups size most slots. */
  aspectRatio?: string
  className?: string
  /** Use for explicit sizing, e.g. `{ width: 150, height: 150 }` or `{ height: 400 }`. */
  style?: CSSProperties
}

/**
 * Styled stand-in for the 18 unfilled `<image-slot>` sockets in the
 * mockups (design-tool placeholders, not real markup): dashed divider
 * border, centered label, tint-cream fill, correct shape. `role="img"` +
 * `aria-label` exposes the placeholder's description to assistive tech
 * exactly as the eventual real image's `alt` would.
 */
export function ImageSlot({ shape = 'rect', label, aspectRatio, className, style }: ImageSlotProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        'flex items-center justify-center border-2 border-dashed border-divider bg-tint-cream px-4 text-center font-heading text-xs font-bold leading-snug tracking-wide text-neutral-700',
        shape === 'circle' && 'aspect-square rounded-full',
        className,
      )}
      style={{ aspectRatio: shape === 'rect' ? aspectRatio : undefined, ...style }}
    >
      {label}
    </span>
  )
}
