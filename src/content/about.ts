import type { Localized } from '@/lib/i18n'

/**
 * Typed fixture data for the About page (`docs/About.dc.html`), extracted
 * verbatim from both the `dir="rtl"` and `dir="ltr"` branches of the
 * mockup. Payload wiring lands later — this file is shaped so the eventual
 * collection/global fields are a near 1:1 match (see field-level comments).
 */

/** One of the three "lines of work" pillar cards. */
export type AboutPillar = {
  /** Literal index label ("01"/"02"/"03") — not localized, same glyphs either direction. */
  number: string
  title: Localized<string>
  body: Localized<string>
  /** The "האמצעים" / "The means" sub-label above the bullet list. */
  meansLabel: Localized<string>
  means: Localized<string[]>
  /** Arrow-link label text, WITHOUT the arrow glyph — the page adds it via `arrowForward()`. */
  linkLabel: Localized<string>
  /** Route-relative href, e.g. `/podcast` — the page prefixes the locale. */
  hrefSlug: string
}

/**
 * One "By the numbers" stat tile. `sourcePrefix` is the full citation line;
 * `sourcePlaceholder`, when present for a given locale, is an additional
 * dotted-underline "to be completed" fragment appended after " · ".
 *
 * The mockup's placeholder markers are NOT symmetric between locales: 3
 * appear in Hebrew (tiles 2, 5, 6 — 1-indexed) but only 2 survive in the
 * English copy (tiles 2, 6) — the Hebrew "committee name" TODO on tile 5
 * was apparently resolved before translation. Modeled exactly as authored,
 * not assumed symmetric.
 */
export type AboutStatTile = {
  value: number
  suffix: string
  decimals?: number
  label: Localized<string>
  sourcePrefix: Localized<string>
  sourcePlaceholder?: { he?: string; en?: string }
}

