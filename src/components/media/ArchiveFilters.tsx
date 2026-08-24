import type { ReactNode } from 'react'

import { Tag } from '@/components/ui'

export type FilterChip = {
  key: string
  label: ReactNode
  href: string
  active: boolean
}

export type ArchiveFiltersProps = {
  categoryChips: FilterChip[]
  yearChips: FilterChip[]
}

/**
 * Category + year filter chips for the archive listing (`/media#archive`).
 * URL-driven: every chip is a plain `<Tag href>` link built server-side
 * from the current `?cat=&year=` search params (see the page component),
 * so results stay linkable, shareable and server-rendered — no client JS.
 *
 * Deliberately reuses the shared `Tag` component (accent = selected,
 * outline = not) instead of porting docs/ArchiveTemp.dc.html's ad hoc
 * inline chip styling — that worksheet is a behavioural reference only
 * (filter/derivation logic), not a visual one, per the task brief.
 */
export function ArchiveFilters({ categoryChips, yearChips }: ArchiveFiltersProps) {
  return (
    <div>
      <div className="flex flex-wrap gap-2.5 border-b-2 border-divider pb-[18px]">
        {categoryChips.map((chip) => (
          <Tag key={chip.key} href={chip.href} variant={chip.active ? 'accent' : 'outline'} aria-current={chip.active ? 'true' : undefined}>
            {chip.label}
          </Tag>
        ))}
      </div>
      <div className="flex flex-wrap gap-2.5 py-[18px]">
        {yearChips.map((chip) => (
          <Tag key={chip.key} href={chip.href} variant={chip.active ? 'accent' : 'outline'} aria-current={chip.active ? 'true' : undefined}>
            {chip.label}
          </Tag>
        ))}
      </div>
    </div>
  )
}
