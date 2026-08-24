import { getPodcastShorts } from '@/content/podcast'
import type { Locale } from '@/lib/i18n'
import { ShortsGrid } from './ShortsGrid'

/**
 * A dedicated Shorts area (2026-08-13 brief, item 32) — separate from the
 * full-episode "בינג'" archive, backed by the channel's real, distinct
 * Shorts playlist (`getPodcastShorts()`, see src/lib/youtube.ts). Async
 * Server Component (fetches live data itself, same split as
 * `StoriesSection`/`StoriesStrip`) wrapping the interactive grid.
 */
export async function ShortsSection({ locale }: { locale: Locale }) {
  const shorts = await getPodcastShorts()
  if (shorts.length === 0) return null
  return <ShortsGrid shorts={shorts} locale={locale} />
}
