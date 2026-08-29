import type { SocialLinkItem } from '@/components/ui'
import type { PayloadSiteSettings } from './cms'
import { t, type Locale } from './i18n'

/**
 * The site's two content channels (Nivcharot itself, and the Haredit
 * Meduberet podcast) as follow-link groups — shared between the Contact
 * page (one combined row) and the Join page's "talk to us" section (two
 * separated groups, 2026-08-29 brief: "להפריד באייקונים... את הערוצים של
 * נבחרות ושל חרדית מדוברת") so neither page hand-copies the same links.
 */
export function buildNivcharotLinks(siteSettings: PayloadSiteSettings, locale: Locale): SocialLinkItem[] {
  return [
    { network: 'facebook', href: siteSettings.social.facebook!, label: t(locale, { he: 'פייסבוק · נבחרות', en: 'Facebook · Nivcharot' }) },
    { network: 'instagram', href: siteSettings.social.instagram!, label: t(locale, { he: 'אינסטגרם · נבחרות', en: 'Instagram · Nivcharot' }) },
  ]
}

export function buildHareditLinks(siteSettings: PayloadSiteSettings, locale: Locale): SocialLinkItem[] {
  return [
    { network: 'youtube', href: siteSettings.social.youtube!, label: t(locale, { he: 'יוטיוב · חרדית מדוברת', en: 'YouTube · Haredit Meduberet' }) },
    { network: 'spotify', href: siteSettings.social.spotify!, label: t(locale, { he: 'ספוטיפיי · חרדית מדוברת', en: 'Spotify · Haredit Meduberet' }) },
    { network: 'applePodcasts', href: siteSettings.social.applePodcasts!, label: t(locale, { he: 'אפל פודקאסטס · חרדית מדוברת', en: 'Apple Podcasts · Haredit Meduberet' }) },
    { network: 'instagram', href: siteSettings.social.podcastInstagram!, label: t(locale, { he: 'אינסטגרם · חרדית מדוברת', en: 'Instagram · Haredit Meduberet' }) },
  ]
}

/** Both groups as one flat list — the Contact page's single combined follow row. */
export function buildFollowLinks(siteSettings: PayloadSiteSettings, locale: Locale): SocialLinkItem[] {
  return [...buildNivcharotLinks(siteSettings, locale), ...buildHareditLinks(siteSettings, locale)]
}
