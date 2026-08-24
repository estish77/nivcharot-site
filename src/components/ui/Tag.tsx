import Link from 'next/link'
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

import { cn } from './cn'

export type TagVariant = 'default' | 'outline' | 'accent'

const VARIANT_CLASS: Record<TagVariant, string> = {
  default: 'tag',
  outline: 'tag tag-outline',
  accent: 'tag tag-accent',
}

type TagBaseProps = {
  /** @default 'default' */
  variant?: TagVariant
  className?: string
  children: ReactNode
}

export type TagProps =
  | (TagBaseProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'>)
  | (TagBaseProps & { href?: undefined } & Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'children'>)

/**
 * Small pill label (`.tag`/`.tag-outline`/`.tag-accent` from globals.css —
 * 800 weight, 12px, 4px 10px padding). Renders a `<span>` by default, or a
 * `<Link>` when `href` is passed (e.g. category chips that navigate).
 */
export function Tag(props: TagProps) {
  const classes = cn(
    VARIANT_CLASS[props.variant ?? 'default'],
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    props.className,
  )

  if (props.href !== undefined) {
    const { href, variant: _variant, className: _className, children, ...anchorRest } = props
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    )
  }

  const { href: _href, variant: _variant2, className: _className2, children, ...spanRest } = props
  return (
    <span className={classes} {...spanRest}>
      {children}
    </span>
  )
}
