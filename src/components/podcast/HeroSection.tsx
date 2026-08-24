import { Button, Eyebrow, Figure, ImageSlot, Reveal, Section } from '@/components/ui'
import { podcastText } from '@/content/podcast'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'

/** Hero for "חרדית מדוברת" / "Haredit Meduberet" (docs/Podcast.dc.html:118-132 / :281-295). */
export function HeroSection({ locale }: { locale: Locale }) {
  return (
    <Reveal as="section">
      <Section as="div" paddingBlockStart="56px" paddingBlockEnd="48px">
        <div className="grid grid-cols-[7fr_5fr] items-center gap-12 max-[860px]:grid-cols-1">
          <div>
            <Eyebrow className="mb-[14px]">{t(locale, podcastText.heroEyebrow)}</Eyebrow>
            <h1 className="mb-5 text-[clamp(38px,5vw,60px)] leading-[1.05] max-[860px]:text-[clamp(30px,9vw,46px)]">
              {t(locale, podcastText.heroTitle)}
            </h1>
            <p className="mb-7 max-w-[600px] text-[17px] leading-[1.7]">{t(locale, podcastText.heroLead)}</p>
            <div className="flex flex-wrap gap-3">
              <Button href={podcastText.youtubeShowUrl} variant="primary">
                {t(locale, podcastText.ctaYoutube)}
              </Button>
              <Button href={podcastText.spotifyShowUrl} variant="secondary">
                {t(locale, podcastText.ctaSpotify)}
              </Button>
              <Button href={podcastText.appleShowUrl} variant="secondary">
                {t(locale, podcastText.ctaApple)}
              </Button>
            </div>
          </div>
          <Figure grayscale className="m-0">
            <ImageSlot shape="rect" label={t(locale, podcastText.heroCoverLabel)} className="w-full" style={{ height: 380 }} />
          </Figure>
        </div>
      </Section>
    </Reveal>
  )
}
