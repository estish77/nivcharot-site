import { StatCounter } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import type { AboutStatTile } from '@/content/about'

export type StatTileProps = {
  tile: AboutStatTile
  locale: Locale
}

/**
 * One "By the numbers" cell: the big count-up figure (`StatCounter`), its
 * label, and a citation line that may end in a dotted-underline "to be
 * completed" placeholder — kept exactly as authored per locale (see the
 * type comment on `AboutStatTile`: the mockup's 3 Hebrew / 2 English
 * placeholders don't line up 1:1 across languages).
 */
export function StatTile({ tile, locale }: StatTileProps) {
  const placeholder = tile.sourcePlaceholder?.[locale]

  return (
    <div>
      <div className="font-heading text-accent-700" style={{ fontSize: 'clamp(40px, 5vw, 62px)', lineHeight: 1, fontWeight: 800 }}>
        <StatCounter value={tile.value} suffix={tile.suffix} decimals={tile.decimals} />
      </div>
      <p className="m-0 mt-3 text-[15.5px] font-semibold leading-[1.55]">{t(locale, tile.label)}</p>
      <p className="m-0 mt-1.5 text-[12.5px] leading-[1.5] text-neutral-700">
        {t(locale, tile.sourcePrefix)}
        {placeholder ? (
          <>
            {' · '}
            <span className="border-b border-dotted border-accent text-accent-700">{placeholder}</span>
          </>
        ) : null}
      </p>
    </div>
  )
}
