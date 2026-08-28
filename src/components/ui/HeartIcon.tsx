/**
 * Filled, minimal heart — matches the hand-drawn-inline-SVG convention used
 * everywhere else in this codebase (see NavMenu.tsx's icons); no icon
 * library is installed or needed.
 *
 * Lives here rather than inside `Header` because the donate page's
 * recommended-amount badge uses the same mark, and the site's donate
 * language is "תרמו ♥" — the same heart in both places, not two drawings of
 * one idea.
 */
export function HeartIcon({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={className}>
      <path
        d="M12 20.5c-.25 0-.5-.09-.7-.27C7.6 16.9 3 13 3 8.7 3 5.8 5.2 3.5 8 3.5c1.7 0 3.2.85 4 2.15.8-1.3 2.3-2.15 4-2.15 2.8 0 5 2.3 5 5.2 0 4.3-4.6 8.2-8.3 11.53-.2.18-.45.27-.7.27Z"
        fill="currentColor"
      />
    </svg>
  )
}
