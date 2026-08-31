import { Button } from './Button'
import { Eyebrow } from './Eyebrow'
import { NotFoundMascot } from './NotFoundMascot'
import { Section } from './Section'

/**
 * Shared 404 body, used by both `(site)/[locale]/not-found.tsx` (reached
 * from within a known-locale route via `notFound()`) and the app-root
 * `global-not-found.tsx` (reached for a URL that doesn't match any route
 * at all, so no locale is knowable either). Neither call site can know
 * which locale was active, hence both languages render side by side
 * rather than guessing one; see `not-found.tsx`'s original doc comment.
 *
 * Copy (2026-08-31 brief: "בוא נעשה אותו מצחיק, הדף לא נמצא, אבל גם אנחנו
 * לא מצאנו עדיין נשים חרדיות בכנסת ואנחנו פועלות כדי לשנות את זה"). The
 * headline stays the literal "page not found" (it's still true, and it's
 * the joke's setup); only the line under it changes, from an explanation
 * of *why* the link might be broken to the joke, keeping its closing
 * "back to the homepage" sentence exactly as it read before.
 */
export function NotFoundContent() {
  return (
    <Section as="div" maxWidth={640} paddingBlockStart="0px" paddingBlockEnd="0px" innerClassName="text-center">
      <NotFoundMascot className="mx-auto mb-2" />
      <p className="mb-4 font-heading text-[64px] font-extrabold leading-none text-accent-700">404</p>

      <div dir="rtl" className="mb-8">
        <Eyebrow className="mb-2 justify-center">שגיאה 404</Eyebrow>
        <h1 className="m-0 mb-3 text-[clamp(26px,4vw,36px)] leading-[1.15]">הדף לא נמצא</h1>
        <p className="m-0 text-[16px] leading-[1.7] text-neutral-800">
          אבל גם אנחנו עוד לא מצאנו נשים חרדיות בכנסת, ואנחנו פועלות לשנות את זה. אפשר לחזור לעמוד הבית.
        </p>
      </div>

      <div aria-hidden="true" className="mx-auto mb-8 h-px w-16 bg-divider" />

      <div dir="ltr" className="mb-10">
        <Eyebrow className="mb-2 justify-center">404 error</Eyebrow>
        <h2 className="m-0 mb-3 text-[clamp(26px,4vw,36px)] leading-[1.15]">Page not found</h2>
        <p className="m-0 text-[16px] leading-[1.7] text-neutral-800">
          But then, we haven&rsquo;t found Haredi women in the Knesset yet either, and we&rsquo;re working to change
          that. You can head back to the homepage.
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
