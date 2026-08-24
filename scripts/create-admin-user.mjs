// Run via `npm run create-admin -- <email> <password>` (payload run) —
// plain `node` can't resolve payload.config.ts's directory imports and
// fails with ERR_UNSUPPORTED_DIR_IMPORT. No default credentials on
// purpose — this file is committed to git, so a hardcoded password here
// would be a real, permanent credential leak.
import { getPayload } from 'payload'
import config from '../payload.config.ts'

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('Usage: npm run create-admin -- <email> <password>')
  process.exit(1)
}

const payload = await getPayload({ config })

const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })

if (existing.docs.length > 0) {
  console.log('User already exists:', email)
  process.exit(0)
}

await payload.create({
  collection: 'users',
  data: { email, password, role: 'admin' },
})

console.log('Created admin user:')
console.log('  email:', email)
console.log('  password:', password)
process.exit(0)
