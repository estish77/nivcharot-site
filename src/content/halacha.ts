import type { Localized } from '@/lib/i18n'

/**
 * `/halacha` — a comparative overview of two halakhic works on whether a
 * woman may be appointed to, or elected to, public office.
 *
 * BILINGUAL AS OF 2026-08-29. This page used to render its Hebrew source
 * material as-is under both locales, so an English reader met an English
 * hero followed by ninety-odd lines of Hebrew. The analysis, the section
 * titles and the summaries are now translated.
 *
 * The quotations are translated too, but the page keeps each one's HEBREW
 * ORIGINAL visible underneath in the English locale. These are verbatim
 * citations from named poskim — Rambam, Tosafot, Igrot Moshe, Mishpetei
 * Uziel, Seridei Esh, Rav Kroizer — and a translation of a psak is an
 * interpretation of it. Showing the original alongside is the ordinary
 * scholarly convention and it means the English rendering can never be
 * mistaken for the ruling itself.
 *
 * Terminology: "serarah" is left transliterated rather than flattened to
 * "authority", because the whole argument turns on its precise halakhic
 * scope — which of "kingship", "coercive power" and "an inherited office"
 * it does and doesn't cover.
 */

export const halachaHero: { eyebrow: Localized; title: Localized; lead: Localized } = {
  eyebrow: { he: 'הלכה', en: 'HALAKHA' },
  title: {
    he: 'בחירת נשים למשרות ציבוריות: סקירה הלכתית',
    en: 'Women in public office: a halakhic overview',
  },
  lead: {
    he: 'שני חיבורים הלכתיים, שנכתבו במרחק כעשור זה מזה ובידי שני כותבים שונים, דנים בשאלה האם קיים איסור הלכתי במינוי או בבחירת אישה למשרה ציבורית, ומגיעים למסקנה דומה במידה ניכרת.',
    en: 'Two halakhic works, written about a decade apart by two different authors, examine whether Jewish law forbids appointing or electing a woman to public office, and reach a largely similar conclusion.',
  },
}

export type HalachaSource = 'kroizer' | 'pamphlet2015'

export const halachaSourceMeta: Record<HalachaSource, { name: Localized; full: Localized }> = {
  kroizer: {
    name: { he: 'הרב קרויזר', en: 'Rabbi Kroizer' },
    full: {
      he: 'הרב רפאל קרויזר, בדין בחירת נשים לכהן כחברות כנסת, י"ח תמוז תשפ"ה',
      en: 'Rabbi Refael Kroizer, On the Election of Women to Serve as Members of Knesset, 18 Tammuz 5785',
    },
  },
  pamphlet2015: {
    name: { he: 'הקונטרס (תשע"ה)', en: 'The kuntres (5775)' },
    full: {
      he: 'קונטרס בירור הלכתי בעניין בחירת נשים למשרות ציבוריות, טבת תשע"ה',
      en: 'A Halakhic Clarification Concerning the Election of Women to Public Office, Tevet 5775',
    },
  },
}

export type HalachaQuote = {
  text: Localized
  source: HalachaSource
  attribution: Localized
}

export type HalachaSection = {
  id: string
  letter: Localized
  title: Localized
  intro?: Localized<string[]>
  quotes?: HalachaQuote[]
  closing?: Localized<string[]>
}

export const halachaIntro: Localized<string[]> = {
  he: [
    'השאלה ההלכתית העומדת ביסוד שני החיבורים היא אחת: האם קיים איסור הלכתי במינוי או בבחירת אישה למשרה ציבורית, כגון חברת כנסת, דירקטורית בחברה ציבורית, מנהלת מוסד וכיוצא באלה. שני החיבורים דנים בשאלה כל אחד בדרכו, אך מגיעים למסקנה דומה במידה ניכרת: אין איסור הלכתי גורף במינוי נשים למשרות מהסוג הזה, ובמקרים רבים אף יש לעודד זאת.',
    '"קונטרס בירור הלכתי בעניין בחירת נשים למשרות ציבוריות" (טבת תשע"ה) נכתב בידי רב שביקש לשמור על עילום שמו, ודן בשאלה באופן רחב; לצדו מצורף קטע נפרד של תשובות שקיבל המחבר בעל פה ובכתב ממרן הגר"ח קניבסקי זצ"ל. תשובתו של הרב רפאל קרויזר (י"ח תמוז תשפ"ה), "בדין בחירת נשים לכהן כחברות כנסת", ממוקדת יותר בשאלת חברות הכנסת, ובנויה כתשובה הלכתית מסודרת בשמונה סימנים.',
  ],
  en: [
    'One halakhic question stands at the base of both works: is there a halakhic prohibition on appointing or electing a woman to public office — a member of Knesset, a director of a public company, the head of an institution, and the like. Each work approaches the question in its own way, but they arrive at a largely similar conclusion: there is no sweeping halakhic prohibition on appointing women to offices of this kind, and in many cases it should even be encouraged.',
    '"A Halakhic Clarification Concerning the Election of Women to Public Office" (Tevet 5775) was written by a rabbi who chose to remain anonymous, and treats the question broadly; appended to it is a separate section of answers the author received, orally and in writing, from Rabbi Chaim Kanievsky zt"l. Rabbi Refael Kroizer\'s responsum (18 Tammuz 5785), "On the Election of Women to Serve as Members of Knesset", is focused more narrowly on membership of the Knesset, and is built as an ordered halakhic responsum in eight sections.',
  ],
}

