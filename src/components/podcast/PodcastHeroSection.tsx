import { Button, Eyebrow, Reveal, Section } from '@/components/ui'
import { getPodcastEpisodes, PODCAST_SPOTIFY_SHOW_ID, podcastText } from '@/content/podcast'
import { getPodcastHeroContent } from '@/lib/cms'
import { t, type Locale } from '@/lib/i18n'

import { PlatformLinksRow } from './PlatformLinksRow'
import { episodeLabel, guestLine, shortDateLabel } from './podcastUtils'

/**
 * The podcast page's opening screen: show identity on one side, the latest
 * episode and its player on the other.
 *
 * 2026-08-27 brief. This merges what used to be two full-height sections —
 * `HeroSection` (title, blurb, three platform buttons and a large
 * `ImageSlot` placeholder that never had a real image behind it) and
 * `LatestEpisodeSection` (episode hero text, a 352px Spotify iframe and
 * the platform icon row) — into one. Nothing is lost: every string, link
 * and the player itself are all still here, just side by side instead of
 * stacked, which removes roughly a full screen of scrolling before a
 * visitor reaches the episodes.
 *
 * The dark `--niv-slate` panel carries the contrast the removed
 * "recently" band used to give the page. Its eyebrow uses
 * `--color-accent-300` rather than the shared `Eyebrow`'s accent-700:
 * brand red on brand slate measures ~2:1 and fails WCAG AA, and darkening
 * it makes a dark ground worse — the lighter tint (~5.2:1) is the
 * on-dark variant, the same substitution `RecentEpisodesSection` used.
 *
 * Async Server Component. `episodes[0]` is "the latest episode", fetched
 * from the live YouTube RSS feed (falling back to the hardcoded fixture),
 * the same single source every other podcast section reads. The iframe
 * embeds the whole SHOW rather than one pinned episode — there is no real
 * per-episode Spotify id in this data — so Spotify always surfaces its own
 * newest episode there, and reading the hero text off the same live feed
 * is what keeps the two from drifting apart.
 */
/** Keeps YouTube / Spotify / Apple Podcasts on a single row down to 320px. */
const platformButtonClass =
  'whitespace-nowrap max-[560px]:px-3 max-[560px]:py-2 max-[560px]:text-[13px] max-[380px]:px-2.5 max-[380px]:text-[12px]'

export async function PodcastHeroSection({ locale }: { locale: Locale }) {
  const [hero, episodes] = await Promise.all([getPodcastHeroContent(locale), getPodcastEpisodes()])
  const latest = episodes[0]

  return (
    <Reveal as="section">
      <Section as="div" paddingBlockStart="52px" paddingBlockEnd="52px">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,430px)] items-start gap-11 max-[960px]:grid-cols-1 max-[960px]:gap-8">
          <div>
            <Eyebrow className="mb-[14px]">{hero.eyebrow}</Eyebrow>
            <h1 className="mb-5 text-[clamp(38px,5vw,60px)] leading-[1.05] max-[860px]:text-[clamp(30px,9vw,46px)]">
              {hero.title}
            </h1>
            <p className="mb-7 max-w-[620px] text-[17px] leading-[1.7]">{hero.body}</p>
            {/*
              The three platform buttons wrapped onto two rows on a phone —
              "אפל פודקאסטס" alone is wide enough to push itself down. They
              stay on one line now, shrinking their padding and type below
              560px instead of wrapping (2026-08-28 brief).
            */}
            <div className="flex flex-nowrap items-center gap-3 max-[560px]:gap-2">
              <Button
                href={podcastText.youtubeShowUrl}
                variant="primary"
                className={platformButtonClass}
              >
                {t(locale, podcastText.ctaYoutube)}
              </Button>
              <Button
                href={podcastText.spotifyShowUrl}
                variant="secondary"
                className={platformButtonClass}
              >
                {t(locale, podcastText.ctaSpotify)}
              </Button>
              <Button
                href={podcastText.appleShowUrl}
                variant="secondary"
                className={platformButtonClass}
              >
                {t(locale, podcastText.ctaApple)}
              </Button>
            </div>
            <PlatformLinksRow />
          </div>

          {latest ? (
            <div className="bg-niv-slate p-6 max-[560px]:p-4">
              <p className="m-0 mb-2.5 font-heading text-[11px] font-extrabold tracking-[0.14em] text-accent-300">
                {t(locale, podcastText.latestEyebrow)}
              </p>
              <h2 className="mb-2 text-[clamp(21px,2.4vw,26px)] leading-[1.25] text-niv-cream">
                {episodeLabel(latest, locale)}
              </h2>
              <div className="mb-3 font-heading text-[12px] font-extrabold tracking-[0.06em] text-[#e3ded7]">
                {[shortDateLabel(latest.publishedAt, locale), guestLine(latest, locale)].filter(Boolean).join(' · ')}
              </div>
              <p className="m-0 mb-4 line-clamp-4 text-[14px] leading-[1.7] text-[rgba(227,222,215,0.86)]">
                {t(locale, latest.description)}
              </p>
              <iframe
                title={t(locale, podcastText.playerTitle)}
                src={`https://open.spotify.com/embed/show/${PODCAST_SPOTIFY_SHOW_ID}?theme=0`}
                height={152}
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="block w-full border-2 border-[rgba(249,218,187,0.28)] bg-niv-slate"
              />
            </div>
          ) : null}
        </div>
      </Section>
    </Reveal>
  )
}
