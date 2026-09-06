import type { GlobalConfig } from 'payload'

import { About } from './About'
import { Activism } from './Activism'
import { Donate } from './Donate'
import { Halacha } from './Halacha'
import { Hanivcheret } from './Hanivcheret'
import { Home } from './Home'
import { Join } from './Join'
import { Mishpat } from './Mishpat'
import { Navigation } from './Navigation'
import { Podcast } from './Podcast'
import { SiteSettings } from './SiteSettings'
import { Story } from './Story'

/**
 * Barrel for Payload globals (SiteSettings, Navigation, and the editable
 * page-copy globals for every public route).
 *
 * `Campaigns` lived here as a global (2026-09-01 to 2026-09-06), replaced
 * by the `galleries` collection (src/payload/collections/Galleries.ts,
 * `type: 'campaigns'`), which bulk-selects images instead of one upload
 * row per post.
 */
export const globals: GlobalConfig[] = [
  SiteSettings,
  Navigation,
  Home,
  About,
  Story,
  Activism,
  Halacha,
  Mishpat,
  Podcast,
  Hanivcheret,
  Join,
  Donate,
]
