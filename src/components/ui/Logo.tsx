import { t, type Locale } from '@/lib/i18n'
import { cn } from './cn'

export type LogoProps = {
  locale: Locale
  className?: string
}

/**
 * The real brand logos (public/assets/nivcharot-logo-he.svg and
 * public/assets/nivcharot-logo-en.png), replacing
 * the earlier text-wordmark placeholder now that the design-tool assets
 * have landed. A plain <img>, not next/image: these are small hand-authored
 * vector files with no resampling to gain from the image optimizer, and
 * local SVGs need `images.dangerouslyAllowSVG` opted into next.config for
 * next/image to serve them at all.
 *
 * Sizing mirrors the mockups' own header rule (verbatim from
 * docs/"Home copy.dc.html"): the Hebrew mark is fixed-height/auto-width,
 * the English wordmark is fixed-width/auto-height — the two logos have
 * different aspect ratios (portrait illustration position differs), so a
 * single shared rule would distort one of them.
 */
export function Logo({ locale, className }: LogoProps) {
  const label = t(locale, {
    he: 'נבחרות, תנועת נשים חרדיות',
    en: "Nivcharot, Haredi women's movement",
  })

  if (locale === 'he') {
    return (
      <img
        src="/assets/nivcharot-logo-he.svg"
        alt={label}
        className={className}
        // 70px, not the mockup's original 46px: at 46px the Hebrew wordmark
        // (denser letterforms + the illustration) read as illegible in
        // practice, even though the same rule works for the English mark.
        style={{ height: 70, width: 'auto', display: 'block' }}
      />
    )
  }

  return (
    <img
      src="/assets/nivcharot-logo-en.png"
      alt={label}
      // Fixed-width per the mockup rule, but not a single fixed width: at
      // 230px (the mockup/desktop value) the English wordmark alone is
      // wider than the available header row on every phone width from 320
      // to 430px once the language toggle + menu button are accounted for
      // (header padding 2*32px + gap-6 24px + nav ~118px), forcing the
      // header onto two lines — unlike the Hebrew mark, which is narrow
      // enough to never wrap. Scaling the width down at narrow viewports
      // keeps the header on one line through the whole phone range;
      // min-[440px] restores the exact original 230px once there's room.
      className={cn('w-[110px] min-[356px]:w-[150px] min-[440px]:w-[230px]', className)}
      style={{ height: 'auto', display: 'block' }}
    />
  )
}
