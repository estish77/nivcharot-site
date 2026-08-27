import type { CollectionConfig } from 'payload'

import { AlumnaeQuotes } from './AlumnaeQuotes'
import { Categories } from './Categories'
import { ElsewhereMedia } from './ElsewhereMedia'
import { Events } from './Events'
import { Faqs } from './Faqs'
import { Inquiries } from './Inquiries'
import { Media } from './Media'
import { NewsletterSubscribers } from './NewsletterSubscribers'
import { PodcastEpisodes } from './PodcastEpisodes'
import { Posts } from './Posts'
import { PressArchive } from './PressArchive'
import { TeamMembers } from './TeamMembers'
import { TimelineMilestones } from './TimelineMilestones'

/**
 * Barrel for bilingual CONTENT collections (Post, Team, Story, Event, ...).
 * The admin auth collection (Users) is scaffold-owned and lives in
 * ./Users.ts, wired directly into payload.config.ts, not through here.
 *
 * `PressArchive`/`ElsewhereMedia` added 2026-08-16 — the two real content
 * types the site's press/media coverage lives in (src/content/press-archive.ts,
 * src/content/elsewhere-media.ts) that had no editable collection yet.
 *
 * `Inquiries` added 2026-08-19 — transactional contact-form submissions,
 * not editorial content, but it lives in this barrel anyway so
 * payload.config.ts has one place that lists every collection.
 */
export const collections: CollectionConfig[] = [
  Media,
  Categories,
  Posts,
  PressArchive,
  ElsewhereMedia,
  Events,
  PodcastEpisodes,
  TeamMembers,
  TimelineMilestones,
  Faqs,
  AlumnaeQuotes,
  Inquiries,
  NewsletterSubscribers,
]
