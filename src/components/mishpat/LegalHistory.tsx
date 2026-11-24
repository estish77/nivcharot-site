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
      date: '2012',
      title: { he: '״לא נבחרות, לא בוחרות״', en: 'No Voice, No Vote' },
      body: {
        he: 'לקראת הבחירות לכנסת ה־19 פתחה אסתי שושן דף פייסבוק בשם ״לא נבחרות, לא בוחרות״. נשים חרדיות התבקשו להצביע למפלגות שייצגו את הקהילה שלהן, בעוד ברשימות המועמדים של אותן מפלגות לכנסת הופיעו גברים בלבד.',
        en: 'Ahead of the election for the 19th Knesset, Esty Shushan launched the “No Voice, No Vote” campaign on Facebook. Haredi women were asked to vote for parties that represented their communities, yet those parties put forward only men for election.',
      },
      link: { href: `/${locale}/story`, label: { he: 'לסיפור המחאה', en: 'Read how the campaign began' } },
    },
    {
      date: '2015',
      title: { he: 'תמר בן־פורת עותרת לבג״ץ', en: 'Tamar Ben-Porat petitions the High Court' },
      body: {
        he: 'עוד לפני השאלה מי תופיע ברשימה לכנסת, עמדה שאלה פשוטה יותר. האם אישה יכולה להיות חברה באגודת ישראל? עו״ד תמר בן־פורת עתרה נגד רשם המפלגות ואגודת ישראל בעניין הוראות התקנון, ובהן המילה ״איש״ בסעיף החברות. נבחרות פעלה לצד העותרת וארגוני נשים נוספים.',
        en: 'Before a party draws up its list of candidates, who can join it? Lawyer Tamar Ben-Porat challenged the Registrar of Parties and Agudat Yisrael over charter provisions that included the word “man” in the membership clause. Nivcharot worked alongside the petitioner and other women’s organisations.',
      },
      quote: {
        lead: { he: 'בתגובתה בכתב השוותה אגודת ישראל בין תנועת הנשים שלה לתנועת הנוער של המפלגה. כך נימקה את ההשוואה:', en: 'In its written response, Agudat Yisrael compared its separate women’s organisation with its youth movement. The party argued:' },
        words: { he: '״כפי שהעותרת אינה טוענת כי אי צירופם של ילדים למפלגה, והקמת ארגון לילדים החוסה תחת כנפי המפלגה, מהווה אפליה פסולה, והדרת ילדים, כך אין מקום לטעון זאת לעניין נשים.״', en: '“Just as the petitioner does not claim that excluding children from the party and establishing a children’s organisation under its wing constitutes unlawful discrimination and the exclusion of children, there is no basis for making that claim regarding women.”' },
        credit: { he: 'אגודת ישראל, תגובת המשיבה 2 בבג״ץ 1823/15, עמ׳ 10, סעיף 53.', en: 'Agudat Yisrael, second respondent’s brief in HCJ 1823/15, p. 10, para. 53. Translated from Hebrew.' },
      },
    },
    {
      date: '2016',
      title: { he: 'באולם הדיונים, שאלה על שייכות ועל סמכות', en: 'In the courtroom, a question of belonging and authority' },
      body: {
        he: 'בדיון בפברואר הציגה בן־פורת את הבחירה שניצבת בפני אישה המבקשת לייצג את הקהילה שלה. בדיון באוקטובר ביקש השופט עוזי פוגלמן לדייק כלפי מי מכוונת העתירה. האם היא מבקשת לבקר את החלטת רשם המפלגות, לתקוף את התקנון עצמו, או לפעול בשני המסלולים? שני הקטעים שלהלן מתעדים את השיחה באולם, בשלב שבו הצדדים עוד התווכחו על הדרך שבה בית המשפט יכול להתערב.',
        en: 'At the February hearing, Ben-Porat described the choice facing a woman who wanted to represent her own community. In October, Justice Uzi Vogelman asked her to identify exactly what the petition challenged. Was it the registrar’s decision, the party charter itself, or both? These exchanges record the argument while the court was still considering how it could intervene.',
      },
      quote: {
        lead: { he: 'לקראת הדיון באוקטובר העלתה אגודת ישראל את הטיעון שנודע כ״מפלגת השמנים״. היא ביקשה מן השופטים לדמיין מפלגה שתגביל את ההצטרפות אליה לפי משקל:', en: 'Ahead of the October hearing, Agudat Yisrael asked the court to imagine a party that limited membership by weight. Its written submission began:' },
        words: { he: '״נניח כי המאותגרים במשקלם, בעלי משקל היתר (ובלשון העם: השמנים) יבקשו להקים לעצמם מפלגה״', en: '“Suppose that people who struggle with their weight, those who are overweight (in common parlance: fat people), wish to establish a party of their own.”' },
        credit: { he: 'אגודת ישראל, תגובה לקראת הדיון מ־27 באוקטובר 2016, בג״ץ 1823/15, עמ׳ 5, סעיפים 36–38.', en: 'Agudat Yisrael, submission for the hearing of 27 October 2016, HCJ 1823/15, p. 5, paras. 36–38. Translated from Hebrew.' },
      },
      documents: [february, october],
    },
    {
      date: '2018',
      title: { he: 'אגודת ישראל מתבקשת לשקול שינוי בתקנון', en: 'The court asks the party to reconsider its charter' },
      body: {
        he: 'בדיון ב־31 ביולי ביקשו השופטים מאגודת ישראל לשקול מחדש את הסעיפים הנוגעים לחברות נשים. ההחלטה עברה למוסדות המפלגה. אחת השאלות שהתחדדו לאורך ההליך הייתה עד היכן רשאית מפלגה להגדיר את ציבור החברים שלה.',
        en: 'At the hearing on 31 July, the justices asked Agudat Yisrael to reconsider the clauses governing women’s membership. The question went back to the party. A recurring issue was how far a party could go in defining who could belong to it.',
      },
      quote: {
        lead: { he: 'אסתי שושן תיארה לימים את דוגמת ״מפלגת השמנים״ שהעלתה אגודת ישראל. לפי הטיעון, מפלגה שקמה כדי לייצג אנשים שמנים רשאית לסרב לצרף אנשים רזים. שושן זכרה גם את תשובתה של השופטת דפנה ברק־ארז:', en: 'Esty Shushan later recalled the party’s analogy of a political party for fat people that could turn away thin applicants. In Shushan’s account, Justice Daphne Barak-Erez replied:' },
        words: { he: '״יצטרכו במפלגת השמנים לקבל גם שמנות״', en: '“The party for fat people would have to admit fat women too.”' },
        credit: { he: 'מתוך עדותה של אסתי שושן במאמר ״הן בסוף ירצו להיות בכנסת״.', en: 'From Esty Shushan’s published recollection of the proceedings. Translated from Hebrew.' },
        href: 'https://www.estymedia.co.il/single-post/נשיםבמפלגותהחרדיות',
      },
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
      date: '2021',
      title: { he: 'נבחרות יוזמת את מהלך ההתפקדות', en: 'Nivcharot organises the membership applications' },
      body: {
        he: 'בסוף 2021 יזמה נבחרות הגשה משותפת של בקשות התפקדות. בהובלת התנועה הגישו נשים חרדיות, ובהן בוגרות תוכנית ״הנבחרת״ ופעילות חברתיות, בקשות להצטרף למפלגות. הפעם היה על המפלגות לתת תשובה לנשים מסוימות שביקשו להיות חברות מן המניין.',
        en: 'In late 2021 Nivcharot organised a membership drive. Under its leadership, Haredi women, including graduates of its HaNivcheret programme and community activists, applied to join the parties. The parties now had to answer individual women seeking membership in their own names.',
      },
      link: { href: `/${locale}/hanivcheret`, label: { he: 'על תוכנית המנהיגות ״הנבחרת״', en: 'About the HaNivcheret leadership programme' } },
    },
    {
      date: '2022',
      title: { he: 'שתי תביעות מגיעות לבתי המשפט המחוזיים', en: 'Two claims reach the district courts' },
      body: {
        he: 'לאחר שבקשות התפקדות נענו בסירוב או נותרו ללא מענה, פנו נשים ונבחרות לשני בתי משפט. בירושלים התנהלה התביעה נגד ש״ס, ובתל אביב–יפו התביעה נגד אגודת ישראל. בשני ההליכים התבקשו המפלגות לאפשר דרך מעשית להצטרף.',
        en: 'After applications were refused or went unanswered, women and Nivcharot took two cases to court. The claim against Shas was heard in Jerusalem, and the claim against Agudat Yisrael in Tel Aviv–Jaffa. Both concerned a practical route to membership.',
      },
    },
    {
      date: '2023',
      title: { he: 'נבחרות מביאה את ההליכים לדיון הציבורי בכנסת', en: 'Nivcharot brings the cases to the Knesset' },
      body: {
        he: 'ב־19 בפברואר הציגה נבחרות בנייר עמדה לכנסת את סיפורן של 22 נשים שביקשו להתפקד. התנועה הסבירה מדוע הגישה לבתי המשפט חשובה לנשים שהמפלגות שלהן אינן משתפות אותן בהחלטות.',
        en: 'In a position paper dated 19 February, Nivcharot told the Knesset about 22 women who had applied for membership. The movement explained why access to the courts mattered when the parties excluded women from their decisions.',
      },
      link: { href: knessetPaper, label: { he: 'לנייר העמדה באתר הכנסת', en: 'Read the paper on the Knesset website (Hebrew)' } },
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
      <nav className="border-b border-divider py-6" aria-label={t(locale, { he: 'דילוג לשנה בציר הזמן', en: 'Jump to a year' })}>
        <p className="mb-3 font-semibold">{t(locale, { he: 'ציר הזמן של המאבק', en: 'Campaign timeline' })}</p>
        <div className="flex flex-wrap gap-2">
          {chapters.map(({ date }) => <a key={date} href={`#year-${date}`} className="rounded-full border border-divider px-3 py-1 text-sm font-bold text-accent-700 hover:underline">{date}</a>)}
        </div>
      </nav>
      <ol className="ms-2 my-8 border-s-2 border-divider">
        {chapters.map(chapter => (
          <li key={chapter.date} className="relative ps-6 sm:ps-10">
            <span aria-hidden="true" className="absolute -start-2 top-8 h-3.5 w-3.5 rounded-full border-2 border-white bg-accent-700" />
            <section id={`year-${chapter.date}`} aria-labelledby={`heading-${chapter.date}`} className="max-w-[760px] scroll-mt-28 border-b border-divider py-6 sm:py-8">
              <time dateTime={chapter.date} className="font-heading text-xl font-bold tabular-nums text-accent-700">{chapter.date}</time>
              <h2 id={`heading-${chapter.date}`} className="mb-3 mt-1 text-[clamp(24px,3vw,36px)] leading-tight">{t(locale, chapter.title)}</h2>
              <p className="text-[17px] leading-[1.8]">{t(locale, chapter.body)}</p>
              {chapter.quote && <aside className="my-4 border-s-4 border-accent bg-tint-cream p-5">
                <p className="text-base leading-relaxed">{t(locale, chapter.quote.lead)}</p>
                <blockquote className="my-3 text-xl font-semibold leading-relaxed">{t(locale, chapter.quote.words)}</blockquote>
                <p className="text-sm">{chapter.quote.href ? <a href={chapter.quote.href} className="underline">{t(locale, chapter.quote.credit)}</a> : t(locale, chapter.quote.credit)}</p>
              </aside>}
              {chapter.documents && <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-accent-700 underline">{t(locale, { he: 'לעיון בקטעים מהמסמכים המקוריים', en: 'View excerpts from the original records' })}</summary>
                {chapter.documents.map(document => <Excerpt key={document.file} document={document} locale={locale} />)}
              </details>}
              {chapter.link && <Link href={chapter.link.href} className="mt-4 inline-block font-semibold text-accent-700 underline">{t(locale, chapter.link.label)}</Link>}
            </section>
          </li>
        ))}
      </ol>
    </article>
  )
}
