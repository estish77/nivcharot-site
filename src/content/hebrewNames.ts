import { mivzakonEntries } from './mivzakon'
import { teamMembers } from './team'

import type { Locale } from '@/lib/i18n'

/**
 * Hebrew person name → its English transliteration.
 *
 * The podcast's Shorts carry Hebrew titles, and the stories strip cuts the
 * guest's name straight out of one. On the English page that printed Hebrew
 * names under English captions, while every name the site controls itself —
 * team members, the ticker's speakers — is already transliterated. This
 * closes that gap for names the repo can pair up.
 *
 * Most pairs are not written here: they are read off the fixtures that
 * already carry both spellings, so adding an English name in one place
 * keeps working everywhere. `EXTRA` only holds people who appear in the
 * Shorts but nowhere else, so there is no existing pair to read.
 *
 * A name with no pair falls back to the Hebrew, which is the honest
 * outcome — better an untransliterated real name than an invented spelling
 * of someone's name.
 */
const EXTRA: Record<string, string> = {
  'רחלי סלומון': 'Racheli Salomon',
  'רחלי משולם סלומון': 'Racheli Meshulam Salomon',
  'אלי ביתאן': 'Eli Bitan',
  'אלישבע רזווג': 'Elisheva Razvag',
  'יהודה מוזס': 'Yehuda Mozes',
  'אופיר טובול': 'Ofir Toubul',
  'שלי רפופורט': 'Sheli Rappaport',
  'נטע כ״ץ': 'Neta Katz',
  'נטע כ"ץ': 'Neta Katz',
  'יוכי תפילינסקי-בלוך': 'Yochi Tfilinsky-Bloch',
  'סימי הרשקופ': 'Simi Hershkopf',
  'נועם גרין': 'Noam Green',
  'אלי דן': 'Eli Dan',
  'דידי שור': 'Didi Shor',
}

const BY_HEBREW = new Map<string, string>([
  ...teamMembers
    .filter((member) => member.name.he && member.name.en && member.name.he !== member.name.en)
    .map((member) => [member.name.he, member.name.en] as const),
  ...mivzakonEntries
    .filter((entry) => entry.speaker.he !== entry.speaker.en)
    .map((entry) => [entry.speaker.he, entry.speaker.en] as const),
  ...Object.entries(EXTRA),
])

/** Strips the honorifics the team fixture carries but a Short's title won't. */
function bare(name: string): string {
  return name.replace(/^(?:עו״ד|עו"ד|הרב ד״ר|הרב ד"ר|הרב|ד״ר|ד"ר)\s+/, '').trim()
}

const BY_BARE = new Map([...BY_HEBREW].map(([he, en]) => [bare(he), en]))

/**
 * The name as this locale should print it. Hebrew is returned unchanged;
 * English gets the transliteration when one is known, and the Hebrew name
 * otherwise.
 */
export function localizedName(name: string, locale: Locale): string {
  if (locale === 'he') return name
  const trimmed = name.trim()
  return BY_HEBREW.get(trimmed) ?? BY_BARE.get(bare(trimmed)) ?? name
}
