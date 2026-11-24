import Image from 'next/image'
import Link from 'next/link'
import { knessetPaper, legalCases } from '@/content/legal-cases'
import { t, type Locale, type Localized } from '@/lib/i18n'

type DocumentExcerpt = {
  file: string
  width: number
  height: number
  label: Localized
  alt: Localized
  source?: string
}

function Excerpt({ document, locale }: { document: DocumentExcerpt; locale: Locale }) {
  const path = `/assets/legal/${document.file}.webp`
  return (
    <figure className="my-6 border-s-4 border-accent bg-tint-cream p-4 sm:p-6">
      <a href={path} aria-label={t(locale, { he: 'הגדלת התצלום', en: 'Enlarge the document excerpt' })}>
        <Image src={path} width={document.width} height={document.height} sizes="(max-width: 800px) 90vw, 740px" className="block h-auto w-full bg-white" alt={t(locale, document.alt)} />
      </a>
      <figcaption className="mt-3 text-sm leading-relaxed text-neutral-800">
        {t(locale, document.label)}
        {document.source && <> · <a href={document.source} className="font-semibold underline">{t(locale, { he: 'למסמך המלא', en: 'Full judgment in Hebrew' })}</a></>}
      </figcaption>
    </figure>
  )
}

const february: DocumentExcerpt = {
  file: 'hearing-february-2016', width: 1377, height: 261,
  label: { he: 'בג״ץ 1823/15, פרוטוקול הדיון מ־8.2.2016, עמ׳ 2, שורות 4–8. מתוך ארכיון נבחרות.', en: 'HCJ 1823/15, hearing of 8 February 2016, p. 2, lines 4–8. Nivcharot archive.' },
  alt: { he: 'עו״ד תמר בן־פורת טוענת בדיון שהבחירה של אישה בין קהילה מסוימת לציבור הישראלי כולו נוגעת לזכות החוקתית לבחור ולהיבחר.', en: 'Ben-Porat argues that choosing between one’s own community and the wider electorate engages the constitutional right to vote and stand for election.' },
}
const october: DocumentExcerpt = {
  file: 'hearing-october-2016', width: 1369, height: 261,
  label: { he: 'בג״ץ 1823/15, פרוטוקול הדיון מ־27.10.2016, עמ׳ 2, שורות 11–15. מתוך ארכיון נבחרות.', en: 'HCJ 1823/15, hearing of 27 October 2016, p. 2, lines 11–15. Nivcharot archive.' },
  alt: { he: 'בן־פורת מבקשת שבית המשפט יורה למפלגה לפעול באופן שונה. השופט עוזי פוגלמן שואל אם העתירה תוקפת את שיקול דעת הרשם וגם את התקנון במישרין.', en: 'Ben-Porat asks the court to require the party to act differently. Justice Uzi Vogelman asks whether the petition challenges both the registrar’s discretion and the charter itself.' },
}
const highCourt: DocumentExcerpt = {
  file: 'high-court-2019', width: 1126, height: 187,
  label: { he: 'בג״ץ 1823/15, פסק הדין מ־10.1.2019, עמ׳ 3, סעיף 6.', en: 'HCJ 1823/15, judgment of 10 January 2019, p. 3, paragraph 6.' },
  alt: { he: 'הסעיף שבו ניתן תוקף של פסק דין להתחייבות המפלגה להסיר את המילה „איש” בתוך 21 ימים ולהצהרתה בדבר חברות נשים.', en: 'The operative paragraph gives legal effect to removal of the word “man” within 21 days and to the party’s declaration on women’s membership.' },
  source: legalCases.find(entry => entry.slug === 'agudat-yisrael')?.sections[0].source?.url,
}
const districtCourt: DocumentExcerpt = {
  file: 'jerusalem-2025', width: 1213, height: 182,
  label: { he: 'ת״א 31083-08-22, פסק הדין מ־24.12.2025, עמ׳ 10, סעיף 32.', en: 'Civil case 31083-08-22, judgment of 24 December 2025, p. 10, paragraph 32.' },
  alt: { he: 'בית המשפט מורה לש״ס להקים את התנאים לקבלת חברים וחברות לפי סעיף 4 לתקנון, ודוחה את בקשת התובעות להתקבל מיד.', en: 'The court orders Shas to establish the conditions for admissions under section 4 of its charter and declines immediate admission for the claimants.' },
  source: legalCases.find(entry => entry.slug === 'shas')?.sections[1].source?.url,
}

