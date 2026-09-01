import type { GlobalConfig } from 'payload'

import { About } from './About'
import { Activism } from './Activism'
import { Campaigns } from './Campaigns'
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
 */
export const globals: GlobalConfig[] = [
  SiteSettings,
  Navigation,
  Home,
  About,
  Story,
  Activism,
  Campaigns,
  Halacha,
  Mishpat,
  Podcast,
  Hanivcheret,
  Join,
  Donate,
]
