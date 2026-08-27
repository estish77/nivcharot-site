import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { EmptyState } from '@/components/media/EmptyState'
import { PostPrevNext } from '@/components/media/PostPrevNext'
import { Figure, ImageSlot, Reveal, Section, Eyebrow } from '@/components/ui'
import { archiveCategories, formatArchiveDate, sortPostsByDateDesc, type ArchivePost } from '@/content/media'
import { archivePostsVisible } from '@/content/media-visibility'
import { getArchivePosts } from '@/lib/cms'
import { arrowBack, isLocale, locales, t, type Locale } from '@/lib/i18n'
import { pageMetadata, urlFor } from '@/lib/seo'
import { siteUrl } from '@/lib/site'

type Params = { locale: string; slug: string }

/**
 * Ported from docs/Post.dc.html (was a `?p=<slug>` query-string route).
 *
 * This used to list only the static fixture's slugs and look posts up via
 * `findPostBySlug` — meaning a post added through the dashboard's `Posts`
 * collection showed up fine on the /media archive listing (already wired
 * to Payload) but 404'd the moment anyone clicked into it, since this page
 * never read from Payload at all. Both now read the same live-or-fallback
 * list from `getArchivePosts()`. `dynamicParams` stays at its default
 * (`true`), so a post added after the last build still resolves correctly
 * on the very next request instead of needing a redeploy first.
 */
export async function generateStaticParams() {
  // 2026-08-27 brief: archive posts are hidden from the public site while
  // their content is reworked (src/content/media-visibility.ts). Nothing is
  // pre-rendered, and the page below 404s, so no post is reachable - while
  // every one of them stays intact and editable in the dashboard.
  if (!archivePostsVisible) return []
  const posts = await getArchivePosts()
  return locales.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slug })))
}

function categoryLine(categories: string[]): string {
  return categories
    .map((slug) => archiveCategories.find((c) => c.slug === slug)?.name)
    .filter((name): name is string => Boolean(name))
    .join(' · ')
}

function findAdjacent(posts: ArchivePost[], slug: string): { prev?: ArchivePost; next?: ArchivePost } {
  const sorted = sortPostsByDateDesc(posts)
  const i = sorted.findIndex((p) => p.slug === slug)
  if (i === -1) return {}
  return { prev: i > 0 ? sorted[i - 1] : undefined, next: i < sorted.length - 1 ? sorted[i + 1] : undefined }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  if (!isLocale(rawLocale)) return {}
  const posts = await getArchivePosts()
  const post = posts.find((p) => p.slug === slug)
  if (!post) return {}

  return pageMetadata({
    locale: rawLocale,
    path: `/media/${slug}`,
    title: post.title,
    description: post.body[0],
    image: post.cover?.src,
    type: 'article',
  })
}

export default async function PostDetailPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, slug } = await params
  if (!isLocale(rawLocale)) {
    notFound()
  }
  // `dynamicParams` defaults to true, so an empty `generateStaticParams`
  // alone would still resolve a post on demand. This is the actual gate.
  if (!archivePostsVisible) {
    notFound()
  }
  const locale: Locale = rawLocale
  const posts = await getArchivePosts()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <EmptyState
        title={t(locale, { he: 'הרשומה הזו לא נמצאה', en: "This entry wasn't found" })}
        body={t(locale, {
          he: 'אולי הקישור נשבר. הארכיון המלא נמצא בעמוד תקשורת ומדיה.',
          en: 'The link may be broken. The full archive lives on the media page.',
        })}
        ctaLabel={t(locale, { he: 'לארכיון המלא', en: 'View the full archive' })}
        ctaHref={`/${locale}/media#desk`}
      />
    )
  }

  const { prev, next } = findAdjacent(posts, post.slug)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.body[0],
    image: post.cover?.src ? [post.cover.src] : undefined,
    datePublished: post.date,
    url: urlFor(locale, `/media/${post.slug}`),
    isPartOf: { '@type': 'WebSite', name: 'נבחרות | Nivcharot', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'נבחרות | Nivcharot', url: siteUrl },
  }

  return (
    <>
      {/* Standard JSON-LD pattern — content is server-built from this same archive fixture/CMS data, never raw user input. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Reveal as="section">
        <article className="mx-auto max-w-[760px] px-8 pb-6 pt-14">
          <a
            href={`/${locale}/media#desk`}
            className="mb-[26px] inline-block text-[13px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {arrowBack(locale)} {t(locale, { he: 'חזרה לארכיון', en: 'Back to archive' })}
          </a>
          {post.categories.length > 0 ? (
            <Eyebrow className="mb-3.5">{categoryLine(post.categories)}</Eyebrow>
          ) : null}
          <h1 className="mb-4 text-[clamp(30px,4vw,46px)] leading-[1.12]">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-2 border-b-2 border-divider pb-6 font-heading text-[13px] font-extrabold text-neutral-600">
            <span>
              {formatArchiveDate(post.date)} · {t(locale, { he: 'מהארכיון של נבחרות', en: 'from the Nivcharot archive' })}
            </span>
            {locale === 'en' ? (
              // Real archive material, researched and verified but never translated
              // (see src/content/media.ts's file header) — an honest heads-up for
              // English readers, same visual pattern as PressItemCard's language badge.
              <span className="border border-divider px-1.5 py-0.5 font-heading text-[10px] font-extrabold tracking-[0.06em] text-neutral-600">
                In Hebrew
              </span>
            ) : null}
          </div>
          {post.cover?.src ? (
            <Figure
              src={post.cover.src}
              alt={post.cover.alt}
              grayscale
              aspectRatio="16/9"
              className="mt-7 overflow-hidden border-2 border-divider"
              mediaClassName="object-cover"
            />
          ) : post.cover ? (
            <Figure grayscale className="relative mt-7 aspect-video overflow-hidden border-2 border-divider bg-neutral-200">
              <ImageSlot label={post.cover.alt} className="absolute inset-0 h-full w-full" />
            </Figure>
          ) : null}
          {post.body.map((paragraph, i) => (
            <p key={i} className="mt-6 text-[17px] leading-[1.9] text-text">
              {paragraph}
            </p>
          ))}
          {post.sourceLinks && post.sourceLinks.length > 0 ? (
            <div className="mt-10 border-t-2 border-divider pt-6">
              <Eyebrow className="mb-4">
                {t(locale, { he: 'לקריאה ולצפייה במקור', en: 'Read and watch at the source' })}
              </Eyebrow>
              <div className="flex flex-col gap-2.5">
                {post.sourceLinks.map((link) => {
                  let host = ''
                  try {
                    host = new URL(link.url).host.replace(/^www\./, '')
                  } catch {
                    host = ''
                  }
                  return (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener"
                      className="flex items-baseline gap-2.5 font-heading text-[15px] font-extrabold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <span>{link.label}</span>
                      <span className="text-xs font-semibold text-neutral-600">
                        {host} ↗
                      </span>
                    </a>
                  )
                })}
              </div>
            </div>
          ) : null}
        </article>
      </Reveal>
      <Reveal as="section" index={1}>
        <Section as="div" maxWidth={760} paddingBlockStart="32px" paddingBlockEnd="72px">
          <PostPrevNext prev={prev} next={next} locale={locale} />
        </Section>
      </Reveal>
    </>
  )
}
