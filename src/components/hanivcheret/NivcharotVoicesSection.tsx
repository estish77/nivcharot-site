import { Cell, CellGrid, Reveal, Section, SectionHead } from '@/components/ui'
import { t, type Locale, type Localized } from '@/lib/i18n'

/**
 * Women from Nivcharot speaking, embedded from the movement's own media
 * channel (2026-08-28 brief: "add video from Nivcharot's media channel of
 * the women speaking and telling").
 *
 * Deliberately NOT folded into `AlumnaeVideosSection`. That component is
 * specifically for graduates of the HaNivcheret programme — its type
 * carries a required `cohort` field, and its own comment insists it may
 * only ever hold verified alumnae. The women below are Nivcharot activists
 * and staff; presenting them as programme alumnae, and inventing a cohort
 * number for each, would be exactly the kind of fabrication that comment
 * forbids. So they get their own, accurately-labelled section and the
 * alumnae grid stays empty until real alumnae footage exists.
 *
 * Every name, role and topic below is taken from the channel's own title
 * and description for that video — nothing here is inferred.
 */
type Voice = {
  videoId: string
  /** Real name — not localized; person names aren't translated. */
  name: string
  role: Localized
  topic: Localized
}

const VOICES: Voice[] = [
  {
    videoId: 'WMhUIEMB8Vc',
    name: 'יפעת חיים',
    role: { he: 'פעילת נבחרות', en: 'Nivcharot activist' },
    topic: {
      he: 'בוועדת הרווחה בכנסת, על צורכי הציבור מאז ה-7 באוקטובר',
      en: "At the Knesset welfare committee, on the public's needs since October 7",
    },
  },
  {
    videoId: 'evf1KvUDZL4',
    name: 'לאה שיינברום',
    role: { he: 'עובדת סוציאלית ופעילה חברתית בנבחרות', en: 'Social worker and Nivcharot activist' },
    topic: {
      he: 'בוועדה, על הצורך בהרחבת המענים בקהילה למתמודדי ומתמודדות נפש',
      en: 'At committee, on the need to widen community mental-health provision',
    },
  },
  {
    videoId: 'X_cyqJsiFAo',
    name: 'ציפי לביא',
    role: { he: 'אקטיביסטית חרדית בנבחרות', en: 'Haredi activist with Nivcharot' },
    topic: {
      he: 'על הפגיעה הצפויה בזכויות נשים עם הרחבת סמכויות בתי הדין הרבניים',
      en: "On the expected harm to women's rights as rabbinical courts' powers widen",
    },
  },
  {
    videoId: 'V3RKW7y86s4',
    name: 'רעיה חתוכה מרי',
    role: { he: 'מנהלת הפרויקטים בנבחרות', en: 'Projects manager at Nivcharot' },
    topic: {
      he: 'נכנסת לכנס פוליטי המיועד לגברים בלבד ומבקשת מיו"ר אגודת ישראל לאפשר לנשים להשתתף',
      en: "Walking into a men-only political conference and asking Agudat Yisrael's chair to let women take part",
    },
  },
  {
    videoId: 'omQeHUDvNBE',
    name: 'טובה בוריה',
    role: { he: 'פעילת נבחרות ומנכ"לית עמותת טוב בלב', en: 'Nivcharot activist, CEO of the Tov BaLev association' },
    topic: {
      he: 'על המחסור במגרשי ספורט בבני ברק וההשפעה על הנוער החרדי',
      en: 'On the shortage of sports grounds in Bnei Brak and its effect on Haredi youth',
    },
  },
  {
    videoId: 'cU8WSUgdAp0',
    name: 'אפרת שוקרון',
    role: { he: 'פעילת נבחרות', en: 'Nivcharot activist' },
    topic: {
      he: 'על מצב הנשים החרדיות בתקופת הקורונה, ולמה יש מקום לאופטימיות',
      en: 'On Haredi women during the pandemic, and why there is room for optimism',
    },
  },
]

const sectionText = {
  eyebrow: { he: 'קולות מהשטח', en: 'VOICES FROM THE FIELD' } satisfies Localized,
  title: { he: 'נשים מנבחרות מדברות', en: 'Women of Nivcharot, speaking' } satisfies Localized,
  lead: {
    he: 'פעילות נבחרות בוועדות הכנסת, בכנסים ובאולפנים, מציגות את הדברים בעצמן. מתוך ערוץ המדיה של נבחרות.',
    en: "Nivcharot activists at Knesset committees, conferences and studios, making the case themselves. From Nivcharot's own media channel.",
  } satisfies Localized,
}

export function NivcharotVoicesSection({ locale }: { locale: Locale }) {
  return (
    <Reveal as="section">
      <Section as="div" maxWidth={1240} borderBlockStart paddingBlockStart="48px" paddingBlockEnd="52px">
        <SectionHead
          eyebrow={t(locale, sectionText.eyebrow)}
          title={t(locale, sectionText.title)}
          lead={t(locale, sectionText.lead)}
          titleClassName="text-[clamp(24px,3vw,32px)]"
          className="mb-7"
        />
        <CellGrid cols={3}>
          {VOICES.map((voice) => (
            <Cell key={voice.videoId} className="gap-3">
              <div className="aspect-video w-full border-2 border-niv-slate bg-[#141210]">
                <iframe
                  title={`${voice.name} — ${t(locale, voice.topic)}`}
                  src={`https://www.youtube.com/embed/${voice.videoId}?rel=0`}
                  loading="lazy"
                  className="block h-full w-full border-0"
                  allow="encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <h3 className="text-[18px] leading-[1.3]">{voice.name}</h3>
              <p className="m-0 font-heading text-[11.5px] font-extrabold tracking-[0.04em] text-accent-700">
                {t(locale, voice.role)}
              </p>
              <p className="m-0 text-[14px] leading-[1.65] text-neutral-800">{t(locale, voice.topic)}</p>
            </Cell>
          ))}
        </CellGrid>
      </Section>
    </Reveal>
  )
}