export const halachaSections: HalachaSection[] = [
  {
    id: 'source',
    letter: { he: 'א', en: 'A' },
    title: {
      he: 'מקור האיסור ומידת קבלתו להלכה',
      en: 'The source of the prohibition, and how far it was accepted as law',
    },
    intro: {
      he: [
        'שני החיבורים פותחים מאותה נקודת מוצא: פסיקת הרמב"ם (הלכות מלכים פ"א ה"ה): "אין מעמידין אשה במלכות, שנאמר: עליך מלך ולא מלכה. וכן כל משימות שבישראל אין ממנים בהם אלא איש". מקורה בספרי (דברים פרשת שופטים). שני הכותבים תוהים מהו מקורו של הרמב"ם להרחיב את האיסור מ"מלכות" בלבד אל "כל משימות שבישראל", ומציינים שהדבר אינו מוסכם על כלל הראשונים.',
      ],
      en: [
        'Both works open from the same starting point: the Rambam\'s ruling (Laws of Kings 1:5): "A woman is not appointed to kingship, as it says: \'set a king over you\' — a king and not a queen. And likewise all appointments in Israel are filled only by a man." Its source is the Sifrei (Deuteronomy, Shoftim). Both authors ask what the Rambam\'s source is for extending the prohibition from "kingship" alone to "all appointments in Israel", and note that this is not agreed upon by all the Rishonim.',
      ],
    },
    quotes: [
      {
        text: {
          he: 'רבים תמהו מהו מקור הרמב"ם להלכה זו, ואף מגדולי הראשונים חלקו על הרמב"ם (רש"י, תוס\', הרא"ש, הר"ן, הרמב"ן ולדעת הגאון ר\' משה פיינשטיין גם הרשב"א, עיין שו"ת אגרות משה יורה דעה חלק ב סימן מה).',
          en: 'Many have wondered what the Rambam\'s source for this ruling is, and leading Rishonim disagreed with him (Rashi, Tosafot, the Rosh, the Ran, the Ramban — and in the view of Rabbi Moshe Feinstein, the Rashba as well; see Responsa Igrot Moshe, Yoreh De\'ah II:45).',
        },
        source: 'pamphlet2015',
        attribution: {
          he: 'קונטרס בחירת נשים למשרות ציבוריות',
          en: 'Kuntres on the election of women to public office',
        },
      },
      {
        text: {
          he: 'וביותר נראה להוכיח שדין זה אינו מוסכם להלכה שהרי הטור ושולחן ערוך ורמ"א השמיטו דין זה, ואם הוא נוהג בכל השררות הרי הוא נוהג בזמן הזה ונראה מהשמטתם שסבירי להו שאין זה אלא דין במלך ולא בשאר שררות.',
          en: 'It appears still more strongly that this ruling was not accepted as law, since the Tur, the Shulchan Aruch and the Rema all omitted it. Were it to apply to every position of serarah it would apply in our own time as well, and their omission suggests they held it to be a law concerning a king alone and not other positions of serarah.',
        },
        source: 'kroizer',
        attribution: {
          he: 'הרב רפאל קרויזר, בדין בחירת נשים לכהן כחברות כנסת, אות ב',
          en: 'Rabbi Refael Kroizer, On the Election of Women to Serve as Members of Knesset, §B',
        },
      },
    ],
  },
  {
    id: 'minui-kabala',
    letter: { he: 'ב', en: 'B' },
    title: {
      he: '"מינוי" מול "קבלה": האם לבחירה דמוקרטית יש דין שררה',
      en: '"Appointment" versus "acceptance": does a democratic election carry the status of serarah',
    },
    intro: {
      he: [
        'זהו ציר המחלוקת המרכזי שבו שני החיבורים נפגשים ומחזקים זה את זה, אף שכל אחד מגיע אליו מכיוון מקורות שונה במקצת. הקונטרס נשען בעיקר על חילוקו של הרב מאיר עוזיאל בין מינוי (הטלת סמכות מלמעלה) לבין קבלה (הסכמת הציבור הבוחר). הרב קרויזר מגיע לאותה תוצאה דרך תוספות במסכת יבמות, המגדירים "שררה" כתלויה בכוח כפייה.',
      ],
      en: [
        'This is the central axis on which the two works meet and reinforce one another, though each reaches it from a slightly different set of sources. The kuntres rests mainly on Rabbi Meir Uziel\'s distinction between appointment (authority imposed from above) and acceptance (the consent of the electing public). Rabbi Kroizer reaches the same result by way of Tosafot in tractate Yevamot, which define "serarah" as contingent on coercive power.',
      ],
    },
    quotes: [
      {
        text: {
          he: 'קבלה, שעל ידי הבחירות מכריע רוב הקהל את דעתו הסכמתו ואמונו לאותם הנבחרים, שהם יהיו באי כחו לפקח על כל עניניהם הצבוריים, ועל זה אפילו הרמב"ם מודה שאין כאן שום שמץ של אסור.',
          en: 'Acceptance — whereby through the elections the majority of the public gives its judgement, its consent and its trust to those elected, so that they act as its representatives in overseeing all its public affairs. On this even the Rambam concedes that there is not the slightest trace of a prohibition.',
        },
        source: 'pamphlet2015',
        attribution: {
          he: 'שו"ת משפטי עוזיאל, חלק ד, חושן משפט סימן ו, מובא בקונטרס',
          en: 'Responsa Mishpetei Uziel IV, Choshen Mishpat §6, cited in the kuntres',
        },
      },
      {
        text: {
          he: 'חבר הכנסת איננו מביע את דעתו האישית, אלא את דעת גדולי הדור ומוריו ואת רצונם... תפקיד חברות בכנסת הוא למלאות את רצון הציבור ולא להפעיל את סמכותן. שאלה של שררה אין במינוי הפסיבי.',
          en: 'A member of Knesset does not express a personal opinion, but the view and the will of the leading rabbis of the generation and of their teachers... The role of women members of Knesset is to carry out the will of the public, not to exercise authority of their own. No question of serarah arises in passive election.',
        },
        source: 'pamphlet2015',
        attribution: {
          he: 'קונטרס בחירת נשים למשרות ציבוריות, בשם הרב עוזיאל',
          en: 'Kuntres on the election of women to public office, in the name of Rabbi Uziel',
        },
      },
      {
        text: {
          he: 'דלא שייכא שימה ודבר של שררה דכתיב שום תשים עליך מלך (דברים יז) אלא בכפייה... ולפי זה יש לדון כיוון שחבר כנסת אין לו כוח כפייה שכוח הכפייה אינו אלא לבית הדין ולמלך... אבל חבר כנסת כיוון שאינו בכלל כפייה אינו בכלל כל משימות שאתה משים... והוא הדין למינוי אשה.',
          en: 'Appointment and matters of serarah — as it is written, "you shall surely set a king over you" (Deuteronomy 17) — apply only where there is coercion... On this basis one may argue that since a member of Knesset holds no coercive power, coercive power belonging only to the court and to the king... a member of Knesset, not falling under coercion, does not fall under "all appointments that you make"... and the same applies to appointing a woman.',
        },
        source: 'kroizer',
        attribution: {
          he: 'תוספות, יבמות קא ע"ב, כמובא בתשובת הרב קרויזר, אות ד',
          en: 'Tosafot, Yevamot 101b, as cited in Rabbi Kroizer\'s responsum, §D',
        },
      },
      {
        text: {
          he: 'אף להרמב"ם הסובר שאין למנות אשה לשאר שררות, הרי גדר שררה הוא שיכול לצוות על אחרים לעשות רצונו ואינו כפוף להם, ולפי זה חברת כנסת כיוון שכפופה לרצון הבוחרים וצריכה לפעול לפי הסמכות שנתנו לה הבוחרים ואין לה כח שררה לצוות על אחרים הרי אין זה בכלל שררות.',
          en: 'Even according to the Rambam, who holds that a woman may not be appointed to other positions of serarah, the definition of serarah is one who can command others to carry out his will and is not subordinate to them. On this basis, a woman member of Knesset — being subordinate to the will of the voters, obliged to act within the authority the voters gave her, and holding no power of serarah to command others — does not fall within the category of serarah at all.',
        },
        source: 'kroizer',
        attribution: {
          he: 'שו"ת אגרות משה, יורה דעה חלק ב סימן מד, כמובא בתשובת הרב קרויזר',
          en: 'Responsa Igrot Moshe, Yoreh De\'ah II:44, as cited in Rabbi Kroizer\'s responsum',
        },
      },
    ],
  },
  {
    id: 'yerusha',
    letter: { he: 'ג', en: 'C' },
    title: {
      he: 'שררה כמעמד העובר בירושה: תוספת מיוחדת בתשובת הרב קרויזר',
      en: 'Serarah as an inherited status: a distinctive addition in Rabbi Kroizer\'s responsum',
    },
    intro: {
      he: [
        'הרב קרויזר מוסיף יסוד עצמאי, המבוסס על שיטת הגר"ש ישראלי (שו"ת חוות בנימין סימן יב), ולפיו "שררה" במובנה ההלכתי הקלאסי היא מעמד העובר בירושה דווקא, ומסיק מכך במפורש לגבי חברות כנסת.',
      ],
      en: [
        'Rabbi Kroizer adds an independent element, resting on the position of Rabbi Shaul Yisraeli (Responsa Chavot Binyamin §12), according to which "serarah" in its classical halakhic sense is specifically a status passed on by inheritance — and he draws an explicit conclusion from this regarding women members of Knesset.',
      ],
    },
    quotes: [
      {
        text: {
          he: 'מלכות – פירושה הקניית מעמד של זרע המלוכה למשפחה זו. שמשום כך כשמת המלך, ממלא מקומו אחר מבני המשפחה הזאת, ולא זולתה... רק זו שעוברת בירושה תורת שררה עליה... מינוי שאינו בירושה, מכל שכן שאינו אלא לזמן מוגבל, וניתן גם לסילוק ברצון הציבור, אינו בכלל זה.',
          en: 'Kingship means conferring on a particular family the standing of royal lineage. That is why, when the king dies, another of that family — and no one else — takes his place... Only a position passed on by inheritance carries the law of serarah... An appointment that is not inherited, all the more so one that runs for a limited term and can be removed at the will of the public, is not included in it.',
        },
        source: 'kroizer',
        attribution: {
          he: 'הגר"ש ישראלי, שו"ת חוות בנימין סימן יב, כמובא בתשובת הרב קרויזר, אות ד',
          en: 'Rabbi Shaul Yisraeli, Responsa Chavot Binyamin §12, as cited in Rabbi Kroizer\'s responsum, §D',
        },
      },
      {
        text: {
          he: 'הוא הדין במינוי נשים לחברות כנסת שאינו דומה כלל לשררה, הן מחמת שאין זה עובר בירושה ואם כן אינו דומה לשררות ולמינויים שבהם אין למנות נשים. ועוד שכל גדר נבחרי ציבור כחברי כנסת שאינם בעלי שררה ויכולת אלא משועבדים לרצון הציבור.',
          en: 'The same applies to appointing women as members of Knesset, which bears no resemblance to serarah at all — both because it is not passed on by inheritance, and so is unlike those positions and appointments to which women are not appointed; and further, because the whole category of public representatives such as members of Knesset is one of people who hold no serarah or power of their own but are bound to the will of the public.',
        },
        source: 'kroizer',
        attribution: {
          he: 'הרב רפאל קרויזר, בדין בחירת נשים לכהן כחברות כנסת, אות ד',
          en: 'Rabbi Refael Kroizer, On the Election of Women to Serve as Members of Knesset, §D',
        },
      },
    ],
    closing: {
      he: [
        'לכך מצרף הרב קרויזר גם את דברי הגר"מ שטרנבוך (תשובות והנהגות א, סימן תתלח; ג, סימן שה), שתפקיד שאינו עובר בירושה ואינו "מינוי של כבוד" (כגון ניהול מוסד) אינו בכלל שררה, ולכן מותר למנות לו גם אשה או גר.',
      ],
      en: [
        'To this Rabbi Kroizer adds the words of Rabbi Moshe Sternbuch (Teshuvot veHanhagot I §838; III §305), that a role which is not inherited and is not "an appointment of honour" — running an institution, for instance — is not included in serarah, and so a woman or a convert may be appointed to it.',
      ],
    },
  },
  {
    id: 'gabai',
    letter: { he: 'ד', en: 'D' },
    title: {
      he: 'מודל הגבאי: קבלת הציבור וצירוף עם אחרים',
      en: 'The gabbai model: public acceptance, and acting together with others',
    },
    intro: {
      he: [
        'שני החיבורים נעזרים באותו מקבץ מקורות: הירושלמי (קידושין פ"ד ה"ה), המאירי, הכנסת הגדולה והתומים, הדנים בכשרות מינוי גר לגבאי צדקה חרף הדרישה "מקרב אחיך", ומיישמים את ההיתר גם לענייננו.',
      ],
      en: [
        'Both works draw on the same cluster of sources: the Jerusalem Talmud (Kiddushin 4:5), the Meiri, the Knesset HaGedolah and the Tumim, which discuss the validity of appointing a convert as a gabbai of charity despite the requirement "from among your brethren", and they apply that permission to our question as well.',
      ],
    },
    quotes: [
      {
        text: {
          he: 'גם חבר כנסת אינו פועל יחידי אלא הוא חלק מן הרוב בכנסת שיכולים לפעול בכוח הציבור ואין לכל אחד ואחד מהם זכות לפעול לבדו אלא רק מכוח הרוב, ואם כן יש לצרף גם שיטת המאירי הנ"ל וכפי שהביא מרן הגר"ע יוסף.',
          en: 'A member of Knesset likewise does not act alone but as part of the majority in the Knesset, which can act with the power of the public; no individual among them has the right to act on their own, only by force of the majority. Accordingly, the position of the Meiri cited above may also be brought to bear, as Rabbi Ovadia Yosef adduced it.',
        },
        source: 'pamphlet2015',
        attribution: {
          he: 'קונטרס בחירת נשים למשרות ציבוריות',
          en: 'Kuntres on the election of women to public office',
        },
      },
      {
        text: {
          he: 'כן היה מנהג קהילות ישראל למנות נשים כגבאיות צדקה, כמו שמסופר המעשה על אשת רבינו הגר"א שהייתה גבאית צדקה, והביא מעשה זה הגראמ"ש שך במכתבים ומאמרים... וכן במצבות עתיקות נמצא כינוי שבח לאשה שהייתה גבאית צדקה.',
          en: 'It was likewise the practice of Jewish communities to appoint women as gabba\'ot of charity, as is recounted of the wife of the Vilna Gaon, who was a gabbait of charity — an account Rabbi Elazar Menachem Man Shach brought in Michtavim uMa\'amarim... and on old gravestones one finds a woman praised with the title of gabbait of charity.',
        },
        source: 'kroizer',
        attribution: {
          he: 'הרב רפאל קרויזר, בדין בחירת נשים לכהן כחברות כנסת, אות ה',
          en: 'Rabbi Refael Kroizer, On the Election of Women to Serve as Members of Knesset, §E',
        },
      },
    ],
  },
  {
    id: 'zman-yavo',
    letter: { he: 'ה', en: 'E' },
    title: {
      he: '"הזמן יבוא ויכריע": מהרב וינברג ועד ימינו',
      en: '"The time will come and decide": from Rabbi Weinberg to the present',
    },
    intro: {
      he: [
        'הקונטרס פותח בהצגת תשובתו הידועה של הגרי"י וינברג (שרידי אש) מחנוכה תשי"א, שנמנע מהכרעה בשאלת בחירת נשים ולהיבחרותן, והציג שלוש שיטות: יש האוסרים, יש שהתיר לבחור ולהיבחר (הרב מאיר עוזיאל), ויש מי שהתיר לבחור ואסר להיבחר (הגרד"צ הופמן), וכך נהגו.',
      ],
      en: [
        'The kuntres opens by presenting the well-known responsum of Rabbi Yechiel Yaakov Weinberg (Seridei Esh) from Chanukah 5711, which declined to rule on women voting and standing for election and set out three positions: some prohibit; some permitted both voting and standing (Rabbi Meir Uziel); and some permitted voting but forbade standing (Rabbi David Zvi Hoffmann), which is how people acted in practice.',
      ],
    },
    quotes: [
      {
        text: {
          he: 'השואל רצה לדעת אם מותר לנשים לבחור ולהיבחר. הרב וינברג ענה לו תשובה קצרה שאין הכרעה בצידה... שלוש שיטות בדבר... אלא שהגרי"י וינברג לא חפץ להכריע והותיר את הדבר שיוכרע ביום מן הימים.',
          en: 'The questioner wished to know whether women may vote and stand for election. Rabbi Weinberg gave him a brief answer carrying no ruling... three positions on the matter... but Rabbi Weinberg did not wish to decide, and left the matter to be decided one day.',
        },
        source: 'pamphlet2015',
        attribution: {
          he: 'שו"ת שרידי אש חלק א סימן קלט וקנו, כמובא בקונטרס',
          en: 'Responsa Seridei Esh I §139 and §156, as cited in the kuntres',
        },
      },
      {
        text: {
          he: 'השאלה היא אם לא הגיע הזמן לשוב ולדון אם נוכל להתיר לנשים אף להיבחר.',
          en: 'The question is whether the time has not come to take the matter up again, and to ask whether we may permit women to stand for election as well.',
        },
        source: 'pamphlet2015',
        attribution: {
          he: 'קונטרס בחירת נשים למשרות ציבוריות',
          en: 'Kuntres on the election of women to public office',
        },
      },
    ],
    closing: {
      he: [
        'תשובת הרב קרויזר אינה עוסקת בפולמוס וינברג–עוזיאל במישרין, אך מגיעה למעשה לאותה עמדה מהצד ההלכתי-עקרוני.',
      ],
      en: [
        'Rabbi Kroizer\'s responsum does not address the Weinberg–Uziel debate directly, but in practice arrives at the same position on the level of halakhic principle.',
      ],
    },
  },
  {
    id: 'tzniut',
    letter: { he: 'ו', en: 'F' },
    title: { he: 'שיקול הצניעות', en: 'The consideration of modesty' },
    intro: {
      he: [
        'הקונטרס מקדיש לכך פרק שלם, ומביא את קביעתו העקרונית של הרב עוזיאל שדיני צניעות תלויים בזמן ובמקום, ושאין בעצם המפגש הענייני בין המינים משום פריצות. הרב קרויזר, המתמקד יותר בשאלת השררה, נוגע בשיקול הצניעות רק לקראת הסיום, אך דווקא כטיעון מסייע.',
      ],
      en: [
        'The kuntres devotes a full chapter to this, citing Rabbi Uziel\'s principle that the laws of modesty depend on time and place, and that a businesslike encounter between the sexes is not in itself immodesty. Rabbi Kroizer, more focused on the question of serarah, turns to modesty only towards the end — and there as an argument in support.',
      ],
    },
    quotes: [
      {
        text: {
          he: 'הסברא נותנת לומר דבכל כנסיה רצינית ושיחה מועילה אין בה משום פריצות, וכל יום ויום האנשים נפגשים עם הנשים במשא ומתן מסחרי, ונושאים ונותנים, ובכל זאת אין שום פרץ ושום צוחה. ואפילו היותר פרוצים בעריות, לא יהרהרו באיסור בשעה שעוסקים ברצינות במסחרם.',
          en: 'Reason dictates that in any serious assembly and constructive discussion there is no immodesty. Day after day men meet women in commercial dealings and negotiate with them, and still there is no breach and no outcry. Even the most licentious have no forbidden thoughts while they are seriously engaged in their business.',
        },
        source: 'pamphlet2015',
        attribution: {
          he: 'שו"ת משפטי עוזיאל, כמובא בקונטרס',
          en: 'Responsa Mishpetei Uziel, as cited in the kuntres',
        },
      },
      {
        text: {
          he: 'אפשר שיש בבחירת נשים לתפקידים אלו השפעה על עזרה לנשים וצרכיהן... ומדרכי הצניעות יהיה להן אוזן קשבת אצל חברות כנסת ולא יצטרכו לבוא בקשר עם ממונים גברים ויכול להיות בזה תועלת מרובה.',
          en: 'It may be that electing women to these roles bears on help for women and their needs... and it would be more in keeping with modesty for them to find a listening ear with women members of Knesset, without having to approach male officials — and there may be great benefit in this.',
        },
        source: 'kroizer',
        attribution: {
          he: 'הרב רפאל קרויזר, בדין בחירת נשים לכהן כחברות כנסת, אות ח',
          en: 'Rabbi Refael Kroizer, On the Election of Women to Serve as Members of Knesset, §H',
        },
      },
    ],
  },
  {
    id: 'kanievsky',
    letter: { he: 'ז', en: 'G' },
    title: {
      he: 'תשובות הגר"ח קניבסקי (מצורפות לקונטרס)',
      en: 'The answers of Rabbi Chaim Kanievsky (appended to the kuntres)',
    },
    intro: {
      he: [
        'בצד הקונטרס מביא מחברו תשובות שקיבל בעל פה ובכתב ממרן הגר"ח קניבסקי זצ"ל, בעניין מינוי נשים לדירקטוריון ומינויים ציבוריים דומים:',
      ],
      en: [
        'Alongside the kuntres its author brings answers he received, orally and in writing, from Rabbi Chaim Kanievsky zt"l, concerning the appointment of women to boards of directors and similar public appointments:',
      ],
    },
    quotes: [
      {
        text: {
          he: 'לשאלה כיצד ממנים נשים למנהלות בתי ספר וכדומה, השיב: "מה ששייך לנשים מותר". לשאלה בדבר מינוי אשה לחברת דירקטוריון, השיב: "כנ"ל". לשאלה מדוע השולחן ערוך מזכיר את איסור מינוי גרים לשררות ומשימות ואינו מזכיר איסור מקביל לגבי נשים, השיב: "הוא פשוט".',
          en: 'Asked how women are appointed as school principals and the like, he answered: "What pertains to women is permitted." Asked about appointing a woman to a board of directors, he answered: "The same as above." Asked why the Shulchan Aruch mentions the prohibition on appointing converts to positions of serarah and to appointments, yet mentions no parallel prohibition regarding women, he answered: "It is obvious."',
        },
        source: 'pamphlet2015',
        attribution: {
          he: 'תשובות שנתקבלו מאת הגר"ח קניבסקי שליט"א, מצורפות לקונטרס',
          en: 'Answers received from Rabbi Chaim Kanievsky, appended to the kuntres',
        },
      },
    ],
    closing: {
      he: [
        'הקונטרס מציין כי תשובות אלה, אף שניתנו בקיצור, מתיישבות היטב עם המסקנה העקרונית שהוא מפתח מתוך המקורות.',
      ],
      en: [
        'The kuntres notes that these answers, brief as they are, sit well with the conclusion in principle that it develops from the sources.',
      ],
    },
  },
  {
    id: 'sikum',
    letter: { he: 'ח', en: 'H' },
    title: { he: 'סיכומי שני הכותבים', en: 'The two authors\' conclusions' },
    intro: {
      he: ['תשובת הרב קרויזר מסתיימת בסיכום מפורש, המונה חמישה טעמים מצטברים להיתר:'],
      en: ['Rabbi Kroizer\'s responsum closes with an explicit summary, listing five cumulative grounds for permitting it:'],
    },
    quotes: [
      {
        text: {
          he: '1. השולחן ערוך והרמ"א לא הביאו להלכה את איסור מינוי נשים למשרות ציבוריות, וכמה ראשונים סוברים שאין בזה מניעה כלל. 2. במינוי שאין בו כוח כפייה אין מניעה אף לשיטת הרמב"ם, וכן בתפקיד שאינו "מינוי של כבוד ושררה" אלא עבודה לתועלת הציבור. 3. קבלת הרבים מכשירה מינוי, כשם שהוכשר מינוי גרים. 4. מינוי שאינו עובר בירושה אינו בכלל שררה. 5. כאשר המינוי אינו לבדו אלא בצירוף עם אחרים אין מניעה.',
          en: '1. The Shulchan Aruch and the Rema did not bring the prohibition on appointing women to public office as law, and several Rishonim hold there is no impediment in it at all. 2. In an appointment carrying no coercive power there is no impediment even according to the Rambam, and likewise in a role that is not "an appointment of honour and serarah" but work for the public benefit. 3. Acceptance by the public validates an appointment, just as it validated the appointment of converts. 4. An appointment that is not passed on by inheritance is not included in serarah. 5. Where the appointee does not act alone but together with others, there is no impediment.',
        },
        source: 'kroizer',
        attribution: {
          he: 'הרב רפאל קרויזר, בדין בחירת נשים לכהן כחברות כנסת, אות ח',
          en: 'Rabbi Refael Kroizer, On the Election of Women to Serve as Members of Knesset, §H',
        },
      },
      {
        text: {
          he: 'בסיכום, נראה שהגיעה השעה להתיר את בחירת הנשים הפסיבית... שאלה של שררה אין במינוי חברת כנסת שכן תפקיד חברות בכנסת הוא למלאות את רצון הציבור ולא להפעיל את סמכותן... ואם הדבר יגרום להגברת כוח התורה בארצנו, אסור למנוע את בחירתן.',
          en: 'In sum, it appears that the time has come to permit the passive election of women... No question of serarah arises in appointing a woman member of Knesset, since the role of women members of Knesset is to carry out the will of the public and not to exercise authority of their own... and if it will strengthen the standing of Torah in our land, it is forbidden to prevent their election.',
        },
        source: 'pamphlet2015',
        attribution: {
          he: 'קונטרס בחירת נשים למשרות ציבוריות, סיום',
          en: 'Kuntres on the election of women to public office, closing',
        },
      },
    ],
  },
  {
    id: 'meeting-points',
    letter: { he: 'ט', en: 'I' },
    title: { he: 'נקודות ההשקה: תמונה משותפת', en: 'Where they meet: a shared picture' },
    intro: {
      he: [
        'אף שנכתבו בידי שני מחברים שונים, בהפרש של כעשור, שני החיבורים בנויים על אותו שלד הלכתי וכמעט אותו מאגר מקורות (רמב"ם, ספרי, תוספות ביבמות, הר"ן, המאירי, אגרות משה, ותיעוד המנהג ההיסטורי של גבאיות צדקה). עיקרי ההשקה:',
      ],
      en: [
        'Though written by two different authors about a decade apart, both works are built on the same halakhic skeleton and very nearly the same body of sources (Rambam, Sifrei, Tosafot in Yevamot, the Ran, the Meiri, Igrot Moshe, and the historical record of women serving as gabba\'ot of charity). The main points where they meet:',
      ],
    },
    closing: {
      he: [
        '1. פסיקת הרמב"ם האוסרת מינוי אשה לכל "משימות שבישראל" אינה מוסכמת: הטור, השולחן ערוך והרמ"א השמיטוה, וראשונים רבים חלוקים עליה.',
        '2. גם למאן דאמר כרמב"ם, "שררה" האסורה היא סמכות כפייה עצמאית שאינה כפופה לרצון אחרים, ותפקיד נבחר הכפוף לרצון הציבור אינו "שררה" במובן זה.',
        '3. "שררה" במובנה הקלאסי היא מעמד העובר בירושה; תפקיד נבחר, מוגבל בזמן וניתן לביטול על ידי הציבור, אינו נכלל בגדר זה.',
        '4. קבלת הציבור ("קבלוה עליהם") מכשירה מינוי שבלעדיה היה מוטל בספק, במיוחד כשהממונה פועל בצירוף אחרים ולא לבדו.',
        '5. שיקולים מעשיים, כגון מניעת בחירת מועמדים בלתי ראויים במקום מועמדות כשרות, חיזוק כוח התורה, ומניעת חילול השם, נוטים אף הם לכף ההיתר.',
        'שני הכותבים שומרים עם זאת על גוון זהיר ומודע: הקונטרס ממליץ ללכת בעניין זה "על פי הוראות רבותנו", ותשובת הרב קרויזר חותמת בהמלצה לפעול "לאחר הימלכות בגדולי ישראל והוראתם". ההיתר העקרוני מוצג לצד קריאה מפורשת להכרעה מעשית בידי גדולי הדור בכל מקרה נתון.',
      ],
      en: [
        '1. The Rambam\'s ruling forbidding the appointment of a woman to any "appointment in Israel" is not agreed upon: the Tur, the Shulchan Aruch and the Rema omitted it, and many Rishonim differ with it.',
        '2. Even for those who rule with the Rambam, the serarah that is forbidden is independent coercive authority not subject to the will of others; an elected role that is subject to the will of the public is not "serarah" in that sense.',
        '3. "Serarah" in its classical sense is a status passed on by inheritance; an elected role, limited in time and revocable by the public, does not fall within that definition.',
        '4. Acceptance by the public ("they accepted it upon themselves") validates an appointment that would otherwise be in doubt, particularly where the appointee acts together with others rather than alone.',
        '5. Practical considerations — preventing unsuitable candidates from being elected in place of fit ones, strengthening the standing of Torah, and avoiding desecration of God\'s name — also weigh towards permitting it.',
        'Both authors nevertheless keep a careful and self-aware tone: the kuntres recommends proceeding in this matter "according to the instruction of our teachers", and Rabbi Kroizer\'s responsum closes by recommending that one act "after consulting the leading rabbis of Israel and following their instruction". The permission in principle is presented alongside an explicit call for the practical decision to rest with the leading rabbis of the generation in each given case.',
      ],
    },
  },
]
