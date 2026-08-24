import { Archivo, Heebo } from 'next/font/google'

/**
 * Heebo carries Hebrew glyphs (Archivo has no Hebrew subset) — always stack
 * Archivo first, Heebo second so Latin text prefers Archivo's shapes while
 * Hebrew text falls through to Heebo. Both expose a CSS variable so
 * `--font-heading` / `--font-body` in globals.css can reference either.
 */
export const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-archivo',
  display: 'swap',
})

export const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '600', '800'],
  variable: '--font-heebo',
  display: 'swap',
})

/** Combined class list to spread onto <html> so both font variables are available. */
export const fontVariables = `${archivo.variable} ${heebo.variable}`
