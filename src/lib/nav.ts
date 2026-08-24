import type { NavLink } from '@/components/ui'
import type { Locale } from '@/lib/i18n'

/**
 * Single source of truth for the sitewide primary nav (`Header`/`NavMenu`).
 * `niv-menu.js` — the mockups' own nav data source — is missing from the
 * repo (flagged by both the scaffold and shared-UI agents), so this used to
 * be a from-scratch, on-theme UI-chrome addition rather than a ported
 * value. The order, Hebrew labels, and "צרו קשר"/Contact entry now match a
 * screenshot of the design tool's own mobile-menu preview (the actual,
 * previously-unrecoverable niv-menu.js content) — see the site owner's
 * 2026-08-13 review. English labels for "פעילות ומשפט" and "תקשורת ומדיה"
 * weren't visible in that screenshot (it was showing the Hebrew branch), so
 * they reuse this project's own already-established English copy for those
 * pages (`activismHero.eyebrow`, media/page.tsx's `generateMetadata` title)
 * rather than inventing new phrasing. "הצטרפות"/Join was dropped from the
 * nav entirely (not present in the reference screenshot) even though the
 * route itself still exists — reachable via its own page's CTAs instead.
 * Every `href` below is verified against the actual routes produced by
 * `next build`. "צרו קשר"/Contact points at the real `/contact` page (site
 * owner brief item 36) rather than a bare `mailto:` — that page's own form
 * still hands off to mailto under the hood, but a real page is a better nav
 * destination than jumping straight to the visitor's mail client.
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
    { label: { he: 'פעילות ומשפט', en: 'Advocacy & Law' }, href: `/${locale}/activism` },
    { label: { he: 'תקשורת ומדיה', en: 'Media & Archive' }, href: `/${locale}/media` },
    { label: { he: 'תרומה', en: 'Donate' }, href: `/${locale}/donate` },
    { label: { he: 'צרו קשר', en: 'Contact us' }, href: `/${locale}/contact` },
  ]
}
