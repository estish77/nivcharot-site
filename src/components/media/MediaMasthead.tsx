import { cn } from '@/components/ui'

export type MastheadStat = {
  value: string
  label: string
}

/**
 * The newspaper-masthead figure strip under the `/media` title: four big
 * numerals divided by the site's 2px rules.
 *
 * It replaces the old hero's row of three jump buttons. Those buttons
 * existed because the page was four long sections you had to leap between;
 * now that everything lives in one desk below, the useful thing to put
 * here instead is the shape of the collection itself — how much there is,
 * of what, and across how many years.
 *
 * Border handling is index-based rather than `last:`/`nth-child` utilities
 * because the strip is 4-up on desktop and 2-up below 720px, so the cells
 * that need to drop their inline-end rule differ per breakpoint.
 */
export function MediaMasthead({ stats, className }: { stats: MastheadStat[]; className?: string }) {
  return (
    <dl className={cn('m-0 grid grid-cols-4 border-2 border-divider max-[720px]:grid-cols-2', className)}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={cn(
            'flex flex-col gap-1.5 px-5 py-[18px] max-[560px]:px-4',
            i !== stats.length - 1 && 'border-e-2 border-divider',
            i % 2 === 1 && 'max-[720px]:border-e-0',
            i < 2 && 'max-[720px]:border-b-2 max-[720px]:border-divider',
          )}
        >
          <dd className="m-0 font-heading text-[clamp(28px,3.6vw,42px)] font-extrabold leading-none tabular-nums text-text">
            {/*
              `<bdi>`, not a bare string: the year-span value ("2012–2026")
              is two LTR number runs joined by a direction-neutral en dash,
              which the Hebrew page's RTL base direction reorders into
              "2026–2012" on screen. Isolating the value fixes that without
              forcing a direction on the plain counts beside it.
            */}
            <bdi>{stat.value}</bdi>
          </dd>
          <dt className="font-heading text-[11px] font-extrabold leading-[1.4] tracking-[0.1em] text-neutral-700">
            {stat.label}
          </dt>
        </div>
      ))}
    </dl>
  )
}
