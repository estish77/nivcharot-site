import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from './cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

/** Padding/font-size combinations observed across the mockups' `.btn` instances. */
const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'px-[18px] py-[10px] text-[14px]',
  md: 'px-[22px] py-3 text-[15px]',
  lg: 'px-[26px] py-[13px] text-[15.5px]',
}

type ButtonBaseProps = {
  /** @default 'primary' */
  variant?: ButtonVariant
  /** @default 'md' */
  size?: ButtonSize
  className?: string
  children: ReactNode
}

export type ButtonProps =
  | (ButtonBaseProps & { href: string } & Omit<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        'className' | 'children' | 'href'
      >)
  | (ButtonBaseProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>)

/**
 * The site's one button primitive — three variants (`.btn`/`.btn-primary`/
 * `.btn-secondary`/`.btn-ghost` from globals.css, which already pair every
 * `:hover` with `:focus-visible`), three size presets matching the padding/
 * font-size pairs actually used in the mockups.
 *
 * Renders a Next `<Link>` when `href` is passed (internal or external — Link
 * degrades to a plain `<a>` for external/`mailto:`/`#anchor` targets), a
 * `<button type="button">` otherwise. Pass any other anchor/button attribute
 * through (`target`, `rel`, `onClick`, `disabled`, `aria-*`, …).
 */
export function Button(props: ButtonProps) {
  const classes = cn(
    'btn',
    `btn-${props.variant ?? 'primary'}`,
    SIZE_CLASS[props.size ?? 'md'],
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    props.className,
  )

  if (props.href !== undefined) {
    const { href, variant: _variant, size: _size, className: _className, children, ...anchorRest } = props
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    )
  }

  const { href: _href, variant: _variant2, size: _size2, className: _className2, children, ...buttonRest } = props
  return (
    <button type="button" className={classes} {...buttonRest}>
      {children}
    </button>
  )
}
