'use client'

import { useEffect } from 'react'

import { Button, Eyebrow, Section } from '@/components/ui'

/**
 * Next's `error.tsx` error-boundary convention is always a Client Component
 * and receives `{ error, reset }`, never route `params` — same reasoning as
 * `not-found.tsx` in this same folder, so both languages render side by
 * side rather than guessing the active locale.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg text-text">
      <Section as="div" maxWidth={640} paddingBlockStart="0px" paddingBlockEnd="0px" innerClassName="text-center">
        <div dir="rtl" className="mb-8">
          <Eyebrow className="mb-2 justify-center">שגיאה</Eyebrow>
          <h1 className="m-0 mb-3 text-[clamp(26px,4vw,36px)] leading-[1.15]">משהו השתבש</h1>
          <p className="m-0 text-[16px] leading-[1.7] text-neutral-800">
            אירעה שגיאה בלתי צפויה בטעינת הדף. אפשר לנסות שוב, או לחזור לעמוד הבית.
          </p>
        </div>

        <div aria-hidden="true" className="mx-auto mb-8 h-px w-16 bg-divider" />

        <div dir="ltr" className="mb-10">
          <Eyebrow className="mb-2 justify-center">Error</Eyebrow>
          <h2 className="m-0 mb-3 text-[clamp(26px,4vw,36px)] leading-[1.15]">Something went wrong</h2>
          <p className="m-0 text-[16px] leading-[1.7] text-neutral-800">
            An unexpected error occurred while loading this page. You can try again, or head back to the homepage.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button type="button" variant="primary" onClick={() => reset()}>
            נסו שוב · Try again
          </Button>
          <Button href="/" variant="secondary">
            בית · Home
          </Button>
        </div>
      </Section>
    </main>
  )
}
