import type { ReactNode } from 'react'

import { cn } from './cn'
import { Eyebrow } from './Eyebrow'

export type SectionHeadProps = {
  /** Rendered via `Eyebrow` (a styled `<p>`, not a heading). */
  eyebrow?: ReactNode
  /** Rendered as the real `<h2>` — keeps h1 > h2 > h3 document order intact. */
  title: ReactNode
  /** Optional lead paragraph: 17px/1.7, max-width 680px. */
  lead?: ReactNode
  className?: string
  eyebrowClassName?: string
  titleClassName?: string
  leadClassName?: string
}

/** Eyebrow + h2 + optional lead paragraph — the recurring section-header block. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  className,
  eyebrowClassName,
  titleClassName,
  leadClassName,
}: SectionHeadProps) {
  return (
    <div className={className}>
      {eyebrow ? <Eyebrow className={cn('mb-3', eyebrowClassName)}>{eyebrow}</Eyebrow> : null}
      <h2 className={titleClassName}>{title}</h2>
      {lead ? (
        <p className={cn('mt-4 max-w-[680px] text-[17px] leading-[1.7] text-neutral-800', leadClassName)}>{lead}</p>
      ) : null}
    </div>
  )
}
