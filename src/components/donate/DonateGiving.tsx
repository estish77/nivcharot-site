'use client'

import { useState } from 'react'

import { Button, Cell, CellGrid, Reveal, Section, cn } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import {
  bankDetails,
  bankOption,
  cardOption,
  closingCta,
  donateAmounts,
  donatePreferredAmount,
  donateStandingOrderLinks,
  donationSummary,
  preferredAmountBadge,
  standingOrderOption,
  type DonateAmount,
} from '@/content/donate'

export type DonateGivingProps = {
  locale: Locale
  /** From getSiteSettings() — dashboard-editable Morning checkout links, falling back to the static fixture's values. */
  donationLinks: { standingOrderUrl: string; cardUrl: string }
}

function amountLabel(locale: Locale, amount: number): string {
  return locale === 'he' ? `${amount} ₪` : `${amount} NIS`
}

/**
 * The interactive core of the Donate page (docs/Shop.dc.html): the three
 * giving-method columns (standing order with an amount picker, card,
 * bank transfer) and the closing CTA banner, which reads the same
 * selected amount in its headline ("הוראת קבע של 54 ₪ בחודש"). Both
 * pieces share `amount` state, so they're one client component even
 * though they render as two separate page sections — matching the
 * mockup's single top-level component state.
 *
 * The mockup's decorative hover-driven "equalizer dot" flourish
 * (`{{ eq0 }}`..`{{ eq7 }}`, an aria-hidden random-blink widget with no
 * content of its own) is intentionally not ported — it's outside the
 * page's functional spec and disproportionate to build faithfully.
 */
