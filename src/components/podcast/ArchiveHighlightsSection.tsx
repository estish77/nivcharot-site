import Link from 'next/link'

import { cn, Reveal, Section } from '@/components/ui'
import { pressArchiveItemsSorted, pressItemHref } from '@/content/press-archive'
import { podcastText } from '@/content/podcast'
import type { Locale } from '@/lib/i18n'
import { arrowForward, t } from '@/lib/i18n'

const HIGHLIGHT_COUNT = 4

/**
 * "מהארכיון · מגזין ווידאו" / "From the archive · magazine and video"
 * (docs/Podcast.dc.html:204-218 / :367-381).
 *
 * 2026-08-13 site owner brief, items 39/40: this used to read
 * `src/content/media.ts`'s `archivePosts`, most of which were invented
 * (several with fake source links) — see that file's own comment. Now
 * pulls the 4 most recent REAL items from `press-archive.ts`, same as
 * every other "from the archive" strip on the site.
 *
 * The grid collapses 4 -> 2 -> 1 at 860px/560px, which happens to match
 * the shared `CellGrid`'s `cols={4}` breakpoints — but `CellGrid` always
 * uses `--color-divider` for its border and always omits it on the grid's
 * very last cell, while this row's border color varies per item via the
 * mockup's own `{{ a.border }}` (divider on every cell but the last,
 * "none" only on the last), so it's built directly here instead.
 */
export function ArchiveHighlightsSection({ locale }: { locale: Locale }) {
  const highlights = pressArchiveItemsSorted.slice(0, HIGHLIGHT_COUNT)

  return (
    <Reveal as="section">
      <Section as="div" paddingBlockStart="56px" paddingBlockEnd="72px">
        <div className="mb-[22px] flex flex-col items-start gap-3">
          <h2 className="m-0 max-[860px]:text-[clamp(24px,7vw,34px)]">{t(locale, podcastText.magazineTitle)}</h2>
          <Link
            href={`/${locale}/media#in-the-media`}
            className="text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {locale === 'he' ? (
              <>
                {t(locale, podcastText.fullArchive)} {arrowForward(locale)}
              </>
            ) : (
              <>
                {arrowForward(locale)} {t(locale, podcastText.fullArchive)}
              </>
            )}
          </Link>
        </div>
        <div className="-me-[2px] grid grid-cols-4 max-[860px]:grid-cols-2 max-[560px]:grid-cols-1">
          {highlights.map((post, i) => {
            const { href, external } = pressItemHref(post.link, locale)
            return (
              <Link
                key={post.slug}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener' : undefined}
                className={cn(
                  'flex flex-col gap-2 px-[22px] py-6 text-text no-underline transition-colors duration-200 ease-out hover:bg-neutral-200 focus-visible:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent',
                  i !== highlights.length - 1 && 'border-e-2 border-divider',
                )}
              >
                <span className="font-heading text-[13px] font-extrabold text-accent-700">
                  {t(locale, post.dateLabel)}
                </span>
                <span className="font-heading text-[17px] font-extrabold leading-[1.35]">{t(locale, post.title)}</span>
                {/*
                  Clamped, 2026-08-27 redesign: these are full press-archive
                  summaries (a substantive paragraph each, by design — see
                  press-archive.ts), so printed in full four of them made
                  this closing strip taller than the episode desk above it.
                  The whole text stays one click away on `/media`.
                */}
                <span className="line-clamp-4 text-[13.5px] leading-[1.6] text-neutral-700">
                  {t(locale, post.summary)}
                </span>
              </Link>
            )
          })}
        </div>
      </Section>
    </Reveal>
  )
}
