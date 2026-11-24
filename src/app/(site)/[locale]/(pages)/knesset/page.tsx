import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { knessetPaper } from '@/content/legal-cases'
import { isLocale, locales, t } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

const title = { he: 'נבחרות בכנסת', en: 'Nivcharot at the Knesset' }
const lead = {
  he: 'מה קורה כשהנשים שאת חייהן מתארים בדיון מגיעות בעצמן לוועדה? פעילות נבחרות מביאות לכנסת את הניסיון שלהן בקהילה, מציגות עדויות ומגישות ניירות עמדה. אלה כמה מן הסוגיות שהעלו בפני חברי וחברות הכנסת.',
  en: 'What happens when the women whose lives are being discussed take part in the hearing? Nivcharot activists bring their experience to Knesset committees, give testimony and submit position papers. Here are some of the questions they have put before legislators.',
}
const papers = [
  {
    period: { he: 'אפריל 2020', en: 'April 2020' },
    title: { he: 'אלימות במשפחה החרדית בזמן הסגר', en: 'Domestic violence in Haredi families during lockdown' },
    body: { he: 'כיצד יכולה אישה לבקש עזרה כשהיא סגורה בבית עם מי שפוגע בה? נבחרות ריכזה מידע מארגוני סיוע על הקושי לפנות אליהם בזמן הסגר ולקראת פסח, ועל הצורך להנגיש לנשים חרדיות מידע על דרכי הפנייה.', en: 'How can a woman ask for help when she is confined at home with someone who harms her? Nivcharot gathered accounts from support organisations and described the difficulty of reaching help during lockdown and before Passover.' },
    url: 'https://fs.knesset.gov.il/23/Committees/23_cs_bg_568253.pdf',
  },
  {
    period: { he: 'הדיון בינואר 2021', en: 'January 2021 committee hearing' },
    title: { he: 'רשימות מועמדים ללא נשים', en: 'Candidate lists without women' },
    body: { he: 'נבחרות ביקשה מחברות ומחברי הכנסת לבחון את הפער בין זכותן של נשים חרדיות לבחור לבין האפשרות שלהן להתמודד ברשימות של המפלגות שמייצגות את קהילותיהן.', en: 'Nivcharot asked legislators to examine the gap between Haredi women’s right to vote and their ability to stand on the lists of parties representing their communities.' },
    url: 'https://fs.knesset.gov.il/23/Committees/23_cs_bg_594139.pdf',
  },
  {
    period: { he: '19 בפברואר 2023', en: '19 February 2023' },
    title: { he: 'הרפורמה המשפטית וייצוג נשים חרדיות', en: 'Judicial reform and Haredi women’s representation' },
    body: { he: 'על רקע הדיון ברפורמה תיארה התנועה את ניסיונות החקיקה לקידום ייצוג נשים ואת פנייתן של נשים לבתי המשפט בעקבות בקשות ההתפקדות לש״ס ולאגודת ישראל.', en: 'During the debate over judicial reform, the movement set out its legislative efforts and explained why women turned to the courts after applying to join Shas and Agudat Yisrael.' },
    url: knessetPaper,
  },
  {
    period: { he: 'מאי 2023', en: 'May 2023' },
    title: { he: 'מי מייצג נשים חרדיות בשלטון המקומי?', en: 'Who represents Haredi women in local government?' },
    body: { he: 'לקראת הבחירות המקומיות בחנה נבחרות כיצד נבחרים נציגים ברשויות החרדיות, ואילו צרכים נשארים מחוץ לדיון כאשר נשים נעדרות משולחן המועצה.', en: 'Ahead of the municipal elections, Nivcharot examined how representatives are selected in Haredi local authorities and whose needs are overlooked when women are absent from the council table.' },
    url: 'https://fs.knesset.gov.il/25/Committees/25_cs_bg_2458534.pdf',
  },
  {
    period: { he: 'הכנסת ה־25', en: '25th Knesset' },
    title: { he: 'מגרשי ספורט בערים חרדיות', en: 'Sports facilities in Haredi cities' },
    body: { he: 'טובה בוריה ואסתר קרמר, פעילות נבחרות, כתבו על המחסור במגרשים ועל האפשרויות המצומצמות במיוחד לנערות ולנשים. הן ביקשו להגדיל את מספר המתקנים בערים החרדיות ולפעול מול הרשויות המקומיות להקמתם.', en: 'Nivcharot activists Tova Buria and Esther Kramer described the shortage of playing fields and the particularly limited options for girls and women. They called for more facilities and for action by local authorities.' },
    url: 'https://fs.knesset.gov.il/25/Committees/25_cs_bg_2757734.pdf',
  },
  {
    period: { he: 'הכנסת ה־25', en: '25th Knesset' },
    title: { he: 'ענישה בעבירות מין על רקע לאומני', en: 'Sentencing for sexual offences with a nationalist motive' },
    body: { he: 'בתגובה להצעה להחמיר ענישה לפי מניע לאומני, העלתה נבחרות את נקודת המבט של נפגעות חרדיות שנפגעו בתוך הקהילה ושאלה כיצד יינתן משקל לפגיעה בהן.', en: 'Responding to a proposal to increase sentences for offences with a nationalist motive, Nivcharot asked legislators to consider Haredi survivors harmed within their own community and how the law recognises that harm.' },
    url: 'https://fs.knesset.gov.il/25/Committees/25_cs_bg_2805846.pdf',
  },
]