export function DonateGiving({ locale, donationLinks }: DonateGivingProps) {
  const [amount, setAmount] = useState<DonateAmount>(donatePreferredAmount)

  // Each preset amount has its own pre-filled Morning checkout
  // (src/content/donate.ts). The dashboard-editable single link stays as
  // the fallback for any amount that doesn't have one.
  const standingOrderHref = donateStandingOrderLinks[amount] ?? donationLinks.standingOrderUrl

  return (
    <>
      <Reveal as="section">
        <Section as="div" borderBlock paddingBlockStart="28px" paddingBlockEnd="0px">
          <CellGrid cols={3}>
            <Cell paddingInline="28px" paddingBlockStart="38px" paddingBlockEnd="34px" className="gap-[14px]">
              <span className="font-heading text-[11px] font-extrabold tracking-[0.12em] text-accent-700">
                {standingOrderOption.number}
              </span>
              <h3 className="text-[23px] max-[860px]:text-[clamp(19px,5.2vw,24px)]">
                {t(locale, standingOrderOption.title)}
              </h3>
              <p className="text-[14.5px] leading-[1.7] text-neutral-800">{t(locale, standingOrderOption.body)}</p>
              <div
                className="mt-1 flex flex-wrap items-start gap-[10px]"
                role="group"
                aria-label={t(locale, { he: 'בחירת סכום תרומה', en: 'Choose a donation amount' })}
              >
                {donateAmounts.map((value) => {
                  const active = value === amount
                  const preferred = value === donatePreferredAmount
                  const badgeId = `niv-donate-preferred-${value}`
                  return (
                    <span key={value} className="flex flex-col items-center gap-1.5">
                      <button
                        type="button"
                        aria-pressed={active}
                        aria-describedby={preferred ? badgeId : undefined}
                        onClick={() => setAmount(value)}
                        className={cn(
                          'w-full cursor-pointer border-2 px-[18px] py-[10px] font-heading text-[15px] font-extrabold transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                          active
                            ? 'border-accent bg-accent text-white'
                            : cn(
                                'bg-transparent text-text',
                                // The recommended amount keeps an accent
                                // outline even while unselected, so it still
                                // reads as the suggested one after the donor
                                // clicks a different button.
                                preferred
                                  ? 'border-accent hover:bg-neutral-200 focus-visible:bg-neutral-200'
                                  : 'border-divider hover:border-text focus-visible:border-text',
                              ),
                        )}
                      >
                        {amountLabel(locale, value)}
                      </button>
                      {preferred ? (
                        <span
                          id={badgeId}
                          className="tag tag-accent pointer-events-none px-2 py-[2px] text-[10px] leading-[1.4] tracking-[0.06em]"
                        >
                          {t(locale, preferredAmountBadge)}
                        </span>
                      ) : null}
                    </span>
                  )
                })}
              </div>
              <Button href={standingOrderHref} target="_blank" rel="noopener" className="mt-auto self-start">
                {locale === 'he'
                  ? `לפתיחת הוראת קבע · ${amountLabel(locale, amount)}`
                  : `Set up a standing order · ${amountLabel(locale, amount)}`}
              </Button>
            </Cell>
            <Cell paddingInline="28px" paddingBlockStart="38px" paddingBlockEnd="34px" className="gap-[14px]">
              <span className="font-heading text-[11px] font-extrabold tracking-[0.12em] text-accent-700">
                {cardOption.number}
              </span>
              <h3 className="text-[23px] max-[860px]:text-[clamp(19px,5.2vw,24px)]">
                {t(locale, cardOption.title)}
              </h3>
              <p className="text-[14.5px] leading-[1.7] text-neutral-800">{t(locale, cardOption.body)}</p>
              <Button href={donationLinks.cardUrl} target="_blank" rel="noopener" className="mt-auto self-start">
                {t(locale, { he: 'לתרומה מאובטחת', en: 'Donate securely' })}
              </Button>
            </Cell>
            <Cell paddingInline="28px" paddingBlockStart="38px" paddingBlockEnd="34px" className="gap-[14px]">
              <span className="font-heading text-[11px] font-extrabold tracking-[0.12em] text-accent-700">
                {bankOption.number}
              </span>
              <h3 className="text-[23px] max-[860px]:text-[clamp(19px,5.2vw,24px)]">
                {t(locale, bankOption.title)}
              </h3>
              <p className="text-[14.5px] leading-[1.7] text-neutral-800">{t(locale, bankOption.body)}</p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-[14px] gap-y-[6px] text-[14.5px] leading-[1.6]">
                <dt className="font-semibold text-neutral-700">{t(locale, { he: 'בנק', en: 'Bank' })}</dt>
                <dd className="m-0">{t(locale, bankDetails.bankName)}</dd>
                <dt className="font-semibold text-neutral-700">{t(locale, { he: 'סניף', en: 'Branch' })}</dt>
                <dd className="m-0">{bankDetails.branch}</dd>
                <dt className="font-semibold text-neutral-700">{t(locale, { he: 'חשבון', en: 'Account' })}</dt>
                <dd className="m-0">{bankDetails.accountNumber}</dd>
                <dt className="font-semibold text-neutral-700">{t(locale, { he: 'על שם', en: 'Name' })}</dt>
                <dd className="m-0">{t(locale, bankDetails.accountHolder)}</dd>
                <dt className="font-semibold text-neutral-700">IBAN</dt>
                <dd className="m-0 text-start [direction:ltr]">{bankDetails.iban}</dd>
                <dt className="font-semibold text-neutral-700">SWIFT</dt>
                <dd className="m-0 text-start [direction:ltr]">{bankDetails.swift}</dd>
              </dl>
              <p className="mt-auto text-[13px] leading-[1.6] text-neutral-700">{t(locale, bankDetails.note)}</p>
            </Cell>
          </CellGrid>
        </Section>
      </Reveal>
      <Reveal as="section">
        <Section
          as="div"
          tint="accent"
          className="text-white"
          paddingBlockStart="48px"
          paddingBlockEnd="48px"
          innerClassName="flex flex-wrap items-center justify-between gap-7"
        >
          <div>
            <h2 className="mb-1.5 text-[clamp(24px,3vw,36px)] text-white max-[860px]:text-[clamp(24px,7vw,34px)]">
              {donationSummary(locale, amount)}
            </h2>
            {/*
              19px/700 rather than the mockup's 14.5px/400: white on the brand
              red measures 3.98:1, which fails the 4.5:1 WCAG AA bar for normal
              text but clears the 3:1 bar for "large text" (>=18.66px bold).
              Sizing up is what keeps the band its designed brand red instead of
              forcing the whole panel darker. Still subordinate to the h2 above,
              which is clamp(24px, 3vw, 36px).
            */}
            <p className="m-0 text-[19px] font-bold leading-[1.45] text-white">{t(locale, closingCta.note)}</p>
          </div>
          <a
            href={standingOrderHref}
            target="_blank"
            rel="noopener"
            className="whitespace-nowrap bg-white px-7 py-[14px] font-heading text-base font-extrabold text-accent no-underline transition-colors duration-200 ease-out hover:bg-niv-slate hover:text-white focus-visible:bg-niv-slate focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t(locale, closingCta.buttonLabel)}
          </a>
        </Section>
      </Reveal>
    </>
  )
}
