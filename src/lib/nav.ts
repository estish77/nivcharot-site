import type { NavLink } from '@/components/ui'
import type { Locale } from '@/lib/i18n'

/**
 * Single source of truth for the sitewide primary nav (`Header`/`NavMenu`).
 * `niv-menu.js` — the mockups' own nav data source — is missing from the
 * repo (flagged by both the scaffold and shared-UI agents), so this used to
 * be a from-scratch, on-theme UI-chrome addition rather than a ported
 * value. The order and Hebrew labels originally matched a screenshot of the
 * design tool's own mobile-menu preview (the actual, previously-unrecoverable
 * niv-menu.js content) — see the site owner's 2026-08-13 review. English
 * labels for "פעילות ומשפט" and "תקשורת ומדיה" weren't visible in that
 * screenshot (it was showing the Hebrew branch), so they reuse this
 * project's own already-established English copy for those pages
 * (`activismHero.eyebrow`, media/page.tsx's `generateMetadata` title)
 * rather than inventing new phrasing. Every `href` below is verified
 * against the actual routes produced by `next build`.
 *
 * 2026-08-29 brief: the last slot — "צרו קשר"/Contact — now points at the
 * already-built `/join` page ("בואו לקחת חלק"/Get involved) instead of
 * `/contact`, since `/join` had no way to reach it from the nav. The email
 * address that lived at the bottom of the contact page is still reachable —
 * it's the footer's mailto icon (`Footer.tsx`'s `buildNivcharotLinks`) —
 * so removing this nav entry doesn't remove access to it. The `/contact`
 * route/form itself is untouched, just unlinked from primary nav.
 */
export function navLinksFor(locale: Locale): NavLink[] {
  return [
    { label: { he: 'בית', en: 'Home' }, href: `/${locale}` },
    {
      label: { he: 'אודות', en: 'About' },
      href: `/${locale}/about`,
      children: [
        { label: { he: 'הסיפור שלנו', en: 'Our story' }, href: `/${locale}/story` },
        { label: { he: 'הצוות', en: 'Team' }, href: `/${locale}/team` },
      ],
    },
    { label: { he: 'הנבחרת', en: 'HaNivcheret' }, href: `/${locale}/hanivcheret` },
    { label: { he: 'חרדית מדוברת', en: 'Haredit Meduberet' }, href: `/${locale}/podcast` },
    {
      label: { he: 'פעילות ומשפט', en: 'Advocacy & Law' },
      href: `/${locale}/activism`,
      children: [
        { label: { he: 'הלכה', en: 'Halakha' }, href: `/${locale}/halacha` },
        { label: { he: 'משפט', en: 'Law' }, href: `/${locale}/mishpat` },
      ],
    },
    { label: { he: 'תקשורת ומדיה', en: 'Media & Archive' }, href: `/${locale}/media` },
    { label: { he: 'תרומה', en: 'Donate' }, href: `/${locale}/donate` },
    { label: { he: 'בואו לקחת חלק', en: 'Get involved' }, href: `/${locale}/join` },
  ]
}
