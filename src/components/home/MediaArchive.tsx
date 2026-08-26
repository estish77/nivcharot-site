import Link from 'next/link'

import { Cell, CellGrid, Reveal } from '@/components/ui'
import { arrowForward, t, type Locale } from '@/lib/i18n'
import { mediaArchiveSection } from '@/content/home'
import { homeCardExcerpt, pressItemHref } from '@/content/press-archive'
import { getPressArchiveItems } from '@/lib/cms'
import { EqualizerDots } from './EqualizerDots'

/**
 * 2026-08-13 site owner brief, items 39/40: this teaser used to read four
 * entirely invented posts (`content/home.ts`'s old `mediaArchivePosts`).
 * Now pulls REAL items from `press-archive.ts`/Payload's `press-archive`
 * collection — the same research-verified archive the `/media#in-the-media`
 * section uses — so this strip only ever shows content that genuinely
 * exists.
 *
 * 2026-08-16 brief: "בדף הבית שים כתבות מגוונות לא רק כאלה עם שמי" — picks
 * the dashboard-curated `featured` set rather than the 4 most recent, so
 * this doesn't skew toward whichever pieces happen to be newest (which
 * tended to be interview-heavy, name-centered coverage). Falls back to the
 * 4 most recent only if nothing is marked featured yet.
 */
export async function MediaArchive({ locale }: { locale: Locale }) {
  const arrow = arrowForward(locale)
  const allItems = await getPressArchiveItems()
  const featured = allItems.filter((item) => item.featured)
  const posts = (featured.length > 0 ? featured : allItems).slice(0, 4)

  return (
    <Reveal as="section">
      <div className="relative mx-auto" style={{ maxWidth: 1240, paddingInline: '32px', paddingBlock: '72px' }}>
        <div className="absolute leading-none" style={{ insetBlockStart: '32px', insetInlineEnd: '32px' }}>
          <EqualizerDots tone="light" />
        </div>
        <div className="mb-[22px] flex flex-col items-start gap-3">
          <h2 className="m-0">{t(locale, mediaArchiveSection.title)}</h2>
          <Link
            href={`/${locale}/media#in-the-media`}
            className="text-[14px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {locale === 'he' ? (
              <>
                {t(locale, mediaArchiveSection.linkLabel)} {arrow}
              </>
            ) : (
              <>
                {arrow} {t(locale, mediaArchiveSection.linkLabel)}
              </>
            )}
          </Link>
        </div>
        <CellGrid cols={4}>
          {posts.map((post) => {
            const { href, external } = pressItemHref(post.link, locale)
            return (
              <Cell
                key={post.slug}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener' : undefined}
                hoverTint
                paddingInline="22px"
                paddingBlockStart="26px"
                paddingBlockEnd="26px"
                className="gap-2"
              >
                {/* `--color-accent` at 13px fails AA on this background (3.75:1 vs the 4.5:1 small-text minimum) — `--color-accent-700` per the project's small-text rule, deviating from the mockup's raw accent here. */}
                <span className="font-heading text-[13px] font-extrabold text-accent-700">{t(locale, post.dateLabel)}</span>
                {/* line-clamp-2, not unbounded: titles vary a lot in length across real coverage, and a 4-column row stretches every cell to match its tallest sibling (see Cell.tsx) — capping the title keeps one long headline from inflating all 4 cards. */}
                <span className="line-clamp-2 font-heading text-[17px] font-extrabold leading-[1.35]">{t(locale, post.title)}</span>
                {/* homeCardExcerpt (not the raw summary): the archive's `summary` is deliberately long-form (quotes, full context) for the /media list, way too much for a narrow card. line-clamp-4 is a pure backstop — the excerpt itself is written short enough that it shouldn't visibly truncate. */}
                <span className="line-clamp-4 text-[13.5px] leading-[1.6] text-neutral-700">{homeCardExcerpt(post, locale)}</span>
              </Cell>
            )
          })}
        </CellGrid>
      </div>
    </Reveal>
  )
}
