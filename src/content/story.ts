import type { Localized } from '@/lib/i18n'

/**
 * Typed fixture data for the Story page (`docs/Story.dc.html`) — the
 * 2012→2026 timeline, shaped to match the `timeline-milestones` Payload
 * collection (see `src/payload/collections`): a localized `year`/`title`/
 * `body` per milestone plus a localized `visible` checkbox.
 *
 * CRITICAL asymmetry (by design, not a bug): the Hebrew mockup carries 21
 * milestones; the English mockup shows only 14. The 7 Hebrew-only entries
 * (ids marked `visible.en: false` below) have no standalone English
 * paragraph in the mockup — two of them (`2020-23-widening` and
 * `2024-podcast`) have their content folded into a *different* milestone's
 * English body by the mockup's own translator (see the comments on those
 * two). For the other five, the `en` text below is my own faithful
 * translation of the Hebrew, kept only so the field is never empty —
 * it is not shown anywhere while `visible.en` is false.
 */
export type TimelineExternalArticle = {
  label: Localized<string>
  outlet: string
  url: string
}

export type TimelineMilestone = {
  id: string
  year: Localized<string>
  title: Localized<string>
  body: Localized<string>
  visible: Localized<boolean>
  /**
   * Optional press-clipping links from the same period (site owner brief,
   * 2026-08-13, item 24) — real, dated articles, not invented citations.
   * Rendered as a small "as covered by" row under the milestone body.
   */
  externalArticles?: TimelineExternalArticle[]
}

/**
 * Declared oldest-first (matches how each entry references "the previous
 * one"/reads as a narrative) — `timelineMilestones` below is the reversed,
 * newest-first order the page actually renders (2026-08-13 brief, item 20:
 * "flip the timeline from new to old").
 */