type Params = Promise<{ locale: string }>
export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return pageMetadata({ locale, path: '/knesset', title: t(locale, { he: 'פעילות בכנסת וניירות עמדה של נשים חרדיות', en: 'Knesset advocacy and position papers by Haredi women' }), description: t(locale, lead) })
}

export default async function KnessetPage({ params }: { params: Params }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return <article className="mx-auto max-w-[1120px] px-6 py-10 md:py-16">
    <header className="grid items-center gap-7 border-b-2 border-divider pb-8 md:grid-cols-2 md:gap-12">
      <div>
        <h1 className="mb-5 text-[clamp(38px,5.5vw,68px)] leading-tight">{t(locale, title)}</h1>
        <p className="text-lg leading-relaxed">{t(locale, lead)}</p>
      </div>
      <figure>
        <Image src="/assets/knesset/hanivcheret-at-the-knesset.webp" width={1200} height={900} sizes="(max-width: 767px) 90vw, 510px" alt={t(locale, { he: 'קבוצת משתתפות תוכנית הנבחרת עומדת ברחבה מול משכן הכנסת בירושלים', en: 'HaNivcheret participants together on the plaza in front of the Knesset in Jerusalem' })} className="h-auto w-full" />
        <figcaption className="mt-2 text-sm">{t(locale, { he: 'משתתפות תוכנית ״הנבחרת״ מול משכן הכנסת. ארכיון נבחרות.', en: 'HaNivcheret participants outside the Knesset. Nivcharot archive.' })}</figcaption>
      </figure>
    </header>
    <section className="py-8">
      <h2 className="mb-5 text-3xl">{t(locale, { he: 'ניירות העמדה באתר הכנסת', en: 'Position papers in the Knesset archive' })}</h2>
      <ul className="grid gap-x-10 md:grid-cols-2">
        {papers.map(paper => <li key={paper.url} className="border-t border-divider py-5">
          <p className="text-sm font-bold text-accent-700">{t(locale, paper.period)}</p>
          <h3 className="my-2 text-2xl"><a className="underline decoration-1 underline-offset-4" href={paper.url}>{t(locale, paper.title)}</a></h3>
          <p className="leading-relaxed">{t(locale, paper.body)}</p>
        </li>)}
      </ul>
    </section>
    <section className="max-w-[760px] border-s-4 border-accent bg-tint-cream p-6">
      <h2 className="mb-3 text-2xl">{t(locale, { he: 'עדויות בוועדה לקידום מעמד האישה', en: 'Testimony before the Committee on the Status of Women' })}</h2>
      <p className="leading-relaxed">{t(locale, { he: 'ב־6 בינואר 2021 השתתפה אסתי שושן בדיון על חוקיותן של רשימות מועמדים ללא נשים. היא תיארה בפני הוועדה את המחיר האישי ששילמה כשדרשה ייצוג פוליטי לנשים חרדיות.', en: 'On 6 January 2021, Esty Shushan spoke at the hearing on the legality of all-male candidate lists. She described the personal cost of calling for political representation for Haredi women.' })}</p>
      <a className="mt-3 inline-block font-semibold underline" href="https://main.knesset.gov.il/News/PressReleases/pages/press06012021d.aspx">{t(locale, { he: 'לסיקור הדיון באתר הכנסת', en: 'Read the Knesset’s account of the hearing (Hebrew)' })}</a>
      <p className="mt-5 leading-relaxed">{t(locale, { he: 'ב־20 בפברואר 2023 הופיעה הדר ליינר מטעם נבחרות באותה ועדה, בדיון על השלכות הרפורמה המשפטית. היא תיארה כיצד נשים בקהילה ביקשו ממנה לדבר בשמן על היעדר הייצוג בכנסת וברשויות המקומיות.', en: 'On 20 February 2023, Hadar Leiner spoke for Nivcharot before the same committee during its debate on judicial reform. She described how women in her community asked her to speak for them about their lack of representation in the Knesset and on local councils.' })}</p>
      <a className="mt-3 inline-block font-semibold underline" href="https://fs.knesset.gov.il/25/Committees/25_ptv_2032325.doc">{t(locale, { he: 'לדברי הדר ליינר בפרוטוקול 13 של הוועדה (Word)', en: 'Read Hadar Leiner’s testimony in committee minutes no. 13 (Hebrew Word document)' })}</a>
    </section>
    <Link className="mt-6 inline-block font-semibold underline" href={`/${locale}/mishpat`}>{t(locale, { he: 'לציר הזמן של המאבק המשפטי', en: 'Explore the legal campaign timeline' })}</Link>
  </article>
}
