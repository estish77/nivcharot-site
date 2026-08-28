import type { Localized } from '@/lib/i18n'

/**
 * UI chrome for the Media Desk (`/media`) and the Episode Desk
 * (`/podcast`) — the two explorer components introduced by the 2026-08-27
 * redesign brief.
 *
 * Strings only, deliberately: both desks are client components, so keeping
 * their labels in this tiny module (instead of reaching into
 * `press-archive.ts` / `podcast.ts`, which carry hundreds of KB of fixture
 * data alongside their text constants) keeps the client bundle to just the
 * copy it actually renders.
 */
export const mediaDeskText = {
  eyebrow: { he: 'ארכיון חי', en: 'LIVE ARCHIVE' } satisfies Localized,
  title: { he: 'שולחן התקשורת', en: 'The media desk' } satisfies Localized,
  lead: {
    he: 'כל מה שנכתב, שודר והוקלט על נבחרות ועל ידה, במקום אחד: חיפוש, סינון לפי סוג ולפי שנה, ופתיחה של כל פריט במקום בלי לצאת מהעמוד.',
    en: 'Everything written, broadcast and recorded about Nivcharot and by it, in one place: search, filter by kind and by year, and open any item in place without leaving the page.',
  } satisfies Localized,

  tabs: {
    all: { he: 'הכול', en: 'Everything' } satisfies Localized,
    press: { he: 'כתבות בעיתונות', en: 'In the press' } satisfies Localized,
    watch: { he: 'שמע ווידאו', en: 'Audio & video' } satisfies Localized,
    archive: { he: 'רשומות מהארכיון', en: 'Archive posts' } satisfies Localized,
  },
  tabHints: {
    all: {
      he: 'כל הפריטים מכל המקורות, מהחדש לישן.',
      en: 'Every item from every source, newest first.',
    } satisfies Localized,
    press: {
      he: 'סיקור חיצוני שאותר ואומת: כתבות, טורי דעה, ראיונות והפולמוסים.',
      en: 'Verified outside coverage: reporting, opinion columns, interviews and the controversies.',
    } satisfies Localized,
    watch: {
      he: 'פודקאסטים, וידאו והרצאות מערוצים אחרים. בחרו פריט ברשימה כדי לנגן אותו כאן.',
      en: 'Podcasts, video and talks from other channels. Pick one from the list to play it here.',
    } satisfies Localized,
    archive: {
      he: 'ניירות עמדה, פוסטים, ניוזלטרים ופעילות, מהארכיון של נבחרות עצמה.',
      en: "Position papers, posts, newsletters and activity, from Nivcharot's own archive.",
    } satisfies Localized,
  },

  searchLabel: { he: 'חיפוש בארכיון', en: 'Search the archive' } satisfies Localized,
  searchPlaceholder: { he: 'חיפוש חופשי…', en: 'Search…' } satisfies Localized,
  clearSearch: { he: 'ניקוי החיפוש', en: 'Clear search' } satisfies Localized,

  filtersHeading: { he: 'סינון', en: 'Filter' } satisfies Localized,
  kindHeading: { he: 'לפי סוג', en: 'By kind' } satisfies Localized,
  yearHeading: { he: 'לפי שנה', en: 'By year' } satisfies Localized,
  allKinds: { he: 'הכול', en: 'All' } satisfies Localized,
  allYears: { he: 'כל השנים', en: 'All years' } satisfies Localized,
  reset: { he: 'איפוס הסינון', en: 'Reset filters' } satisfies Localized,
  activeFilters: { he: 'סינון פעיל', en: 'Filters on' } satisfies Localized,

  sortLabel: { he: 'סדר', en: 'Order' } satisfies Localized,
  sortNewest: { he: 'מהחדש', en: 'Newest' } satisfies Localized,
  sortOldest: { he: 'מהישן', en: 'Oldest' } satisfies Localized,
  /** English page only — see MediaDesk's sort comment. */
  sortEnglishFirst: { he: 'מקורות באנגלית', en: 'English sources first' } satisfies Localized,

  viewLabel: { he: 'תצוגה', en: 'View' } satisfies Localized,
  viewList: { he: 'רשימה', en: 'List' } satisfies Localized,
  viewGrid: { he: 'כרטיסים', en: 'Cards' } satisfies Localized,

  resultsCount: { he: 'פריטים', en: 'items' } satisfies Localized,
  showingRange: { he: 'מוצגים', en: 'Showing' } satisfies Localized,
  outOf: { he: 'מתוך', en: 'of' } satisfies Localized,
  page: { he: 'עמוד', en: 'Page' } satisfies Localized,
  expand: { he: 'הצגת הפריט המלא', en: 'Show the full item' } satisfies Localized,
  collapse: { he: 'סגירת הפריט', en: 'Collapse the item' } satisfies Localized,

  empty: {
    he: 'אין פריטים בחיתוך הזה.',
    en: 'Nothing matches this combination.',
  } satisfies Localized,
  emptyAction: { he: 'לאיפוס הסינון', en: 'Reset the filters' } satisfies Localized,

  nowPlaying: { he: 'מתנגן כעת', en: 'Now playing' } satisfies Localized,
  playlist: { he: 'רשימת ההשמעה', en: 'Playlist' } satisfies Localized,
  audioOnly: { he: 'פריט אודיו, נפתח בפלטפורמה המקורית', en: 'Audio only, opens on its original platform' } satisfies Localized,
  openOnYoutube: { he: 'ביוטיוב ↗', en: 'On YouTube ↗' } satisfies Localized,

  statsHeading: { he: 'מה יש כאן', en: "What's here" } satisfies Localized,
  statPress: { he: 'כתבות בעיתונות', en: 'press items' } satisfies Localized,
  statWatch: { he: 'פודקאסטים ווידאו', en: 'podcasts & video' } satisfies Localized,
  statArchive: { he: 'רשומות ארכיון', en: 'archive posts' } satisfies Localized,
  statYears: { he: 'שנות תיעוד', en: 'years covered' } satisfies Localized,
} as const

