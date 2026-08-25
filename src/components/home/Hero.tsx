'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'

import { Button, Reveal } from '@/components/ui'
import { dict, t, type Locale } from '@/lib/i18n'
import { hallAriaLabel, hallSentence, heroContent } from '@/content/home'
import { SeatHall } from './SeatHall'

const BREATHE_DURATION_S = 3.4
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
          <Button href={`/${locale}/${content.primaryCta.slug}`} variant="primary" size="lg" className="whitespace-nowrap">
            {t(locale, content.primaryCta.label)}
          </Button>
          <Link
            href={`/${locale}/${content.secondaryCta.slug}`}
            className="btn whitespace-nowrap border-text bg-transparent px-[26px] py-[12px] text-[15.5px] text-text hover:bg-niv-slate hover:text-white focus-visible:bg-niv-slate focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t(locale, content.secondaryCta.label)}
          </Link>
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
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.55, rotate: -50 }}
        animate={{ opacity: 1, scale: hallSettled ? [1, 1.02, 1] : 1, rotate: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : hallSettled
              ? { scale: { duration: 4.4, repeat: Infinity, ease: 'easeInOut' } }
              : { duration: 1.05, ease: EASE }
        }
        onAnimationComplete={() => setHallSettled(true)}
      >
        <SeatHall locale={locale} ariaLabel={hallAriaLabel} sentence={hallSentence} />
      </motion.div>
    </Reveal>
  )
}
