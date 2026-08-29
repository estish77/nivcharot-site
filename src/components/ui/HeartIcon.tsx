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
export function HeartIcon({
  className,
  size = 14,
  /**
   * Outlined hearts read as "not yet", filled ones as "done" — which is the
   * whole signal on the team page's שכוייח button, since it shows no count.
   * Defaults to filled, matching every other heart on the site.
   */
  filled = true,
}: {
  className?: string
  size?: number
  filled?: boolean
}) {
  const d =
    'M12 21c-.26 0-.51-.1-.7-.28C6.6 16.24 2.75 12.5 2.75 8.55 2.75 5.6 5 3.25 7.85 3.25c1.9 0 3.55 1.06 4.15 2.53.6-1.47 2.25-2.53 4.15-2.53 2.85 0 5.1 2.35 5.1 5.3 0 3.95-3.85 7.69-8.55 12.17-.19.18-.44.28-.7.28Z'
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={className}>
      {filled ? (
        <path d={d} fill="currentColor" />
      ) : (
        <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      )}
    </svg>
  )
}
