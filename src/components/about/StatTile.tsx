import { StatCounter } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import type { AboutStatTile } from '@/content/about'

export type StatTileProps = {
  tile: AboutStatTile
  locale: Locale
}

export function StatTile({ tile, locale }: StatTileProps) {

  return (
    <div>
      <div className="font-heading text-accent-700" style={{ fontSize: 'clamp(40px, 5vw, 62px)', lineHeight: 1, fontWeight: 800 }}>
        <StatCounter value={tile.value} suffix={tile.suffix} decimals={tile.decimals} />
      </div>
      <p className="m-0 mt-3 text-[15.5px] font-semibold leading-[1.55]">{t(locale, tile.label)}</p>
      <p className="m-0 mt-1.5 text-[12.5px] leading-[1.5] text-neutral-700">
        <a className="underline underline-offset-2" href={tile.sourceUrl.startsWith('/') ? `/${locale}${tile.sourceUrl}` : tile.sourceUrl}>
          {t(locale, tile.sourcePrefix)}
        </a>
      </p>
    </div>
  )
}
