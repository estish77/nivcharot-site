import Link from 'next/link'

import { Figure, ImageSlot } from '@/components/ui'
import { arrowForward, t, type Locale } from '@/lib/i18n'
import type { EventGalleryContent } from '@/lib/cms'

export type EventGalleryCardProps = { gallery: EventGalleryContent; locale: Locale }

/** One event/gallery card in the `/activism#gatherings` grid (docs/ArchiveTemp.dc.html's `events` cards, restyled onto the shared `Figure`/`ImageSlot` primitives). */
export function EventGalleryCard({ gallery, locale }: EventGalleryCardProps) {
  const photoCount = gallery.photos.length

  return (
    <Link
      href={`/${locale}/events/${gallery.slug}`}
      className="group flex flex-col border-2 border-divider text-text no-underline transition-colors duration-200 ease-out hover:bg-neutral-200 focus-visible:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
    >
      {gallery.coverImage ? (
        <Figure
          grayscale
          className="relative aspect-[325/220] overflow-hidden border-b-2 border-divider"
          src={gallery.coverImage.url}
          alt={gallery.coverImage.alt}
          mediaClassName="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Figure grayscale className="relative aspect-[325/220] overflow-hidden border-b-2 border-divider">
          <ImageSlot label={gallery.title} className="absolute inset-0 h-full w-full" />
        </Figure>
      )}
      <div className="flex flex-1 flex-col gap-2 px-5 pb-[22px] pt-[18px]">
        <span className="font-heading text-[26px] leading-none text-accent-700">{gallery.year}</span>
        <h3 className="flex-1 text-[17px] leading-[1.35]">{gallery.title}</h3>
        <span className="text-[12.5px] font-semibold text-neutral-700">
          {t(locale, { he: `${photoCount} תמונות`, en: `${photoCount} photos` })}
          {gallery.credit ? ` · ${gallery.credit}` : ''}
          {/* Title above is real, never-translated archive material (src/content/media.ts) — flag it for English readers, same call as the detail page. */}
          {locale === 'en' ? ' · Title in Hebrew' : ''}
        </span>
        <span className="font-heading text-[13px] font-extrabold text-accent-700">
          {t(locale, { he: 'לגלריה המלאה', en: 'View full gallery' })} {arrowForward(locale)}
        </span>
      </div>
    </Link>
  )
}
