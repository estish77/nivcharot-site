'use client'

import { useState, type ReactNode } from 'react'

import { Button, Cell, CellGrid, Eyebrow, Reveal, Section, SectionHead, cn } from '@/components/ui'
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
  givingText,
  preferredAmountBadge,
  standingOrderOption,
  type DonateAmount,
} from '@/content/donate'

export type DonateGivingProps = {
  locale: Locale
  /** From getSiteSettings() — dashboard-editable Morning checkout links, falling back to the static fixture's values. */
  donationLinks: { standingOrderUrl: string; cardUrl: string }
  /** Inbox a donor writes to for a receipt after a bank transfer. */
  receiptEmail: string
  /**
   * Rendered between "other ways to give" and the closing banner — in
   * practice `TransparencyGrid`, passed down as `children` so it keeps
   * rendering on the server while still sitting inside this client
   * component's run of sections. The closing banner has to stay in here
   * (it echoes the selected amount), and trust content reads better
   * BEFORE a final ask than after it.
   */
  children?: ReactNode
}

function amountLabel(locale: Locale, amount: number): string {
  return locale === 'he' ? `${amount} ₪` : `${amount} NIS`
}

/**
 * The interactive core of the Donate page.
 *
 * 2026-08-27 redesign brief ("reorder this page, make it much cleaner").
 * It used to be three equal-weight columns — standing order, card, bank —
 * side by side, which gave the page no focal point: the monthly standing
 * order (the thing the hero copy calls "the most meaningful way to
 * support us") carried exactly as much visual weight as the bank-transfer
 * details table, the amount picker was five small buttons crammed into a
 * one-third-width column, and the red banner repeated the same call to
 * action immediately under the button it duplicated.
 *
 * The page now runs ask → alternatives → trust → final ask:
 *
 *   1. the amount scale below — five full-height cells of oversized
 *      numerals, the page's one clear focal point, selected cell filled in
 *      brand red, the recommended amount badged;
 *   2. card and bank transfer as a deliberately lighter, two-up
 *      `tint-cream` band, framed as alternatives rather than equals;
 *   3. `children` (the transparency block);
 *   4. the red closing banner, now genuinely closing rather than echoing
 *      a button two sections above it.
 *
 * No copy was invented for this: the fine print under the button collects
 * lines the old layout already carried (see `givingText`'s comment), and
 * every option keeps its original title and body text.
 *
 * The scale is a wrapping flex row rather than a 5-column grid so that a
 * wrapped row still fills the full width — a `grid-cols-5` collapsing to 3
 * leaves the last row two-thirds full, with a visible notch in the border
 * box. Borders follow the codebase's usual "container owns top/start, each
 * cell owns end/bottom" pattern, which needs no nth-child arithmetic and
 * therefore stays correct at every breakpoint.
 */
