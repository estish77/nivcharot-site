import Link from 'next/link'
import { notFound } from 'next/navigation'
import { legalCases, legalTitle } from '@/content/legal-cases'
import { isLocale, locales, t } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

type Params = Promise<{ locale: string; caseSlug: string }>

export function generateStaticParams() {
  return locales.flatMap(locale => legalCases.map(entry => ({ locale, caseSlug: entry.slug })))
}

async function resolveCase(params: Params) {
  const { locale, caseSlug } = await params
  const entry = legalCases.find(item => item.slug === caseSlug)
  if (!isLocale(locale) || !entry) notFound()
  return { locale, entry }
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, entry } = await resolveCase(params)
  return pageMetadata({ locale, path: `/mishpat/${entry.slug}`, title: t(locale, entry.title), description: t(locale, entry.summary), type: 'article' })
}

export default async function CasePage({ params }: { params: Params }) {
  const { locale, entry } = await resolveCase(params)
  return (
    <article className="mx-auto max-w-[800px] px-6 py-14">
      <Link href={`/${locale}/mishpat`} className="text-sm font-semibold underline">{t(locale, legalTitle)}</Link>
      <p className="mt-9 text-sm font-bold text-accent-700">{t(locale, entry.reference)}</p>
      <h1 className="my-4 text-[clamp(32px,5vw,56px)] leading-tight">{t(locale, entry.title)}</h1>
      <p className="mb-10 max-w-[65ch] text-lg leading-relaxed">{t(locale, entry.summary)}</p>
      {entry.sections.map(section => (
        <section key={section.heading.en} className="border-t-2 border-divider py-7">
          <h2 className="mb-3 text-2xl">{t(locale, section.heading)}</h2>
          <p className="mb-4 leading-relaxed">{t(locale, section.body)}</p>
          {section.source && <a className="font-semibold text-accent-700 underline" href={section.source.url}>{t(locale, section.source.label)}</a>}
        </section>
      ))}
    </article>
  )
}
