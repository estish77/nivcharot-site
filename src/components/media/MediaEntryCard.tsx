import { Cell, Tag } from '@/components/ui'
import type { MediaEntry } from '@/lib/mediaEntries'

import { PressTypeIcon } from './PressTypeIcon'

/**
 * The card form of a desk row, for the "כרטיסים" view toggle — same data,
 * laid out in the site's existing bordered `CellGrid` cell rather than a
 * list line. Used when a visitor prefers scanning by title block over the
 * dense catalogue list; the list view stays the default because it fits
 * roughly three times as many items per screen.
 */
export function MediaEntryCard({ entry, ordinal }: { entry: MediaEntry; ordinal: number }) {
  return (
    <Cell
      href={entry.href}
      {...(entry.external ? { target: '_blank', rel: 'noopener' } : {})}
      hoverTint
      className="gap-2.5"
    >
      <div className="flex items-center gap-2 text-accent-700">
        <PressTypeIcon type={entry.iconType} />
        <span className="font-heading text-[11px] font-extrabold tracking-[0.1em] text-neutral-700">
          {entry.dateLabel}
        </span>
        <span aria-hidden="true" className="ms-auto font-heading text-[11px] font-extrabold tabular-nums text-neutral-600">
          {String(ordinal).padStart(2, '0')}
        </span>
      </div>
      {entry.kindLabel ? (
        <span className="font-heading text-[10px] font-extrabold tracking-[0.1em] text-accent-700">
          {entry.kindLabel}
        </span>
      ) : null}
      <h3 className="text-[18px] leading-[1.3]">{entry.title}</h3>
      {entry.summary ? (
        <p className="line-clamp-4 text-[14px] leading-[1.65] text-neutral-800">{entry.summary}</p>
      ) : null}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
        {entry.outlet ? (
          <Tag variant="outline" className="pointer-events-none">
            {entry.outlet}
          </Tag>
        ) : null}
        {entry.langBadge ? (
          <span className="border border-divider px-1.5 py-0.5 font-heading text-[10px] font-extrabold tracking-[0.06em] text-neutral-600">
            {entry.langBadge}
          </span>
        ) : null}
        <span
          aria-hidden="true"
          className="ms-auto whitespace-nowrap font-heading text-[13px] font-extrabold text-accent-700"
        >
          {entry.external ? '↗' : '›'}
        </span>
      </div>
    </Cell>
  )
}
