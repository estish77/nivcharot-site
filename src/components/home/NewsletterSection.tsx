import Link from 'next/link'

import { Breathe, Section } from '@/components/ui'
import { t, type Locale } from '@/lib/i18n'
import { joinCards } from '@/content/join'

/** Reuses the Join page's "newsletter" card as the single source of truth for the external signup URL/label. */
const newsletterCard = joinCards.find((card) => card.id === 'newsletter')!
const newsletterLink = newsletterCard.links[0]

/**
 * A thin, single-row bar under `DonateBand`: one rallying sentence + one
 * centered button out to the external newsletter signup page. Deliberately
 * simple for now, by design — an internal, Payload-backed signup form (see
 * git history, src/payload/collections/NewsletterSubscribers.ts) exists but
 * needs a production database migration before it can go live; until then
 * this reverts to the same external-link handoff the site used before,
 * just restyled as its own dark, brand-navy bar rather than sharing
 * `DonateBand`'s accent-red band.
 */
export function NewsletterSection({ locale }: { locale: Locale }) {
  const newsletterUrl = t(locale, newsletterLink.href)

  return (
    <Breathe as="section" durationS={5}>
      <Section as="div" tint="niv-slate" paddingBlockStart="20px" paddingBlockEnd="20px">
        <div className="flex flex-wrap items-center justify-center gap-4 text-center">
          <p className="m-0 font-heading text-[15px] font-extrabold text-niv-cream">
            {t(locale, {
              he: 'אל תפספסו אף עדכון — הצטרפו לניוזלטר של נבחרות',
              en: "Don't miss an update — join the Nivcharot newsletter",
            })}
          </p>
          <Link
            href={newsletterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn whitespace-nowrap bg-white px-5 py-2 text-[14px] text-niv-slate hover:bg-accent-300 hover:text-niv-slate focus-visible:bg-accent-300 focus-visible:text-niv-slate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t(locale, newsletterLink.label)}
          </Link>
        </div>
      </Section>
    </Breathe>
  )
}
