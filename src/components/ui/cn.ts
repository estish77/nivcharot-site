/**
 * Minimal classname joiner — no external dependency (clsx/cva aren't in the
 * pinned dependency list). Falsy values are skipped so callers can inline
 * conditionals: `cn('base', active && 'active', className)`.
 */
export type ClassValue = string | number | null | undefined | false

export function cn(...values: ClassValue[]): string {
  return values.filter((v): v is string | number => Boolean(v)).join(' ')
}
