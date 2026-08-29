/**
 * Subtle, stroke-only headphones glyph — same hand-drawn-inline-SVG
 * convention as `HeartIcon`/`PodcastIcon` (no icon library). Used next to
 * the team page's "בואו להכיר מקרוב את X" episode link (2026-08-29 brief:
 * "אייקון של אוזניות עדין ומינימליסטי"), picked from the podcast-icon
 * audition page's headphones option.
 */
export function HeadphonesIcon({ className, size = 15 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="2.5" y="13" width="4" height="6" rx="2" />
      <rect x="17.5" y="13" width="4" height="6" rx="2" />
    </svg>
  )
}
