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
 */

export type TeamPodcastEpisode = {
  videoId: string
  /** `https://www.youtube.com/watch?v=<videoId>` — a plain, stable watch link, not a search url. */
  youtubeUrl: string
}

function episode(videoId: string): TeamPodcastEpisode {
  return { videoId, youtubeUrl: `https://www.youtube.com/watch?v=${videoId}` }
}

export const teamPodcastEpisodes: Record<string, TeamPodcastEpisode> = {
  'שלי רפופורט': episode('eakRf41F85U'),
  'לאה שיינברום': episode('QY04mPeFG84'),
  'מלכי רוטנר': episode('fH_Q82GkLeU'),
  'אפרת שוקרון': episode('T9pE3FZh9aI'),
  'הילה חסן לפקוביץ': episode('KMZHIF2g1-I'),
  'תרצה בלוך אסתרזון': episode('SQ-pDX5MHQ4'),
  "מיכל צ'רנוביצקי": episode('DhWB-RqJA4M'),
  'עו"ד יואב ללום': episode('4Gp2j6alEH4'),
}

export function findTeamPodcastEpisode(nameHe: string): TeamPodcastEpisode | undefined {
  return teamPodcastEpisodes[nameHe]
}
