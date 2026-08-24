import type { Localized } from '@/lib/i18n'

/**
 * Typed fixture data for the Activism page (docs/Activism.dc.html), shaped
 * to line up with the eventual Payload sources:
 *  - hero / halakha-cards intro copy  -> `activism` global (heroField/sectionIntrosField)
 *  - the four בג"ץ / #מחאת_הכסאות / כנסת / קהילה blocks -> `activism` global's pillarCards
 *  - the six FAQ entries               -> `faqs` collection, filtered `page: 'activism'`
 *  - the "מהארכיון" grid               -> `posts` collection, filtered by categories
 *    ["ניירות עמדה", "חקיקה"], newest first, first 4 — see the note on
 *    `activismArchive` below, this slice is not wired to real posts yet.
 */

export const activismHero = {
  eyebrow: {
    he: 'פעילות ציבורית, משפט והלכה',
    en: 'ADVOCACY, LAW & HALAKHA',
  } satisfies Localized,
  titleLine1: {
    he: 'מהרשת, לרחוב,',
    en: 'From the feed, to the street,',
  } satisfies Localized,
  titleLine2: {
    he: 'לכנסת ולבג"ץ.',
    en: 'to the Knesset and the Court.',
  } satisfies Localized,
  lead: {
    he: 'נבחרות מאמינה שעל מוסדות המדינה מוטלת אחריות לשנות מצב שבו מפלגות משפיעות בישראל הן מועדון סגור לגברים בלבד. לצד עבודת התודעה בקהילה, אנחנו פועלות בכל הזירות שבהן מתקבלות ההחלטות.',
    en: "Nivcharot believes state institutions bear responsibility for changing a reality in which Israel's most influential parties are a closed men's club. Alongside awareness work in the community, we act in every arena where decisions are made.",
  } satisfies Localized,
}

export type ActivismPillar = {
  eyebrow: Localized
  title: Localized
  body: Localized
}

/**
 * The four alternating image+text blocks. Laid out by `ActivismPage` as
 * three fixed rows (text+image / image+text / text+text) matching the
 * mockup's hard-coded structure exactly — this isn't a repeatable list in
 * the source, so it isn't modeled as one here either.
 */
export const activismPillars: {
  bagatz: ActivismPillar
  chairs: ActivismPillar
  knesset: ActivismPillar
  community: ActivismPillar
} = {
  bagatz: {
    eyebrow: { he: 'בג"ץ', en: 'SUPREME COURT' },
    title: { he: 'המאבק בתקנוני המפלגות', en: 'The battle over party bylaws' },
    body: {
      he: 'מ־2015 היינו שותפות למאבק המשפטי נגד סעיפי התקנון שמנעו מנשים להתמודד במפלגות החרדיות. אחרי ארבע שנים, ב־2019, הורה בית המשפט העליון לאגודת ישראל לבטל כל מניעה לקבלת אישה כחברה במפלגה. "יש שופטים בירושלים והם אומרים: אין יותר שלט \'אין כניסה לנשים\'".',
      en: 'From 2015 we were partners in the legal battle against bylaw clauses barring women from Haredi parties. After four years, in 2019, the Supreme Court ordered Agudat Yisrael to remove every barrier to women\'s membership. No more "No entry for women" sign.',
    },
  },
  chairs: {
    eyebrow: { he: '#מחאת_הכסאות', en: '#EMPTY_CHAIRS' },
    title: { he: 'הכיסא הריק', en: 'The empty chair' },
    body: {
      he: 'סביב סבבי הבחירות הציבה מחאת הכסאות את הכיסא הריק כסמל: הכיסא שבו אמורה לשבת נציגה חרדית, ואין. פעולה חזותית פשוטה שהפכה לאחד הסמלים המזוהים ביותר של המאבק לייצוג.',
      en: "Around the election rounds, the Empty Chairs protest placed the vacant chair as a symbol: the seat where a Haredi woman representative should sit, and doesn't. A simple visual act that became one of the struggle's most recognizable symbols.",
    },
  },
  knesset: {
    eyebrow: { he: 'כנסת', en: 'KNESSET' },
    title: { he: 'לובי וניירות עמדה', en: 'Lobbying and position papers' },
    body: {
      he: '"לובילעדינו", לובי הנשים החרדיות בכנסת, מביא את הקול החרדי־נשי לוועדות ולדיונים: מהוועדה למעמד האישה ועד הוועדה לביטחון לאומי. ניירות העמדה שלנו, על רווחה, תעסוקה, בריאות והשכלה, מוגשים לכנסת, למשרדי הממשלה ולאו"ם.',
      en: '"Lobbyladeinu", the Haredi women\'s lobby in the Knesset, brings the Haredi women\'s voice to committees and hearings, from the Committee on the Status of Women to the National Security Committee. Our position papers, on welfare, employment, health and education, go to the Knesset, government ministries and the UN.',
    },
  },
  community: {
    eyebrow: { he: 'קהילה', en: 'COMMUNITY' },
    title: { he: 'שיח.ה וחוגי בית', en: 'Sicha circles and home groups' },
    body: {
      he: 'מיזם שיח.ה מרחיב את מעגלי ההשפעה גם בקרב גברים חרדים, ולצדו חוגי בית ומעגלי שיח בקהילות. אחרי אוקטובר 2023 הקמנו יחד את "חרדיות שותפות", התארגנות נשים חרדיות להושטת יד לצה"ל ולעורף.',
      en: 'The Sicha project widens the circles of influence to include Haredi men, alongside home groups and community dialogue circles. After October 2023 we helped found "Harediyot Shutafot", Haredi women organizing support for soldiers and the home front.',
    },
  },
}

