import { Button } from '@/components/ui/Button'
import { Cell } from '@/components/ui/Cell'
import { t, type Locale } from '@/lib/i18n'
import type { JoinCard as JoinCardData } from '@/content/join'

export type JoinCardProps = {
  card: JoinCardData
  locale: Locale
}

/**
 * One "get involved" CTA card (docs/Join.dc.html): h3 title, body copy, and
 * one or two `Button`s. Renders inside a `CellGrid` — padding is widened to
 * the mockup's `24px`/`28px` (the `Cell` default is `22px`/`24px`).
 */
export function JoinCard({ card, locale }: JoinCardProps) {
  return (
    <Cell paddingInline="24px" paddingBlockStart="28px" paddingBlockEnd="28px">
      <h3 className="mb-2 text-[22px] leading-[1.2] max-[860px]:text-[clamp(19px,5.2vw,24px)]">
        {t(locale, card.title)}
      </h3>
      <p className="mb-[14px] text-sm leading-[1.65] text-neutral-800">{t(locale, card.body)}</p>
      {/* `mt-auto` pushes the button(s) to the card's foot regardless of body length, so all three cards' buttons line up across the row. */}
      <div className="mt-auto flex flex-wrap gap-3">
        {card.links.map((link) => (
          <Button key={t(locale, link.label)} href={t(locale, link.href)} variant={link.variant}>
            {t(locale, link.label)}
          </Button>
        ))}
      </div>
    </Cell>
  )
}
