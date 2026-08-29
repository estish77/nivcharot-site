// Writes the ENGLISH locale for team members, to match whatever Hebrew is
// currently in the CMS.
//
//   NODE_ENV=production DATABASE_URI="<uri>" npx payload run scripts/translate-team-en.mjs
//
// Deliberately the mirror image of `sync-team-members.mjs`, which may no
// longer touch production at all. That script pushed a code fixture over
// the whole record, Hebrew included, and on 2026-08-28 it overwrote a
// day's editing in /admin.
//
// This one:
//   - writes ONLY `locale: 'en'`, so the Hebrew can never be touched;
//   - writes ONLY name, role and bio — never order, category, active or
//     photo, so it can't reorder or hide anyone;
//   - matches people by their Hebrew name and skips anyone it has no
//     translation for, rather than blanking them.
//
// The Hebrew in the dashboard is the source of truth. When it changes, add
// the new English here and re-run.
import { getPayload } from 'payload'
import config from '../payload.config.ts'

function textToLexical(paragraphs, direction = 'ltr') {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction,
        children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
      })),
    },
  }
}

/** Keyed by the Hebrew name exactly as it appears in the collection. */
const TRANSLATIONS = {
  'אסתי שושן': {
    role: 'Founder and CEO',
    bio: 'A filmmaker and cultural figure, host of the "Haredit Meduberet" podcast.',
  },
  'הילה ילון': {
    role: 'Educator. Board member',
  },
  'עו"ד יואב ללום': {
    role: 'Board member',
  },
  'הילה חסן לפקוביץ': {
    role: 'Former projects manager, association member',
    bio: 'Today chair of the religious council in Kfar Yona. A graduate of HaNivcheret cohort 1.',
  },
  'תרצה בלוך אסתרזון': {
    role: 'Community management, association member',
    bio: 'A content writer, translator and digital marketer. A community activist on health, welfare and Haredi women, promoting initiatives for single-parent families and women in the workforce.',
  },
  "שני מונצ'ק": {
    role: 'Project manager',
    bio: 'A coach and emotional therapist. Manager of the "HaNivcheret" leadership project, a leadership reserve for Haredi women.',
  },
  'אפרת שוקרון': {
    role: 'Programme facilitator, association member',
    bio: "A media professional and panelist, a Haredi feminist and social activist on ethnic discrimination, core-curriculum studies and Haredi women's representation in decision-making.",
  },
  'אסתר קרמר': {
    role: 'Lecturer and community coordinator',
    bio: 'A social activist for the realisation of rights for people with disabilities, a manager and coordinator in Nivcharot\'s "Achotenu At" community, and a lecturer and coordinator for government relations. A graduate of "HaNivcheret" cohort 1.',
  },
  'שלי רפופורט': {
    role: 'Course and workshop facilitator',
    bio: 'A senior strategic consultant, lecturer, facilitator and educator specialising in gender equality, diversity and inclusion.',
  },
  'מלכי רוטנר': {
    role: 'Facilitator and lecturer',
    bio: "An activist, commentator and hasidic feminist. A facilitator and lecturer in the movement's programmes.",
  },
  'שרה ינץ': {
    role: 'Social media, research and production',
    bio: 'Researcher and producer on the "Haredit Meduberet" podcast.',
  },
  'עו"ד ראובן ביטון': {
    role: 'Legal advisor',
    bio: 'Specialises in civil litigation, administrative law and arbitration.',
  },
  'אסתי רידר אינדורסקי': {
    role: 'Co-CEO of Nivcharot, 2016–2018',
    bio: 'A lecturer, author and researcher. Her book “VeShe’einan Nir’ot” (“And Those Who Are Not Seen”) tells the story of how the movement began. A leading activist in the 2015 “Lo Nivcharot, Lo Bochrot” campaign.',
  },
  'רחלי איבנבוים': {
    role: 'Co-founder of "Meoravut"; activist in the "Lo Nivcharot, Lo Bochrot" campaign, 2015',
    bio: 'A co-founder of "Meoravut". Works to bring Haredi women into employment, academia and politics.',
  },
  'טלי פרקש': {
    role: 'Activist in the "Lo Nivcharot, Lo Bochrot" campaign, 2015',
    bio: 'A Haredi journalist, researcher, commentator and activist.',
  },
  'רחלי רושגולד גוטליב': {
    role: 'Government relations',
    bio: 'A co-founder of "Lo Tishtok", campaigning against sexual abuse in Haredi society. Formerly Nivcharot\'s government-relations manager.',
  },
  "מיכל צ'רנוביצקי": {
    role: 'Activist in the "Lo Nivcharot, Lo Bochrot" campaign, 2015',
    bio: 'A researcher, political activist and Haredi activist, working to advance and integrate Haredi society within Israel.',
  },
  'ציפי לביא': {
    role: 'Projects and government relations',
    // "נבחרותת" in the Hebrew is a typo for "נבחרות"; rendered correctly here.
    bio: 'A Haredi activist and influencer, formerly the organisation\'s projects and government-relations manager. Among other things she ran Nivcharot\'s "Haredot Shutafot" project. A graduate of HaNivcheret cohort 5.',
  },
  'רחלי סלומון (מורגנשטרן)': {
    // Created while /admin was on the English tab, so the English slots held
    // her Hebrew text — name included.
    name: 'Racheli Salomon (Morgenstern)',
    role: 'Social and political activist',
    bio: 'A counsellor for couples in second marriages, an actress and a social activist, one of the initiators of the Mamlachti-Haredi (state-Haredi) schooling project in Petah Tikva, a graduate of HaNivcheret cohort 1, and one of the first women to run for city council in 2018.',
  },
  'לאה שיינברום': {
    role: 'Founder and community manager',
    bio: 'A clinical social worker (M.S.W.), emotional therapist and activist, founder of the "Si\'aH" groups. A graduate of HaNivcheret cohort 5.',
  },
  'רעיה מרי': {
    role: 'Projects and community management',
    bio: "A media professional and activist, a graduate of HaNivcheret cohort 4, formerly Nivcharot's community and projects manager, and lead petitioner in the case against Shas.",
  },
}

const payload = await getPayload({ config })
const all = await payload.find({ collection: 'team-members', locale: 'he', limit: 200, depth: 0 })

let updated = 0
let skipped = 0
for (const doc of all.docs) {
  const t = TRANSLATIONS[doc.name]
  if (!t) {
    console.log(`  no translation on file, left untouched: ${doc.name}`)
    skipped++
    continue
  }
  const data = {}
  if (t.name) data.name = t.name
  if (t.role) data.role = t.role
  if (t.bio) data.bio = textToLexical([t.bio], 'ltr')
  if (!Object.keys(data).length) continue

  await payload.update({
    collection: 'team-members',
    id: doc.id,
    locale: 'en',
    context: { disableRevalidate: true, disableAutoTranslate: true },
    data,
  })
  updated++
  console.log(`  en updated: ${doc.name}`)
}

console.log(`\nupdated=${updated} skipped=${skipped}`)
process.exit(0)
