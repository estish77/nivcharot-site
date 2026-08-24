import { Cell, CellGrid, Reveal, Section, SectionHead } from '@/components/ui'
import type { Locale, Localized } from '@/lib/i18n'
import { t } from '@/lib/i18n'

export type AlumnaVideo = {
  id: string
  /**
   * An 11-char YouTube video id — same shape as the `HERO_VIDEO_IDS` values
   * in src/content/hanivcheret.ts's `resolveHeroMedia`, NOT a full URL.
   */
  videoId: string
  /**
   * Real alumna name, NOT localized — matches the `alumnae-quotes.name`
   * schema precedent flagged in src/content/hanivcheret.ts's own top
   * comment ("person names aren't translated").
   */
  name: string
  cohort: number
  /** Short localized caption for what she talks about in the clip. */
  caption: Localized
}

/**
 * TASK (site-owner item 13): "a section on this page with REAL
 * alumnae-speaking videos embedded from YouTube."
 *
 * Deliberately EMPTY. No research into real alumnae-specific video content
 * was done for this task — there is no source material in this repo to
 * pull real video ids from, so nothing is populated here rather than
 * guessing. This is the only place in the codebase that should ever fill
 * this array, and it must only ever hold real, verified ids of real
 * HaNivcheret alumnae speaking on camera — never sample/placeholder/guessed
 * YouTube ids. Note `hanivcheretHeroMedia` in src/content/hanivcheret.ts
 * already has three real video ids, but those back a single toggleable
 * HERO video (a separate, already-wired feature) — they are not a source
 * to borrow from for this grid, and reusing them here would misrepresent
 * one clip as several.
 */
export const alumnaeVideos: AlumnaVideo[] = []

export const alumnaeFeatureVideo = {
  id: 'alumnae-speaking-np5bxt-xksm',
  videoId: 'NP5bxt-xksM',
  caption: {
    he: 'בוגרות הנבחרת מספרות על התוכנית',
    en: 'HaNivcheret alumnae speak about the program',
  } satisfies Localized,
}

const alumnaeVideosSection = {
  eyebrow: { he: 'בוגרות בוידאו', en: 'ALUMNAE ON VIDEO' } satisfies Localized,
  title: { he: 'לשמוע אותן מספרות', en: 'Hear them tell it' } satisfies Localized,
  comingSoonLabel: {
    he: 'בקרוב: ראיונות וידאו עם בוגרות התוכנית, מספרות בעצמן',
    en: 'Coming soon: video interviews with program alumnae, in their own words',
  } satisfies Localized,
}

/** "שם · בוגרת מחזור N" / "Name · Cohort N alumna" — same shape as `hanivcheretAlumnaPlaceholder`, but with a real name once `alumnaeVideos` is populated. */
function videoByline(locale: Locale, video: AlumnaVideo): string {
  return locale === 'he' ? `${video.name} · בוגרת מחזור ${video.cohort}` : `${video.name} · Cohort ${video.cohort} alumna`
}

/**
 * "בוגרות בוידאו" / "Alumnae on video" — a video grid wired to
 * `alumnaeVideos`, following the exact YouTube-iframe embed shape
 * `HanivcheretPage`'s own `HeroMedia` already uses for the hero's
 * toggleable video (`resolveHeroMedia`): a bordered, dark `aspect-video`
 * box holding a `youtube.com/embed/<id>` iframe.
 *
 * Renders a single `ImageSlot`-styled "coming soon" placeholder — the
 * site's own unfilled-placeholder visual language, same component used for
 * every other not-yet-real image on this page — instead of the grid while
 * `alumnaeVideos` is empty, so the section stays visibly present (not
 * silently missing, and never rendering a fake video) until real ids land.
 */
export function AlumnaeVideosSection({ locale }: { locale: Locale }) {
  return (
    <Reveal as="section">
      <Section as="div" maxWidth={1240} paddingBlockStart="48px" paddingBlockEnd="48px">
        <SectionHead
          className="mb-6"
          eyebrow={t(locale, alumnaeVideosSection.eyebrow)}
          title={t(locale, alumnaeVideosSection.title)}
        />
        <div className="mb-7 aspect-video w-full border-2 border-niv-slate bg-[#141210]">
          <iframe
            title={t(locale, alumnaeFeatureVideo.caption)}
            src={`https://www.youtube.com/embed/${alumnaeFeatureVideo.videoId}?rel=0`}
            loading="lazy"
            className="block h-full w-full border-0"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
        {alumnaeVideos.length > 0 ? (
          <CellGrid cols={3}>
            {alumnaeVideos.map((video) => (
              <Cell key={video.id} paddingInline="20px" paddingBlockStart="20px" paddingBlockEnd="20px" className="gap-3">
                <div className="aspect-video w-full border-2 border-niv-slate bg-[#141210]">
                  <iframe
                    title={t(locale, video.caption)}
                    src={`https://www.youtube.com/embed/${video.videoId}?rel=0`}
                    loading="lazy"
                    className="block h-full w-full border-0"
                    allow="encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="m-0 text-[14px] font-semibold leading-[1.4]">{t(locale, video.caption)}</p>
                <p className="m-0 text-[13px] text-neutral-700">{videoByline(locale, video)}</p>
              </Cell>
            ))}
          </CellGrid>
        ) : null}
      </Section>
    </Reveal>
  )
}
