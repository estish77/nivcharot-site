import { Button } from './Button'
import { Eyebrow } from './Eyebrow'
import { Section } from './Section'

/**
 * Shared 404 body — used by both `(site)/[locale]/not-found.tsx` (reached
 * from within a known-locale route via `notFound()`) and the app-root
 * `global-not-found.tsx` (reached for a URL that doesn't match any route
 * at all, so no locale is knowable either). Neither call site can know
 * which locale was active, hence both languages render side by side
 * rather than guessing one — see `not-found.tsx`'s original doc comment.
 */
export function NotFoundContent() {
  return (
    <Section as="div" maxWidth={640} paddingBlockStart="0px" paddingBlockEnd="0px" innerClassName="text-center">
      <p className="mb-4 font-heading text-[64px] font-extrabold leading-none text-accent-700">404</p>

      <div dir="rtl" className="mb-8">
        <Eyebrow className="mb-2 justify-center">שגיאה 404</Eyebrow>
        <h1 className="m-0 mb-3 text-[clamp(26px,4vw,36px)] leading-[1.15]">הדף לא נמצא</h1>
        <p className="m-0 text-[16px] leading-[1.7] text-neutral-800">
          ייתכן שהקישור שגוי או שהדף הוסר. אפשר לחזור לעמוד הבית.
        </p>
      </div>

      <div aria-hidden="true" className="mx-auto mb-8 h-px w-16 bg-divider" />

      <div dir="ltr" className="mb-10">
        <Eyebrow className="mb-2 justify-center">404 error</Eyebrow>
        <h2 className="m-0 mb-3 text-[clamp(26px,4vw,36px)] leading-[1.15]">Page not found</h2>
        <p className="m-0 text-[16px] leading-[1.7] text-neutral-800">
          This link may be broken, or the page may have been removed. You can head back to the homepage.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button href="/" variant="primary">
          בית · Home
        </Button>
      </div>
    </Section>
  )
}
