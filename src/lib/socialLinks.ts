import type { SocialLinkItem } from '@/components/ui'
import type { PayloadSiteSettings } from './cms'
import { t, type Locale } from './i18n'

type SiteSocial = PayloadSiteSettings['social']

/**
 * The site's two content channels (Nivcharot itself, and the Haredit
 * Meduberet podcast) as follow-link groups — shared by every page that
 * shows a follow row (Footer, Media, Contact, Join) so none of them
 * hand-copy the same links, and so a corrected account list (2026-08-29
 * brief) only has to change in one place. Takes just `siteSettings.social`
 * (not the whole object) since that's all Footer itself is ever handed.
 *
 * Nivcharot: Facebook, Instagram, and X/Twitter — the last one is
 * `hostX` (Esty Shushan's personal account), the same field
 * `PlatformLinksRow` (src/components/podcast/PlatformLinksRow.tsx) already
 * treats as "the public presence on that network" when no dedicated org
 * account exists; swap the URL there if Nivcharot gets its own handle.
 *
 * Haredit Meduberet: Facebook, Instagram and TikTok are its social
 * presence (`hostFacebook`/`podcastInstagram`/`hostTiktok` — the first and
 * third are also Esty's personal accounts, same reasoning as above);
 * YouTube, Spotify and Apple Podcasts are where the full episodes live.
 */
export function buildNivcharotLinks(social: SiteSocial, locale: Locale): SocialLinkItem[] {
  return [
    { network: 'facebook', href: social.facebook!, label: t(locale, { he: 'פייסבוק · נבחרות', en: 'Facebook · Nivcharot' }) },
    { network: 'instagram', href: social.instagram!, label: t(locale, { he: 'אינסטגרם · נבחרות', en: 'Instagram · Nivcharot' }) },
    { network: 'x', href: social.hostX!, label: t(locale, { he: 'טוויטר/X · נבחרות', en: 'Twitter/X · Nivcharot' }) },
  ]
}

export function buildHareditLinks(social: SiteSocial, locale: Locale): SocialLinkItem[] {
  return [
    { network: 'facebook', href: social.hostFacebook!, label: t(locale, { he: 'פייסבוק · חרדית מדוברת', en: 'Facebook · Haredit Meduberet' }) },
    { network: 'instagram', href: social.podcastInstagram!, label: t(locale, { he: 'אינסטגרם · חרדית מדוברת', en: 'Instagram · Haredit Meduberet' }) },
    { network: 'tiktok', href: social.hostTiktok!, label: t(locale, { he: 'טיקטוק · חרדית מדוברת', en: 'TikTok · Haredit Meduberet' }) },
    { network: 'youtube', href: social.youtube!, label: t(locale, { he: 'יוטיוב · חרדית מדוברת', en: 'YouTube · Haredit Meduberet' }) },
    { network: 'spotify', href: social.spotify!, label: t(locale, { he: 'ספוטיפיי · חרדית מדוברת', en: 'Spotify · Haredit Meduberet' }) },
    { network: 'applePodcasts', href: social.applePodcasts!, label: t(locale, { he: 'אפל פודקאסטס · חרדית מדוברת', en: 'Apple Podcasts · Haredit Meduberet' }) },
  ]
}

/** Both groups as one flat list — for a single combined follow row (Footer, Media). */
export function buildFollowLinks(social: SiteSocial, locale: Locale): SocialLinkItem[] {
  return [...buildNivcharotLinks(social, locale), ...buildHareditLinks(social, locale)]
}
