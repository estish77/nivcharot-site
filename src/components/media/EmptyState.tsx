import { Button } from '@/components/ui'

export type EmptyStateProps = {
  title: string
  body: string
  ctaLabel: string
  ctaHref: string
}

/** The "not found" branch shared by the post and event detail templates (docs/Post.dc.html / docs/Event.dc.html). */
export function EmptyState({ title, body, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-[760px] px-8 py-20 max-[860px]:px-[18px] max-[860px]:py-12">
      <h1 className="mb-3.5 text-[clamp(28px,3.5vw,40px)]">{title}</h1>
      <p className="mb-6 text-base leading-[1.7] text-neutral-800">{body}</p>
      <Button href={ctaHref} variant="primary">
        {ctaLabel}
      </Button>
    </div>
  )
}