export const aboutContent = {
  hero: {
    eyebrow: { he: `אודות`, en: `ABOUT` } satisfies Localized,
    /** `\n` marks the mockup's single `<br>` line break. */
    title: {
      he: `תנועה חרדית פמיניסטית\nלשינוי חברתי.`,
      en: `A Haredi feminist movement\nfor social change.`,
    } satisfies Localized,
    lead: {
      he: `נבחרות (ע"ר) הוקמה כתנועת מחאה בשם "לא נבחרות לא בוחרות" ופועלת מאז 2012 לייצוג נשים חרדיות במוקדי קבלת ההחלטות, להעלאת תודעת זכויות בקהילה החרדית, לביעור עריצות ולהכשרת מנהיגות נשית חרדית. אנחנו מאמינות שהיעדר הקול של נשים חרדיות בפוליטיקה ובציבוריות הישראלית הוא עוול שהחברה כולה משלמת עליו, ושבידינו היכולת לשנות אותו, מבפנים.`,
      en: `Nivcharot (NGO) began as a protest movement called "No Voice, No Vote" and has worked since 2012 for the representation of Haredi women in decision-making, for rights awareness in the Haredi community, against tyranny, and for the training of Haredi women's leadership. We believe the absence of Haredi women's voices from Israeli politics and public life is an injustice the whole society pays for, and that we have the power to change it from within.`,
    } satisfies Localized,
  },

  purpose: {
    eyebrow: { he: `המטרה`, en: `Our purpose` } satisfies Localized,
    title: {
      he: `מנהיגות חרדית אלטרנטיבית,\nשיש בה נשים וגברים`,
      en: `An alternative Haredi leadership,\nof women and men alike`,
    } satisfies Localized,
    lead: {
      he: `נבחרות לא מבקשת להחליף את המנהיגות החרדית אלא להרחיב אותה: מנהיגות שנשים שותפות בה באופן שוויוני ומכבד. משם נגזרות שלוש דרכי הפעולה, ומכל דרך נגזרים האמצעים.`,
      en: `Nivcharot does not ask to replace Haredi leadership but to widen it: a leadership women take part in, equally and respectfully. Three lines of work follow from that purpose, and the means follow from each line.`,
    } satisfies Localized,
  },

  pillars: [
    {
      number: `01`,
      title: { he: `העלאת מודעות`, en: `Raising awareness` },
      body: {
        he: `להפוך את סוגיית הייצוג מטאבו לשיחה שמתנהלת בתוך הקהילה ומחוצה לה.`,
        en: `Turning representation from a taboo into a conversation, inside the community and beyond it.`,
      },
      meansLabel: { he: `האמצעים`, en: `The means` },
      means: {
        he: [`הפודקאסט "חרדית מדוברת"`, `כתיבה בתקשורת החרדית והכללית`, `כנסים ומעגלי שיח`],
        en: [`The podcast Haredit Meduberet`, `Writing in the Haredi and general press`, `Conferences and discussion circles`],
      },
      linkLabel: { he: `לפודקאסט`, en: `The podcast` },
      hrefSlug: `/podcast`,
    },
    {
      number: `02`,
      title: { he: `הכשרת מנהיגות`, en: `Training leadership` },
      body: {
        he: `לבנות שדרה של אקטיביסטיות חרדיות שממשיכות להוביל בעצמן, ומפיצות את הרעיונות הלאה.`,
        en: `Building a corps of Haredi activists who lead in their own right and carry the ideas onward.`,
      },
      meansLabel: { he: `האמצעים`, en: `The means` },
      means: {
        he: [
          `"הנבחרת": תשעה מחזורים מאז 2018, כ־20 אקטיביסטיות בכל מחזור`,
          `רשת הבוגרות ופעילות בשטח, ברשויות ובתקשורת`,
          `שיתופי פעולה עם ארגוני נשים, אקדמיה וחברה אזרחית להרחבת השיח החרדי־פמיניסטי`,
        ],
        en: [
          `HaNivcheret: nine cohorts since 2018, about 20 activists in each`,
          `The alumnae network, active on the ground, in local government and in the media`,
          `Partnerships with women’s organisations, academia and civil society to widen Haredi feminist discourse`,
        ],
      },
      linkLabel: { he: `לתוכנית`, en: `The program` },
      hrefSlug: `/hanivcheret`,
    },
    {
      number: `03`,
      title: { he: `חקיקה, משפט והלכה`, en: `Law, policy and halakha` },
      body: {
        he: `להפעיל את מנועי הלחץ של המדינה נגד הדרת נשים, ולברר מה ההלכה עצמה אומרת.`,
        en: `Using the state’s levers against the exclusion of women, and clarifying what halakha itself says.`,
      },
      meansLabel: { he: `האמצעים`, en: `The means` },
      means: {
        he: [`עתירות נגד תקנוני המפלגות`, `ניירות עמדה ולובי בכנסת ובוועדותיה`, `בירור עמדת ההלכה בשאלת בחירת נשים לתפקיד ציבורי`],
        en: [
          `Petitions against exclusionary party bylaws`,
          `Position papers and lobbying in the Knesset and its committees`,
          `Clarifying the halakhic position on women holding public office`,
        ],
      },
      linkLabel: { he: `לפעילות`, en: `Advocacy` },
      hrefSlug: `/activism`,
    },
  ] satisfies AboutPillar[],

  schenirer: {
    eyebrow: { he: `האישה שבלוגו`, en: `THE WOMAN IN THE LOGO` } satisfies Localized,
    name: { he: `שרה שנירר`, en: `Sarah Schenirer` } satisfies Localized,
    imageLabel: {
      he: `שרה שנירר, האישה שבלוגו של נבחרות`,
      en: `Sarah Schenirer, the woman in the Nivcharot logo`,
    } satisfies Localized,
    paragraphs: {
      he: [
        `מחנכת, סופרת יידיש ומחזאית. נולדה בקרקוב ב־1883 למשפחה חסידית, למדה בבית ספר פולני, ובנעוריה נאלצה לעבוד למחייתה כתופרת. ב־1917 פתחה בביתה כיתה לבנות, וממנה צמחה "בית יעקב", רשת החינוך הראשונה לבנות בעולם החרדי.`,
        `החינוך היה רק חלק ממה שעשתה. היא כתבה מחזות ביידיש לתלמידותיה וחומרי קריאה למערכת החינוך שבנתה, ייסדה את הסתדרות "בנות אגודת ישראל", ונשאה דברים בכינוסי אגודת ישראל - בתקופה שבה אישה על בימה חרדית הייתה חריגה. כתביה נאספו לאחר מותה ב־1935 לכרך אחד, "אם בישראל".`,
        `היא עצמה דחתה כל הגדרה פמיניסטית, ותבעה את מה שהיה מגיע לה “על פי הזכויות שהתורה העניקה לנו”. בדיוק משום כך בחרנו בה ללוגו של נבחרות: אישה אחת, מן השוליים, שבנתה מוסד שכל החברה החרדית חיה בו עד היום. מנהיגות של נשים חרדיות איננה המצאה חדשה, היא הייתה כאן קודם.`,
      ],
      en: [
        `An educator, a Yiddish author and a playwright. Born in Krakow in 1883 to a Hasidic family, schooled in Polish, and as a young woman obliged to earn her living as a dressmaker. In 1917 she opened a class for girls in her home, and out of it grew Beit Yaakov, the first girls' education network in the Haredi world.`,
        `Education was only part of what she did. She wrote Yiddish plays for her students and reading material for the system she built, founded the Bnot Agudat Yisrael organisation, and spoke at Agudat Yisrael conventions, at a time when a woman on a Haredi public platform was an anomaly. Her writings were collected after her death in 1935 into a single volume, Em BeYisrael.`,
        `She herself rejected any feminist label, and claimed what was due to her “according to the rights the Torah granted us”. That is exactly why we chose her for the Nivcharot logo: one woman, an outsider, who built an institution the whole of Haredi society still lives in. Haredi women's leadership is not a new invention. It was here first.`,
      ],
    } satisfies Localized<string[]>,
    sources: {
      he: `מקורות: ערכי “שרה שנירר” בויקיפדיה ובהמכלול; נעמי זיידמן, “שרה שנירר ותנועת בית יעקב: מהפכה בשם המסורת”; ברנדה סוכצ׳בסקי־בקון, “מייסדת בית יעקב שהפכה להרבה יותר ממורה”, מקור ראשון, 12.7.2020.`,
      en: `Sources: the “Sarah Schenirer” entries in Hebrew Wikipedia and HaMichlol; Naomi Seidman, “Sarah Schenirer and the Bais Yaakov Movement: A Revolution in the Name of Tradition”; Brenda Socachevsky Bacon, Makor Rishon, 12 July 2020.`,
    } satisfies Localized,
    timelineLinkLabel: { he: `איך זה התחיל, ציר הזמן`, en: `How it began, the timeline` } satisfies Localized,
  },

  transparency: {
    eyebrow: { he: `שקיפות`, en: `Transparency` } satisfies Localized,
    bodyPrefix: {
      he: `נבחרות היא עמותה רשומה (580619120), הנתמכת בקרנות ובתורמים פרטיים בישראל ובחו"ל, בשיתוף מוסדות אקדמיים וגורמי חברה אזרחית. לדוחות ולפניות בנושא תמיכה:`,
      en: `Nivcharot is a registered Israeli NGO (580619120), supported by foundations and private donors in Israel and abroad, in partnership with academic and civil-society institutions. For reports and support inquiries:`,
    } satisfies Localized,
    email: `estish@nivcharot.com`,
  },

  team: {
    eyebrow: { he: `צוות`, en: `Team` } satisfies Localized,
    body: {
      he: `לצד אסתי פועלות מנהלות, מנחות ופעילות שטח, וקהילת בוגרות רחבה. הצוות המלא מופיע למעלה.`,
      en: `Alongside Esty work managers, facilitators and field activists, and a broad alumnae community. The full team is below.`,
    } satisfies Localized,
  },

  stats: {
    eyebrow: { he: `במספרים`, en: `By the numbers` } satisfies Localized,
    leadPrefix: {
      he: `הנתונים שמאחורי המאבק, מתוך ניירות העמדה שהגשנו ומתוך העתירות. לכל נתון מצוין המקור וגוף היעד שאליו הוגש; פרטים שטרם אומתו מסומנים ב`,
      en: `The figures behind the struggle, from the position papers we submitted and from the petitions. Each figure carries its source and the body it was submitted to; details not yet verified are marked with a`,
    } satisfies Localized,
    leadDotted: { he: `קו מקווקו`, en: `dotted underline` } satisfies Localized,
    leadSuffix: { he: `.`, en: `.` } satisfies Localized,
    tiles: [
      {
        value: 0,
        suffix: ``,
        label: { he: `נשים חרדיות שכיהנו בכנסת מאז 1948`, en: `Haredi women who have served in the Knesset since 1948` },
        sourcePrefix: {
          he: `נייר עמדה נבחרות, 2017 · הוגש לבג"ץ, לכנסת ולמשרדי ממשלה`,
          en: `Nivcharot position paper, 2017 · submitted to the Supreme Court, the Knesset and government ministries`,
        },
      },
      {
        value: 16,
        suffix: ``,
        label: { he: `חברי כנסת חרדים, כולם גברים`, en: `Haredi members of Knesset, all of them men` },
        sourcePrefix: { he: `אסתי שושן, 2021`, en: `Esty Shushan, 2021` },
        sourcePlaceholder: { he: `מקור הציטוט להשלמה`, en: `citation to be completed` },
      },
      {
        value: 30,
        suffix: `%`,
        label: { he: `פער השכר בין אישה חרדית לאישה ישראלית ממוצעת`, en: `Pay gap between a Haredi woman and an average Israeli woman` },
        sourcePrefix: {
          he: `מסמך נבחרות, "סיפורן של הסופרג'יסטיות האחרונות"`,
          en: `From "The story of the last suffragettes"`,
        },
      },
      {
        value: 79.5,
        suffix: `%`,
        decimals: 1,
        label: { he: `שיעור התעסוקה בקרב נשים חרדיות`, en: `Employment rate among Haredi women` },
        sourcePrefix: {
          he: `נייר עמדה נבחרות, 2017 · הוגש לבג"ץ, לכנסת ולמשרדי ממשלה`,
          en: `Nivcharot position paper, 2017 · submitted to the Supreme Court, the Knesset and government ministries`,
        },
      },
      {
        value: 6,
        suffix: `%`,
        label: { he: `חלקן של נשים חרדיות בחברה הישראלית`, en: `Haredi women's share of Israeli society` },
        sourcePrefix: { he: `הדר לינר, פרוטוקול דיון בכנסת, 2023`, en: `Hadar Leiner, Knesset committee 2023` },
        sourcePlaceholder: { he: `שם הוועדה להשלמה` },
      },
      {
        value: 7,
        suffix: ``,
        label: { he: `מתוך 114 מקלטים לנשים מיועדים למשפחות חרדיות`, en: `Of 114 women's shelters are designated for Haredi families` },
        sourcePrefix: { he: `נייר עמדה נבחרות, 2020`, en: `Nivcharot position paper, 2020` },
        sourcePlaceholder: { he: `יעד ההגשה להשלמה`, en: `recipient to be completed` },
      },
      {
        value: 22,
        suffix: ``,
        label: { he: `נשים שביקשו להצטרף למפלגות החרדיות וסורבו`, en: `Women who asked to join the Haredi parties and were refused` },
        sourcePrefix: { he: `מתוך העתירה לבג"ץ נגד ש"ס, 2022`, en: `From the Supreme Court petition against Shas, 2022` },
      },
      {
        value: 9,
        suffix: ``,
        label: {
          he: `מחזורים של "הנבחרת" מאז 2018, כ־20 אקטיביסטיות בכל מחזור`,
          en: `HaNivcheret cohorts since 2018, about 20 activists in each`,
        },
        sourcePrefix: { he: `נתוני תוכנית "הנבחרת", נבחרות`, en: `HaNivcheret program data, Nivcharot` },
      },
    ] satisfies AboutStatTile[],
  },

  facts: {
    eyebrow: { he: `נשים חרדיות בישראל, נתונים ועובדות`, en: `Ultra-orthodox women in Israel, facts and figures` } satisfies Localized,
    lead: {
      he: `התמונה שממנה יצאנו לדרך, מתוך מסמך נבחרות "סיפורן של הסופרג'יסטיות האחרונות".`,
      en: `The picture we set out from, as set out in Nivcharot’s document "The story of the last suffragettes".`,
    } satisfies Localized,
    items: [
      {
        he: `אין ייצוג בפוליטיקה המקומית והארצית.`,
        en: `No representation in municipal and national politics.`,
      },
      {
        he: `התרחבות נוהגי צניעות קיצוניים, כמו קווי אוטובוס ומדרכות מופרדים.`,
        en: `Rise of extreme modesty practices such as segregated buses and sidewalks.`,
      },
      {
        he: `ספרות ועיתונות ללא תמונות נשים וללא נוכחות נשית חזותית.`,
        en: `Literature and newspapers with no female visuals or women's pictures.`,
      },
      {
        he: `הקצאת משאבי חינוך לגברים חרדים בלבד.`,
        en: `Allocation of resources for education to ultra-orthodox men only.`,
      },
      {
        he: `אישה חרדית משתכרת 30% פחות מנשים במגזרים אחרים בישראל.`,
        en: `Chareidi women earn 30% less than women from other Israeli sectors.`,
      },
      {
        he: `שיעורי מוות גבוהים ממחלות כמו סרטן השד.`,
        en: `High mortality rate from illness such as breast cancer.`,
      },
      {
        he: `נשים, נערות וצעירות בסיכון גבוה יותר לפגיעה מינית.`,
        en: `Women, teenage and young girls at higher risk to sexual abuse.`,
      },
      {
        he: `שיעורי גירושין עולים ועימם מספר האמהות החד־הוריות.`,
        en: `Rising divorce rate and with it more single mothers.`,
      },
      {
        he: `התעלמות מוחלטת של הנציגים החרדים, כולם גברים, מסוגיות נשים ומגדר במוקדי קבלת ההחלטות.`,
        en: `A total disregard of Chareidi delegates, all male, of women's and gender issues in decision making centers.`,
      },
      {
        he: `נישואים בגיל צעיר, אמהות צעירה, פרנסה על כתפי האישה בתחומים רבים, אם למשפחה גדולה, ולצד זאת החמרה, הדרה ושלילת זכויות.`,
        en: `Early marriage, young motherhood, sole supporter in many professional areas, mother of a large family, alongside unending extremism, discrimination and deprivation of rights.`,
      },
    ] satisfies Localized[],
  },
}
