import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LegalHistory } from '@/components/mishpat/LegalHistory'
import { legalCases, legalLead, legalTitle } from '@/content/legal-cases'
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

  return (
    <div>
      <header className="border-b-2 border-divider bg-tint-cream">
        <div className="mx-auto max-w-[1080px] px-6 py-12 md:py-16">
          <h1 className="mb-5 max-w-[20ch] text-[clamp(36px,5.5vw,68px)] leading-[1.08]">{t(locale, legalTitle)}</h1>
          <p className="max-w-[64ch] text-lg leading-relaxed">{t(locale, {
            he: 'ב־2012 שאלו נשים חרדיות מדוע הן מתבקשות להצביע לרשימות שאין בהן אף אישה. הדרך לייצוג בכנסת הובילה לשאלה מי יכולה להצטרף למפלגה כחברה. תחילה התחייבה אגודת ישראל לשנות את התקנון שלה. כשנשים ביקשו להתפקד בהובלת נבחרות, הן גילו מה עוד נדרש כדי שבקשותיהן יידונו. מכאן יצאו שתי תביעות, אחת נגד ש״ס ואחת נגד אגודת ישראל.',
            en: 'In 2012, Haredi women asked why they were expected to vote for lists without a single woman on them. The campaign for representation in the Knesset raised a question about party membership. Agudat Yisrael first agreed to change its charter. When women applied to join the parties in a drive organised by Nivcharot, they discovered what it would take just to have their applications heard. They brought two claims, one against Shas and one against Agudat Yisrael.',
          })}</p>
        </div>
      </header>
      <LegalHistory locale={locale} />
      <section id="case-files" aria-labelledby="case-files-heading" className="mx-auto max-w-[1080px] px-6 py-10">
        <h2 id="case-files-heading" className="mb-6 text-3xl">{t(locale, { he: 'להעמקה בשני התיקים', en: 'Explore the two case files' })}</h2>
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
    </div>
  )
}
