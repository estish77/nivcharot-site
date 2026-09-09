// One-off: corrects the 2026-09-06 "considering" framing on the Nechumi
// Yaffe timeline milestone (id 28) to reflect the now-confirmed placement,
// adds Haaretz as a second external-article citation (Kipa stays), and
// creates a new press-archive entry for the Haaretz piece. Both corrected
// per the site owner (2026-09-09): this isn't the first time a Haredi woman
// has been placed on a Haredi party's list — Hila Chason Lefkowitz (a
// Nivcharot alumna) held second place on "Am Shalem" in 2021 (already
// documented at timeline-milestones id 14), and Ruth Kolian founded a
// separate Haredi women's party, "Bizchutan", in 2015.
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
  title: 'בפעם השנייה מאז 2021: מקום שני ברשימת מפלגה חרדית',
  body: 'מפלגת "הציבור החרדי" בראשות מוטי לייטנר שריינה את ד"ר נחומי יפה, חוקרת פסיכולוגיה פוליטית וחברתית של החברה החרדית ומייסדת החמ"ל החרדי המרכזי בתקופת המלחמה, במקום השני ברשימתה לכנסת ה-26. זו הפעם השנייה שאישה חרדית משובצת במקום ריאלי ברשימת מפלגה חרדית קיימת, אחרי שהילה חסן לפקוביץ׳, בוגרת הנבחרת ולשעבר מנהלת פרויקטים בתנועה, כיהנה במקום השני ברשימת "עם שלם" בראשות הרב חיים אמסלם לכנסת ה-24 (2021). ב-2015 הקימה רות קוליאן את "בזכותן", מפלגה נפרדת של נשים חרדיות שלא עברה את אחוז החסימה.',
}

const en = {
  title: "The second time since 2021: second place on a Haredi party's list",
  body: 'The Haredi Public party, led by Moti Leitner, reserved Dr. Nechumi Yaffe, a researcher of political and social psychology in Haredi society and founder of the central Haredi war room during the war, for second place on its list for the 26th Knesset. It is the second time a Haredi woman has been placed in a realistic slot on an existing Haredi party\'s list, after Hila Chason Lefkowitz, a Nivcharot alumna and former projects manager at the movement, held second place on the "Am Shalem" list led by Rabbi Chaim Amsalem for the 24th Knesset (2021). In 2015 Ruth Kolian founded "Bizchutan," a separate Haredi women\'s party that did not clear the electoral threshold.',
}

const HAARETZ_URL = 'https://www.haaretz.co.il/news/elections/2026-09-07/ty-article/.premium/000001a0-7cac-d825-afb5-fcfc386e0000'

// 1) Update the existing milestone, preserving its current Kipa article and adding Haaretz.
const current = await payload.findByID({ collection: 'timeline-milestones', id: MILESTONE_ID, locale: 'he', depth: 0 })
const existingArticles = current.externalArticles ?? []
console.log('existing external articles (he):', JSON.stringify(existingArticles))

const heArticles = [
  ...existingArticles.map((a) => ({ id: a.id, label: a.label, outlet: a.outlet, url: a.url })),
  { label: 'הארץ: אישה ראשונה במפלגה חרדית', outlet: 'הארץ', url: HAARETZ_URL },
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

// Fetch the EN labels for the pre-existing article(s) so they aren't clobbered.
const currentEn = await payload.findByID({ collection: 'timeline-milestones', id: MILESTONE_ID, locale: 'en', depth: 0 })
const existingArticlesEn = currentEn.externalArticles ?? []

const enArticles = articleIds.map((id, i) => {
  if (i < existingArticlesEn.length) {
    return { id, label: existingArticlesEn[i].label, outlet: existingArticlesEn[i].outlet, url: existingArticlesEn[i].url }
  }
  return { id, label: 'Haaretz: First Woman in a Haredi Party', outlet: 'Haaretz', url: HAARETZ_URL }
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

// 2) New press-archive entry for the Haaretz piece.
const slug = 'haaretz-nechumi-yaffe-second-place-2026'
const heSummary =
  'כתבה מאת אהרן רבינוביץ\' ויעל פרידסון (7.9.2026) על שיבוצה של ד"ר נחומי יפה, חוקרת פסיכולוגיה פוליטית וחברתית באוניברסיטת תל אביב ולשעבר יועצת למועצה לביטחון לאומי בנושאי החברה החרדית, במקום השני ברשימת "הציבור החרדי" בראשות מוטי לייטנר לקראת הבחירות לכנסת ה-26. בניגוד לכותרת, זו אינה הפעם הראשונה: ב-2021 כיהנה הילה חסן לפקוביץ׳, בוגרת הנבחרת, במקום השני ברשימת "עם שלם" בראשות הרב חיים אמסלם לכנסת ה-24, וב-2015 הקימה רות קוליאן מפלגת נשים חרדיות נפרדת, "בזכותן". לפי הכתבה, מפלגת הציבור החרדי לא התמזגה עם רשימות אחרות, וסקרים מצביעים על כך שהיא לא צפויה לעבור את אחוז החסימה.'
const enSummary =
  'An article by Aaron Rubinowitz and Yael Friedson (September 7, 2026) on Dr. Nechumi Yaffe, a researcher of political and social psychology at Tel Aviv University and a former adviser to the National Security Council on Haredi-sector affairs, being placed second on the "Haredi Public" party\'s list, led by Moti Leitner, ahead of the 26th Knesset elections. Despite the headline, this isn\'t actually the first time: in 2021 Hila Chason Lefkowitz, a Nivcharot alumna, held second place on the "Am Shalem" list led by Rabbi Chaim Amsalem for the 24th Knesset, and in 2015 Ruth Kolian founded a separate Haredi women\'s party, "Bizchutan." Per the article, the party did not merge with other lists, and polling suggests it is not expected to clear the electoral threshold.'

const heData = {
  slug,
  title: 'אישה ראשונה במפלגה חרדית: ד"ר נחומי יפה תוצב במקום השני ברשימת הציבור החרדי',
  summary: heSummary,
  type: 'article',
  category: 'coverage',
  outlet: 'הארץ',
  dateLabel: '7.9.2026',
  sortDate: '2026-09-07',
  year: 2026,
  sourceLanguage: 'he',
  linkKind: 'external',
  url: HAARETZ_URL,
  featured: false,
  reviewStatus: 'keep',
}
const enData = {
  slug,
  title: 'First Woman in a Haredi Party: Dr. Nechumi Yaffe Placed Second on the Haredi Public List',
  summary: enSummary,
  outlet: 'Haaretz',
  dateLabel: 'Sep 7, 2026',
}

const existingPa = await payload.find({ collection: 'press-archive', where: { slug: { equals: slug } }, limit: 1 })
let paId
if (existingPa.docs.length > 0) {
  paId = existingPa.docs[0].id
  await payload.update({ collection: 'press-archive', id: paId, locale: 'he', context: { disableRevalidate: true }, data: heData })
  console.log('press-archive: updated existing', slug)
} else {
  const doc = await payload.create({ collection: 'press-archive', locale: 'he', context: { disableRevalidate: true }, data: heData })
  paId = doc.id
  console.log('press-archive: created', slug, 'id=', paId)
}
await payload.update({ collection: 'press-archive', id: paId, locale: 'en', context: { disableRevalidate: true }, data: enData })

console.log('done.')
process.exit(0)
