import Image from 'next/image'

import { t, type Locale } from '@/lib/i18n'

const media = '/assets/campaigns/empty-chairs'
const photos = [
  {
    file: 'poster',
    width: 1131,
    height: 1600,
    alt: {
      he: 'כרזה בשחור ולבן ובה איור ספסל והכיתוב ״יש כיסאות שאת כאשה לא יכולה לשבת עליהם״',
      en: 'Black-and-white poster with a bench and the Hebrew words “There are seats you cannot sit on as a woman.”',
    },
    caption: { he: 'הכרזה שהסבירה את המחאה', en: 'The poster explaining the protest' },
  },
  {
    file: 'bench',
    width: 1600,
    height: 1200,
    alt: {
      he: 'שלט ״הישיבה לגברים בלבד״ מודבק למשענת של ספסל ירוק ליד קיר אבן',
      en: 'A “Seating for men only” sign attached to a green public bench beside a stone wall.',
    },
    caption: { he: 'כך נראה השלט על ספסל ברחוב', en: 'The sign on a public bench' },
  },
]

export function EmptyChairsCampaign({ locale }: { locale: Locale }) {
  return (
    <article id="empty-chairs" aria-labelledby="empty-chairs-title" className="scroll-mt-24 border-b-2 border-divider py-8">
      <p className="mb-2 text-sm font-semibold text-accent-700">
        <time dateTime="2019-09">{t(locale, { he: 'ספטמבר 2019', en: 'September 2019' })}</time>
      </p>
      <h3 id="empty-chairs-title" className="mb-3 text-[28px]">
        {t(locale, { he: 'מחאת הכיסאות', en: 'The Empty Chairs protest' })}
      </h3>
      <p className="mb-6 max-w-[700px] leading-relaxed">
        {t(locale, {
          he: 'ימים אחדים לפני הבחירות לכנסת ה־22 הופיעו על ספסלים ציבוריים ברחבי הארץ שלטים שעליהם נכתב ״הישיבה לגברים בלבד״. השלטים עוררו מחאה ברשת. נבחרות ביקשה להפנות את אותה שאלה אל הכנסת. אם מובן מאליו שלאישה יש מקום על הספסל ברחוב, מדוע אין לה מקום ברשימת המועמדים של מפלגתה? נשות הארגון קראו להצביע למפלגות שמשלבות נשים ברשימותיהן.',
          en: 'Days before the election for the 22nd Knesset, signs appeared on public benches across Israel reading “Seating for men only.” People took to social media to object. Nivcharot asked why a woman who could take a seat on a public bench could not take one on her own party’s candidate list. The activists called on voters to support parties that included women on their lists.',
        })}
      </p>
      <figure className="max-w-[800px]">
        <video controls playsInline preload="none" width={1280} height={720}
          poster={media + '-film.jpg'} src={media + '-2019.mp4'}
          aria-labelledby="empty-chairs-film-caption" className="aspect-video h-auto w-full bg-black" />
        <figcaption id="empty-chairs-film-caption" className="mt-2 text-sm text-neutral-700">
          {t(locale, { he: 'סרטון המחאה עם כתוביות בעברית · 2 דקות ו־13 שניות', en: 'Campaign film in Hebrew with Hebrew captions · 2 min 13 sec' })}
        </figcaption>
      </figure>
      <div className="mt-6 grid items-start gap-5 sm:grid-cols-2">
        {photos.map((photo) => (
          <figure key={photo.file}>
            <a href={media + '-' + photo.file + '.webp'} className="block focus-visible:outline-accent">
              <Image unoptimized src={media + '-' + photo.file + '.webp'} alt={t(locale, photo.alt)}
                width={photo.width} height={photo.height} className="h-auto max-h-[420px] w-full object-contain object-top" />
            </a>
            <figcaption className="mt-2 text-sm text-neutral-700">{t(locale, photo.caption)}</figcaption>
          </figure>
        ))}
      </div>
      <a className="mt-6 inline-block font-semibold text-accent-700 underline underline-offset-4"
        href="https://www.ynet.co.il/articles/0,7340,L-5587296,00.html">
        {t(locale, { he: 'לכתבה ב־ynet שבה נחשף הסרטון ב־12 בספטמבר 2019', en: 'Read the ynet story that premiered the film on 12 September 2019 (Hebrew)' })}
      </a>
    </article>
  )
}
