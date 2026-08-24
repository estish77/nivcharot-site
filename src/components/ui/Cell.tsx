import type { AnchorHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from 'react'

import { cn } from './cn'

export type CellGridCols = 2 | 3 | 4

export type CellGridProps = {
  /** Column count at desktop width. Responsive collapse is automatic (see below). */
  cols: CellGridCols
  /**
   * Adds a 2px divider under every cell, including the last row — matches
   * the "closed" stat-grid pattern (About "By the numbers" / "Facts").
   * Default false matches the more common single-row grids, which have no
   * bottom border at all.
   */
  bottomDivider?: boolean
  className?: string
  /** Must be `Cell` elements — nth-child selectors below depend on them being direct children. */
  children: ReactNode
}

/**
 * Builds the (small, deterministic) scoped stylesheet for one grid
 * configuration. A real `<style>` block with real `@media` queries — NOT
 * the mockups' `[style*="grid-template-columns:…"]` inline-style substring
 * matching, which can't work once column counts vary by breakpoint in real
 * React output. Selectors are scoped under a grid-specific class + a direct
 * child combinator, so multiple grids on one page never leak into each
 * other even when they share a column count.
 */
function cellGridCss(cols: CellGridCols, bottomDivider: boolean): { className: string; css: string } {
  const cls = `niv-cellgrid-${cols}${bottomDivider ? '-b' : ''}`
  const bottomRule = bottomDivider ? `.${cls} > .niv-cell{border-block-end:2px solid var(--color-divider)}` : ''
  const breathe = `
.${cls} > .niv-cell:hover{animation:nivCellBreathe 2.6s ease-in-out infinite}
@keyframes nivCellBreathe{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@media (prefers-reduced-motion: reduce){.${cls} > .niv-cell:hover{animation:none!important}}`

  if (cols === 2) {
    // The mockups collapse a 2-column grid straight to 1 column at 860px —
    // there's no intermediate 2-col state to preserve.
    return {
      className: cls,
      css: `
.${cls}{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}
.${cls} > .niv-cell{border-inline-end:2px solid var(--color-divider)}
.${cls} > .niv-cell:nth-child(2n){border-inline-end:0}
${bottomRule}
@media (max-width:860px){
  .${cls}{grid-template-columns:minmax(0,1fr)}
  .${cls} > .niv-cell{border-inline-end:0}
}
${breathe}`,
    }
  }

  return {
    className: cls,
    css: `
.${cls}{display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr))}
.${cls} > .niv-cell{border-inline-end:2px solid var(--color-divider)}
.${cls} > .niv-cell:nth-child(${cols}n){border-inline-end:0}
${bottomRule}
@media (max-width:860px){
  .${cls}{grid-template-columns:repeat(2,minmax(0,1fr))}
  .${cls} > .niv-cell{border-inline-end:2px solid var(--color-divider)}
  .${cls} > .niv-cell:nth-child(2n){border-inline-end:0}
}
@media (max-width:560px){
  .${cls}{grid-template-columns:minmax(0,1fr)}
  .${cls} > .niv-cell{border-inline-end:0}
}
${breathe}`,
  }
}

/**
 * The bordered modular grid used everywhere (About: 44 cells, Home: 24,
 * Hanivcheret: 10, Join: 10, Shop: 8, Activism: 6): `cols` columns, a 2px
 * `border-inline-end` divider between cells (never on the last cell of a
 * row), genuinely responsive — 4→2→1 / 3→2→1 at real 860px/560px
 * breakpoints, 2→1 at 860px — computed with real CSS `@media` queries
 * scoped to this grid instance (see `cellGridCss` above), not inline-style
 * substring matching.
 *
 * Children must be `Cell` elements (or arrays/fragments of them) — the
 * border/hover rules target `.niv-cell` direct children by CSS position,
 * so no per-item index prop is needed.
 */
export function CellGrid({ cols, bottomDivider = false, className, children }: CellGridProps) {
  const { className: gridClass, css } = cellGridCss(cols, bottomDivider)
  return (
    <>
      {/*
        dangerouslySetInnerHTML, not a text child, is required here:
        `<style>` is an HTML "raw text" element whose content is never
        entity-decoded by the browser's parser, but React's default text-
        child rendering still HTML-escapes `>`/`&` — which would corrupt
        this stylesheet's child-combinator selectors (`.cls > .niv-cell`)
        into literal `&gt;` text. The CSS is fully computed above from a
        closed `cols`/`bottomDivider` union, never from user input.
      */}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className={cn(gridClass, className)}>{children}</div>
    </>
  )
}

type CellBaseProps = {
  /**
   * Adds the `hover:`/`focus-visible:` neutral-200 background wash used by
   * several cell instances (e.g. Home/About "purpose" cells) alongside the
   * breathe animation. Default false (breathe only, no background change).
   */
  hoverTint?: boolean
  paddingInline?: string
  paddingBlockStart?: string
  paddingBlockEnd?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export type CellProps =
  | (CellBaseProps & { href: string } & Omit<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        'className' | 'style' | 'children' | 'href'
      >)
  | (CellBaseProps & { href?: undefined } & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children'>)

/**
 * One cell inside a `CellGrid`. Renders `<a>` when `href` is given (the
 * Home "media" archive cards are link-cells), `<div>` otherwise. Always a
 * flex column (matches the common `margin-top:auto` "push link to bottom"
 * layout used across cell content) and always carries the `nivCellBreathe`
 * hover animation (2.6s, on hover only, via the parent `CellGrid`'s scoped
 * stylesheet — disabled under `prefers-reduced-motion`).
 */
export function Cell(props: CellProps) {
  const {
    hoverTint = false,
    paddingInline = '22px',
    paddingBlockStart = '24px',
    paddingBlockEnd = '24px',
    className,
    style,
    children,
  } = props

  const classes = cn(
    'niv-cell flex flex-1 flex-col transition-colors duration-[250ms] ease-out focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
    hoverTint && 'hover:bg-neutral-200 focus-visible:bg-neutral-200',
    className,
  )
  const cellStyle: CSSProperties = { paddingInline, paddingBlockStart, paddingBlockEnd, ...style }

  if (props.href !== undefined) {
    const {
      href,
      hoverTint: _hoverTint,
      paddingInline: _pi,
      paddingBlockStart: _pbs,
      paddingBlockEnd: _pbe,
      className: _className,
      style: _style,
      children: _children,
      ...anchorRest
    } = props
    return (
      <a href={href} className={cn(classes, 'text-text no-underline')} style={cellStyle} {...anchorRest}>
        {children}
      </a>
    )
  }

  const {
    href: _href,
    hoverTint: _hoverTint2,
    paddingInline: _pi2,
    paddingBlockStart: _pbs2,
    paddingBlockEnd: _pbe2,
    className: _className2,
    style: _style2,
    children: _children2,
    ...divRest
  } = props
  return (
    <div className={classes} style={cellStyle} {...divRest}>
      {children}
    </div>
  )
}
