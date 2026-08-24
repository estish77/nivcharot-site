import type { ReactNode } from 'react'

import { cn } from './cn'

export type EyebrowProps = {
  /** Host element. @default 'p' */
  as?: 'p' | 'div' | 'span'
  className?: string
  children: ReactNode
}

/**
 * The small accent "eyebrow" label used above every section/page title
 * (מדוע בעצם הכל התחיל / Our purpose / etc.) — 13px/800/tracking .08em.
 *
 * The mockups render this as an `<h6>`, which breaks heading order
 * (h1 → h6 with no h2-h5 in between). This is a deliberate a11y fix: it's
 * a visual label, not a real heading, so it renders a `<p>` by default —
 * keep real headings (h1 > h2 > h3) in document order elsewhere.
 *
 * Uses `--color-accent-700`, a darkened derivative of the real brand red
 * (sampled from the logo files), not the raw `--color-accent` itself: the
 * raw brand red passes WCAG AA as text on `--color-bg` (4.67:1) but this
 * component renders on several of the site's other light tints too
 * (`--tint-cream` 4.42:1, `--tint-slate` 4.38:1, `--niv-cream` 3.73:1) —
 * all below the 4.5:1 floor for 13px text. accent-700 clears all of them.
 */
export function Eyebrow({ as: Tag = 'p', className, children }: EyebrowProps) {
  return (
    <Tag className={cn('m-0 font-heading text-[13px] font-extrabold tracking-[0.08em] text-accent-700', className)}>
      {children}
    </Tag>
  )
}
