'use client'

import { useId, useState } from 'react'
import { motion } from 'motion/react'

import { useReducedMotion } from '@/lib/useReducedMotion'
import type { ReactNode } from 'react'

import { cn } from './cn'

export type AccordionItemData = {
  /** Stable key, also seeds the trigger/panel ids used to wire `aria-controls`/`aria-labelledby`. */
  id: string
  /** Trigger row content — rendered inside the `<button>`, before the rotating "+" icon. */
  trigger: ReactNode
  children: ReactNode
  /** @default false */
  defaultOpen?: boolean
}

export type AccordionProps = {
  items: AccordionItemData[]
  className?: string
  rowClassName?: string
  triggerClassName?: string
  panelClassName?: string
}

const EASE = [0.22, 0.61, 0.36, 1] as const

/**
 * Radix-free `<details>`-equivalent (the mockups' `Podcast` archive and
 * `Activism` FAQ both repeat this: a row of trigger + rotating "+" icon +
 * collapsible panel). Each row is an independent, keyboard-accessible
 * disclosure (`button[aria-expanded]` + `role="region"[aria-labelledby]`),
 * animated with `motion/react` (height 0 ↔ "auto", the icon rotating 45°),
 * honouring `prefers-reduced-motion` (animations collapse to duration 0).
 */
export function Accordion({ items, className, rowClassName, triggerClassName, panelClassName }: AccordionProps) {
  return (
    <div className={className}>
      {items.map((item) => (
        <AccordionRow
          key={item.id}
          item={item}
          rowClassName={rowClassName}
          triggerClassName={triggerClassName}
          panelClassName={panelClassName}
        />
      ))}
    </div>
  )
}

function AccordionRow({
  item,
  rowClassName,
  triggerClassName,
  panelClassName,
}: {
  item: AccordionItemData
  rowClassName?: string
  triggerClassName?: string
  panelClassName?: string
}) {
  const [open, setOpen] = useState(item.defaultOpen ?? false)
  const shouldReduceMotion = useReducedMotion()
  const reactId = useId()
  const triggerId = `${reactId}-trigger`
  const panelId = `${reactId}-panel`

  return (
    <div className={cn('border-b-2 border-divider', rowClassName)}>
      <button
        type="button"
        id={triggerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center justify-between gap-6 py-5 text-start focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
          triggerClassName,
        )}
      >
        <span className="flex-1">{item.trigger}</span>
        <PlusIcon open={open} reduceMotion={!!shouldReduceMotion} />
      </button>
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        initial={false}
        animate={{ height: open ? 'auto' : 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.35, ease: EASE }}
        style={{ overflow: 'hidden' }}
      >
        <div className={cn('pb-[22px]', panelClassName)}>{item.children}</div>
      </motion.div>
    </div>
  )
}

function PlusIcon({ open, reduceMotion }: { open: boolean; reduceMotion: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      className="relative block h-[15px] w-[15px] flex-none text-accent-700"
      animate={{ rotate: open ? 45 : 0 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: EASE }}
    >
      <span className="absolute inset-0 m-auto h-[1.5px] w-[13px] bg-current" />
      <span className="absolute inset-0 m-auto h-[13px] w-[1.5px] bg-current" />
    </motion.span>
  )
}
