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
        // 70px, not the mockup's original 46px: at 46px the Hebrew wordmark
        // (denser letterforms + the illustration) read as illegible in
        // practice, even though the same rule works for the English mark.
        //
        // Fixed at 70px height on every viewport used to force the header
        // onto two lines on every phone width (this mark alone is ~152px
        // wide at 70px tall — same class of bug the English mark's
        // min-[356px]/min-[440px] steps below were already written to
        // avoid). Same two breakpoints, scaled by height instead of width
        // so the SVG's own aspect ratio still governs the actual width.
        //
        // 2026-08-29: the mobile Donate button dropped its label for a bare
        // heart (HeaderDonateHeart), freeing up real width in the nav row —
        // both tiers below grew a bit to use some of it ("תגדיל קצת את
        // הלוגו"), re-measured against the real (now much narrower) nav.
        className={cn('h-11 min-[356px]:h-[58px] min-[440px]:h-[70px]', className)}
        style={{ width: 'auto', display: 'block' }}
      />
    )
  }

  return (
    <img
      src="/assets/nivcharot-logo-en.png"
      alt={label}
      // Fixed-width per the mockup rule, but not a single fixed width: at
      // 230px (the mockup/desktop value) the English wordmark alone is
      // wider than the available header row on real phone widths, once the
      // podcast icon + language toggle + Donate button + menu button are
      // accounted for (measured via a real headless-browser render, not
      // just computed from the class list — see 2026-08-29 brief below).
      // Unlike the Hebrew mark, "NIVCHAROT" plus its tagline has no slack
      // to give here, so this needed three width tiers rather than two to
      // avoid a wrap at any width in between: 84px through 400px, 130px
      // through 520px (where "Donate" + the toggle + both icons still add
      // up to more than the room a bigger logo would leave), and the full
      // 230px only once there's genuinely enough width to spare.
      //
      // 2026-08-29: the English-only version of this header wrap bug — the
      // two smaller tiers above (110/150px) still wrapped through the whole
      // 340-430px phone range, and 230px turned out to engage 80px too
      // early at min-[440px]. Re-derived all three numbers from actual
      // rendered widths instead of estimates.
      //
      // 2026-08-29 (later same day): the mobile Donate button dropped its
      // label for a bare heart (HeaderDonateHeart), freeing up real width
      // in the nav row — the two smaller tiers grew a bit to use some of it
      // ("תגדיל קצת את הלוגו"), re-measured against the real (now much
      // narrower) nav rather than guessed.
      className={cn('w-[100px] min-[401px]:w-[160px] min-[520px]:w-[230px]', className)}
      style={{ height: 'auto', display: 'block' }}
    />
  )
}
