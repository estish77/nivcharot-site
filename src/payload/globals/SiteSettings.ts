import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '../access/isAdminOrEditor'
import { autoTranslateGlobalHook } from '../hooks/autoTranslate'
import { revalidateGlobal } from '../hooks/revalidate'

/**
 * Sitewide facts and links that appear in the footer and on the Donate
 * page across every mockup (docs/Shop.dc.html, docs/Post.dc.html footer,
 * etc.): the NGO registration number, contact email, standing social
 * accounts, Morning donation checkout links, newsletter signup, and bank
 * transfer details. Values default to the ones hardcoded in the mockups
 * so the site round-trips today; editors can update them without a
 * redeploy going forward.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobal('site-settings'), autoTranslateGlobalHook()],
  },
  fields: [
    {
      name: 'ngoNumber',
      type: 'text',
      required: true,
      defaultValue: '580619120',
      admin: { position: 'sidebar', description: 'עמותה רשומה (ע"ר) registration number.' },
    },
    {
      name: 'contactEmail',
      type: 'email',
      required: true,
      defaultValue: 'estish@nivcharot.com',
    },
    {
      name: 'social',
      type: 'group',
      admin: { description: 'Handles used in the sitewide footer (docs/Post.dc.html and others).' },
      fields: [
        { name: 'facebook', type: 'text', defaultValue: 'https://www.facebook.com/NoVoiceNoVote/' },
        { name: 'instagram', type: 'text', defaultValue: 'https://www.instagram.com/nivcharot/' },
        {
          name: 'youtube',
          type: 'text',
          admin: { description: '"חרדית מדוברת" (podcast) channel.' },
          defaultValue:
            'https://www.youtube.com/@%D7%97%D7%A8%D7%93%D7%99%D7%AA%D7%9E%D7%93%D7%95%D7%91%D7%A8%D7%AA',
        },
        {
          name: 'spotify',
          type: 'text',
          defaultValue: 'https://open.spotify.com/show/7HwVj9J7rnUFqoiUDtc1oL',
        },
        {
          name: 'applePodcasts',
          type: 'text',
          defaultValue: 'https://podcasts.apple.com/il/podcast/id1767223746',
        },
        {
          name: 'podcastInstagram',
          type: 'text',
          admin: { description: 'Separate Instagram used specifically for the podcast, "@haredit_meduberet".' },
          defaultValue: 'https://www.instagram.com/haredit_meduberet/',
        },
        {
          name: 'hostInstagram',
          type: 'text',
          admin: { description: "Podcast host Esty Shushan's personal Instagram, used on docs/Podcast.dc.html." },
          defaultValue: 'https://www.instagram.com/esty_shushan/',
        },
        {
          name: 'hostFacebook',
          type: 'text',
          defaultValue: 'https://www.facebook.com/profile.php?id=61565500745331',
        },
        { name: 'hostX', type: 'text', defaultValue: 'https://x.com/estyshushan' },
        { name: 'hostTiktok', type: 'text', defaultValue: 'https://www.tiktok.com/@estybittonshushan' },
      ],
    },
    {
      name: 'donation',
      type: 'group',
      admin: { description: 'Morning ("מורנינג") secure checkout links from docs/Shop.dc.html.' },
      fields: [
        {
          name: 'standingOrderUrl',
          type: 'text',
          required: true,
          defaultValue: 'https://mrng.to/WJUIrZs6F9',
          admin: {
            description:
              'Fallback recurring standing-order checkout. The Donate page now links each preset amount to its own Morning form (src/content/donate.ts, donateStandingOrderLinks); this value is only used for an amount that has no entry there.',
          },
        },
        {
          name: 'cardUrl',
          type: 'text',
          required: true,
          defaultValue: 'https://mrng.to/KPpOoC6rJ2',
          admin: { description: 'One-time or recurring credit-card checkout.' },
        },
      ],
    },
    {
      name: 'newsletterUrl',
      type: 'text',
      defaultValue: 'https://lp.vp4.me/8sit',
    },
    {
      name: 'bank',
      type: 'group',
      admin: { description: 'Bank-transfer details from docs/Shop.dc.html.' },
      fields: [
        { name: 'bankName', type: 'text', required: true, defaultValue: 'מזרחי טפחות (20)' },
        {
          name: 'accountHolder',
          type: 'text',
          required: true,
          defaultValue: 'נבחרות (ע"ר) 580619120',
        },
        { name: 'iban', type: 'text', required: true, defaultValue: 'IL32 0205 5000 0000 0238 975' },
        { name: 'swift', type: 'text', required: true, defaultValue: 'MIZBILIT' },
      ],
    },
    {
      name: 'taxText',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description:
          'Tax-deductibility note, e.g. "כל תרומה מזכה בהחזר מס לפי סעיף 46" (docs/Shop.dc.html).',
      },
    },
  ],
}
