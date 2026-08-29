import { ContactForm } from '@/components/contact/ContactForm'
import { EqualizerDots } from '@/components/team/EqualizerDots'
import { CellGrid } from '@/components/ui/Cell'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHead } from '@/components/ui/SectionHead'
import { SocialLinksRow } from '@/components/ui/SocialLinks'
import { getSiteSettings } from '@/lib/cms'
import { t, type Locale } from '@/lib/i18n'
import { buildHareditLinks, buildNivcharotLinks } from '@/lib/socialLinks'
import { joinCards, joinHero, joinQuote, joinTalkToUs } from '@/content/join'
import { JoinCard } from './JoinCard'

export type JoinPageContentProps = { locale: Locale }

/**
 * docs/Join.dc.html body: hero, a 3-across row of "get involved" CTA cards
 * (`CellGrid cols={3}` + `JoinCard`), a full-width "talk to us" band (real
 * contact form + follow row — see `joinTalkToUs`), and the closing
 * accent-red pull-quote banner with its decorative equalizer-dot motif.
 *
 * 2026-08-29 brief: the hero dropped its lead paragraph; the former fourth
 * grid card ("talk to us", journalists/researchers blurb + bare mailto) is
 * now the dedicated section below the grid instead, since a real form and a
 * six-icon follow row don't fit a quarter of a 4-card grid.
 */
export async function JoinPageContent({ locale }: JoinPageContentProps) {
  const siteSettings = await getSiteSettings()
  const nivcharotLinks = buildNivcharotLinks(siteSettings, locale)
  const hareditLinks = buildHareditLinks(siteSettings, locale)

  return (
    <>
      <Reveal as="section" className="mx-auto max-w-[1080px] px-8 pb-10 pt-16 max-[860px]:px-[18px] max-[860px]:pb-6 max-[860px]:pt-9">
        <Eyebrow className="mb-[14px]">{t(locale, joinHero.eyebrow)}</Eyebrow>
        <h1 className="text-[clamp(36px,5vw,56px)] leading-[1.08] max-[860px]:text-[clamp(30px,9vw,46px)]">
          {t(locale, joinHero.title)}
        </h1>
      </Reveal>

      <Reveal as="section" className="mx-auto max-w-[1080px] px-8 pb-14 max-[860px]:px-[18px] max-[860px]:pb-8">
        <CellGrid cols={3} bottomDivider className="border-2 border-divider">
          {joinCards.map((card) => (
            <JoinCard key={card.id} card={card} locale={locale} />
          ))}
        </CellGrid>
      </Reveal>

      <Reveal as="section" className="mx-auto max-w-[1080px] px-8 pb-14 max-[860px]:px-[18px] max-[860px]:pb-8">
        <SectionHead
          eyebrow={t(locale, joinTalkToUs.eyebrow)}
          title={t(locale, joinTalkToUs.title)}
          lead={t(locale, joinTalkToUs.lead)}
          titleClassName="text-[clamp(26px,3.2vw,36px)]"
          className="mb-8"
        />
        <div className="mb-10 border-2 border-divider bg-tint-cream px-6 py-6 max-[640px]:px-4 max-[640px]:py-5">
          <p className="mb-4 max-w-[640px] text-[14px] leading-[1.7] text-neutral-800">
            {t(locale, joinTalkToUs.followIntro)}
          </p>
          <div className="flex flex-col gap-4 min-[560px]:flex-row min-[560px]:items-start min-[560px]:gap-10">
            <SocialLinksRow heading={t(locale, joinTalkToUs.followNivcharot)} links={nivcharotLinks} />
            <SocialLinksRow heading={t(locale, joinTalkToUs.followHaredit)} links={hareditLinks} />
          </div>
        </div>

        <div className="max-w-[520px] border-2 border-divider bg-white px-6 py-7 max-[640px]:px-5 max-[640px]:py-6">
          <ContactForm locale={locale} />
        </div>
      </Reveal>

      <Reveal as="section" className="bg-accent">
        <div className="relative mx-auto max-w-[1080px] px-8 py-[72px] max-[860px]:px-[18px] max-[860px]:py-9">
          <div className="absolute top-8 end-8 leading-none max-[860px]:end-[18px]">
            <EqualizerDots tone="accent" />
          </div>
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
