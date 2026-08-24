import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from './cn'

export type TabBarItem = {
  label: ReactNode
  href: string
}

export type TabBarProps = {
  items: TabBarItem[]
  /** Current path — the matching item gets the accent-filled active treatment + `aria-current="page"`. */
  activeHref: string
  className?: string
}

/**
 * The About/Story/Team sub-nav pattern: `flex: 1 1 140px` items, 2px
 * `border-inline-end` divider between them (not on the last), active =
 * accent background + white text + `aria-current="page"` (an a11y
 * addition — the mockups style the active tab but never mark it up as
 * current).
 *
 * Below 560px each tab goes `basis-full` (one per row) instead of wrapping
 * at its 140px basis: 3 items sharing that basis on a ~375-420px phone
 * either crams them well under a comfortable tap target or wraps unevenly
 * (2-then-1). A clean full-width stack reads better and keeps every tab a
 * generous target — same `max-[560px]:` breakpoint the rest of the site
 * already uses for its final mobile column collapse.
 */
export function TabBar({ items, activeHref, className }: TabBarProps) {
  return (
    <div className={cn('flex flex-wrap border-y-2 border-s-2 border-divider', className)}>
      {items.map((item) => {
        const active = item.href === activeHref
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex-1 basis-[140px] border-e-2 border-divider px-[18px] py-[15px] text-start font-heading text-sm font-extrabold no-underline transition-colors duration-[250ms] ease-out last:border-e-0 max-[560px]:basis-full max-[560px]:border-e-0 max-[560px]:border-b-2 max-[560px]:last:border-b-0 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
              active ? 'bg-accent text-white' : 'text-text hover:bg-neutral-200 focus-visible:bg-neutral-200',
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
