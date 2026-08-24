import { Button, Eyebrow, Section } from '@/components/ui'

/**
 * Next's `not-found.tsx` convention does not receive route `params` (it can
 * be reached from any nested segment, including when the `[locale]` param
 * itself is invalid — see the root layout's `notFound()` call), so this
 * can't know which locale was active. The outer `[locale]/layout.tsx`
 * already sets `<html lang dir>` correctly whenever a valid locale *is*
 * known; here both languages render side by side (mirroring how the
 * mockups themselves always ship both branches) rather than guessing one.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg text-text">
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
    </main>
  )
}
