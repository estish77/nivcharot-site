import type { ReactNode } from 'react'

import { cn } from './cn'

type FigureBase = {
  caption?: ReactNode
  /** Applies the `.grayscale` utility (removed on hover/focus, per globals.css). */
  grayscale?: boolean
  /** CSS `aspect-ratio` value, e.g. `'16/9'`. Only used with `src` — omit to let height be set by `mediaClassName`/`style` instead. */
  aspectRatio?: string
  className?: string
  mediaClassName?: string
}

export type FigureProps =
  | (FigureBase & { src: string; alt: string; children?: undefined })
  | (FigureBase & { src?: undefined; alt?: undefined; children: ReactNode })

/**
 * `<figure>` with the mockups' hover-zoom: the media scales to 1.03 over
 * 0.6s (ease `[0.22,0.61,0.36,1]`) on hover *or* keyboard focus-within.
 * Implemented as a plain CSS `group-hover`/`group-focus-within` transition
 * (no JS/motion needed for a single-property hover scale) — stays a Server
 * Component.
 *
 * Two ways to fill it: pass `src`+`alt` for a real `<img>`, or pass
 * `children` (typically an `<ImageSlot>`) for the placeholder case — either
 * way the hover-scale wrapper applies to whatever's inside.
 */
export function Figure(props: FigureProps) {
  const { caption, grayscale = false, aspectRatio, className, mediaClassName } = props

  return (
    <figure className={cn('m-0 group', grayscale && 'grayscale', className)}>
      <div className="transition-transform duration-[600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.03] group-focus-within:scale-[1.03]">
        {props.src ? (
          // eslint-disable-next-line @next/next/no-img-element -- placeholder/CMS-driven source, dimensions unknown until Payload media wiring lands
          <img
            src={props.src}
            alt={props.alt}
            className={cn('block h-auto w-full', mediaClassName)}
            style={aspectRatio ? { aspectRatio } : undefined}
          />
        ) : (
          props.children
        )}
      </div>
      {caption ? <figcaption className="mt-2 text-[13px] leading-[1.5] text-neutral-700">{caption}</figcaption> : null}
    </figure>
  )
}
