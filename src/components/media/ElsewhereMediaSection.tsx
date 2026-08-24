import { CellGrid } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import { elsewhereMediaText, type ElsewhereMediaItem } from '@/content/elsewhere-media'

import { ElsewhereMediaCard } from './ElsewhereMediaCard'

export type ElsewhereMediaSectionProps = {
  podcasts: ElsewhereMediaItem[]
  videos: ElsewhereMediaItem[]
  /** Conference/panel/lecture footage — a third bucket added 2026-08-14 once the deeper YouTube sweep turned up a real academic/conference circuit (TEDx, WIZO, university lectures) distinct in tone from news interviews. */
  talks: ElsewhereMediaItem[]
  locale: Locale
}

/**
 * Three sub-grids (podcasts / video & TV / talks & conferences) under one
 * shared heading — the "עוד ברשת" section the 2026-08-13 brief asked for:
 * podcast and video coverage of Nivcharot from outlets OTHER than the
 * org's own "חרדית מדוברת" podcast, kept in its own section rather than
 * mixed into "בתקשורת" (written press) above it.
 */
export function ElsewhereMediaSection({ podcasts, videos, talks, locale }: ElsewhereMediaSectionProps) {
  const groups = [
    { items: podcasts, title: elsewhereMediaText.podcastsTitle },
    { items: videos, title: elsewhereMediaText.videoTitle },
    { items: talks, title: elsewhereMediaText.talksTitle },
  ]

  return (
    <div className="flex flex-col gap-11">
      {groups.map(({ items, title }) =>
        items.length > 0 ? (
          <div key={t(locale, title)}>
            <h3 className="mb-4 text-[19px] leading-[1.3]">{t(locale, title)}</h3>
            <CellGrid cols={3}>
              {items.map((item) => (
                <ElsewhereMediaCard key={item.slug} item={item} locale={locale} />
              ))}
            </CellGrid>
          </div>
        ) : null,
      )}
    </div>
  )
}
