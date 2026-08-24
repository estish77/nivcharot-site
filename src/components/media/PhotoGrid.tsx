import { Figure, ImageSlot } from '@/components/ui'
import type { EventPhoto } from '@/content/media'

export type PhotoGridProps = { photos: EventPhoto[] }

/**
 * The full-bleed photo grid on an event-gallery detail page
 * (docs/Event.dc.html): real 4→2→1 breakpoints at 860/560px (replacing
 * the mockup's inline-style-substring responsive hack).
 *
 * The mockup wraps each tile in a link to a full-size original
 * (`ph.full`, opened in a new tab). No real media library is wired up yet
 * — there is no full-size asset to link to — so tiles render as plain
 * (non-interactive) placeholders rather than linking nowhere; swap in the
 * anchor once Payload media is wired up.
 */
export function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <div className="grid grid-cols-4 max-[860px]:grid-cols-2 max-[560px]:grid-cols-1">
      {photos.map((photo, i) => (
        <Figure key={`${photo.alt}-${i}`} grayscale className="relative aspect-[325/220] overflow-hidden border-2 border-divider">
          <ImageSlot label={photo.alt} className="absolute inset-0 h-full w-full" />
        </Figure>
      ))}
    </div>
  )
}
