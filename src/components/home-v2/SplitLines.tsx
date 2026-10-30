'use client'

import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Headline that "unrolls" line by line: each line sits inside its own mask
 * and slides up from beneath it, 0.12s after the previous one (the effect
 * the reference site uses on every big title).
 *
 * `trigger="mount"` plays right away (hero), `"view"` plays once the
 * heading scrolls into view.
 */
export function SplitLines({
  lines,
  as: Tag = 'h2',
  delay = 0,
  trigger = 'view',
  className,
}: {
  lines: string[]
  as?: 'h1' | 'h2' | 'h3'
  delay?: number
  trigger?: 'mount' | 'view'
  className?: string
}) {
  const reduced = useReducedMotion()
  const visible = { y: '0%' }
  const hidden = { y: '108%' }

  return (
    <Tag className={className} style={{ textWrap: 'balance' }}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="block"
            initial={reduced ? false : hidden}
            animate={trigger === 'mount' ? visible : undefined}
            whileInView={trigger === 'view' ? visible : undefined}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={reduced ? { duration: 0 } : { duration: 1.1, ease: EASE, delay: delay + i * 0.12 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
