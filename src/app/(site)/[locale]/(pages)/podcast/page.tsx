import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { EpisodeDeskSection } from '@/components/podcast/EpisodeDeskSection'
import { TopShortsSection } from '@/components/podcast/TopShortsSection'
import { PodcastHeroSection } from '@/components/podcast/PodcastHeroSection'
import { StoriesSection } from '@/components/podcast/StoriesSection'
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
 * "חרדית מדוברת" — the podcast page. Header/Footer render once in the
 * locale root layout, so this only assembles the page's own sections.
 *
 * 2026-08-27 brief ("do the same to the podcast"): this used to be seven
 * stacked sections — stories, hero, a dark "recently" trio, the latest
 * episode + player, the paginated archive, a Shorts grid, and the magazine
 * strip — which meant a visitor met the same episode catalogue three
 * separate times on the way down. It is now four:
 *
 *   1. the stories strip (unchanged — already compact and distinctive);
 *   2. `PodcastHeroSection`, which merges the old hero with the latest
 *      episode and its player side by side;
 *   3. `EpisodeDeskSection`, one searchable, sortable, paginated desk over
 *      every full episode AND every Short (replacing sections 3, 5 and 6);
 *   4. `TopShortsSection`, the channel's most-watched Shorts. This replaced
 *      the "מהארכיון · מגזין ווידאו" strip through to `/media` on the
 *      2026-08-28 brief.
 *
 * No episode, Short, link or field was dropped in the merge — see
 * `EpisodeDesk`'s comment for where each one now lives.
 */
export default async function PodcastPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }

  const locale = rawLocale

  return (
    <>
      <StoriesSection locale={locale} />
      <PodcastHeroSection locale={locale} />
      <EpisodeDeskSection locale={locale} />
      <TopShortsSection locale={locale} />
    </>
  )
}
