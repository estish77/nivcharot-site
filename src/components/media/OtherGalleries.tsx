import Link from 'next/link'

import { cn } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import type { EventGallery } from '@/content/media'

export type OtherGalleriesProps = { galleries: EventGallery[]; locale: Locale }

/** Mirrors docs/Event.dc.html's `x.title.length > 70 ? slice(0, 70) + '…' : x.title`. */
function truncateTitle(title: string): string {
  return title.length > 70 ? `${title.slice(0, 70).trim()}…` : title
}

/** The "גלריות נוספות" / "More galleries" cross-link row at the foot of an event detail page. */
export function OtherGalleries({ galleries, locale }: OtherGalleriesProps) {
  return (
    <div className="grid grid-cols-3 max-[860px]:grid-cols-2 max-[560px]:grid-cols-1">
      {galleries.map((gallery, i) => {
        const lastOfThree = i % 3 === 2 || i === galleries.length - 1
        const lastOfTwo = i % 2 === 1 || i === galleries.length - 1
        return (
        <Link
          key={gallery.slug}
          href={`/${locale}/events/${gallery.slug}`}
          className={cn(
            'flex flex-col gap-2 px-[22px] py-6 text-text no-underline transition-colors duration-200 ease-out hover:bg-neutral-200 focus-visible:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
            !lastOfThree && 'border-e-2 border-divider',
            lastOfTwo && 'max-[860px]:border-e-0',
            'max-[560px]:border-e-0',
          )}
        >
          <span className="font-heading text-[13px] font-extrabold text-accent-700">{gallery.year}</span>
          <span className="font-heading text-[16px] font-extrabold leading-[1.35]">{truncateTitle(gallery.title)}</span>
          <span className="text-[12.5px] font-semibold text-neutral-700">
            {t(locale, { he: `${gallery.photos.length} תמונות`, en: `${gallery.photos.length} photos` })}
          </span>
        </Link>
        )
      })}
    </div>
  )
}