/** The two unfilled `<image-slot>` placeholders next to the bagatz/chairs blocks. */
export const activismImageSlots = {
  bagatz: {
    id: 'act-bagatz',
    label: { he: 'תמונה, מחוץ לבית המשפט העליון', en: 'Image, outside the Supreme Court' } satisfies Localized,
  },
  chairs: {
    id: 'act-chairs',
    label: { he: 'תמונה, מחאת הכסאות', en: 'Image, the Empty Chairs protest' } satisfies Localized,
  },
}

/**
 * `href` is optional by design, same convention as
 * `activismHalachaCards.second`'s placeholder: the two entries below
 * originally linked to pages on the old nivcharot.co.il site, which is
 * being taken offline (2026-08-13 brief, item 33 — no link anywhere may
 * point at the old site). Neither document has a new home yet, so rather
 * than link to a domain that's about to 404, these render as plain
 * dotted-underline "not yet linked" labels until the real files/pages are
 * re-hosted and a real `href` can be filled back in.
 */
export type ActivismLink = { label: Localized; href?: string }

export const activismPositionPapersEyebrow = {
  he: 'ניירות עמדה נבחרים',
  en: 'Selected position papers',
} satisfies Localized

export const activismPositionPapersPlaceholder = {
  he: 'הקישור יתעדכן',
  en: 'link coming soon',
} satisfies Localized

export const activismPositionPapers: ActivismLink[] = [
  {
    label: {
      he: 'הזכות לשירותי רווחה, על הקשיים והתפקוד הלקוי במערכת הרווחה (2024)',
      en: 'The right to welfare services, failures of Israel\'s welfare system (2024, Hebrew)',
    },
  },
  {
    label: {
      he: 'לכל ניירות העמדה באתר הארכיון',
      en: 'All position papers (archive site, Hebrew)',
    },
  },
]

export const activismHalachaSection = {
  eyebrow: { he: 'הלכה', en: 'HALAKHA' } satisfies Localized,
  title: { he: 'מה ההלכה עצמה אומרת', en: 'What halakha itself says' } satisfies Localized,
  lead: {
    he: 'הטענה שההלכה אוסרת על נשים להיבחר היא הקיר הראשון שנתקלנו בו. כדי לבדוק אותה פנינו למקורות ולפוסקים, ואספנו את התשובות.',
    en: 'The claim that halakha forbids women from being elected was the first wall we hit. To test it we went to the sources and the decisors, and collected the answers.',
  } satisfies Localized,
}

/**
 * The two halakhic-ruling cards. The second is an explicit, intentional
 * placeholder in the mockup — "המסמך יעלה לאתר" / "document to be uploaded",
 * with no link — preserved as designed rather than inventing a URL.
 */
