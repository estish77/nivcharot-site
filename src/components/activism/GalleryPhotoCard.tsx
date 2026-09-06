import { Figure, ImageSlot } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import type { GalleryContent } from '@/lib/cms'

export type GalleryPhotoCardProps = { gallery: GalleryContent; locale: Locale }

/**
 * A "gatherings"-type gallery card, shown next to `EventGalleryCard`s in
 * the same grid on the Activism page. Same visual language (cover photo,
 * border, caption row), but not a link: `galleries` documents have no
 * slug or detail page of their own, unlike `events`, so this renders the
 * gallery's photo count in place instead of a "view full gallery" link.
 */
export function GalleryPhotoCard({ gallery, locale }: GalleryPhotoCardProps) {
  const cover = gallery.images[0]
  const photoCount = gallery.images.length

  return (
    <div className="flex flex-col border-2 border-divider text-text">
      {cover ? (
        <Figure
          grayscale
          className="relative aspect-[325/220] overflow-hidden border-b-2 border-divider"
          src={cover.url}
          alt={cover.alt}
          mediaClassName="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Figure grayscale className="relative aspect-[325/220] overflow-hidden border-b-2 border-divider">
          <ImageSlot label={gallery.title} className="absolute inset-0 h-full w-full" />
        </Figure>
      )}
      <div className="flex flex-1 flex-col gap-2 px-5 pb-[22px] pt-[18px]">
        <h3 className="flex-1 text-[17px] leading-[1.35]">{gallery.title}</h3>
        <span className="text-[12.5px] font-semibold text-neutral-700">
          {t(locale, { he: `${photoCount} תמונות`, en: `${photoCount} photos` })}
        </span>
      </div>
    </div>
  )
}
