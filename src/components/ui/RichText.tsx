import { Fragment, type ReactNode } from 'react'

import { cn } from './cn'

/**
 * Renders Payload's Lexical rich text.
 *
 * Every `richText` field on the site used to be squeezed through
 * `lexicalToParagraphs`, which walks the top level of the tree, keeps
 * `paragraph` nodes and reads only each child's `text`. That is fine for a
 * one-line bio, but it silently destroys a real article: a link node has
 * `children`, not `text`, so it vanished entirely, and headings, lists,
 * quotes, bold and italic were dropped on the floor with it. An editor
 * writing in `/admin` saw a formatted piece with 17 sources and the site
 * showed flat grey prose with no links at all (2026-08-28 report:
 * "links and formatting are missing from the article on the law page").
 *
 * So this walks the whole tree instead. Anything it doesn't recognise still
 * renders its children rather than disappearing, which keeps an unknown
 * node type from blanking a paragraph the way the old flattener did.
 */

/** Lexical's text-format bitmask. */
const BOLD = 1
const ITALIC = 1 << 1
const STRIKETHROUGH = 1 << 2
const UNDERLINE = 1 << 3
const CODE = 1 << 4
const SUBSCRIPT = 1 << 5
const SUPERSCRIPT = 1 << 6

type Node = Record<string, unknown>

const linkClass =
  'text-accent-700 underline underline-offset-[3px] decoration-[1.5px] hover:text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Only schemes that are safe to put behind a click. An editor pasting a
 * `javascript:` URL into the link dialog must not become a script on the
 * page, so anything else renders as plain text.
 */
function safeHref(raw: unknown): string | null {
  const url = String(raw ?? '').trim()
  if (!url) return null
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url
  // Relative links to our own pages.
  if (url.startsWith('/') || url.startsWith('#')) return url
  return null
}

function children(node: Node, key: string): ReactNode {
  const list = Array.isArray(node.children) ? (node.children as Node[]) : []
  return list.map((child, i) => <Fragment key={`${key}-${i}`}>{renderNode(child, `${key}-${i}`)}</Fragment>)
}

function renderText(node: Node, key: string): ReactNode {
  const text = String(node.text ?? '')
  if (!text) return null
  const format = typeof node.format === 'number' ? node.format : 0

  let out: ReactNode = text
  if (format & CODE) out = <code className="bg-neutral-200 px-1.5 py-0.5 text-[0.9em]">{out}</code>
  if (format & BOLD) out = <strong className="font-bold">{out}</strong>
  if (format & ITALIC) out = <em>{out}</em>
  if (format & UNDERLINE) out = <u>{out}</u>
  if (format & STRIKETHROUGH) out = <s>{out}</s>
  if (format & SUBSCRIPT) out = <sub>{out}</sub>
  if (format & SUPERSCRIPT) out = <sup>{out}</sup>
  return <Fragment key={key}>{out}</Fragment>
}

function renderNode(node: Node, key: string): ReactNode {
  if (!node || typeof node !== 'object') return null

  switch (node.type) {
    case 'text':
      return renderText(node, key)

    case 'linebreak':
      return <br />

    case 'paragraph': {
      const kids = children(node, key)
      // Lexical emits empty paragraphs for blank lines; rendering them as
      // spaced-out empty <p>s just adds ragged gaps.
      if (!Array.isArray(kids) || kids.length === 0) return null
      return <p className="mb-5 text-[15.5px] leading-[1.8] text-text">{kids}</p>
    }

    case 'heading': {
      const tag = String(node.tag ?? 'h2')
      /*
       * The page already renders the hero as the document's <h1>, so a body
       * h1 (which is how an editor writes the article's own title) becomes
       * an h2 here. Two <h1>s on one page is a real accessibility problem,
       * and the visual weight is unchanged.
       */
      const level = tag === 'h1' ? 2 : Math.min(Math.max(Number(tag.slice(1)) || 2, 2), 4)
      const Tag = `h${level}` as 'h2' | 'h3' | 'h4'
      const size =
        level === 2
          ? 'text-[clamp(21px,2.6vw,27px)] mt-10 mb-4'
          : level === 3
            ? 'text-[clamp(18px,2.1vw,21px)] mt-9 mb-3'
            : 'text-[17px] mt-7 mb-2.5'
      return <Tag className={cn('leading-[1.25] first:mt-0', size)}>{children(node, key)}</Tag>
    }

    case 'quote':
      return (
        <blockquote className="my-7 border-s-[3px] border-accent bg-tint-cream px-6 py-4 text-[16px] italic leading-[1.75] text-neutral-800">
          {children(node, key)}
        </blockquote>
      )

    case 'list': {
      const ordered = node.listType === 'number'
      const Tag = ordered ? 'ol' : 'ul'
      return (
        <Tag
          className={cn(
            'mb-5 ps-6 text-[15.5px] leading-[1.8] text-text',
            ordered ? 'list-decimal' : 'list-disc',
            // Nested lists shouldn't inherit the outer bottom margin.
            '[&_ol]:mb-0 [&_ul]:mb-0 [&_ol]:mt-2 [&_ul]:mt-2',
          )}
        >
          {children(node, key)}
        </Tag>
      )
    }

    case 'listitem':
      return <li className="mb-2 ps-1 marker:text-accent-700">{children(node, key)}</li>

    case 'horizontalrule':
      return <hr className="my-9 border-0 border-t-2 border-divider" />

    case 'link':
    case 'autolink': {
      const fields = (node.fields ?? {}) as Node
      const href = safeHref(node.type === 'autolink' ? (fields.url ?? node.url) : fields.url)
      if (!href) return <>{children(node, key)}</>
      const newTab = Boolean(fields.newTab)
      return (
        <a
          href={href}
          className={linkClass}
          {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children(node, key)}
        </a>
      )
    }

    case 'upload': {
      const value = node.value && typeof node.value === 'object' ? (node.value as Node) : null
      const src = value?.url ? String(value.url) : null
      if (!src) return null
      const alt = value?.alt ? String(value.alt) : ''
      return (
        // eslint-disable-next-line @next/next/no-img-element -- editor-supplied media of unknown dimensions
        <img src={src} alt={alt} className="my-7 block h-auto w-full border-2 border-divider" loading="lazy" />
      )
    }

    default:
      // Unknown node: keep its text rather than dropping the content.
      return <>{children(node, key)}</>
  }
}

/** True when `value` is Lexical rich text with at least one child node. */
export function hasRichText(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const root = (value as Node).root as Node | undefined
  return Array.isArray(root?.children) && root.children.length > 0
}

export type RichTextProps = { value: unknown; className?: string }

export function RichText({ value, className }: RichTextProps) {
  if (!hasRichText(value)) return null
  const root = (value as Node).root as Node
  return <div className={className}>{children(root, 'r')}</div>
}
