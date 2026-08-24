import Link from 'next/link'

import { arrowBack, arrowForward, t, type Locale } from '@/lib/i18n'
import type { ArchivePost } from '@/content/media'

export type PostPrevNextProps = { prev?: ArchivePost; next?: ArchivePost; locale: Locale }

/** The two-column prev/next archive pager under a post (docs/Post.dc.html). */
export function PostPrevNext({ prev, next, locale }: PostPrevNextProps) {
  if (!prev && !next) return null

  return (
    <div className="grid grid-cols-2 max-[860px]:grid-cols-1 bg-neutral-200">
      {prev ? (
        <Link
          href={`/${locale}/media/${prev.slug}`}
          className="flex items-start gap-3 border-e border-neutral-300 px-[18px] py-4 text-text no-underline transition-colors duration-200 ease-out hover:bg-neutral-300 focus-visible:bg-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent max-[860px]:border-b max-[860px]:border-e-0"
        >
          <span aria-hidden="true" className="font-heading text-xl font-extrabold leading-[1.1] text-accent-700">
            {arrowBack(locale)}
          </span>
          <span>
            <span className="mb-[3px] block text-[11px] font-semibold tracking-[0.04em] text-neutral-700">
              {t(locale, { he: 'הרשומה הקודמת', en: 'Previous entry' })}
            </span>
            <span className="block font-heading text-[13.5px] font-extrabold leading-[1.4]">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
      {next ? (
        <Link
          href={`/${locale}/media/${next.slug}`}
          className="flex items-start justify-end gap-3 px-[18px] py-4 text-end text-text no-underline transition-colors duration-200 ease-out hover:bg-neutral-300 focus-visible:bg-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
        >
          <span>
            <span className="mb-[3px] block text-[11px] font-semibold tracking-[0.04em] text-neutral-700">
              {t(locale, { he: 'הרשומה הבאה', en: 'Next entry' })}
            </span>
            <span className="block font-heading text-[13.5px] font-extrabold leading-[1.4]">{next.title}</span>
          </span>
          <span aria-hidden="true" className="font-heading text-xl font-extrabold leading-[1.1] text-accent-700">
            {arrowForward(locale)}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </div>
  )
}
