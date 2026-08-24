import { Tag } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import { pressArchiveText, type PressArchiveItem } from '@/content/press-archive'

import { PressTypeIcon } from './PressTypeIcon'

export type PressItemCardProps = { item: PressArchiveItem; locale: Locale }

/**
 * One "בתקשורת" list row (2026-08-13 brief, follow-up — replaces the
 * previous grid-cell card with a full-width stacked row, matching the
 * reference design: type icon + date, title, summary, then outlet tag +
 * "לכתבה במקור ›" trailing link on their own line at the bottom).
 */
export function PressItemCard({ item, locale }: PressItemCardProps) {
  const { link } = item
  const isExternal = link.kind === 'external'
  const href = link.kind === 'external' ? link.url : `/${locale}/press/${link.slug}`
  const cta = t(locale, isExternal ? pressArchiveText.outboundLabel : pressArchiveText.internalLabel)
  const isTranslated = item.sourceLanguage !== locale

  return (
    <article className="flex flex-col gap-2 border-b-2 border-divider py-6 first:pt-0 last:border-b-0">
      <div className="flex flex-wrap items-center gap-2 text-accent-700">
        <PressTypeIcon type={item.type} />
        <span className="font-heading text-[11px] font-extrabold tracking-[0.1em] text-neutral-700">
          {t(locale, item.dateLabel)}
        </span>
        <span className="font-heading text-[10px] font-extrabold tracking-[0.06em] text-accent-700">
          {t(locale, pressArchiveText.categoryLabel[item.category])}
        </span>
        {isTranslated ? (
          <span className="border border-divider px-1.5 py-0.5 font-heading text-[10px] font-extrabold tracking-[0.06em] text-neutral-600">
            {t(locale, pressArchiveText.originalLanguageBadge[item.sourceLanguage])}
          </span>
        ) : null}
      </div>
      <h3 className="m-0 text-[19px] leading-[1.3]">{t(locale, item.title)}</h3>
      <p className="m-0 max-w-[760px] text-[14.5px] leading-[1.7] text-neutral-800">{t(locale, item.summary)}</p>
      {item.note ? (
        <p className="m-0 max-w-[760px] text-[12.5px] leading-[1.6] text-neutral-600">{t(locale, item.note)}</p>
      ) : null}
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <Tag variant="outline" className="pointer-events-none">
          {t(locale, item.outlet)}
        </Tag>
        <a
          href={href}
          {...(isExternal ? { target: '_blank', rel: 'noopener' } : {})}
          className="flex items-center gap-1.5 whitespace-nowrap font-heading text-[13px] font-extrabold text-accent-700 no-underline hover:text-accent focus-visible:rounded-sm focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {cta}
          <span aria-hidden="true">{isExternal ? '↗' : '›'}</span>
        </a>
      </div>
    </article>
  )
}
