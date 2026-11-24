import Link from 'next/link'
import { notFound } from 'next/navigation'
import { hasRichText, RichText } from '@/components/ui'
import { LegalHistory } from '@/components/mishpat/LegalHistory'
import { legalCases, legalLead, legalTitle } from '@/content/legal-cases'
import { getMishpatContent } from '@/lib/cms'
import { isLocale, locales, t } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

type Params = Promise<{ locale: string }>

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return pageMetadata({
    locale, path: '/mishpat',
    title: t(locale, { he: 'הערוץ המשפטי – חברות נשים בש״ס ובאגודת ישראל', en: 'Legal advocacy for women’s membership in Shas and Agudat Yisrael' }),
    description: t(locale, legalLead),
  })
}

export default async function MishpatPage({ params }: { params: Params }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const content = await getMishpatContent(locale)

  return (
    <div>
      <header className="border-b-2 border-divider bg-tint-cream">
        <div className="mx-auto max-w-[1080px] px-6 py-12 md:py-16">
          <h1 className="mb-5 max-w-[20ch] text-[clamp(36px,5.5vw,68px)] leading-[1.08]">{t(locale, legalTitle)}</h1>
          <p className="max-w-[64ch] text-lg leading-relaxed">{t(locale, legalLead)}</p>
        </div>
      </header>
      <LegalHistory locale={locale} />
      <section className="mx-auto max-w-[1080px] px-6 py-10">
        <h2 className="mb-6 text-3xl">{t(locale, { he: 'ההליכים בבתי המשפט', en: 'The court cases' })}</h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {legalCases.map(entry => (
            <article key={entry.slug} className="border-t-2 border-divider pt-5">
              <p className="mb-2 text-sm font-bold text-accent-700">{t(locale, entry.reference)}</p>
              <h3 className="mb-3 text-2xl"><Link className="underline decoration-1 underline-offset-4" href={`/${locale}/mishpat/${entry.slug}`}>{t(locale, entry.title)}</Link></h3>
              <p className="leading-relaxed">{t(locale, entry.summary)}</p>
            </article>
          ))}
        </div>
      </section>
      {hasRichText(content.bodyRich) && (
        <section className="mx-auto max-w-[1080px] border-t-2 border-divider px-6 py-8">
          <details className="max-w-[760px]">
            <summary className="cursor-pointer text-xl font-bold">{t(locale, { he: 'מאמר הרקע של נבחרות', en: 'Background from Nivcharot' })} — {content.hero.title}</summary>
            <p className="my-4 leading-relaxed">{content.hero.body}</p>
            <RichText value={content.bodyRich} />
          </details>
        </section>
      )}
      <nav aria-label={t(locale, { he: 'קישורים מהערוץ המשפטי', en: 'More from Nivcharot' })} className="mx-auto flex max-w-[1080px] flex-wrap gap-x-8 gap-y-3 px-6 pb-12 font-semibold underline">
        <Link href={`/${locale}/halacha`}>{t(locale, { he: 'עמדות הלכתיות על בחירת נשים', en: 'Halakhic sources on electing women' })}</Link>
        <Link href={`/${locale}/contact`}>{t(locale, { he: 'פנייה לנבחרות', en: 'Contact Nivcharot' })}</Link>
      </nav>
    </div>
  )
}
