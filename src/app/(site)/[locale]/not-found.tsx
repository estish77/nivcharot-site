import { NotFoundContent } from '@/components/ui'

/**
 * Next's `not-found.tsx` convention does not receive route `params` (it can
 * be reached from any nested segment, including when the `[locale]` param
 * itself is invalid — see the root layout's `notFound()` call), so this
 * can't know which locale was active. The outer `[locale]/layout.tsx`
 * already sets `<html lang dir>` correctly whenever a valid locale *is*
 * known; `NotFoundContent` renders both languages side by side (mirroring
 * how the mockups themselves always ship both branches) rather than
 * guessing one — shared with `global-not-found.tsx`, reached for URLs that
 * don't match any route at all, where the same "no locale is knowable"
 * problem applies.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg text-text">
      <NotFoundContent />
    </main>
  )
}
