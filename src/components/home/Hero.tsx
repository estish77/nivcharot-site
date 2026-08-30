'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'

import { Button, PodcastIcon, Reveal, SeatHall } from '@/components/ui'
import { dict, t, type Locale } from '@/lib/i18n'
import { hallAriaLabel, hallSentence, heroContent } from '@/content/home'

const BREATHE_DURATION_S = 3.4
const CTA_BREATHE_DURATION_S = 4
const EASE = [0.22, 0.61, 0.36, 1] as const

export function Hero({ locale, content = heroContent }: { locale: Locale; content?: typeof heroContent }) {
  const shouldReduceMotion = useReducedMotion()
  const [hallSettled, setHallSettled] = useState(false)
  const titleLines = content.title[locale].split('\n')

  return (
    <Reveal
      as="section"
      className="relative grid grid-cols-[minmax(320px,44%)_1fr] items-center gap-6 border-b-2 border-divider bg-bg max-[860px]:grid-cols-1"
      style={{ minHeight: '78vh', paddingInline: '40px', paddingBlockStart: '56px', paddingBlockEnd: '48px' }}
    >
      <motion.div
        style={{ maxWidth: 620 }}
        initial={shouldReduceMotion ? false : { opacity: 0, x: 26 }}
        animate={{ opacity: 1, x: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.85, ease: EASE, delay: 0.22 }}
      >
        <div className="mb-4 flex items-center gap-3">
          <span aria-hidden="true" className="block h-[3px] w-[34px] bg-accent" />
          <span className="font-heading text-[13px] font-extrabold tracking-[0.08em] text-neutral-700">
            {t(locale, content.eyebrow)}
          </span>
        </div>
        <h1 className="m-0 mb-[18px] text-text" style={{ textWrap: 'balance' }}>
          {titleLines.map((line, i) => (
            <span key={line}>
              {i > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </h1>
        <p className="m-0 text-[18.5px] leading-[1.6] text-neutral-800" style={{ maxWidth: 520 }}>
          {t(locale, content.lead)}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <motion.div
            className="inline-block"
            animate={shouldReduceMotion ? undefined : { scale: [1, 1.03, 1] }}
            transition={{ duration: CTA_BREATHE_DURATION_S, ease: 'easeInOut', repeat: Infinity }}
          >
            <Button href={`/${locale}/${content.primaryCta.slug}`} variant="primary" size="lg" className="whitespace-nowrap">
              {t(locale, content.primaryCta.label)}
            </Button>
          </motion.div>
          <motion.div
            className="inline-block"
            animate={shouldReduceMotion ? undefined : { scale: [1, 1.03, 1] }}
            transition={{ duration: CTA_BREATHE_DURATION_S, ease: 'easeInOut', repeat: Infinity, delay: 0.35 }}
          >
            <Link
              href={`/${locale}/${content.secondaryCta.slug}`}
              className="btn whitespace-nowrap border-text bg-transparent px-[26px] py-[12px] text-[15.5px] text-text hover:bg-niv-slate hover:text-white focus-visible:bg-niv-slate focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t(locale, content.secondaryCta.label)}
            </Link>
          </motion.div>
          <motion.div
            className="inline-block"
            animate={shouldReduceMotion ? undefined : { scale: [1, 1.03, 1] }}
            transition={{ duration: CTA_BREATHE_DURATION_S, ease: 'easeInOut', repeat: Infinity, delay: 0.7 }}
          >
            {/*
              variant="secondary" (framed, like the donate button) rather
              than "ghost" — a borderless button here read as unstyled next
              to the other two (2026-08-29 brief). The `PodcastIcon` (the
              same pulsing glyph the header's own /podcast link uses) is
              what keeps this from just being a second identical outlined
              button: a visual cue tying it to "sound/listen" specifically.
            */}
            <Button
              href={`/${locale}/${content.tertiaryCta.slug}`}
              variant="secondary"
              size="lg"
              className="flex items-center gap-2.5 whitespace-nowrap text-accent-700 hover:text-white focus-visible:text-white"
            >
              <PodcastIcon className="h-[18px] w-[18px]" />
              {t(locale, content.tertiaryCta.label)}
            </Button>
          </motion.div>
        </div>
        <motion.div
          className="mt-10 font-heading text-[11.5px] font-extrabold tracking-[0.14em] text-neutral-700"
          animate={shouldReduceMotion ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: BREATHE_DURATION_S, ease: 'easeInOut', repeat: Infinity }}
        >
          {t(locale, dict.scrollCue)} ↓
        </motion.div>
      </motion.div>
      <motion.div
        className="flex min-w-0 items-center justify-center"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1, scale: hallSettled ? [1, 1.02, 1] : 1 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : hallSettled
              ? { scale: { duration: 4.4, repeat: Infinity, ease: 'easeInOut' } }
              : { duration: 1.3, ease: EASE }
        }
        onAnimationComplete={() => setHallSettled(true)}
      >
        {/*
          The hall's own seats fly in from scattered points and converge into
          shape (`SeatHall`'s `entrance`) — this wrapper just fades in
          alongside them rather than adding its own competing scale/rotate.

          hoverMode/scrollMode/letterMode (2026-08-29 brief, picked after
          comparing several live options on /seat-lab): seats gently push
          away from the pointer and spring back ("repel"); scrolling past
          the hero sends the whole hall drifting upward and fading
          ("riseAway"), with the outer-ring sentence letters riding along
          with whichever seat they're currently occupying ("withSeats")
          rather than staying fixed in place. Scrolling back near the top
          returns everything to its settled formation.
        */}
        <SeatHall
          locale={locale}
          ariaLabel={hallAriaLabel}
          sentence={hallSentence}
          hoverMode="repel"
          scrollMode="riseAway"
          letterMode="withSeats"
        />
      </motion.div>
    </Reveal>
  )
}
