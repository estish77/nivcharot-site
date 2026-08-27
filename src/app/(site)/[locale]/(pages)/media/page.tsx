import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { MediaDesk } from '@/components/media/MediaDesk'
import { Eyebrow, Reveal, Section, SocialLinksRow, type SocialLinkItem } from '@/components/ui'
import { mediaDeskText } from '@/content/media-desk'
import { archivePostsVisible } from '@/content/media-visibility'
import { getArchivePosts, getElsewhereMediaItems, getPressArchiveItems, getSiteSettings } from '@/lib/cms'
import { isLocale, locales, t, type Locale } from '@/lib/i18n'
import { buildMediaEntries } from '@/lib/mediaEntries'
import { pageMetadata } from '@/lib/seo'

type Params = { locale: string }

/**
 * The media/press archive index.
 *
 * 2026-08-27 brief: this page used to be four long, independently filtered
 * sections stacked one under another — outside press coverage (70+
 * full-height rows), three grids of podcast/video/talk embeds, and the
 * archive-post grid with its own `?cat=&year=` server-side filter chips.
 * All the material was there, but reaching any of it meant scrolling past
 * everything above it, and nothing gave a view of the collection as a
 * whole.
 *
 * It is now a short masthead plus ONE explorer (`MediaDesk`) over exactly
 * the same, complete data: every source is normalized into a common row
 * shape (`buildMediaEntries`) with no field dropped, then searched,
 * faceted, sorted and paginated together. See `MediaDesk`'s own comment
 * for the interaction model, and `mediaEntries.ts` for the mapping.
 *
 * Filters live in client state rather than `?cat=&year=` search params
 * now: with one control surface spanning three formerly separate datasets,
 * round-tripping every chip click through the server (and re-rendering
 * every embed with it) cost far more than linkable filter URLs were worth.
 * The section anchors that other pages link to (`#in-the-media`,
 * `#elsewhere`, `#archive`) are preserved below and open the desk on the
 * matching bucket.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) return {}
  const locale = rawLocale

  return pageMetadata({
    locale,
    path: '/media',
    title: t(locale, { he: 'נבחרות בתקשורת', en: 'Nivcharot in the Media' }),
    description: t(locale, {
      he: 'נבחרות בתקשורת: כתבות וריאיונות מהארכיון של נבחרות ומהעיתונות.',
      en: "Nivcharot in the media: articles and interviews from Nivcharot's own archive and outside press.",
    }),
  })
}

export default async function MediaArchivePage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) {
    notFound()
  }
  const locale: Locale = rawLocale

  const [press, elsewhere, posts, siteSettings] = await Promise.all([
    getPressArchiveItems(),
    getElsewhereMediaItems(),
    // Still fetched behind the flag rather than dropped, so re-enabling
    // the bucket is a one-line change in media-visibility.ts.
    archivePostsVisible ? getArchivePosts() : Promise.resolve([]),
    getSiteSettings(),
  ])

  const entries = buildMediaEntries(
    {
      press,
      podcasts: elsewhere.podcasts,
      videos: elsewhere.videos,
      talks: elsewhere.talks,
      posts,
    },
    locale,
  )

  // Dashboard-editable (site-settings.social), same source the footer reads.
  // Labels name the account, not just the platform: this row links two
  // different Instagram accounts, so "Instagram" alone would give two
  // controls the same accessible name.
  const socialLinks: SocialLinkItem[] = [
    {
      network: 'facebook',
      href: siteSettings.social.facebook!,
      label: t(locale, { he: 'פייסבוק · נבחרות', en: 'Facebook · Nivcharot' }),
    },
    {
      network: 'instagram',
      href: siteSettings.social.instagram!,
      label: t(locale, { he: 'אינסטגרם · נבחרות', en: 'Instagram · Nivcharot' }),
    },
    {
      network: 'youtube',
      href: siteSettings.social.youtube!,
      label: t(locale, { he: 'יוטיוב · חרדית מדוברת', en: 'YouTube · Haredit Meduberet' }),
    },
    {
      network: 'spotify',
      href: siteSettings.social.spotify!,
      label: t(locale, { he: 'ספוטיפיי · חרדית מדוברת', en: 'Spotify · Haredit Meduberet' }),
    },
    {
      network: 'applePodcasts',
      href: siteSettings.social.applePodcasts!,
      label: t(locale, { he: 'אפל פודקאסטס · חרדית מדוברת', en: 'Apple Podcasts · Haredit Meduberet' }),
    },
    {
      network: 'instagram',
      href: siteSettings.social.podcastInstagram!,
      label: t(locale, { he: 'אינסטגרם · חרדית מדוברת', en: 'Instagram · Haredit Meduberet' }),
    },
    {
      network: 'email',
      href: `mailto:${siteSettings.contactEmail}`,
      label: t(locale, { he: 'מייל', en: 'Email' }),
    },
  ]

  return (
    <>
      <Reveal as="section">
        <Section as="div" paddingBlockStart="52px" paddingBlockEnd="34px">
          <Eyebrow className="mb-3.5">{t(locale, { he: 'תקשורת וארכיון', en: 'MEDIA & ARCHIVE' })}</Eyebrow>
          <h1 className="mb-[18px] text-[clamp(32px,4.4vw,48px)] leading-[1.08]">
            {t(locale, { he: 'נבחרות בתקשורת', en: 'Nivcharot in the Media' })}
          </h1>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
            <SocialLinksRow heading={t(locale, { he: 'עקבו אחרינו', en: 'FOLLOW US' })} links={socialLinks} />
            <p className="m-0 text-[13.5px] leading-[1.7] text-neutral-700">
              {t(locale, { he: 'מחפשים תמונות מהשטח? ', en: 'Looking for photos from the field? ' })}
              <a
                href={`/${locale}/activism#gatherings`}
                className="font-heading text-[13.5px] font-extrabold text-accent-700 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t(locale, { he: 'לגלריות מהפעילות ←', en: '→ Activity galleries' })}
              </a>
            </p>
          </div>
        </Section>
      </Reveal>

      <Reveal as="section" index={1}>
        <Section as="div" id="desk" borderBlockStart paddingBlockStart="46px" paddingBlockEnd="72px">
          {/*
            Anchor targets kept for the inbound links the four old sections
            owned (`/media#in-the-media` from the home strip, the story
            timeline and `/press/[slug]`; `/media#archive` from
            `/media/[slug]` and the activism sub-nav). `MediaDesk` reads the
            same hashes and opens on the bucket each one used to point at.
          */}
          <span id="in-the-media" aria-hidden="true" className="block" />
          <span id="elsewhere" aria-hidden="true" className="block" />
          <span id="archive" aria-hidden="true" className="block" />

          <div className="mb-7 max-w-[720px]">
            <Eyebrow className="mb-3">{t(locale, mediaDeskText.eyebrow)}</Eyebrow>
            <h2 className="text-[clamp(24px,3vw,32px)]">{t(locale, mediaDeskText.title)}</h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-neutral-800">{t(locale, mediaDeskText.lead)}</p>
          </div>

          <MediaDesk entries={entries} locale={locale} />
        </Section>
      </Reveal>
    </>
  )
}
