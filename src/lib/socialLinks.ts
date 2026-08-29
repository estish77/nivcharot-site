import type { SocialLinkItem } from '@/components/ui'
import type { PayloadSiteSettings } from './cms'
import { t, type Locale } from './i18n'

/**
 * The site's two content channels (Nivcharot itself, and the Haredit
 * Meduberet podcast) as one icon row — shared between the Contact page and
 * the Join page's "talk to us" section (2026-08-29 brief) so the two don't
 * carry two hand-copied versions of the same six links.
 */
export function buildFollowLinks(siteSettings: PayloadSiteSettings, locale: Locale): SocialLinkItem[] {
  return [
    { network: 'facebook', href: siteSettings.social.facebook!, label: t(locale, { he: 'פייסבוק · נבחרות', en: 'Facebook · Nivcharot' }) },
    { network: 'instagram', href: siteSettings.social.instagram!, label: t(locale, { he: 'אינסטגרם · נבחרות', en: 'Instagram · Nivcharot' }) },
    { network: 'youtube', href: siteSettings.social.youtube!, label: t(locale, { he: 'יוטיוב · חרדית מדוברת', en: 'YouTube · Haredit Meduberet' }) },
    { network: 'spotify', href: siteSettings.social.spotify!, label: t(locale, { he: 'ספוטיפיי · חרדית מדוברת', en: 'Spotify · Haredit Meduberet' }) },
    { network: 'applePodcasts', href: siteSettings.social.applePodcasts!, label: t(locale, { he: 'אפל פודקאסטס · חרדית מדוברת', en: 'Apple Podcasts · Haredit Meduberet' }) },
    { network: 'instagram', href: siteSettings.social.podcastInstagram!, label: t(locale, { he: 'אינסטגרם · חרדית מדוברת', en: 'Instagram · Haredit Meduberet' }) },
  ]
}