/** UI chrome for `/podcast`'s episode desk. */
export const episodeDeskText = {
  eyebrow: { he: 'כל הפרקים במקום אחד', en: 'EVERY EPISODE IN ONE PLACE' } satisfies Localized,
  title: { he: 'מרכז הפרקים', en: 'The episode desk' } satisfies Localized,
  lead: {
    he: 'חיפוש, מיון והאזנה לכל פרקי "חרדית מדוברת" ולשורטס של הערוץ, בלי גלילה אינסופית.',
    en: 'Search, sort and listen to every "Haredit Meduberet" episode and to the channel\'s shorts, with no endless scrolling.',
  } satisfies Localized,

  tabEpisodes: { he: 'פרקים מלאים', en: 'Full episodes' } satisfies Localized,
  tabShorts: { he: 'שורטס', en: 'Shorts' } satisfies Localized,

  searchLabel: { he: 'חיפוש בפרקים', en: 'Search episodes' } satisfies Localized,
  searchPlaceholder: { he: 'שם פרק, אורחת או נושא…', en: 'Episode, guest or topic…' } satisfies Localized,

  sortPopular: { he: 'הנצפים ביותר', en: 'Most watched' } satisfies Localized,
  sortNewest: { he: 'החדשים', en: 'Newest' } satisfies Localized,
  sortOldest: { he: 'מההתחלה', en: 'From the start' } satisfies Localized,

  latestBadge: { he: 'הפרק האחרון', en: 'Latest episode' } satisfies Localized,
  views: { he: 'צפיות', en: 'views' } satisfies Localized,
  empty: { he: 'אין פרקים שתואמים לחיפוש הזה.', en: 'No episodes match this search.' } satisfies Localized,
  playShort: { he: 'נגנו את השורט', en: 'Play this short' } satisfies Localized,

  topShortsEyebrow: { he: 'הכי נצפים', en: 'MOST WATCHED' } satisfies Localized,
  topShortsTitle: {
    he: 'טעימות נבחרות מערוץ היוטיוב של חרדית מדוברת',
    en: 'Selected tastes from the Haredit Meduberet YouTube channel',
  } satisfies Localized,
  allShortsOnYoutube: { he: 'לכל השורטס ביוטיוב', en: 'All shorts on YouTube' } satisfies Localized,
} as const