export const activismHalachaCards = {
  first: {
    tag: { he: 'פסק ראשון', en: 'First ruling' } satisfies Localized,
    title: { he: 'הקונטרס ההלכתי, 2017', en: 'The halakhic pamphlet, 2017' } satisfies Localized,
    body: {
      he: 'את עמדת ההלכה ביררנו במישרין: הקונטרס מציג את תשובת הגרי"י וינברג זצ"ל מחנוכה תשי"א, ולפיה שלוש שיטות בדבר - האוסרים, המתירים, והמבחינים בין לבחור ובין להיבחר. הקונטרס חולק לרבנים, לעסקנים ולתקשורת החרדית.',
      en: "We clarified the halakhic position directly: the pamphlet presents Rabbi Y. Y. Weinberg's 1950 responsum, according to which there are three positions - those who forbid, those who permit, and those who distinguish between voting and standing. It was distributed to rabbis, community figures and the Haredi press.",
    } satisfies Localized,
    linkLabel: { he: 'לקונטרס המלא', en: 'The full pamphlet' } satisfies Localized,
    /**
     * "Post.dc.html?p=kuntres-halachi" in the mockup — mapped to a guessed
     * post route (locale-relative, no leading `/${locale}` — the page
     * component prepends that, matching `Footer`'s `donateHref` convention).
     * Align once the Media/Post routes exist.
     */
    href: '/media/kuntres-halachi',
  },
  second: {
    tag: { he: 'פסק שני', en: 'Second ruling' } satisfies Localized,
    title: {
      he: 'תשובת הרב קרויזר בעניין שילוב נשים במפלגות',
      en: "Rabbi Kreuzer's responsum on women in political parties",
    } satisfies Localized,
    body: {
      he: 'פסק הלכה נוסף, העוסק ישירות בשאלת שילובן של נשים במפלגות. המסמך יעלה לאתר.',
      en: 'A further halakhic ruling, addressing the question of women joining political parties directly. The document will be published here.',
    } satisfies Localized,
    /** No href by design — the mockup shows a dotted-underline label, not a link. */
    placeholderLabel: { he: 'המסמך להעלאה', en: 'document to be uploaded' } satisfies Localized,
  },
}

export type ActivismFaqItem = {
  id: string
  number: string
  question: Localized
  answer: Localized
  source?: Localized
}

export const activismFaqSection = {
  eyebrow: { he: 'שאלות ותשובות', en: 'Q & A' } satisfies Localized,
  title: { he: 'מה שואלים אותנו', en: 'What people ask us' } satisfies Localized,
  lead: {
    he: 'שש שאלות שחוזרות בכל ראיון, בכל חוג בית ובכל טוקבק.',
    en: 'Six questions that come up in every interview, every home group and every comment thread.',
  } satisfies Localized,
}

