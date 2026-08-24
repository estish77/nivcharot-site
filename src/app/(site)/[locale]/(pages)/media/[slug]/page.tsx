import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { EmptyState } from '@/components/media/EmptyState'
import { PostPrevNext } from '@/components/media/PostPrevNext'
import { Figure, ImageSlot, Reveal, Section, Eyebrow } from '@/components/ui'
import {
  adjacentPosts,
  archiveCategories,
  archivePosts,
  findPostBySlug,
  formatArchiveDate,
} from '@/content/media'
import { arrowBack, isLocale, locales, t, type Locale } from '@/lib/i18n'

type Params = { locale: string; slug: string }

/** Ported from docs/Post.dc.html (was a `?p=<slug>` query-string route). */
export function generateStaticParams() {
  return locales.flatMap((locale) => archivePosts.map((post) => ({ locale, slug: post.slug })))
}

function categoryLine(categories: string[]): string {
  return categories
    .map((slug) => archiveCategories.find((c) => c.slug === slug)?.name)
    .filter((name): name is string => Boolean(name))
    .join(' · ')
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  if (!isLocale(rawLocale)) return {}
  const post = findPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.body[0],
  }
}

export default async function PostDetailPage({ params }: { params: Promise<Params> }) {
  const { locale: rawLocale, slug } = await params
  if (!isLocale(rawLocale)) {
    notFound()
  }
  const locale: Locale = rawLocale
  const post = findPostBySlug(slug)

  if (!post) {
    return (
      <EmptyState
        title={t(locale, { he: 'הרשומה הזו לא נמצאה', en: "This entry wasn't found" })}
        body={t(locale, {
          he: 'אולי הקישור נשבר. הארכיון המלא נמצא בעמוד תקשורת ומדיה.',
          en: 'The link may be broken. The full archive lives on the media page.',
        })}
        ctaLabel={t(locale, { he: 'לארכיון המלא', en: 'View the full archive' })}
        ctaHref={`/${locale}/media#archive`}
      />
    )
  }

  const { prev, next } = adjacentPosts(post.slug)

  return (
    <>
      <Reveal as="section">
        <article className="mx-auto max-w-[760px] px-8 pb-6 pt-14">
          <a
            href={`/${locale}/media#archive`}
            className="mb-[26px] inline-block text-[13px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {arrowBack(locale)} {t(locale, { he: 'חזרה לארכיון', en: 'Back to archive' })}
          </a>
          {post.categories.length > 0 ? (
            <Eyebrow className="mb-3.5">{categoryLine(post.categories)}</Eyebrow>
          ) : null}
          <h1 className="mb-4 text-[clamp(30px,4vw,46px)] leading-[1.12]">{post.title}</h1>
          <div className="border-b-2 border-divider pb-6 font-heading text-[13px] font-extrabold text-neutral-600">
            {formatArchiveDate(post.date)} · {t(locale, { he: 'מהארכיון של נבחרות', en: 'from the Nivcharot archive' })}
          </div>
          {post.cover ? (
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
