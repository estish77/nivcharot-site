import type { GlobalConfig } from 'payload'

import { About } from './About'
import { Activism } from './Activism'
import { Donate } from './Donate'
import { Hanivcheret } from './Hanivcheret'
import { Home } from './Home'
import { Join } from './Join'
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
  Podcast,
  Hanivcheret,
  Join,
  Donate,
]
