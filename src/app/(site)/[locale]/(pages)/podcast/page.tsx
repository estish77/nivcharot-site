import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArchiveHighlightsSection } from '@/components/podcast/ArchiveHighlightsSection'
import { EpisodeArchiveSection } from '@/components/podcast/EpisodeArchiveSection'
import { HeroSection } from '@/components/podcast/HeroSection'
import { LatestEpisodeSection } from '@/components/podcast/LatestEpisodeSection'
import { RecentEpisodesSection } from '@/components/podcast/RecentEpisodesSection'
import { ShortsSection } from '@/components/podcast/ShortsSection'
import { StoriesSection } from '@/components/podcast/StoriesSection'
import { podcastEpisodes } from '@/content/podcast'
import { isLocale, locales, t } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) return {}
  const locale = rawLocale

  return pageMetadata({
    locale,
    path: '/podcast',
    title: t(locale, {
      he: 'חרדית מדוברת - הפודקאסט של נבחרות',
      en: 'Haredit Meduberet - The Nivcharot Podcast',
    }),
    description: t(locale, {
      he: 'אסתי שושן בשיחות בגובה העיניים, בלי צנזורה, על העולם החרדי, דת ומדינה, אקטיביזם, תקשורת ותרבות.',
      en: 'Esty Shushan in candid, uncensored conversations about the Haredi world, religion and state, activism, journalism, and culture.',
    }),
  })
}

/**
 * "חרדית מדוברת" — the podcast page (docs/Podcast.dc.html). Header/Footer
 * render once in the locale root layout (src/app/(site)/[locale]/layout.tsx),
 * so this only assembles the page's own sections in source order: the
 * stories strip, hero, "recently" 3-up highlight grid, the latest-episode
 * player, the paginated full archive, and the archive/magazine strip.
 */
export default async function PodcastPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }

  const locale = rawLocale

  return (
    <>
      <StoriesSection episodes={podcastEpisodes} locale={locale} />
      <HeroSection locale={locale} />
      <RecentEpisodesSection episodes={podcastEpisodes} locale={locale} />
      <LatestEpisodeSection episodes={podcastEpisodes} locale={locale} />
      <EpisodeArchiveSection episodes={podcastEpisodes} locale={locale} />
      <ShortsSection locale={locale} />
      <ArchiveHighlightsSection locale={locale} />
    </>
  )
}
