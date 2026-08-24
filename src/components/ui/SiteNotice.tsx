import { t, type Locale } from '@/lib/i18n'

export type SiteNoticeProps = {
  locale: Locale
}

/**
 * Temporary sitewide banner while the new site is going live and content
 * (posts, team, press archive) is still being migrated over — sits above
 * the sticky `Header` on every route in `(site)/[locale]`, so it scrolls
 * away with the page rather than staying pinned. Remove once migration is
 * done and the site is fully populated.
 */
export function SiteNotice({ locale }: SiteNoticeProps) {
  return (
    <div className="bg-niv-slate px-8 py-2.5 text-center text-[13px] font-semibold leading-snug text-white">
      {t(locale, {
        he: 'האתר החדש עולה לאוויר — התוכן עדיין בבנייה ומתעדכן בימים הקרובים.',
        en: 'The new site is launching — content is still being finalized over the coming days.',
      })}
    </div>
  )
}
