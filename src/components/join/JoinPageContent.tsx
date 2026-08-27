import { CellGrid } from '@/components/ui/Cell'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Reveal } from '@/components/ui/Reveal'
import { t, type Locale } from '@/lib/i18n'
import { joinCards, joinHero, joinQuote } from '@/content/join'
import { JoinCard } from './JoinCard'

export type JoinPageContentProps = { locale: Locale }

/**
 * docs/Join.dc.html body: hero, a 2x2 grid of "get involved" CTA cards
 * (`CellGrid cols={2}` + `JoinCard`), and the closing accent-red pull-quote
 * banner with its decorative equalizer-dot motif.
 */
export function JoinPageContent({ locale }: JoinPageContentProps) {
  return (
    <>
      <Reveal as="section" className="mx-auto max-w-[1080px] px-8 pb-10 pt-16 max-[860px]:px-[18px] max-[860px]:pb-6 max-[860px]:pt-9">
        <Eyebrow className="mb-[14px]">{t(locale, joinHero.eyebrow)}</Eyebrow>
        <h1 className="mb-5 text-[clamp(36px,5vw,56px)] leading-[1.08] max-[860px]:text-[clamp(30px,9vw,46px)]">
          {t(locale, joinHero.title)}
        </h1>
        <p className="max-w-[640px] text-[17px] leading-[1.7] text-neutral-800">{t(locale, joinHero.lead)}</p>
      </Reveal>

      <Reveal as="section" className="mx-auto max-w-[1080px] px-8 pb-14 max-[860px]:px-[18px] max-[860px]:pb-8">
        <CellGrid cols={2}>
          {joinCards.map((card, index) => (
            <JoinCard
              key={card.id}
              card={card}
              locale={locale}
              bottomBorder={index < 2}
              mobileBottomBorder={index < joinCards.length - 1}
            />
          ))}
        </CellGrid>
      </Reveal>

      <Reveal as="section" className="bg-accent">
        <div className="relative mx-auto max-w-[1080px] px-8 py-[72px] max-[860px]:px-[18px] max-[860px]:py-9">
          <div className="flex flex-wrap items-center justify-between gap-[22px]">
            <h2 className="max-w-[720px] text-[clamp(26px,3.5vw,40px)] leading-[1.2] text-white max-[860px]:text-[clamp(24px,7vw,34px)] max-[860px]:leading-[1.08]">
              {t(locale, joinQuote)}
            </h2>
          </div>
        </div>
      </Reveal>
    </>
  )
}
