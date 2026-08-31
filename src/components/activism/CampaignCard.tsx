import { Figure } from '@/components/ui'
import { shortDateLabel } from '@/components/podcast/podcastUtils'
import { t, type Locale } from '@/lib/i18n'
import type { CampaignPost } from '@/lib/cms'

export type CampaignCardProps = { post: CampaignPost; locale: Locale }

/**
 * One card in the "קמפיינים" gallery on the Activism page (2026-08-31
 * brief: "סגנון אינסטגרם... כרטיסי פוסט" — laid out like a real Instagram
 * post: a small header row standing in for the profile avatar/handle, the
 * image, a decorative heart/comment row, then the caption and date.
 *
 * The heart/comment icons are deliberately not counters: this site has no
 * way to know a post's real Instagram engagement, and inventing numbers
 * would be exactly the kind of fabricated content avoided everywhere else
 * on this site (see `getEvents()`'s doc comment in src/lib/cms.ts). They're
 * here only to read visually as "a post," not to claim any real count.
 */
export function CampaignCard({ post, locale }: CampaignCardProps) {
  return (
    <article className="flex flex-col border-2 border-divider bg-bg">
      <div className="flex items-center gap-2.5 border-b-2 border-divider px-3.5 py-2.5">
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-niv-slate font-heading text-[13px] font-extrabold text-niv-cream">
          נ
        </span>
        <span className="font-heading text-[13px] font-extrabold">nivcharot</span>
      </div>

      {post.image ? (
        <Figure
          className="relative aspect-square overflow-hidden"
          src={post.image.url}
          alt={post.image.alt}
          mediaClassName="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      <div className="flex flex-col gap-2.5 px-3.5 pb-4 pt-3">
        <div className="flex items-center gap-3 text-accent-700">
          <HeartOutlineIcon />
          <CommentOutlineIcon />
        </div>
        <p className="m-0 text-[14px] leading-[1.6] text-neutral-800">
          <span className="font-heading font-extrabold text-text">nivcharot</span> {post.caption}
        </p>
        <span className="text-[11.5px] font-semibold uppercase tracking-wide text-neutral-600">
          {shortDateLabel(post.postedAt, locale)}
        </span>
        {post.instagramUrl ? (
          <a
            href={post.instagramUrl}
            target="_blank"
            rel="noopener"
            className="self-start text-[12.5px] font-semibold text-accent-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t(locale, { he: 'לצפייה באינסטגרם', en: 'View on Instagram' })}
          </a>
        ) : null}
      </div>
    </article>
  )
}

function HeartOutlineIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true">
      <path
        d="M12 21c-.26 0-.51-.1-.7-.28C6.6 16.24 2.75 12.5 2.75 8.55 2.75 5.6 5 3.25 7.85 3.25c1.9 0 3.55 1.06 4.15 2.53.6-1.47 2.25-2.53 4.15-2.53 2.85 0 5.1 2.35 5.1 5.3 0 3.95-3.85 7.69-8.55 12.17-.19.18-.44.28-.7.28Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CommentOutlineIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true">
      <path
        d="M4 5.5h16a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9.5L5 20v-4H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
