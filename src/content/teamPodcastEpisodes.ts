import type { Localized } from '@/lib/i18n'

/**
 * Team-member → their own full "חרדית מדוברת" episode, for the team page's
 * "בואו להכיר מקרוב את X" link (2026-08-29 brief: "תבדוק בערוץ היוטיוב, יש
 * להרבה מהצוות שם פרקים מלאים. ותיצור את הלינקים").
 *
 * Matched by hand against `src/content/podcast-archive.json` (the full
 * ~104-episode YouTube archive, see `getPodcastEpisodes()` in
 * `src/content/podcast.ts`) — every title on that channel that names the
 * guest was grepped against the current team roster (local `payload.db`,
 * `team_members`/`team_members_locales`). Only real, unambiguous matches are
 * listed; most of the roster has no episode and simply isn't a key here —
 * this project's established rule against fabricating data (see e.g.
 * `alumnaeVideos`, `HOST_FRAMED_SHORTS`) applies just as much to a missing
 * link as to a guessed one.
 *
 * Keyed by the person's Hebrew name (`TeamMember.name.he`), not by id: the
 * static fixture (`src/content/team.ts`) and the live CMS roster use two
 * different id shapes (slug vs numeric), but both carry the same Hebrew
 * name text — same key `guestName` already uses in `podcast.ts`.
 *
 * A few matches are close-but-not-verbatim name matches, kept because
 * they're unambiguously the same person:
 *   - "תרצה בלוך אסתרזון" (team) / "תרצה בלוך" (episode title) — same
 *     community-manager role/bio, no other Tirtza Bloch on the roster.
 * `מלכי רוטנר` has two full episodes on the channel; the more recent one
 * (2026-07-12) is used — it's also the one already cross-referenced in this
 * codebase's own `podcastEpisodes` fallback fixture.
 *
 * Two entries (2026-08-29 follow-up) are hand-verified against the LIVE
 * production roster instead — this file's original pass matched against a
 * stale local `payload.db` snapshot that was missing two people since added
 * directly in production (`רחלי סלומון (מורגנשטרן)`, `שני מונצ'ק`). Verified
 * via a direct read of `team_members`/`team_members_locales` on the real
 * production database (DATABASE_URI_DIRECT), not the local dev copy:
 *   - "רחלי סלומון (מורגנשטרן)" (team, production) / "רחלי משולם סלומון"
 *     (episode title) — same person (the episode's own description names
 *     her a "בוגרת נבחרות"), just written in a different name order.
 *
 * `שרה ינץ` and `אסתי שושן` (2026-08-29 follow-up) are role-reversal
 * episodes — Sara is normally the show's researcher/producer, not a guest;
 * this is the one episode where she interviews Esty Shushan instead of the
 * other way around (confirmed via the episode's own description: "בדרך כלל
 * היא זו ששואלת, הפעם היא זו שעונה... שרה ינץ... מושיבה את אסתי שושן על
 * כסא המרואיינת"). Esty's own link points to a DIFFERENT show entirely —
 * "תקרה וזכוכית - עם ד"ר עליזה בלוך" (host Dr. Aliza Bloch, who has
 * separately been a Haredit Meduberet GUEST herself — "לכי תנהלי עיר
 * חרדית", in `podcast-archive.json`), episode "בין שמיים לארץ | שיחה עם
 * אסתי שושן" (2026-02-19) — verified real via the show's own Apple
 * Podcasts/RSS metadata (title + release date match exactly) and
 * cross-confirmed on YouTube via that video's oEmbed response (`author_name`
 * matches the show, `title` matches the episode verbatim). Outside every
 * other entry's single-channel archive, but real and independently
 * verified all the same.
 *
 * `firstName` (2026-08-29 follow-up: "רק שם פרטי ללא שם משפחה") is stored
 * explicitly rather than sliced out of `TeamMember.name` at render time —
 * several of these people's full names don't start with a bare first name
 * (a professional title, "עו\"ד יואב ללום", or a double/parenthetical
 * surname, "רחלי סלומון (מורגנשטרן)"), so a generic "take the first word"
 * split would mislabel exactly the entries that most need it right.
 */

export type TeamPodcastEpisode = {
  videoId: string
  /** `https://www.youtube.com/watch?v=<videoId>` — a plain, stable watch link, not a search url. */
  youtubeUrl: string
  firstName: Localized<string>
}

function episode(videoId: string, firstName: Localized<string>): TeamPodcastEpisode {
  return { videoId, youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`, firstName }
}

export const teamPodcastEpisodes: Record<string, TeamPodcastEpisode> = {
  'שלי רפופורט': episode('eakRf41F85U', { he: 'שלי', en: 'Sheli' }),
  'לאה שיינברום': episode('QY04mPeFG84', { he: 'לאה', en: 'Leah' }),
  'מלכי רוטנר': episode('fH_Q82GkLeU', { he: 'מלכי', en: 'Malki' }),
  'אפרת שוקרון': episode('T9pE3FZh9aI', { he: 'אפרת', en: 'Efrat' }),
  'הילה חסן לפקוביץ': episode('KMZHIF2g1-I', { he: 'הילה', en: 'Hila' }),
  'תרצה בלוך אסתרזון': episode('SQ-pDX5MHQ4', { he: 'תרצה', en: 'Tirtza' }),
  "מיכל צ'רנוביצקי": episode('DhWB-RqJA4M', { he: 'מיכל', en: 'Michal' }),
  'עו"ד יואב ללום': episode('4Gp2j6alEH4', { he: 'יואב', en: 'Yoav' }),
  'רחלי סלומון (מורגנשטרן)': episode('U_la-TMwsmA', { he: 'רחלי', en: 'Racheli' }),
  'שרה ינץ': episode('pooufIFYPBg', { he: 'שרה', en: 'Sara' }),
  'אסתי שושן': episode('09zy6fSh6v8', { he: 'אסתי', en: 'Esty' }),
}

export function findTeamPodcastEpisode(nameHe: string): TeamPodcastEpisode | undefined {
  return teamPodcastEpisodes[nameHe]
}