export function LegalHistory({ locale }: { locale: Locale }) {
  const chapters = [
    {
      date: '2012–2015',
      title: { he: 'המחאה מתחילה בפתק בקלפי', en: 'It began with a ballot' },
      body: {
        he: 'לקראת הבחירות לכנסת ה־19 פתחה אסתי שושן דף פייסבוק בשם „לא נבחרות, לא בוחרות”. נשים חרדיות הצביעו למפלגות שייצגו את הקהילה שלהן, אבל שמות של נשים נעדרו מרשימות המועמדים שלהן. כדי להבין היכן מתחיל החסם, היה צריך לחזור שלב אחד אחורה, עוד לפני הרכבת הרשימה לכנסת. מי בכלל יכולה להיות חברה במפלגה? ב־2015 הביאה עו״ד תמר בן־פורת את השאלה לבג״ץ. בתקנון של אגודת ישראל, בסעיף שקבע מי יכול להצטרף, הופיעה המילה „איש”.',
        en: 'Ahead of the election for the 19th Knesset, Esty Shushan opened a Facebook page called “No Voice, No Vote”. Haredi women voted for parties that spoke for their communities, yet women’s names were absent from their candidate lists. That raised an earlier question. Before a list is drawn up, who can join the party at all? In 2015 Tamar Ben-Porat took that question to the High Court. The membership clause in Agudat Yisrael’s charter used the word “man”.',
      },
      link: { href: `/${locale}/story`, label: { he: 'איך נולדה מחאת „לא נבחרות, לא בוחרות”', en: 'Read the history of No Voice, No Vote' } },
    },
    {
      date: '2016',
      title: { he: 'באולם הדיונים, שאלה על שייכות ועל סמכות', en: 'In the courtroom, a question of belonging and authority' },
      body: {
        he: 'בדיון בפברואר הציגה בן־פורת את הבחירה שניצבת בפני אישה המבקשת לייצג את הקהילה שלה. בדיון באוקטובר ביקש השופט עוזי פוגלמן לדייק כלפי מי מכוונת העתירה. האם היא מבקשת לבקר את החלטת רשם המפלגות, לתקוף את התקנון עצמו, או לפעול בשני המסלולים? שני הקטעים שלהלן מתעדים את השיחה באולם, בשלב שבו הצדדים עוד התווכחו על הדרך שבה בית המשפט יכול להתערב.',
        en: 'At the February hearing, Ben-Porat described the choice facing a woman who wanted to represent her own community. In October, Justice Uzi Vogelman asked her to identify exactly what the petition challenged. Was it the registrar’s decision, the party charter itself, or both? These exchanges record the argument while the court was still considering how it could intervene.',
      },
      documents: [february, october],
    },
    {
      date: '2019',
      title: { he: 'מילה אחת יוצאת מהתקנון', en: 'One word comes out of the charter' },
      body: {
        he: 'ב־10 בינואר נתן בג״ץ תוקף להתחייבות אגודת ישראל למחוק את המילה „איש” מסעיף החברות בתוך 21 יום. המפלגה גם הצהירה שהסעיף על תנועת „נשי אגודת ישראל” אינו חוסם חברות של אישה במפלגה עצמה. בפסק הדין השאיר בית המשפט פתח להליך נוסף אם אישה שתבקש להצטרף תיתקל בסירוב. השאלה הזאת נעשתה ממשית כשנשים הגישו בקשות חברות.',
        en: 'On 10 January the High Court gave legal force to Agudat Yisrael’s undertaking to remove the word “man” from its membership clause within 21 days. The party also declared that its separate women’s organisation posed no barrier to party membership. The court left open the possibility of a new case if an applicant was turned away. That question became concrete when women applied.',
      },
      documents: [highCourt],
    },
    {
      date: '2021–2023',
      title: { he: 'נשים מגישות בקשות בשמן', en: 'Women apply in their own names' },
      body: {
        he: 'בסוף 2021 ביקשו נשים חרדיות להצטרף לש״ס ולאגודת ישראל. כעת היו למאבק בקשות מסוימות ונשים שחיכו לתשובה. ב־2022 פנו נשים עם נבחרות לבתי המשפט המחוזיים בירושלים ובתל אביב. בנייר עמדה שהגישה לכנסת ב־2023 תיארה נבחרות את שני ההליכים והסבירה כיצד חברות במפלגה קשורה למאבק הרחב יותר על ייצוג ברשימות לכנסת.',
        en: 'In late 2021 Haredi women applied to join Shas and Agudat Yisrael. There were now individual applications, and women waiting for answers. In 2022, women and Nivcharot took the matter to the district courts in Jerusalem and Tel Aviv. In a 2023 paper for the Knesset, Nivcharot described both cases and explained how membership related to the broader struggle for a place on electoral lists.',
      },
      link: { href: knessetPaper, label: { he: 'נייר העמדה של נבחרות באתר הכנסת (PDF)', en: 'Nivcharot’s Knesset position paper (Hebrew PDF)' } },
    },
    {
      date: '2025',
      title: { he: 'בירושלים, ש״ס נדרשת לאפשר הגשת מועמדות', en: 'In Jerusalem, Shas is ordered to make applications possible' },
      body: {
        he: 'ב־24 בדצמבר קיבלה השופטת תמר בזק־רפפורט את התביעה בחלקה. בנקודה המכריעה של פסק הדין היא הורתה לש״ס ליצור את התנאים הדרושים לקבלת חברות וחברים לפי התקנון שלה. את הבקשה לצרף מיד את התובעות למפלגה דחתה. מבחינת אישה שרוצה להתפקד, משמעות ההכרעה הייתה שהנהלת המפלגה נדרשת לאפשר לה להגיש בקשה שאפשר לדון בה.',
        en: 'On 24 December Judge Tamar Bezek-Rappaport partly upheld the claim. The operative paragraph required Shas to establish the conditions for admitting members under its charter. The court declined the request to enrol the claimants immediately. For a woman seeking membership, the ruling required the party leadership to make it possible to submit an application for consideration.',
      },
      documents: [districtCourt],
    },
    {
      date: '2026',
      title: { he: 'בתל אביב נקבע מועד להקמת מנגנון המפקד', en: 'Tel Aviv sets a deadline for a membership process' },
      body: {
        he: 'ב־29 באוקטובר הכריע בית המשפט המחוזי בתל אביב–יפו בתביעה נגד אגודת ישראל. השופטת רחל ברקאי קבעה שהמפלגה הפרה את תקנונה ואת סעיף 14 לחוק המפלגות כאשר לא יצרה את התנאים לעריכת מפקד. היא הקציבה למפלגה 12 חודשים מיום פסק הדין להקמת התשתית הנדרשת. ההכרעה משאירה למוסדות המפלגה את ההחלטה בכל בקשת חברות. כך הגיעה השאלה שהחלה בפתק בקלפי אל המקום שבו מתקבלת הבקשה הראשונה להצטרף.',
        en: 'On 29 October the Tel Aviv–Jaffa District Court ruled on the claim against Agudat Yisrael. Judge Rachel Barkai found that by failing to establish the conditions for a membership drive, the party had breached its charter and section 14 of the Parties Law. She gave it 12 months from judgment to put that process in place. The party’s institutions retained responsibility for individual decisions. A question that began at the ballot box had reached the point where a prospective member first asks to join.',
      },
      link: { href: `/${locale}/mishpat/agudat-yisrael`, label: { he: 'לתיק אגודת ישראל ולפסק הדין מאוקטובר 2026', en: 'Read the Agudat Yisrael case and the October 2026 judgment' } },
    },
  ]

  return (
    <article aria-label={t(locale, { he: 'סיפור המאבק המשפטי', en: 'The legal campaign' })} className="mx-auto max-w-[1080px] px-6">
      {chapters.map(chapter => (
        <section key={chapter.date} className="grid gap-x-9 border-b border-divider py-9 md:grid-cols-[9rem_1fr] md:py-12">
          <p dir="ltr" className="mb-2 text-start font-heading text-xl font-bold tabular-nums text-accent-700">{chapter.date}</p>
          <div className="min-w-0 max-w-[760px]">
            <h2 className="mb-4 text-[clamp(25px,3vw,38px)] leading-tight">{t(locale, chapter.title)}</h2>
            <p className="text-[17px] leading-[1.8]">{t(locale, chapter.body)}</p>
            {chapter.documents?.map(document => <Excerpt key={document.file} document={document} locale={locale} />)}
            {chapter.link && <Link href={chapter.link.href} className="mt-4 inline-block font-semibold text-accent-700 underline">{t(locale, chapter.link.label)}</Link>}
          </div>
        </section>
      ))}
    </article>
  )
}
