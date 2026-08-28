import { Eyebrow, Reveal, Section, SectionHead } from '@/components/ui'
import { contactEmail } from '@/content/contact'
import { hanivcheretApply, hanivcheretProgram } from '@/content/hanivcheret'
import { t, type Locale } from '@/lib/i18n'

import { ApplyForm } from './ApplyForm'

/**
 * What the programme actually is, and the sign-up for the next cycle
 * (2026-08-28 brief: the page should present the project and collect
 * details into the system, instead of handing people to an external
 * landing page).
 *
 * The facts come from Nivcharot's own registration page; see
 * `hanivcheretProgram` for why no dates are stated here.
 */
export function ApplySection({ locale }: { locale: Locale }) {
  return (
    <>
      <Reveal as="section">
        <Section as="div" maxWidth={1240} borderBlockStart paddingBlockStart="48px" paddingBlockEnd="48px">
          <SectionHead
            eyebrow={t(locale, hanivcheretProgram.eyebrow)}
            title={t(locale, hanivcheretProgram.title)}
            lead={t(locale, hanivcheretProgram.lead)}
            titleClassName="text-[clamp(24px,3vw,32px)]"
            className="mb-7"
          />

          <dl className="m-0 grid grid-cols-4 border-t-2 border-s-2 border-divider max-[860px]:grid-cols-2 max-[560px]:grid-cols-1">
            {hanivcheretProgram.facts.map((fact) => (
              <div key={t(locale, fact.label)} className="border-e-2 border-b-2 border-divider px-5 py-[18px]">
                <dt className="font-heading text-[11px] font-extrabold tracking-[0.12em] text-accent-700">
                  {t(locale, fact.label)}
                </dt>
                <dd className="m-0 mt-1.5 text-[14.5px] leading-[1.6] text-neutral-800">{t(locale, fact.value)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-9">
            <Eyebrow className="mb-3">{t(locale, hanivcheretProgram.topicsTitle)}</Eyebrow>
            <ul className="m-0 grid list-none grid-cols-2 gap-x-8 gap-y-0 p-0 max-[720px]:grid-cols-1">
              {hanivcheretProgram.topics.map((topic) => (
                <li
                  key={t(locale, topic)}
                  className="flex items-start gap-2.5 border-b-2 border-divider py-3 text-[14.5px] leading-[1.6] text-neutral-800"
                >
                  <span aria-hidden="true" className="mt-[9px] block h-[6px] w-[6px] flex-none bg-accent" />
                  {t(locale, topic)}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13.5px] leading-[1.7] text-neutral-700">
              {t(locale, hanivcheretProgram.mentoringNote)}
            </p>
          </div>
        </Section>
      </Reveal>

      <Reveal as="section">
        <Section as="div" tint="tint-cream" maxWidth={1240} borderBlock paddingBlockStart="48px" paddingBlockEnd="56px">
          <SectionHead
            eyebrow={t(locale, hanivcheretApply.eyebrow)}
            title={t(locale, hanivcheretApply.title)}
            lead={t(locale, hanivcheretApply.lead)}
            titleClassName="text-[clamp(24px,3vw,32px)]"
            className="mb-6"
          />
          <p className="mb-8 max-w-[640px] text-[13.5px] leading-[1.7] text-neutral-700">
            {t(locale, hanivcheretApply.processNote)}
          </p>
          <ApplyForm locale={locale} contactEmail={contactEmail} />
        </Section>
      </Reveal>
    </>
  )
}
