// One-off: corrects timeline-milestones id 28. The 2026-09-09 version said
// Dr. Nechumi Yaffe alone was placed "second" on the Haredi Public party's
// list. Per the client (2026-09-09), the party actually placed TWO women in
// the first four slots — Yaffe third, Ziva Glantz fourth — confirmed via
// Bechadrei Chareidim (bhol.co.il/news/1738664, which spells out the numbered
// list) and Kipa's own follow-up piece on the same "two women" framing. Adds
// that Kipa piece as a third external-article citation (existing Kipa +
// Haaretz citations kept), and updates the existing Haaretz press-archive
// entry's summary to match. Same two-pass, id-preserving pattern as
// update-nechumi-yaffe-milestone.mjs and update-home-stats.mjs.
import { getPayload } from 'payload'
import config from '../payload.config.ts'

const payload = await getPayload({ config })

function richText(text, direction) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction,
          children: [{ type: 'text', format: 0, style: '', mode: 'normal', detail: 0, version: 1, text }],
        },
      ],
    },
  }
}

const MILESTONE_ID = 28

const he = {
  title: 'שתי נשים ברביעייה הראשונה: מקום שלישי ורביעי ברשימת מפלגה חרדית',
  body: 'מפלגת "הציבור החרדי" בראשות מוטי לייטנר שריינה שתי נשים ברביעייה הראשונה של רשימתה לכנסת ה-26: ד"ר נחומי יפה, חוקרת פסיכולוגיה פוליטית וחברתית של החברה החרדית ומייסדת החמ"ל החרדי המרכזי בתקופת המלחמה, במקום השלישי, וזיווה גלנץ, שהובילה מאבק להכללת לימודי ליבה בתלמודי תורה, במקום הרביעי. זהו המקרה השני מאז 2021 שבו נשים חרדיות משובצות במקום ריאלי ברשימת מפלגה חרדית קיימת, אחרי שהילה חסן לפקוביץ׳, בוגרת הנבחרת ולשעבר מנהלת פרויקטים בתנועה, כיהנה במקום השני ברשימת "עם שלם" בראשות הרב חיים אמסלם לכנסת ה-24 (2021). ב-2015 הקימה רות קוליאן את "בזכותן", מפלגה נפרדת של נשים חרדיות שלא עברה את אחוז החסימה.',
}

const en = {
  title: "Two women in the top four: third and fourth place on a Haredi party's list",
  body: 'The Haredi Public party, led by Moti Leitner, reserved two of the top four slots on its list for the 26th Knesset for women: Dr. Nechumi Yaffe, a researcher of political and social psychology in Haredi society and founder of the central Haredi war room during the war, in third place, and Ziva Glantz, who led a campaign to include core curriculum studies in Talmud Torah schools, in fourth place. It\'s the second time since 2021 that Haredi women have been placed in realistic slots on an existing Haredi party\'s list, after Hila Chason Lefkowitz, a Nivcharot alumna and former projects manager at the movement, held second place on the "Am Shalem" list led by Rabbi Chaim Amsalem for the 24th Knesset (2021). In 2015 Ruth Kolian founded "Bizchutan," a separate Haredi women\'s party that did not clear the electoral threshold.',
}

const KIPA_TWO_WOMEN_URL = 'https://kipa.co.il/%D7%97%D7%93%D7%A9%D7%95%D7%AA/1231283-0'

// 1) Update the milestone, preserving the existing Kipa + Haaretz citations and adding the new Kipa piece.
const current = await payload.findByID({ collection: 'timeline-milestones', id: MILESTONE_ID, locale: 'he', depth: 0 })
const existingArticles = current.externalArticles ?? []
console.log('existing external articles (he):', JSON.stringify(existingArticles))

const heArticles = [
  ...existingArticles.map((a) => ({ id: a.id, label: a.label, outlet: a.outlet, url: a.url })),
  { label: 'כיפה: שתי נשים בצמרת', outlet: 'כיפה', url: KIPA_TWO_WOMEN_URL },
]

const updatedHe = await payload.update({
  collection: 'timeline-milestones',
  id: MILESTONE_ID,
  locale: 'he',
  context: { disableRevalidate: true },
  data: {
    title: he.title,
    body: richText(he.body, 'rtl'),
    externalArticles: heArticles,
  },
})

const articleIds = (updatedHe.externalArticles ?? []).map((a) => a.id)
console.log('article ids after he update:', JSON.stringify(articleIds))

const currentEn = await payload.findByID({ collection: 'timeline-milestones', id: MILESTONE_ID, locale: 'en', depth: 0 })
const existingArticlesEn = currentEn.externalArticles ?? []

const enArticles = articleIds.map((id, i) => {
  if (i < existingArticlesEn.length) {
    return { id, label: existingArticlesEn[i].label, outlet: existingArticlesEn[i].outlet, url: existingArticlesEn[i].url }
  }
  return { id, label: 'Kipa: Two women at the top', outlet: 'כיפה', url: KIPA_TWO_WOMEN_URL }
})

await payload.update({
  collection: 'timeline-milestones',
  id: MILESTONE_ID,
  locale: 'en',
  context: { disableRevalidate: true },
  data: {
    title: en.title,
    body: richText(en.body, 'ltr'),
    externalArticles: enArticles,
  },
})

console.log('milestone 28 updated.')

