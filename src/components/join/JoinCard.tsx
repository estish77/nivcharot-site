import { Button } from '@/components/ui/Button'
import { Cell } from '@/components/ui/Cell'
import { cn } from '@/components/ui/cn'
import { t, type Locale } from '@/lib/i18n'
import type { JoinCard as JoinCardData } from '@/content/join'

export type JoinCardProps = {
  card: JoinCardData
  locale: Locale
  /**
   * Adds a bottom divider — the mockup's 2x2 CTA grid only borders the
   * bottom of row 1 (cards 1-2), not row 2 (cards 3-4). `CellGrid`'s own
   * `bottomDivider` prop borders every row uniformly, so this is applied
   * per-card instead of at the grid level.
   */
  bottomBorder?: boolean
  /**
   * Mobile-only divider (below 860px, where `CellGrid` collapses this 2x2
   * grid to a single stacked column). Without it, the row-1/row-2 boundary
   * that only exists as a "bottom of row 1" border on desktop leaves cards
   * 3 and 4 running together with no separator once everything stacks.
   * Ignored when `bottomBorder` is already true (that divider already shows
   * at every width).
   */
  mobileBottomBorder?: boolean
}

/**
 * One "get involved" CTA card (docs/Join.dc.html): h3 title, body copy, and
 * one or two `Button`s. Renders inside a `CellGrid` — padding is widened to
 * the mockup's `24px`/`28px` (the `Cell` default is `22px`/`24px`), and the
 * "Talk to us" card carries the mockup's locale-specific in-page anchor id
 * (`#contact` / `#contact-en`) plus a matching scroll offset.
 */
export function JoinCard({ card, locale, bottomBorder = false, mobileBottomBorder = false }: JoinCardProps) {
  return (
    <Cell
      id={card.anchorId ? t(locale, card.anchorId) : undefined}
      paddingInline="24px"
      paddingBlockStart="28px"
      paddingBlockEnd="28px"
      className={cn(
        bottomBorder && 'border-b-2 border-divider',
        !bottomBorder && mobileBottomBorder && 'max-[860px]:border-b-2 max-[860px]:border-divider',
      )}
      style={card.anchorId ? { scrollMarginBlockStart: '24px' } : undefined}
    >
      <h3 className="mb-2 text-[22px] leading-[1.2] max-[860px]:text-[clamp(19px,5.2vw,24px)]">
        {t(locale, card.title)}
      </h3>
      <p className="mb-[14px] text-sm leading-[1.65] text-neutral-800">{t(locale, card.body)}</p>
      <div className="flex flex-wrap gap-3">
        {card.links.map((link) => (
          <Button key={t(locale, link.label)} href={t(locale, link.href)} variant={link.variant}>
            {t(locale, link.label)}
          </Button>
        ))}
      </div>
    </Cell>
  )
}
