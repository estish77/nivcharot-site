import { Cell, Tag } from '@/components/ui'
import { arrowForward, type Locale } from '@/lib/i18n'
import { archiveCategories, formatArchiveDate, type ArchivePost } from '@/content/media'

const EXCERPT_MAX = 150

export type PostCardProps = { post: ArchivePost; locale: Locale }

/**
 * One archive-post card inside the `/media#archive` `CellGrid` — date,
 * title, a truncated lead paragraph, up to two category tags, and a
 * "read" arrow. Post content itself (title/body/category names) is
 * Hebrew-only source material rendered as-is under both locales; only the
 * arrow direction follows the active locale's reading direction.
 */
export function PostCard({ post, locale }: PostCardProps) {
  const lead = post.body[0] ?? ''
  const excerpt = lead.length > EXCERPT_MAX ? `${lead.slice(0, EXCERPT_MAX).trim()}…` : lead
  const cats = post.categories
    .map((slug) => archiveCategories.find((c) => c.slug === slug))
    .filter((c): c is (typeof archiveCategories)[number] => Boolean(c))
    .slice(0, 2)

  return (
    <Cell href={`/${locale}/media/${post.slug}`} hoverTint className="gap-2.5">
      <span className="font-heading text-[11px] font-extrabold tracking-[0.1em] text-neutral-700">
        {formatArchiveDate(post.date)}
      </span>
      <h3 className="text-[19px] leading-[1.3]">{post.title}</h3>
      {excerpt ? <p className="text-[14.5px] leading-[1.7] text-neutral-800">{excerpt}</p> : null}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        {cats.map((cat) => (
          <Tag key={cat.slug} variant="outline" className="pointer-events-none">
            {cat.name}
          </Tag>
        ))}
        <span aria-hidden="true" className="ms-auto font-heading text-[15px] font-extrabold text-accent-700">
          {arrowForward(locale)}
        </span>
      </div>
    </Cell>
  )
}