// 2) Update the existing Haaretz press-archive entry's summary (title stays as the outlet's real headline).
const haaretzSlug = 'haaretz-nechumi-yaffe-second-place-2026'
const haaretzHeSummary =
  'כתבה מאת אהרן רבינוביץ\' ויעל פרידסון (7.9.2026) על שיבוצה של ד"ר נחומי יפה, חוקרת פסיכולוגיה פוליטית וחברתית באוניברסיטת תל אביב ולשעבר יועצת למועצה לביטחון לאומי בנושאי החברה החרדית, ברשימת "הציבור החרדי" בראשות מוטי לייטנר לקראת הבחירות לכנסת ה-26. בניגוד לכותרת, זו אינה הפעם הראשונה, ולמעשה יפה שובצה במקום השלישי, לא השני: לצידה, במקום הרביעי, שובצה זיווה גלנץ, שהובילה מאבק להכללת לימודי ליבה בתלמודי תורה. ב-2021 כיהנה הילה חסן לפקוביץ׳, בוגרת הנבחרת, במקום השני ברשימת "עם שלם" בראשות הרב חיים אמסלם לכנסת ה-24, וב-2015 הקימה רות קוליאן מפלגת נשים חרדיות נפרדת, "בזכותן". לפי הכתבה, מפלגת הציבור החרדי לא התמזגה עם רשימות אחרות, וסקרים מצביעים על כך שהיא לא צפויה לעבור את אחוז החסימה.'
const haaretzEnSummary =
  'An article by Aaron Rubinowitz and Yael Friedson (September 7, 2026) on Dr. Nechumi Yaffe, a researcher of political and social psychology at Tel Aviv University and a former adviser to the National Security Council on Haredi-sector affairs, being placed on the "Haredi Public" party\'s list, led by Moti Leitner, ahead of the 26th Knesset elections. Despite the headline, this isn\'t the first time, and Yaffe was actually placed third, not second: alongside her, in fourth place, is Ziva Glantz, who led a campaign to include core curriculum studies in Talmud Torah schools. In 2021 Hila Chason Lefkowitz, a Nivcharot alumna, held second place on the "Am Shalem" list led by Rabbi Chaim Amsalem for the 24th Knesset, and in 2015 Ruth Kolian founded a separate Haredi women\'s party, "Bizchutan." Per the article, the party did not merge with other lists, and polling suggests it is not expected to clear the electoral threshold.'

const existingHaaretzPa = await payload.find({ collection: 'press-archive', where: { slug: { equals: haaretzSlug } }, limit: 1 })
if (existingHaaretzPa.docs.length > 0) {
  const paId = existingHaaretzPa.docs[0].id
  await payload.update({ collection: 'press-archive', id: paId, locale: 'he', context: { disableRevalidate: true }, data: { summary: haaretzHeSummary } })
  await payload.update({ collection: 'press-archive', id: paId, locale: 'en', context: { disableRevalidate: true }, data: { summary: haaretzEnSummary } })
  console.log('press-archive: updated summary for', haaretzSlug)
} else {
  console.warn('press-archive: could not find', haaretzSlug, '- skipped summary update')
}

// 3) New press-archive entry for Kipa's "two women" follow-up piece.
const kipaSlug = 'kipa-two-women-haredi-public-list-2026'
const kipaHeSummary =
  'כתבה של חדשות כיפה (8.9.2026) על הגשת רשימת מפלגת "הציבור החרדי" בראשות מוטי לייטנר לכנסת ה-26: מוטי לייטנר במקום הראשון, אשר פרדי במקום השני, ד"ר נחומי יפה במקום השלישי וזיווה גלנץ במקום הרביעי. לפי הכתבה, שילובן של שתי נשים ברביעייה הראשונה של הרשימה הוא חידוש בולט עבור מפלגה חרדית קיימת. גלנץ הובילה מאבק להכללת לימודי ליבה בתלמודי תורה.'
const kipaEnSummary =
  'A Kipa News article (September 8, 2026) on the "Haredi Public" party, led by Moti Leitner, filing its list for the 26th Knesset: Moti Leitner in first place, Asher Fredi in second, Dr. Nechumi Yaffe in third, and Ziva Glantz in fourth. Per the article, placing two women in the list\'s first four slots is a notable precedent for an existing Haredi party. Glantz led a campaign to include core curriculum studies in Talmud Torah schools.'

const kipaHeData = {
  slug: kipaSlug,
  title: 'שתי נשים בצמרת: הרשימה המלאה של המפלגה החרדית נחשפה',
  summary: kipaHeSummary,
  type: 'article',
  category: 'coverage',
  outlet: 'כיפה',
  dateLabel: '8.9.2026',
  sortDate: '2026-09-08',
  year: 2026,
  sourceLanguage: 'he',
  linkKind: 'external',
  url: KIPA_TWO_WOMEN_URL,
  featured: false,
  reviewStatus: 'keep',
}
const kipaEnData = {
  slug: kipaSlug,
  title: 'Two Women at the Top: Haredi Party\'s Full List Revealed',
  summary: kipaEnSummary,
  outlet: 'Kipa',
  dateLabel: 'Sep 8, 2026',
}

const existingKipaPa = await payload.find({ collection: 'press-archive', where: { slug: { equals: kipaSlug } }, limit: 1 })
let kipaPaId
if (existingKipaPa.docs.length > 0) {
  kipaPaId = existingKipaPa.docs[0].id
  await payload.update({ collection: 'press-archive', id: kipaPaId, locale: 'he', context: { disableRevalidate: true }, data: kipaHeData })
  console.log('press-archive: updated existing', kipaSlug)
} else {
  const doc = await payload.create({ collection: 'press-archive', locale: 'he', context: { disableRevalidate: true }, data: kipaHeData })
  kipaPaId = doc.id
  console.log('press-archive: created', kipaSlug, 'id=', kipaPaId)
}
await payload.update({ collection: 'press-archive', id: kipaPaId, locale: 'en', context: { disableRevalidate: true }, data: kipaEnData })

console.log('done.')
process.exit(0)
