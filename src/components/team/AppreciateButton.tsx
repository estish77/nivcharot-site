'use client'

import { useEffect, useState, useTransition } from 'react'
import { motion } from 'motion/react'

import { cn, HeartIcon } from '@/components/ui'
import { appreciateTeamMember } from '@/lib/appreciate'
import { t, type Locale } from '@/lib/i18n'
import { useReducedMotion } from '@/lib/useReducedMotion'

/** What a screen reader announces — the only place the word "שכוייח" appears now, since the button carries no visible label. */
const aria = { he: 'שכוייח ל', en: 'Say thank you to ' }

/**
 * "שכוייח" — one appreciation per visitor, per team member. Sits right next
 * to the person's name, as a small heart with no label: the name is already
 * the context, so a word beside it would be redundant, and this stays
 * unobtrusive enough to live in a heading instead of at the foot of the card.
 *
 * NO COUNT IS SHOWN, deliberately. A number beside each person turns the
 * team page into a public ranking of colleagues; the running total lives in
 * /admin instead, where only the movement sees it.
 *
 * That decision creates the real design problem here: with no number and no
 * label, the heart alone has to say that it is a control and that it
 * worked. Two things carry that:
 *
 *   - it is OUTLINED at rest and fills once pressed, so the two states read
 *     as "not yet" and "done" rather than as decoration;
 *   - pressing changes it immediately and the state survives a reload;
 *   - the fill is accompanied by the same kind of quick scale "pop" every
 *     like-heart on a phone already trained people to read as "this landed"
 *     (Instagram's among them) — it only plays on the actual click, never
 *     when a returning visit restores an already-pressed heart, and is
 *     skipped under `prefers-reduced-motion`.
 *
 * Both states are visible without hovering — on a phone there is no hover,
 * and a control that only appears on hover doesn't exist there at all. The
 * accessible name (aria-label) carries the "שכוייח ל<name>" meaning that a
 * visible label would otherwise have carried.
 *
 * The pressed state is remembered in localStorage as well as on the server:
 * the server is the truth, but reading it on every card would mean a query
 * per person on every page view, for a control whose whole job is to feel
 * instant.
 */
export function AppreciateButton({
  memberId,
  memberName,
  locale,
  className,
}: {
  memberId: string
  memberName: string
  locale: Locale
  className?: string
}) {
  const key = `niv-shk:${memberId}`
  const [pressed, setPressed] = useState(false)
  const [justPressed, setJustPressed] = useState(false)
  const [pending, startTransition] = useTransition()
  const reducedMotion = useReducedMotion()

  // Read after mount, never during render: localStorage doesn't exist on the
  // server, and reading it during render would make the markup differ
  // between server and client and break hydration.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(key) === '1') setPressed(true)
    } catch {
      // Private mode, or storage blocked. The button still works; it just
      // won't remember across reloads.
    }
  }, [key])

  function press() {
    if (pressed || pending) return
    setPressed(true) // optimistic: the thank-you should feel immediate
    setJustPressed(true)
    try {
      window.localStorage.setItem(key, '1')
    } catch {
      /* nothing to do */
    }
    startTransition(async () => {
      const result = await appreciateTeamMember(memberId)
      // Only roll back on a real failure. `already` is a success: someone
      // behind a shared address, or a second click, still sees it counted.
      if (!result.ok) {
        setPressed(false)
        try {
          window.localStorage.removeItem(key)
        } catch {
          /* nothing to do */
        }
      }
    })
  }

  return (
    <button
      type="button"
      onClick={press}
      aria-pressed={pressed}
      aria-label={`${t(locale, aria)}${memberName}`}
      className={cn(
        'inline-flex items-center justify-center rounded-full p-1 -m-1',
        'transition-colors duration-200 ease-out',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        pressed ? 'cursor-default text-accent' : 'text-neutral-400 hover:text-accent-700',
        className,
      )}
    >
      <motion.span
        className="inline-flex"
        animate={justPressed && !reducedMotion ? { scale: [1, 1.4, 0.85, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 0.5, times: [0, 0.25, 0.55, 0.8, 1], ease: [0.22, 0.61, 0.36, 1] }}
        onAnimationComplete={() => setJustPressed(false)}
      >
        <HeartIcon size={15} filled={pressed} />
      </motion.span>
    </button>
  )
}
