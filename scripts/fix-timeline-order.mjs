// One-off: fixes two spots where the `order` field (which drives the
// Story timeline's display sequence, independent of the `year` label —
// see TimelineMilestones.ts's own note) had drifted out of chronological
// sync, presumably from incremental edits over time. The timeline is
// newest-first (order ascending = year descending, oldest "Background"
// card last), so:
//
//   - id 7 (2022, "two petitions to district court") sat wedged between
//     two 2024 entries (id 6 and id 8) — moved after both.
//   - id 13 and 14 (2021, the "Eshet Chayil" film and Hila Chason
//     Lefkowitz's council seat) sat between two 2019 entries — moved
//     before them, since 2021 is more recent than 2019.
//
// Uses fractional order values (5.1-5.4) between the existing neighbors
// (id 6 = order 5, id 9 = order 8) so only these 4 documents need
// touching — every other milestone's `order` stays exactly as it was.
// Two genuinely ambiguous multi-year entries (id 9 "2020/23", id 17
// "2017-2019") were left untouched; their current placement is a
// defensible read of a range label, not a clear violation like the two
// above.
import { getPayload } from 'payload'
import config from '../payload.config.ts'

const payload = await getPayload({ config })

const fixes = [
  { id: 8, order: 5.1 },
  { id: 7, order: 5.2 },
  { id: 13, order: 5.3 },
  { id: 14, order: 5.4 },
]

for (const { id, order } of fixes) {
  await payload.update({
    collection: 'timeline-milestones',
    id,
    context: { disableRevalidate: true },
    data: { order },
  })
  console.log(`id=${id} -> order=${order}`)
}

const check = await payload.find({ collection: 'timeline-milestones', locale: 'he', sort: 'order', limit: 200, depth: 0 })
for (const doc of check.docs) {
  console.log(`order=${doc.order}\tyear=${doc.year}\tid=${doc.id}\t${doc.title}`)
}

process.exit(0)