export function DonateGiving({ locale, donationLinks, receiptEmail, children }: DonateGivingProps) {
  const [amount, setAmount] = useState<DonateAmount>(donatePreferredAmount)

  // Each preset amount has its own pre-filled Morning checkout
  // (src/content/donate.ts). The dashboard-editable single link stays as
  // the fallback for any amount that doesn't have one.
  const standingOrderHref = donateStandingOrderLinks[amount] ?? donationLinks.standingOrderUrl

  return (
    <>
      <Reveal as="section">
        <Section as="div" borderBlockStart paddingBlockStart="52px" paddingBlockEnd="56px">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <div className="max-w-[620px]">
              <Eyebrow className="mb-3">
                {standingOrderOption.number} · {t(locale, standingOrderOption.title)}
              </Eyebrow>
              <h2 className="text-[clamp(26px,3.2vw,38px)] leading-[1.12]">
                {t(locale, givingText.chooseAmountLabel)}
              </h2>
              <p className="mt-4 text-[16px] leading-[1.7] text-neutral-800">
                {t(locale, standingOrderOption.body)}
              </p>
            </div>
          </div>

          <div
            role="group"
            aria-label={t(locale, givingText.chooseAmountLabel)}
            className="flex flex-wrap border-t-2 border-s-2 border-divider"
          >
            {donateAmounts.map((value) => {
              const active = value === amount
              const preferred = value === donatePreferredAmount
              const badgeId = `niv-donate-preferred-${value}`
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  aria-describedby={preferred ? badgeId : undefined}
                  onClick={() => setAmount(value)}
                  className={cn(
                    'flex flex-1 basis-[150px] cursor-pointer flex-col items-center justify-center gap-1.5',
                    'border-e-2 border-b-2 border-divider px-4 py-[26px]',
                    'transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent',
                    active ? 'bg-accent text-white' : 'bg-transparent text-text hover:bg-neutral-200',
                  )}
                >
                  <span className="font-heading text-[clamp(30px,3.4vw,44px)] font-extrabold leading-none tabular-nums">
                    {value}
                  </span>
                  <span
                    className={cn(
                      'font-heading text-[10.5px] font-extrabold tracking-[0.12em]',
                      active ? 'text-white/85' : 'text-neutral-700',
                    )}
                  >
                    {t(locale, givingText.perMonth)}
                  </span>
                  {/*
                    Rendered in every cell, hidden where it doesn't apply, so
                    the badge never pushes the recommended cell's numeral off
                    the baseline its four neighbours sit on.
                  */}
                  <span
                    id={preferred ? badgeId : undefined}
                    aria-hidden={preferred ? undefined : 'true'}
                    className={cn(
                      'mt-0.5 px-2 py-[2px] font-heading text-[10px] font-extrabold leading-[1.5] tracking-[0.08em]',
                      !preferred && 'invisible',
                      active ? 'bg-white text-accent-700' : 'bg-accent text-white',
                    )}
                  >
                    {t(locale, preferredAmountBadge)}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Button href={standingOrderHref} target="_blank" rel="noopener" size="lg">
              {t(locale, givingText.standingOrderCta)} · {amountLabel(locale, amount)}
            </Button>
            <p className="m-0 text-[13.5px] leading-[1.7] text-neutral-700">{t(locale, givingText.finePrint)}</p>
          </div>
        </Section>
      </Reveal>

      <Reveal as="section">
        <Section as="div" tint="tint-cream" borderBlock paddingBlockStart="48px" paddingBlockEnd="0px">
          <SectionHead
            eyebrow={t(locale, givingText.otherWaysEyebrow)}
            title={t(locale, givingText.otherWaysHeading)}
            titleClassName="text-[clamp(22px,2.6vw,30px)]"
            className="mb-6"
          />
          {/*
            7fr/5fr, not the even two-up this used to be (2026-08-27 brief:
            "move the divider between card and bank details, and give the
            credit-card option more emphasis"). Both asks are the same fix:
            the card option is the one most visitors actually want, but it
            was sitting in the narrower-looking half beside a dense bank
            table, and the divider fell dead centre between them. Widening
            the card column moves the rule off centre and gives the option
            the weight it should have had.
          */}
          <div className="grid grid-cols-[7fr_5fr] max-[860px]:grid-cols-1">
            <div className="flex flex-col gap-[14px] border-e-2 border-divider pb-[34px] pe-10 pt-[30px] max-[860px]:border-e-0 max-[860px]:border-b-2 max-[860px]:pe-0">
              <span className="font-heading text-[11px] font-extrabold tracking-[0.12em] text-accent-700">
                {cardOption.number}
              </span>
              <h3 className="text-[clamp(24px,2.8vw,30px)] leading-[1.2]">{t(locale, cardOption.title)}</h3>
              <p className="m-0 max-w-[520px] text-[16px] font-semibold leading-[1.65] text-text">
                {t(locale, givingText.cardHighlight)}
              </p>
              <p className="m-0 max-w-[520px] text-[14.5px] leading-[1.7] text-neutral-800">
                {t(locale, cardOption.body)}
              </p>
              {/* Primary (brand red), matching the standing-order CTA above:
                  this is a real call to action, not a footnote. */}
              <Button
                href={donationLinks.cardUrl}
                target="_blank"
                rel="noopener"
                size="lg"
                className="mt-2 self-start"
              >
                {t(locale, givingText.cardCta)}
              </Button>
            </div>
            <div className="flex flex-col gap-[14px] pb-[34px] ps-10 pt-[30px] max-[860px]:ps-0">
              <span className="font-heading text-[11px] font-extrabold tracking-[0.12em] text-accent-700">
                {bankOption.number}
              </span>
              <h3 className="text-[23px] max-[860px]:text-[clamp(19px,5.2vw,24px)]">{t(locale, bankOption.title)}</h3>
              <p className="text-[14.5px] leading-[1.7] text-neutral-800">{t(locale, bankOption.body)}</p>
              <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-[18px] gap-y-0 text-[14.5px] leading-[1.6]">
                {[
                  [t(locale, { he: 'בנק', en: 'Bank' }), t(locale, bankDetails.bankName)],
                  [t(locale, { he: 'סניף', en: 'Branch' }), bankDetails.branch],
                  [t(locale, { he: 'חשבון', en: 'Account' }), bankDetails.accountNumber],
                  [t(locale, { he: 'על שם', en: 'Name' }), t(locale, bankDetails.accountHolder)],
                  ['IBAN', bankDetails.iban],
                  ['SWIFT', bankDetails.swift],
                ].map(([label, value], i, all) => (
                  <div key={label} className="contents">
                    <dt
                      className={cn(
                        'py-[7px] font-heading text-[12.5px] font-extrabold tracking-[0.04em] text-neutral-700',
                        i !== all.length - 1 && 'border-b-2 border-divider',
                      )}
                    >
                      {label}
                    </dt>
                    <dd
                      className={cn(
                        'm-0 py-[7px] tabular-nums',
                        i !== all.length - 1 && 'border-b-2 border-divider',
                      )}
                    >
                      {/*
                        `<bdi>` rather than the `[direction:ltr] text-start`
                        this row used to carry: forcing the direction also
                        flipped what "start" means, so the IBAN and SWIFT
                        values alone jumped to the far side of the column
                        while every other value hugged its label. Isolating
                        the run keeps them rendering left-to-right (which is
                        the actual requirement) without moving them.
                      */}
                      <bdi>{value}</bdi>
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto pt-2">
                <p className="m-0 text-[13px] leading-[1.6] text-neutral-700">{t(locale, bankDetails.note)}</p>
                <p className="m-0 mt-1.5 text-[13px] leading-[1.6] text-neutral-700">
                  {t(locale, givingText.receiptLabel)}{' '}
                  <a
                    href={`mailto:${receiptEmail}`}
                    dir="ltr"
                    className="font-heading font-extrabold text-accent-700 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {receiptEmail}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Section>
      </Reveal>

      {children}

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
