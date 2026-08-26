import { Figure, ImageSlot } from '@/components/ui'
import type { EventPhotoContent } from '@/lib/cms'

export type PhotoGridProps = { photos: EventPhotoContent[] }

/**
 * The full-bleed photo grid on an event-gallery detail page
 * (docs/Event.dc.html): real 4→2→1 breakpoints at 860/560px (replacing
 * the mockup's inline-style-substring responsive hack).
 *
 * Renders a real uploaded photo when one exists (`photo.url`, from the
 * dashboard-editable `events` collection), falling back to the placeholder
 * tile only for entries that genuinely have no image yet.
 */
export function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-4 max-[860px]:grid-cols-2 max-[560px]:grid-cols-1">
      {photos.map((photo, i) =>
        photo.url ? (
          <Figure
            key={`${photo.alt}-${i}`}
            grayscale
            className="relative aspect-[325/220] overflow-hidden border-2 border-divider"
            src={photo.url}
            alt={photo.alt}
            mediaClassName="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Figure key={`${photo.alt}-${i}`} grayscale className="relative aspect-[325/220] overflow-hidden border-2 border-divider">
            <ImageSlot label={photo.alt} className="absolute inset-0 h-full w-full" />
          </Figure>
        ),
      )}
    </div>
  )
}