export const activismFaqs: ActivismFaqItem[] = [
  {
    id: 'want-to-be-elected',
    number: '01',
    question: {
      he: 'נשים חרדיות בכלל רוצות להיבחר?',
      en: 'Do Haredi women actually want to be elected?',
    },
    answer: {
      he: 'בסקר שפרסמנו, 59% מהנשאלים אמרו שירצו לראות נשים חרדיות בכנסת - 27% "מאוד רוצים" ו־32% "די רוצים" - לעומת פחות מרבע שהתנגדו. בקרב מצביעים חילונים מדובר ב־65%. ובשטח: 14 נשים חרדיות התמודדו בבחירות המקומיות האחרונות, ושתיים נבחרו למועצות.',
      en: 'In a survey we published, 59% of respondents said they would like to see Haredi women in the Knesset - 27% "very much" and 32% "somewhat" - against fewer than a quarter opposed. Among secular voters the figure was 65%. On the ground, 14 Haredi women ran in the last municipal elections and two were elected to councils.',
    },
    source: {
      he: 'מקור: סקר נבחרות; ynet, 23.3.2025',
      en: 'Source: Nivcharot survey; ynet, 23 March 2025',
    },
  },
  {
    id: 'halakha-forbids',
    number: '02',
    question: {
      he: 'ההלכה אוסרת על אישה להיבחר לתפקיד ציבורי?',
      en: 'Does halakha forbid a woman from holding public office?',
    },
    answer: {
      he: 'לא. בקונטרס ההלכתי שהוצאנו ב־2017 מוצגות שלוש שיטות בסוגיה, כדברי הגרי"י וינברג זצ"ל בתשובתו מחנוכה תשי"א: יש האוסרים, יש המתירים, ויש המבחינים בין לבחור ובין להיבחר. כלומר זו מחלוקת, לא איסור מוחלט.',
      en: "No. The halakhic pamphlet we published in 2017 sets out three positions on the question, following Rabbi Y. Y. Weinberg's responsum of 1950: some forbid it, some permit it, and some distinguish between voting and standing for election. It is a dispute, not a flat prohibition.",
    },
    source: {
      he: 'מקור: "האם באמת אסור לאישה להיבחר לתפקיד ציבורי?", קונטרס נבחרות, 2017',
      en: 'Source: "Is a woman really forbidden to hold public office?", Nivcharot pamphlet, 2017',
    },
  },
  {
    id: 'whats-blocking',
    number: '03',
    question: { he: 'אז מה בעצם חוסם?', en: 'So what is actually blocking it?' },
    answer: {
      he: 'תקנוני המפלגות ומנהג פוליטי. ב־2015 גילתה העיתונאית טל שניידר שתקנוני המפלגות החרדיות מעגנים את היעדר הנשים בשורותיהן. משם התחיל המאבק המשפטי.',
      en: 'Party bylaws and political custom. In 2015 journalist Tal Schneider revealed that the Haredi parties\' bylaws entrench the absence of women from their ranks. That is where the legal battle began.',
    },
  },
  {
    id: 'why-still-none',
    number: '04',
    question: {
      he: 'בג"ץ הכריע לטובתכן ב־2019. למה עדיין אין נשים?',
      en: 'The Court ruled in your favour in 2019. Why are there still no women?',
    },
    answer: {
      he: 'כי תיקון התקנון לא הפך להתפקדות בפועל. המפלגות החרדיות טרם נפתחו לנשים, ושתי עתירות מתנהלות בימים אלה מול ש"ס ומול אגודת ישראל כדי לאפשר התפקדות.',
      en: 'Because amending the bylaws did not translate into actual membership. The Haredi parties have not opened to women in practice, and two petitions are now pending against Shas and Agudat Yisrael to allow women to join.',
    },
  },
  {
    id: 'womens-party',
    number: '05',
    question: {
      he: 'נבחרות רוצה להקים מפלגת נשים?',
      en: 'Is Nivcharot trying to form a women\'s party?',
    },
    answer: {
      he: 'לא. המטרה היא מנהיגות חרדית אלטרנטיבית שיש בה נשים וגברים, באופן שוויוני ומכבד - לא להחליף את המנהיגות החרדית אלא להרחיב אותה.',
      en: 'No. The purpose is an alternative Haredi leadership of women and men alike, equally and respectfully - not to replace Haredi leadership but to widen it.',
    },
  },
  {
    id: 'haredi-feminism',
    number: '06',
    question: {
      he: '"פמיניזם חרדי" זו לא סתירה?',
      en: 'Isn\'t "Haredi feminism" a contradiction?',
    },
    answer: {
      he: 'שרה שנירר, שמופיעה בלוגו שלנו, דחתה בעצמה כל הגדרה פמיניסטית ותבעה את מה שהיה מגיע לה "על פי הזכויות שהתורה העניקה לנו" - ובנתה את רשת החינוך לבנות הראשונה בעולם החרדי. השאלה היא לא איך קוראים לזה, אלא מי יושבת בשולחן.',
      en: 'Sarah Schenirer, who appears in our logo, rejected any feminist label herself and claimed what was due to her "according to the rights the Torah granted us" - and built the first girls\' education network in the Haredi world. The question is not what to call it, but who sits at the table.',
    },
  },
]

/**
 * 2026-08-13 site owner brief, items 39/40: this section used to read a
 * self-declared placeholder fixture (4 invented archive cards). Now pulls
 * the 4 most recent REAL items from `press-archive.ts` (see
 * `ActivismPage.tsx`) — same real, research-verified data every other
 * "from the archive" strip on the site now uses.
 */
export const activismArchiveSection = {
  title: {
    he: 'מהארכיון · ניירות עמדה וחקיקה',
    en: 'From the archive · position papers and legislation',
  } satisfies Localized,
  linkLabel: { he: 'לארכיון המלא', en: 'Full archive' } satisfies Localized,
  href: '/media#in-the-media',
}