const timelineMilestonesChronological: TimelineMilestone[] = [
  {
    id: `origins`,
    year: { he: `רקע`, en: `Origins` },
    title: { he: `המאבק על זכות הבחירה בישראל`, en: `The struggle over suffrage in Israel` },
    body: {
      he: `בימים בהם עוצבו מוסדותיה האזרחיים של מדינת ישראל ניטש מאבק מר על זכות הבחירה לנשים. המדינה קמה עם זכות בחירה לנשים, אך קבוצה אחת קיבלה את הזכות לבחור בעוד הזכות להיבחר נשללה ממנה באופן מוסדר בתקנוני המפלגות: נשים חרדיות.`,
      en: `When Israel's civic institutions were formed, a bitter battle was fought over women's right to vote. The state was founded with women's suffrage, but one group received the right to vote while the right to be elected was formally denied to it in party bylaws: Haredi women.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `1-2012`,
    year: { he: `2012`, en: `2012` },
    title: { he: `תחילת ימי המאבק לייצוג`, en: `The struggle for representation begins` },
    body: {
      he: `על רקע הקצנה בצניעות, שחיקת מעמדן של נשים חרדיות ופגיעות שלא זכו למענה מההנהגה הפוליטית, בשלהי 2012, חודשים לפני הבחירות לכנסת ה־19, אסתי שושן, עיתונאית ופרסומאית חרדית, פותחת דף פייסבוק בשם "לא נבחרות, לא בוחרות" ובו היא קוראת לנשים חרדיות לא להצביע למפלגות שלא מאפשרות לנשים להיות בהן.`,
      en: `Months before the 19th Knesset elections, Esty Shushan, a Haredi journalist and copywriter, opens a Facebook page called "No Voice, No Vote", calling on Haredi women not to vote for parties that exclude women.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `2-2013-meoravot`,
    year: { he: `2013`, en: `2013` },
    title: { he: `קמפיין תקשורתי ו"מעורבות"`, en: `Media attention and "Meoravot"` },
    body: {
      he: `המחאה זוכה לחשיפה תקשורתית, פעם ראשונה שנשמע קול ברור של נשים חרדיות נגד השתקתן. אחרי הבחירות קמה התארגנות השטח הראשונה, "מעורבות", שייסדו אסתי שושן ורחלי איבנבוים. המפגשים הראשונים מתקיימים בחשאיות גמורה.`,
      en: `The protest draws wide coverage, the first time a clear Haredi women's voice against their silencing is heard. After the elections the first grassroots group, Meoravot, is founded by Esty Shushan and Racheli Ibenboim. Early meetings are held in complete secrecy.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `3-2013-first-wave`,
    year: { he: `2013`, en: `2013` },
    title: { he: `גל ראשון של מועמדות ברשויות המקומיות`, en: `First wave of municipal candidates` },
    body: {
      he: `נשים חרדיות מודיעות על ריצה למועצות הערים. מלבד רשימת "עיר ואם" באלעד בראשות מיכל צ׳רנוביצקי, שרצה עד הסוף, המועמדות פורשות בעקבות איומים.`,
      en: `Haredi women announce runs for city councils. Apart from the "Ir VaEm" list in Elad led by Michal Chernovitzky, which ran to the end, the candidates withdraw under threats.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `4-2014-hearings`,
    year: { he: `2014`, en: `2014` },
    title: { he: `דיונים ראשונים בכנסת וקבוצות דיון`, en: `First Knesset hearings and online circles` },
    body: {
      he: `הפעילות יוזמות דיונים בוועדה למעמד האישה, לראשונה נחשפים נתונים על בריאות, שכר וחסמי השכלה של נשים חרדיות. במקביל נפתחת קבוצת הפייסבוק "פמיניסטיות מתחת לפיאה", קבוצה סגורה לנשים בלבד.  ואחריה נפתחת קבוצת "פמיניזם חרדי" המיועדת לנשים ולגברים מהחברה החרדית.`,
      en: `Activists initiate hearings in the Committee on the Status of Women, data on Haredi women's health, wages and education barriers is presented for the first time. The closed Facebook group "Feminists Under the Wig" opens, followed by "Haredi Feminism".`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `5-2015-ngo`,
    year: { he: `2015`, en: `2015` },
    title: { he: `קמפיין שני, עמותה ותחילת המאבק המשפטי`, en: `A second campaign, an NGO, and legal action` },
    body: {
      he: `לקראת הבחירות לכנסת ה־20 פעילות נחשפות בשמן המלא ודורשות מחברי הכנסת החרדים לפעול לייצוג נשים. התנועה נרשמת כעמותה, "נבחרות", עם דמותה של שרה שנירר בלוגו, ומצטרפת למאבק המשפטי נגד סעיפי התקנון המדירים במפלגות החרדיות. העתירה לבג"ץ נגד אגודת ישראל מוגשת בידי עו"ד תמי בן פורת, בעקבות גילוי של העיתונאית טל שניידר שתקנוני המפלגות החרדיות מעגנים את היעדר הנשים בשורותיהן. לעתירה מצטרפים עשרה ארגוני נשים בהובלת "איתך־מעכי, משפטניות למען צדק חברתי", ומרכז קונקורד מצטרף כידיד בית המשפט.`,
      en: `Ahead of the 20th Knesset elections, activists step forward under their full names and demand action from Haredi MKs. The movement registers as an NGO, Nivcharot, with Sarah Schenirer in its logo, and joins the legal battle against exclusionary party bylaws. The petition against Agudat Yisrael is filed by attorney Tami Ben Porat, after journalist Tal Schneider revealed that the Haredi parties' bylaws entrench the absence of women from their ranks. Ten women's organisations join the petition, led by Itach-Maaki, Women Lawyers for Social Justice, with the Concord Center as amicus curiae.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `6-2016-community`,
    year: { he: `2016`, en: `2016` },
    title: { he: `פעילות קהילתית ותודעת זכויות`, en: `Community work and rights awareness` },
    body: {
      he: `כנסים, כתיבה והפצת מסרים של מנהיגות נשית דתית: הזרוע הפנים־קהילתית פועלת להעלאת המודעות להשפעת חוסר הייצוג הפוליטי על חייהן של נשים חרדיות.`,
      en: `Conferences, writing and messaging on religious women's leadership: the in-community arm raises awareness of how the absence of political representation affects Haredi women's lives.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `7-2017-law`,
    year: { he: `2017`, en: `2017` },
    title: { he: `חוק ומשפט`, en: `Law and policy` },
    body: {
      he: `ניירות עמדה לבג"ץ, לאו"ם, למשרדי ממשלה ולכנסת; שולחנות עגולים עם אנשי אקדמיה ומשפט ומפגשים עם חברות כנסת. אסתי שושן זוכה בפרס קרן יפה לונדון־יערי לקידום יוזמות חברתיות לנשים.`,
      en: `Position papers to the Supreme Court, the UN, government ministries and the Knesset; round tables with legal scholars and meetings with MKs. Esty Shushan receives the Yaffa London-Yaari Prize for women's social initiatives.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `7b-2018-nir-etzion-shabbat`,
    year: { he: `ינואר 2018`, en: `January 2018` },
    title: { he: `שבת אקטיביסטיות בניר עציון`, en: `An activists' Shabbat at Nir Etzion` },
    body: {
      he: `נבחרות מקיימת שבת אקטיביסטיות במלון ניר עציון, ליד ירושלים, ובין האורחות הרבנית מלכה פיוטרקובסקי. השבת הזו מהווה התלכדות נוספת של הכוחות הפועלים בשטח של הפמיניזם החרדי, ומעלה את סוגיית הפמיניזם הדתי-תורני לשיח הפנימי בעוצמה.`,
      en: `Nivcharot holds an activists' Shabbat at the Nir Etzion hotel near Jerusalem, with Rabbanit Malka Piotrkovsky among the guests. The Shabbat becomes another point of unity for the forces active in Haredi feminism on the ground, and pushes the question of Torah-observant religious feminism powerfully into internal discourse.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `7c-2017-19-kol-barama`,
    year: { he: `2017-2019`, en: `2017-2019` },
    title: { he: `פרשת קול ברמה`, en: `The Kol Barama case` },
    body: {
      he: `אסתי שושן מגישה עדות, יחד עם דידי שור, בתביעה הייצוגית של "קולך" נגד רדיו קול ברמה, על כך שהשתקת קולן של נשים ברדיו פוגעת בנשים חרדיות. ב-2019 בית המשפט פוסק שעל קול ברמה לשלם קנס של כמיליון שקל, לצד הוצאות משפט. אנשי הרדיו מביאים לעותרות את החזר הוצאות המשפט בדליים של מטבעות 20 אלף ש"ח.`,
      en: `Esty Shushan submits testimony, together with Didi Shor, in Kolech's class action against Kol Barama radio, over the harm to Haredi women caused by silencing women's voices on air. In 2019 the court orders Kol Barama to pay roughly a million shekels in compensation, plus legal costs. The station's staff deliver the compensation to the petitioners in buckets of 20,000 NIS in coins.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `8-2018-hanivcheret`,
    year: { he: `2018`, en: `2018` },
    title: { he: `"הנבחרת", קבוצת המנהיגות הראשונה`, en: `HaNivcheret, the first leadership cohort` },
    body: {
      he: `בשיתוף נשות ויצו והשגרירות האמריקאית, קמה קבוצת המנהיגות החרדית הראשונה להכשרה ציבורית, חברתית ופוליטית. במקביל בג"ץ דורש מאגודת ישראל להשיב אם תתקן את תקנונה.`,
      en: `With WIZO, the U.S. Embassy and the Shaharit Institute, the first Haredi women's leadership training group is launched. Meanwhile the Supreme Court demands that United Torah Judaism answer whether it will amend its bylaws.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `9-2018-local-candidate`,
    year: { he: `2018`, en: `2018` },
    title: { he: `בוגרות הנבחרת יוצאות לזירה המקומית`, en: `HaNivcheret alumnae enter local politics` },
    body: {
      he: `לראשונה, בוגרות "הנבחרת 1" מציגות מועמדות בבחירות לרשויות המקומיות. רחלי סלומון רצה למועצת הצעירים בפתח תקווה; הרשימה שלה לא עוברת את אחוז החסימה. הילה חסן לפקוביץ רצה למועצת העיר כפר יונה ופורשת באמצע הדרך. פנינה פויפר רצה למועצת עיריית ירושלים, ומוצאת עצמה מוסרת מהרשימה חודש לפני הבחירות, אחרי חודשים של פעילות שטח למענה.`,
      en: `For the first time, "HaNivcheret 1" alumnae run in local government elections. Racheli Solomon runs for the youth council in Petah Tikva; her list doesn't pass the electoral threshold. Hila Hassan Lefkovich runs for the Kfar Yona city council and withdraws partway through. Penina Poifer runs for the Jerusalem city council, and finds herself dropped from the list a month before the election, after months of grassroots campaigning on its behalf.`,
    },
    visible: { he: true, en: true },
    externalArticles: [
      {
        label: {
          he: 'מדוע מועצת העיר ירושלים הוציאה את אחת המועמדות רגע לפני הבחירות?',
          en: "Why did the Jerusalem city council drop a candidate right before the election?",
        },
        outlet: 'attitude.org.il',
        url: 'https://www.atmag.co.il/%D7%9E%D7%99-%D7%9E%D7%A4%D7%97%D7%93-%D7%9E%D7%A4%D7%9E%D7%99%D7%A0%D7%99%D7%96%D7%9D-%D7%97%D7%A8%D7%93%D7%99-%D7%9C%D7%9E%D7%94-%D7%94%D7%9E%D7%95%D7%A2%D7%9E%D7%93%D7%95%D7%AA-%D7%94%D7%97%D7%A8/',
      },
    ],
  },
  {
    id: `10-2021-religious-council`,
    year: { he: `2021`, en: `2021` },
    title: { he: `מהכנסת אל המועצה הדתית`, en: `From the Knesset to the religious council` },
    body: {
      he: `הילה חסן לפקוביץ מתמודדת במקום השני ברשימת "עם שלם" בראשות הרב חיים אמסלם לכנסת ה-24. הרשימה מקבלת כ-592 קולות בלבד ולא עוברת את אחוז החסימה, אך הילה נבחרת ליושבת ראש המועצה הדתית בכפר יונה, תפקיד שהיא מכהנת בו עד היום.`,
      en: `Hila Hassan Lefkovich runs second on the "Am Shalem" list, led by Rabbi Chaim Amsalem, for the 24th Knesset. The list receives about 592 votes and doesn't pass the electoral threshold, but Hila is elected chair of the religious council in Kfar Yona, a position she still holds today.`,
    },
    visible: { he: true, en: true },
    externalArticles: [
      {
        label: { he: 'מספר 2 במפלגת עם שלם: הילה חסן לפקוביץ', en: "No. 2 on the Am Shalem list: Hila Hasan Lefkowitz" },
        outlet: 'ערוץ 7',
        url: 'https://www.inn.co.il/news/463444',
      },
    ],
  },
  {
    id: `11-2021-film`,
    year: { he: `2021`, en: `2021` },
    title: { he: `הסרט "אשת חיל"`, en: `"Woman of Valor" premieres` },
    body: {
      he: `הסרט התיעודי "אשת חיל" בבימוי אנה סומרשף יוצא לאקרנים. שבעים וחמש דקות שמלוות את פעילות נבחרות על פני כמה שנים, את המאבק על הזכות להיבחר ואת המחיר האישי שהוא גובה. הסרט מוקרן בפסטיבל סרטי נשים בירושלים, בסינמטקים ובמכון ון ליר, ומועמד לפרס אופיר בקטגוריית סרט תיעודי ארוך לשנת 2022.`,
      en: `The documentary "Woman of Valor" (Eshet Chayil), directed by Anna Somershaf, is released. Seventy-five minutes following Nivcharot's activity over several years, the struggle for the right to be elected, and its personal cost. The film screens at the Jerusalem Women's Film Festival, at cinematheques and the Van Leer Institute, and is shortlisted for a 2022 Ophir Award for best feature documentary.`,
    },
    visible: { he: true, en: false },
  },
  {
    id: `12-2019-supreme-court`,
    year: { he: `2019`, en: `2019` },
    title: { he: `הניצחון בבג"ץ`, en: `Victory at the Supreme Court` },
    body: {
      he: `בית המשפט העליון מורה לאגודת ישראל לבטל כל מניעה תקנונית לקבלת אישה כחברה במפלגה, שיא של ארבע שנות מאבק משפטי. אסתי שושן זוכה בפרס רפפורט על עשייה נשית פורצת דרך. סביב סבבי הבחירות מציבה "מחאת הכסאות" את הכיסא הריק כסמל להיעדר הייצוג. זו עתירתה של עו"ד תמי בן פורת, שנבחרות וארגוני הנשים היו שותפות לה מ־2015.`,
      en: `The Court orders Agudat Yisrael to remove every barrier to women's party membership, the peak of four years of litigation. Esty Shushan receives the Rappaport Prize. Around the repeated election rounds, the Empty Chairs protest makes the vacant seat a symbol of missing representation. This is attorney Tami Ben Porat's petition, which Nivcharot and the women's organisations had backed since 2015.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `12b-2019-primaries`,
    year: { he: `2019`, en: `2019` },
    title: { he: `שתי בוגרות בזירה הארצית`, en: `Two alumnae on the national stage` },
    body: {
      he: `מיכל צ'רנוביצקי מתמודדת בפריימריז מפלגת העבודה ומסיימת במקום ה-20. במקביל, עומר ינקלביץ מקבלת שיבוץ במקום ה-23, הריאלי, ברשימת כחול לבן, ותהפוך לימים לאישה החרדית הראשונה שמכהנת כשרה בישראל.`,
      en: `Michal Chernovitzky runs in the Labor Party primaries and finishes in 20th place. At the same time, Omer Yanklevich is placed 23rd, a realistic slot, on the Kachol Lavan list, and later becomes the first Haredi woman to serve as a government minister in Israel.`,
    },
    visible: { he: true, en: true },
    externalArticles: [
      {
        label: { he: 'פריימריז בעבודה: התוצאות הסופיות', en: 'Labor primaries: the final results' },
        outlet: 'מעריב',
        url: 'https://www.maariv.co.il/elections2019/Article-684360',
      },
    ],
  },
  {
    id: `12c-2020-achotenu-at`,
    year: { he: `2020`, en: `2020` },
    title: { he: `קבוצת "אחותנו את"`, en: `The "Achotenu At" group` },
    body: {
      he: `בוגרות תוכנית "הנבחרת" מקימות את קבוצת "אחותנו את", מרחב שבו נשים חרדיות משתתפות בשיח ומצטרפות אליו לאורך זמן.`,
      en: `HaNivcheret alumnae found the "Achotenu At" ("She Is Our Sister") group, a space where Haredi women take part in an ongoing discussion, with more women joining over time.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `13-2020-23-widening`,
    year: { he: `2020/23`, en: `2020-23` },
    title: { he: `מרחיבות את המעגלים`, en: `Widening the circles` },
    body: {
      he: `מחזורים חדשים של "הנבחרת" יוצאים לדרך מדי שנה. מיזם שיח.ה מוקם על ידי בוגרות הארגון ופותח מעגלי שיח גם בקרב גברים חרדים, ולובי הנשים החרדיות פועל בכנסת.`,
      // The English mockup folds this milestone's content AND the separate
      // "חרדיות שותפות" (id 16-2024-harediyot-shutafot, hidden in EN)
      // milestone's content into one combined English paragraph — kept
      // verbatim as authored, not split back apart.
      en: `New HaNivcheret cohorts launch every year. The Sicha project opens dialogue circles that include Haredi men, and the Haredi women's lobby works in the Knesset. After October 2023, "Harediyot Shutafot" organizes Haredi women's support for soldiers and the home front.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `14-2024-municipal`,
    year: { he: `2024`, en: `2024` },
    title: { he: `בחירות מקומיות`, en: `Municipal elections` },
    body: {
      he: `בבחירות לרשויות המקומיות מתמודד מספר לא מבוטל של מועמדות חרדיות, פרי עשור של עבודת תודעה והכשרה. נשים חרדיות מופיעות על פתקי הצבעה מקומיים ברשימות שונות, ולראשונה זה נראה כמו מהלך אפשרי ולא כמו חריגה.`,
      // Not shown independently in English — its gist is folded into
      // "2024-podcast"'s English body ("In the municipal elections...").
      en: `In the local elections a considerable number of Haredi women run, the fruit of a decade of awareness-raising and training. Haredi women appear on local ballots across different lists, and for the first time it looks like an available path rather than an exception.`,
    },
    visible: { he: true, en: false },
  },
  {
    id: `15-2022-petitions`,
    year: { he: `2022`, en: `2022` },
    title: { he: `שתי עתירות לבית המשפט המחוזי`, en: `Two petitions to the District Court` },
    body: {
      he: `נבחרות, יחד עם 22 בוגרות ופעילות, מגישות שתי עתירות לבית המשפט המחוזי: בקשה להצטרף כחברות לש"ס ולאגודת ישראל, אחרי שהבקשות סורבו.`,
      en: `Nivcharot, together with 22 alumnae and activists, files two petitions with the District Court: requests to join Shas and Agudat Yisrael as members, after their applications were refused.`,
    },
    visible: { he: true, en: false },
  },
  {
    id: `16-2024-harediyot-shutafot`,
    year: { he: `2024`, en: `2024` },
    title: { he: `"חרדיות שותפות"`, en: `"Harediyot Shutafot"` },
    body: {
      he: `אחרי אוקטובר 2023 קמה "חרדיות שותפות", התארגנות של נשים חרדיות להושטת יד לצה"ל ולעורף: ביקורים בבסיסים, סיוע למשפחות מגויסים ולמפונים, ומפגש ישיר בין נשים חרדיות למערכות שמהן הודרו. ההתארגנות מייצרת שיח חדש בקהילה על שותפות ועל אחריות.`,
      // Content merged into "13-2020-23-widening"'s English body — see note there.
      en: `After October 2023, "Harediyot Shutafot" ("Haredi Women Partners") is founded, an organizing of Haredi women reaching out to the IDF and the home front: base visits, support for the families of soldiers and evacuees, and direct contact between Haredi women and systems they had been excluded from. The organizing opens a new communal conversation about partnership and responsibility.`,
    },
    visible: { he: true, en: false },
  },
  {
    id: `17-2024-podcast`,
    year: { he: `2024`, en: `2024` },
    title: { he: `"חרדית מדוברת" עולה לאוויר`, en: `Haredit Meduberet goes on air` },
    body: {
      he: `הפודקאסט של אסתי שושן יוצא לדרך ומגשר בין העולמות: שיחות בגובה העיניים על חרדיות ישראלית מתחדשת, שנשמעות גם מחוץ לקהילה.`,
      // Folds in "14-2024-municipal"'s gist ("In the municipal elections...") — authored that way in the mockup.
      en: `Esty Shushan's podcast launches, bridging worlds. In the municipal elections a notable number of Haredi women run, the fruit of a decade of awareness-building and training.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `18-2025-alumnae`,
    year: { he: `2025`, en: `2025` },
    title: { he: `רשת הבוגרות`, en: `The alumnae network` },
    body: {
      he: `הצעד הבא של התוכנית: סקר בקרב בוגרות "הנבחרת", צעד ראשון בדרך לרשת בוגרות פעילה - בית, מקור תמיכה ופלטפורמה להשפעה מתמשכת.`,
      en: `The program's next step: a survey among "HaNivcheret" alumnae, a first step toward an active alumnae network - a home, a source of support and a platform for lasting influence.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `19-2025-shas-ruling`,
    year: { he: `2025`, en: `2025` },
    title: { he: `פסק דין בתיק ש"ס`, en: `Ruling in the Shas case` },
    body: {
      he: `בסוף השנה ניתן פסק דין בתיק ש"ס: המפלגה נדרשת להקים מנגנון מסודר לקליטת חברים וחברות. תקדים משפטי שהופך את השאלה מעניין של רצון טוב לחובה פרוצדורלית.`,
      en: `At year's end, a ruling is handed down in the Shas case: the party is required to establish an orderly process for admitting members. A legal precedent that turns the question from a matter of goodwill into a procedural duty.`,
    },
    visible: { he: true, en: false },
  },
  {
    id: `20-2026-hanivcheret-9`,
    year: { he: `2026`, en: `2026` },
    title: { he: `הנבחרת 9`, en: `HaNivcheret 9` },
    body: {
      he: `המחזור התשיעי של תוכנית המנהיגות נפגש. התנועה ממשיכה לפעול לייצוג, לשוויון ולקול, ועוד ארוכה הדרך.`,
      en: `The ninth leadership cohort meets. The movement keeps working for representation, equality and voice, and the road is still long.`,
    },
    visible: { he: true, en: true },
  },
  {
    id: `20b-2026-primaries-initiative`,
    year: { he: `2026`, en: `2026` },
    title: { he: `פריימריז לנשים חרדיות`, en: `Primaries for Haredi women` },
    body: {
      he: `יוזמת "פריימריז לנשים חרדיות" יוצאת לדרך, ביוזמת פעילות חברתיות, חלקן בוגרות התנועה, שמבקשות להנגיש את הזירה הפוליטית לנשים חרדיות מבפנים.`,
      en: `The "Primaries for Haredi Women" initiative launches, driven by social activists, some of them movement alumnae, seeking to open up the political arena to Haredi women from within.`,
    },
    visible: { he: true, en: true },
  },
]

/** Newest-first — see the comment on `timelineMilestonesChronological` above. */
export const timelineMilestones: TimelineMilestone[] = timelineMilestonesChronological.slice().reverse()

export const storyContent = {
  hero: {
    eyebrow: { he: `הסיפור שלנו · ציר זמן`, en: `OUR STORY · TIMELINE` } satisfies Localized,
    title: {
      he: `משקופות לנוכחות`,
      en: `From excluded women\nto visible active women`,
    } satisfies Localized,
    kicker: {
      he: `סיפורן של הסופרג'יסטיות האחרונות.`,
      en: `The story of the last suffragettes.`,
    } satisfies Localized,
    lead: {
      he: `מימי המאבק הארצישראלי על זכות הבחירה ועד למאבק הנשים החרדיות על הזכות להיבחר, \nכך נולדה תנועת הפמיניזם החרדי, וקמה שדרת מנהיגות ואקטיביסטיות  נשים חרדיות.`,
      en: `From the struggle over women's suffrage in pre-state Israel to Haredi women's struggle for the right to be elected, how a movement was born, an NGO founded, a Supreme Court case won, and a generation of Haredi women leaders trained.`,
    } satisfies Localized,
  },

  images: {
    he: [
      { id: `story-1`, label: `תמונה, ימי המחאה הראשונים` },
      { id: `story-2`, label: `תמונה, מחוץ לבית המשפט / מחאת הכסאות` },
      { id: `story-3`, label: `תמונה, מפגש הנבחרת` },
    ],
    en: [
      { id: `story-1`, label: `Image, early protest days` },
      { id: `story-2`, label: `Image, outside the court / Empty Chairs` },
      { id: `story-3`, label: `Image, a HaNivcheret session` },
    ],
  } satisfies Localized<{ id: string; label: string }[]>,

  sidebarLabel: { he: `ציר הזמן`, en: `TIMELINE` } satisfies Localized,

  cta: {
    title: { he: `ועוד ארוכה הדרך.`, en: `The road is still long.` } satisfies Localized,
    buttonLabel: { he: `דברו איתנו`, en: `Talk to us` } satisfies Localized,
    hrefSlug: `/join`,
  },

  archiveHead: {
    title: { he: `מהארכיון · טורים ודעות`, en: `From the archive · columns and opinion` } satisfies Localized,
    linkLabel: { he: `לארכיון המלא`, en: `Full archive` } satisfies Localized,
    hrefSlug: `/media#in-the-media`,
  },
}
