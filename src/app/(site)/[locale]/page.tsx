import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { DonateBand, GoalSection, Hero, MediaArchive, StatsBand, Timeline } from '@/components/home'
import { Footer } from '@/components/ui/Footer'
import { Header } from '@/components/ui/Header'
import { getHomeContent, getNavigationLinks, getSiteSettings } from '@/lib/cms'
import { isLocale, locales, t, type Locale } from '@/lib/i18n'
import { pageMetadata } from '@/lib/seo'

/** Ported from docs/"Home copy.dc.html" — see src/components/home/** for the section-by-section breakdown. */

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale: Locale = isLocale(rawLocale) ? rawLocale : 'he'

  return pageMetadata({
    locale,
    path: '',
    title: t(locale, { he: 'נבחרות | ייצוג, שוויון וקול לנשים חרדיות', en: 'Nivcharot | Representation, equality and voice for Haredi women' }),
    description: t(locale, {
      he: 'נבחרות היא תנועת נשים חרדיות הפועלת לייצוג פוליטי הוגן: הכשרת מנהיגות, פעילות משפטית וחקיקתית, והעלאת מודעות ציבורית מאז 2012.',
      en: 'Nivcharot is a movement of Haredi women working for fair political representation: leadership training, legal and legislative advocacy, and public awareness since 2012.',
    }),
  })
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params

  if (!isLocale(rawLocale)) {
    notFound()
  }

  const locale = rawLocale
  const [navLinks, homeContent, siteSettings] = await Promise.all([
    getNavigationLinks(locale),
    getHomeContent(locale),
    getSiteSettings(),
  ])

  return (
    <>
      {/* Home is the one mockup page with no divider under the header — see `Header`'s `bordered` doc comment. */}
      <Header locale={locale} navLinks={navLinks} bordered={false} />
      <main id="main-content" className="flex-1">
        <Hero locale={locale} content={homeContent.hero} />
        <StatsBand locale={locale} tiles={homeContent.statTiles} />
        <GoalSection locale={locale} section={homeContent.goalSection ?? undefined} cards={homeContent.pillarCards} />
        {/*
          The donate band sits directly under "המטרה והאמצעים" (2026-08-28
          brief) rather than after the timeline: the ask lands while the
          reader has just been told what the work is and why, instead of
          after a long scroll through the movement's history.
        */}
        <DonateBand locale={locale} />
        <Timeline locale={locale} />
        <MediaArchive locale={locale} />
      </main>
      <Footer locale={locale} donateHref={`/${locale}/donate`} contactEmail={siteSettings.contactEmail} social={siteSettings.social} />
    </>
  )
}
