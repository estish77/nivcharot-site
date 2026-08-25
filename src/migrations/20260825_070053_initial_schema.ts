import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('he', 'en');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_posts_review_status" AS ENUM('needs-review', 'keep', 'hidden');
  CREATE TYPE "public"."enum_press_archive_type" AS ENUM('article', 'video', 'press-mention', 'podcast');
  CREATE TYPE "public"."enum_press_archive_category" AS ENUM('coverage', 'opinion', 'interview', 'controversy');
  CREATE TYPE "public"."enum_press_archive_source_language" AS ENUM('he', 'en');
  CREATE TYPE "public"."enum_press_archive_link_kind" AS ENUM('external', 'internal');
  CREATE TYPE "public"."enum_press_archive_review_status" AS ENUM('needs-review', 'keep', 'hidden');
  CREATE TYPE "public"."enum_elsewhere_media_kind" AS ENUM('podcast', 'video', 'talk');
  CREATE TYPE "public"."enum_elsewhere_media_source_language" AS ENUM('he', 'en');
  CREATE TYPE "public"."enum_elsewhere_media_review_status" AS ENUM('needs-review', 'keep', 'hidden');
  CREATE TYPE "public"."enum_events_review_status" AS ENUM('needs-review', 'keep', 'hidden');
  CREATE TYPE "public"."enum_faqs_page" AS ENUM('home', 'about', 'story', 'activism', 'podcast', 'hanivcheret', 'join', 'donate');
  CREATE TYPE "public"."enum_inquiries_locale" AS ENUM('he', 'en');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'read', 'archived');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_source_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"cover_image_id" integer,
  	"featured" boolean DEFAULT false,
  	"review_status" "enum_posts_review_status" DEFAULT 'needs-review' NOT NULL,
  	"legacy_id" varchar,
  	"legacy_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "press_archive" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_press_archive_type" DEFAULT 'article' NOT NULL,
  	"category" "enum_press_archive_category" DEFAULT 'coverage' NOT NULL,
  	"sort_date" timestamp(3) with time zone NOT NULL,
  	"year" numeric NOT NULL,
  	"source_language" "enum_press_archive_source_language" DEFAULT 'he' NOT NULL,
  	"link_kind" "enum_press_archive_link_kind" DEFAULT 'external' NOT NULL,
  	"url" varchar,
  	"featured" boolean DEFAULT false,
  	"review_status" "enum_press_archive_review_status" DEFAULT 'needs-review' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "press_archive_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"outlet" varchar NOT NULL,
  	"date_label" varchar NOT NULL,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "elsewhere_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"kind" "enum_elsewhere_media_kind" DEFAULT 'podcast' NOT NULL,
  	"host" varchar NOT NULL,
  	"sort_date" timestamp(3) with time zone NOT NULL,
  	"source_language" "enum_elsewhere_media_source_language" DEFAULT 'he' NOT NULL,
  	"url" varchar NOT NULL,
  	"review_status" "enum_elsewhere_media_review_status" DEFAULT 'needs-review' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "elsewhere_media_locales" (
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"date_label" varchar,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "events_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "events_photos_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"credit" varchar,
  	"cover_image_id" integer,
  	"review_status" "enum_events_review_status" DEFAULT 'needs-review' NOT NULL,
  	"legacy_id" varchar,
  	"legacy_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "podcast_episodes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric NOT NULL,
  	"guest_name" varchar,
  	"published_at" timestamp(3) with time zone NOT NULL,
  	"apple_id" varchar,
  	"spotify_url" varchar,
  	"youtube_url" varchar,
  	"apple_url" varchar,
  	"cover_image_id" integer,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "podcast_episodes_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"order" numeric DEFAULT 0,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_members_locales" (
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"bio" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "timeline_milestones" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"image_id" integer,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "timeline_milestones_locales" (
  	"title" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"visible" boolean DEFAULT true NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"page" "enum_faqs_page" DEFAULT 'activism' NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "alumnae_quotes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"cohort" numeric NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "alumnae_quotes_locales" (
  	"quote" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar,
  	"message" varchar NOT NULL,
  	"locale" "enum_inquiries_locale",
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"website" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"posts_id" integer,
  	"press_archive_id" integer,
  	"elsewhere_media_id" integer,
  	"events_id" integer,
  	"podcast_episodes_id" integer,
  	"team_members_id" integer,
  	"timeline_milestones_id" integer,
  	"faqs_id" integer,
  	"alumnae_quotes_id" integer,
  	"inquiries_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ngo_number" varchar DEFAULT '580619120' NOT NULL,
  	"contact_email" varchar DEFAULT 'estish@nivcharot.com' NOT NULL,
  	"social_facebook" varchar DEFAULT 'https://www.facebook.com/NoVoiceNoVote/',
  	"social_instagram" varchar DEFAULT 'https://www.instagram.com/nivcharot/',
  	"social_youtube" varchar DEFAULT 'https://www.youtube.com/@%D7%97%D7%A8%D7%93%D7%99%D7%AA%D7%9E%D7%93%D7%95%D7%91%D7%A8%D7%AA',
  	"social_spotify" varchar DEFAULT 'https://open.spotify.com/show/7HwVj9J7rnUFqoiUDtc1oL',
  	"social_apple_podcasts" varchar DEFAULT 'https://podcasts.apple.com/il/podcast/id1767223746',
  	"social_podcast_instagram" varchar DEFAULT 'https://www.instagram.com/haredit_meduberet/',
  	"social_host_instagram" varchar DEFAULT 'https://www.instagram.com/esty_shushan/',
  	"social_host_facebook" varchar DEFAULT 'https://www.facebook.com/profile.php?id=61565500745331',
  	"social_host_x" varchar DEFAULT 'https://x.com/estyshushan',
  	"social_host_tiktok" varchar DEFAULT 'https://www.tiktok.com/@estybittonshushan',
  	"donation_standing_order_url" varchar DEFAULT 'https://mrng.to/WJUIrZs6F9' NOT NULL,
  	"donation_card_url" varchar DEFAULT 'https://mrng.to/KPpOoC6rJ2' NOT NULL,
  	"newsletter_url" varchar DEFAULT 'https://lp.vp4.me/8sit',
  	"bank_bank_name" varchar DEFAULT 'מזרחי טפחות (20)' NOT NULL,
  	"bank_account_holder" varchar DEFAULT 'נבחרות (ע"ר) 580619120' NOT NULL,
  	"bank_iban" varchar DEFAULT 'IL32 0205 5000 0000 0238 975' NOT NULL,
  	"bank_swift" varchar DEFAULT 'MIZBILIT' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"tax_text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL
  );
  
  CREATE TABLE "navigation_items_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_stat_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "home_stat_tiles_locales" (
  	"label" varchar NOT NULL,
  	"source" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_pillar_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"link_href" varchar
  );
  
  CREATE TABLE "home_pillar_cards_locales" (
  	"title" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_section_intros" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL
  );
  
  CREATE TABLE "home_section_intros_locales" (
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_stat_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "about_stat_tiles_locales" (
  	"label" varchar NOT NULL,
  	"source" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_pillar_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"link_href" varchar
  );
  
  CREATE TABLE "about_pillar_cards_locales" (
  	"title" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_section_intros" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL
  );
  
  CREATE TABLE "about_section_intros_locales" (
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "story_stat_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "story_stat_tiles_locales" (
  	"label" varchar NOT NULL,
  	"source" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "story_pillar_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"link_href" varchar
  );
  
  CREATE TABLE "story_pillar_cards_locales" (
  	"title" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "story_section_intros" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL
  );
  
  CREATE TABLE "story_section_intros_locales" (
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "story" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "story_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "activism_stat_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "activism_stat_tiles_locales" (
  	"label" varchar NOT NULL,
  	"source" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "activism_pillar_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"link_href" varchar
  );
  
  CREATE TABLE "activism_pillar_cards_locales" (
  	"title" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "activism_section_intros" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL
  );
  
  CREATE TABLE "activism_section_intros_locales" (
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "activism" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "activism_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "podcast_stat_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "podcast_stat_tiles_locales" (
  	"label" varchar NOT NULL,
  	"source" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "podcast_pillar_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"link_href" varchar
  );
  
  CREATE TABLE "podcast_pillar_cards_locales" (
  	"title" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "podcast_section_intros" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL
  );
  
  CREATE TABLE "podcast_section_intros_locales" (
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "podcast" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "podcast_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "hanivcheret_stat_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "hanivcheret_stat_tiles_locales" (
  	"label" varchar NOT NULL,
  	"source" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "hanivcheret_pillar_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"link_href" varchar
  );
  
  CREATE TABLE "hanivcheret_pillar_cards_locales" (
  	"title" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "hanivcheret_section_intros" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL
  );
  
  CREATE TABLE "hanivcheret_section_intros_locales" (
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "hanivcheret" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "hanivcheret_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "join_stat_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "join_stat_tiles_locales" (
  	"label" varchar NOT NULL,
  	"source" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "join_pillar_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"link_href" varchar
  );
  
  CREATE TABLE "join_pillar_cards_locales" (
  	"title" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "join_section_intros" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL
  );
  
  CREATE TABLE "join_section_intros_locales" (
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "join" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "join_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "donate_stat_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "donate_stat_tiles_locales" (
  	"label" varchar NOT NULL,
  	"source" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "donate_pillar_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL,
  	"link_href" varchar
  );
  
  CREATE TABLE "donate_pillar_cards_locales" (
  	"title" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "donate_section_intros" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL
  );
  
  CREATE TABLE "donate_section_intros_locales" (
  	"eyebrow" varchar,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "donate" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "donate_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_source_links" ADD CONSTRAINT "posts_source_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "press_archive_locales" ADD CONSTRAINT "press_archive_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."press_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "elsewhere_media_locales" ADD CONSTRAINT "elsewhere_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."elsewhere_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_photos" ADD CONSTRAINT "events_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_photos" ADD CONSTRAINT "events_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_photos_locales" ADD CONSTRAINT "events_photos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "podcast_episodes" ADD CONSTRAINT "podcast_episodes_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "podcast_episodes_locales" ADD CONSTRAINT "podcast_episodes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."podcast_episodes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members_locales" ADD CONSTRAINT "team_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "timeline_milestones" ADD CONSTRAINT "timeline_milestones_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "timeline_milestones_locales" ADD CONSTRAINT "timeline_milestones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."timeline_milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "alumnae_quotes_locales" ADD CONSTRAINT "alumnae_quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."alumnae_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_press_archive_fk" FOREIGN KEY ("press_archive_id") REFERENCES "public"."press_archive"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_elsewhere_media_fk" FOREIGN KEY ("elsewhere_media_id") REFERENCES "public"."elsewhere_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_podcast_episodes_fk" FOREIGN KEY ("podcast_episodes_id") REFERENCES "public"."podcast_episodes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_timeline_milestones_fk" FOREIGN KEY ("timeline_milestones_id") REFERENCES "public"."timeline_milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_alumnae_quotes_fk" FOREIGN KEY ("alumnae_quotes_id") REFERENCES "public"."alumnae_quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_items_locales" ADD CONSTRAINT "navigation_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_stat_tiles" ADD CONSTRAINT "home_stat_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_stat_tiles_locales" ADD CONSTRAINT "home_stat_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_stat_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_pillar_cards" ADD CONSTRAINT "home_pillar_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_pillar_cards_locales" ADD CONSTRAINT "home_pillar_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_pillar_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_section_intros" ADD CONSTRAINT "home_section_intros_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_section_intros_locales" ADD CONSTRAINT "home_section_intros_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_section_intros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_stat_tiles" ADD CONSTRAINT "about_stat_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_stat_tiles_locales" ADD CONSTRAINT "about_stat_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_stat_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_pillar_cards" ADD CONSTRAINT "about_pillar_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_pillar_cards_locales" ADD CONSTRAINT "about_pillar_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_pillar_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_section_intros" ADD CONSTRAINT "about_section_intros_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_section_intros_locales" ADD CONSTRAINT "about_section_intros_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_section_intros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_locales" ADD CONSTRAINT "about_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_stat_tiles" ADD CONSTRAINT "story_stat_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_stat_tiles_locales" ADD CONSTRAINT "story_stat_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."story_stat_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_pillar_cards" ADD CONSTRAINT "story_pillar_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_pillar_cards_locales" ADD CONSTRAINT "story_pillar_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."story_pillar_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_section_intros" ADD CONSTRAINT "story_section_intros_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_section_intros_locales" ADD CONSTRAINT "story_section_intros_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."story_section_intros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_locales" ADD CONSTRAINT "story_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activism_stat_tiles" ADD CONSTRAINT "activism_stat_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activism"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activism_stat_tiles_locales" ADD CONSTRAINT "activism_stat_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activism_stat_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activism_pillar_cards" ADD CONSTRAINT "activism_pillar_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activism"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activism_pillar_cards_locales" ADD CONSTRAINT "activism_pillar_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activism_pillar_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activism_section_intros" ADD CONSTRAINT "activism_section_intros_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activism"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activism_section_intros_locales" ADD CONSTRAINT "activism_section_intros_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activism_section_intros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "activism_locales" ADD CONSTRAINT "activism_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."activism"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "podcast_stat_tiles" ADD CONSTRAINT "podcast_stat_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."podcast"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "podcast_stat_tiles_locales" ADD CONSTRAINT "podcast_stat_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."podcast_stat_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "podcast_pillar_cards" ADD CONSTRAINT "podcast_pillar_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."podcast"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "podcast_pillar_cards_locales" ADD CONSTRAINT "podcast_pillar_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."podcast_pillar_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "podcast_section_intros" ADD CONSTRAINT "podcast_section_intros_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."podcast"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "podcast_section_intros_locales" ADD CONSTRAINT "podcast_section_intros_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."podcast_section_intros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "podcast_locales" ADD CONSTRAINT "podcast_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."podcast"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hanivcheret_stat_tiles" ADD CONSTRAINT "hanivcheret_stat_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hanivcheret"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hanivcheret_stat_tiles_locales" ADD CONSTRAINT "hanivcheret_stat_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hanivcheret_stat_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hanivcheret_pillar_cards" ADD CONSTRAINT "hanivcheret_pillar_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hanivcheret"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hanivcheret_pillar_cards_locales" ADD CONSTRAINT "hanivcheret_pillar_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hanivcheret_pillar_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hanivcheret_section_intros" ADD CONSTRAINT "hanivcheret_section_intros_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hanivcheret"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hanivcheret_section_intros_locales" ADD CONSTRAINT "hanivcheret_section_intros_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hanivcheret_section_intros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hanivcheret_locales" ADD CONSTRAINT "hanivcheret_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hanivcheret"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "join_stat_tiles" ADD CONSTRAINT "join_stat_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."join"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "join_stat_tiles_locales" ADD CONSTRAINT "join_stat_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."join_stat_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "join_pillar_cards" ADD CONSTRAINT "join_pillar_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."join"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "join_pillar_cards_locales" ADD CONSTRAINT "join_pillar_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."join_pillar_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "join_section_intros" ADD CONSTRAINT "join_section_intros_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."join"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "join_section_intros_locales" ADD CONSTRAINT "join_section_intros_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."join_section_intros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "join_locales" ADD CONSTRAINT "join_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."join"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donate_stat_tiles" ADD CONSTRAINT "donate_stat_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donate_stat_tiles_locales" ADD CONSTRAINT "donate_stat_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate_stat_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donate_pillar_cards" ADD CONSTRAINT "donate_pillar_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donate_pillar_cards_locales" ADD CONSTRAINT "donate_pillar_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate_pillar_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donate_section_intros" ADD CONSTRAINT "donate_section_intros_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donate_section_intros_locales" ADD CONSTRAINT "donate_section_intros_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate_section_intros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donate_locales" ADD CONSTRAINT "donate_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donate"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_source_links_order_idx" ON "posts_source_links" USING btree ("_order");
  CREATE INDEX "posts_source_links_parent_id_idx" ON "posts_source_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_image_idx" ON "posts" USING btree ("cover_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE UNIQUE INDEX "press_archive_slug_idx" ON "press_archive" USING btree ("slug");
  CREATE INDEX "press_archive_updated_at_idx" ON "press_archive" USING btree ("updated_at");
  CREATE INDEX "press_archive_created_at_idx" ON "press_archive" USING btree ("created_at");
  CREATE UNIQUE INDEX "press_archive_locales_locale_parent_id_unique" ON "press_archive_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "elsewhere_media_slug_idx" ON "elsewhere_media" USING btree ("slug");
  CREATE INDEX "elsewhere_media_updated_at_idx" ON "elsewhere_media" USING btree ("updated_at");
  CREATE INDEX "elsewhere_media_created_at_idx" ON "elsewhere_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "elsewhere_media_locales_locale_parent_id_unique" ON "elsewhere_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_photos_order_idx" ON "events_photos" USING btree ("_order");
  CREATE INDEX "events_photos_parent_id_idx" ON "events_photos" USING btree ("_parent_id");
  CREATE INDEX "events_photos_image_idx" ON "events_photos" USING btree ("image_id");
  CREATE UNIQUE INDEX "events_photos_locales_locale_parent_id_unique" ON "events_photos_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_cover_image_idx" ON "events" USING btree ("cover_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "podcast_episodes_number_idx" ON "podcast_episodes" USING btree ("number");
  CREATE INDEX "podcast_episodes_cover_image_idx" ON "podcast_episodes" USING btree ("cover_image_id");
  CREATE INDEX "podcast_episodes_updated_at_idx" ON "podcast_episodes" USING btree ("updated_at");
  CREATE INDEX "podcast_episodes_created_at_idx" ON "podcast_episodes" USING btree ("created_at");
  CREATE UNIQUE INDEX "podcast_episodes_locales_locale_parent_id_unique" ON "podcast_episodes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE UNIQUE INDEX "team_members_locales_locale_parent_id_unique" ON "team_members_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "timeline_milestones_image_idx" ON "timeline_milestones" USING btree ("image_id");
  CREATE INDEX "timeline_milestones_updated_at_idx" ON "timeline_milestones" USING btree ("updated_at");
  CREATE INDEX "timeline_milestones_created_at_idx" ON "timeline_milestones" USING btree ("created_at");
  CREATE UNIQUE INDEX "timeline_milestones_locales_locale_parent_id_unique" ON "timeline_milestones_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "alumnae_quotes_updated_at_idx" ON "alumnae_quotes" USING btree ("updated_at");
  CREATE INDEX "alumnae_quotes_created_at_idx" ON "alumnae_quotes" USING btree ("created_at");
  CREATE UNIQUE INDEX "alumnae_quotes_locales_locale_parent_id_unique" ON "alumnae_quotes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_press_archive_id_idx" ON "payload_locked_documents_rels" USING btree ("press_archive_id");
  CREATE INDEX "payload_locked_documents_rels_elsewhere_media_id_idx" ON "payload_locked_documents_rels" USING btree ("elsewhere_media_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_podcast_episodes_id_idx" ON "payload_locked_documents_rels" USING btree ("podcast_episodes_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_timeline_milestones_id_idx" ON "payload_locked_documents_rels" USING btree ("timeline_milestones_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_alumnae_quotes_id_idx" ON "payload_locked_documents_rels" USING btree ("alumnae_quotes_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_items_order_idx" ON "navigation_items" USING btree ("_order");
  CREATE INDEX "navigation_items_parent_id_idx" ON "navigation_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_items_locales_locale_parent_id_unique" ON "navigation_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_stat_tiles_order_idx" ON "home_stat_tiles" USING btree ("_order");
  CREATE INDEX "home_stat_tiles_parent_id_idx" ON "home_stat_tiles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_stat_tiles_locales_locale_parent_id_unique" ON "home_stat_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_pillar_cards_order_idx" ON "home_pillar_cards" USING btree ("_order");
  CREATE INDEX "home_pillar_cards_parent_id_idx" ON "home_pillar_cards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_pillar_cards_locales_locale_parent_id_unique" ON "home_pillar_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_section_intros_order_idx" ON "home_section_intros" USING btree ("_order");
  CREATE INDEX "home_section_intros_parent_id_idx" ON "home_section_intros" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_section_intros_locales_locale_parent_id_unique" ON "home_section_intros_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_locales_locale_parent_id_unique" ON "home_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_stat_tiles_order_idx" ON "about_stat_tiles" USING btree ("_order");
  CREATE INDEX "about_stat_tiles_parent_id_idx" ON "about_stat_tiles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_stat_tiles_locales_locale_parent_id_unique" ON "about_stat_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_pillar_cards_order_idx" ON "about_pillar_cards" USING btree ("_order");
  CREATE INDEX "about_pillar_cards_parent_id_idx" ON "about_pillar_cards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_pillar_cards_locales_locale_parent_id_unique" ON "about_pillar_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_section_intros_order_idx" ON "about_section_intros" USING btree ("_order");
  CREATE INDEX "about_section_intros_parent_id_idx" ON "about_section_intros" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_section_intros_locales_locale_parent_id_unique" ON "about_section_intros_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_locales_locale_parent_id_unique" ON "about_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "story_stat_tiles_order_idx" ON "story_stat_tiles" USING btree ("_order");
  CREATE INDEX "story_stat_tiles_parent_id_idx" ON "story_stat_tiles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "story_stat_tiles_locales_locale_parent_id_unique" ON "story_stat_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "story_pillar_cards_order_idx" ON "story_pillar_cards" USING btree ("_order");
  CREATE INDEX "story_pillar_cards_parent_id_idx" ON "story_pillar_cards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "story_pillar_cards_locales_locale_parent_id_unique" ON "story_pillar_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "story_section_intros_order_idx" ON "story_section_intros" USING btree ("_order");
  CREATE INDEX "story_section_intros_parent_id_idx" ON "story_section_intros" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "story_section_intros_locales_locale_parent_id_unique" ON "story_section_intros_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "story_locales_locale_parent_id_unique" ON "story_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "activism_stat_tiles_order_idx" ON "activism_stat_tiles" USING btree ("_order");
  CREATE INDEX "activism_stat_tiles_parent_id_idx" ON "activism_stat_tiles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "activism_stat_tiles_locales_locale_parent_id_unique" ON "activism_stat_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "activism_pillar_cards_order_idx" ON "activism_pillar_cards" USING btree ("_order");
  CREATE INDEX "activism_pillar_cards_parent_id_idx" ON "activism_pillar_cards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "activism_pillar_cards_locales_locale_parent_id_unique" ON "activism_pillar_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "activism_section_intros_order_idx" ON "activism_section_intros" USING btree ("_order");
  CREATE INDEX "activism_section_intros_parent_id_idx" ON "activism_section_intros" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "activism_section_intros_locales_locale_parent_id_unique" ON "activism_section_intros_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "activism_locales_locale_parent_id_unique" ON "activism_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "podcast_stat_tiles_order_idx" ON "podcast_stat_tiles" USING btree ("_order");
  CREATE INDEX "podcast_stat_tiles_parent_id_idx" ON "podcast_stat_tiles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "podcast_stat_tiles_locales_locale_parent_id_unique" ON "podcast_stat_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "podcast_pillar_cards_order_idx" ON "podcast_pillar_cards" USING btree ("_order");
  CREATE INDEX "podcast_pillar_cards_parent_id_idx" ON "podcast_pillar_cards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "podcast_pillar_cards_locales_locale_parent_id_unique" ON "podcast_pillar_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "podcast_section_intros_order_idx" ON "podcast_section_intros" USING btree ("_order");
  CREATE INDEX "podcast_section_intros_parent_id_idx" ON "podcast_section_intros" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "podcast_section_intros_locales_locale_parent_id_unique" ON "podcast_section_intros_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "podcast_locales_locale_parent_id_unique" ON "podcast_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "hanivcheret_stat_tiles_order_idx" ON "hanivcheret_stat_tiles" USING btree ("_order");
  CREATE INDEX "hanivcheret_stat_tiles_parent_id_idx" ON "hanivcheret_stat_tiles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "hanivcheret_stat_tiles_locales_locale_parent_id_unique" ON "hanivcheret_stat_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "hanivcheret_pillar_cards_order_idx" ON "hanivcheret_pillar_cards" USING btree ("_order");
  CREATE INDEX "hanivcheret_pillar_cards_parent_id_idx" ON "hanivcheret_pillar_cards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "hanivcheret_pillar_cards_locales_locale_parent_id_unique" ON "hanivcheret_pillar_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "hanivcheret_section_intros_order_idx" ON "hanivcheret_section_intros" USING btree ("_order");
  CREATE INDEX "hanivcheret_section_intros_parent_id_idx" ON "hanivcheret_section_intros" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "hanivcheret_section_intros_locales_locale_parent_id_unique" ON "hanivcheret_section_intros_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "hanivcheret_locales_locale_parent_id_unique" ON "hanivcheret_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "join_stat_tiles_order_idx" ON "join_stat_tiles" USING btree ("_order");
  CREATE INDEX "join_stat_tiles_parent_id_idx" ON "join_stat_tiles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "join_stat_tiles_locales_locale_parent_id_unique" ON "join_stat_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "join_pillar_cards_order_idx" ON "join_pillar_cards" USING btree ("_order");
  CREATE INDEX "join_pillar_cards_parent_id_idx" ON "join_pillar_cards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "join_pillar_cards_locales_locale_parent_id_unique" ON "join_pillar_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "join_section_intros_order_idx" ON "join_section_intros" USING btree ("_order");
  CREATE INDEX "join_section_intros_parent_id_idx" ON "join_section_intros" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "join_section_intros_locales_locale_parent_id_unique" ON "join_section_intros_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "join_locales_locale_parent_id_unique" ON "join_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "donate_stat_tiles_order_idx" ON "donate_stat_tiles" USING btree ("_order");
  CREATE INDEX "donate_stat_tiles_parent_id_idx" ON "donate_stat_tiles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "donate_stat_tiles_locales_locale_parent_id_unique" ON "donate_stat_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "donate_pillar_cards_order_idx" ON "donate_pillar_cards" USING btree ("_order");
  CREATE INDEX "donate_pillar_cards_parent_id_idx" ON "donate_pillar_cards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "donate_pillar_cards_locales_locale_parent_id_unique" ON "donate_pillar_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "donate_section_intros_order_idx" ON "donate_section_intros" USING btree ("_order");
  CREATE INDEX "donate_section_intros_parent_id_idx" ON "donate_section_intros" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "donate_section_intros_locales_locale_parent_id_unique" ON "donate_section_intros_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "donate_locales_locale_parent_id_unique" ON "donate_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "posts_source_links" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "press_archive" CASCADE;
  DROP TABLE "press_archive_locales" CASCADE;
  DROP TABLE "elsewhere_media" CASCADE;
  DROP TABLE "elsewhere_media_locales" CASCADE;
  DROP TABLE "events_photos" CASCADE;
  DROP TABLE "events_photos_locales" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_locales" CASCADE;
  DROP TABLE "podcast_episodes" CASCADE;
  DROP TABLE "podcast_episodes_locales" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "team_members_locales" CASCADE;
  DROP TABLE "timeline_milestones" CASCADE;
  DROP TABLE "timeline_milestones_locales" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "alumnae_quotes" CASCADE;
  DROP TABLE "alumnae_quotes_locales" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "navigation_items" CASCADE;
  DROP TABLE "navigation_items_locales" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "home_stat_tiles" CASCADE;
  DROP TABLE "home_stat_tiles_locales" CASCADE;
  DROP TABLE "home_pillar_cards" CASCADE;
  DROP TABLE "home_pillar_cards_locales" CASCADE;
  DROP TABLE "home_section_intros" CASCADE;
  DROP TABLE "home_section_intros_locales" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_locales" CASCADE;
  DROP TABLE "about_stat_tiles" CASCADE;
  DROP TABLE "about_stat_tiles_locales" CASCADE;
  DROP TABLE "about_pillar_cards" CASCADE;
  DROP TABLE "about_pillar_cards_locales" CASCADE;
  DROP TABLE "about_section_intros" CASCADE;
  DROP TABLE "about_section_intros_locales" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "about_locales" CASCADE;
  DROP TABLE "story_stat_tiles" CASCADE;
  DROP TABLE "story_stat_tiles_locales" CASCADE;
  DROP TABLE "story_pillar_cards" CASCADE;
  DROP TABLE "story_pillar_cards_locales" CASCADE;
  DROP TABLE "story_section_intros" CASCADE;
  DROP TABLE "story_section_intros_locales" CASCADE;
  DROP TABLE "story" CASCADE;
  DROP TABLE "story_locales" CASCADE;
  DROP TABLE "activism_stat_tiles" CASCADE;
  DROP TABLE "activism_stat_tiles_locales" CASCADE;
  DROP TABLE "activism_pillar_cards" CASCADE;
  DROP TABLE "activism_pillar_cards_locales" CASCADE;
  DROP TABLE "activism_section_intros" CASCADE;
  DROP TABLE "activism_section_intros_locales" CASCADE;
  DROP TABLE "activism" CASCADE;
  DROP TABLE "activism_locales" CASCADE;
  DROP TABLE "podcast_stat_tiles" CASCADE;
  DROP TABLE "podcast_stat_tiles_locales" CASCADE;
  DROP TABLE "podcast_pillar_cards" CASCADE;
  DROP TABLE "podcast_pillar_cards_locales" CASCADE;
  DROP TABLE "podcast_section_intros" CASCADE;
  DROP TABLE "podcast_section_intros_locales" CASCADE;
  DROP TABLE "podcast" CASCADE;
  DROP TABLE "podcast_locales" CASCADE;
  DROP TABLE "hanivcheret_stat_tiles" CASCADE;
  DROP TABLE "hanivcheret_stat_tiles_locales" CASCADE;
  DROP TABLE "hanivcheret_pillar_cards" CASCADE;
  DROP TABLE "hanivcheret_pillar_cards_locales" CASCADE;
  DROP TABLE "hanivcheret_section_intros" CASCADE;
  DROP TABLE "hanivcheret_section_intros_locales" CASCADE;
  DROP TABLE "hanivcheret" CASCADE;
  DROP TABLE "hanivcheret_locales" CASCADE;
  DROP TABLE "join_stat_tiles" CASCADE;
  DROP TABLE "join_stat_tiles_locales" CASCADE;
  DROP TABLE "join_pillar_cards" CASCADE;
  DROP TABLE "join_pillar_cards_locales" CASCADE;
  DROP TABLE "join_section_intros" CASCADE;
  DROP TABLE "join_section_intros_locales" CASCADE;
  DROP TABLE "join" CASCADE;
  DROP TABLE "join_locales" CASCADE;
  DROP TABLE "donate_stat_tiles" CASCADE;
  DROP TABLE "donate_stat_tiles_locales" CASCADE;
  DROP TABLE "donate_pillar_cards" CASCADE;
  DROP TABLE "donate_pillar_cards_locales" CASCADE;
  DROP TABLE "donate_section_intros" CASCADE;
  DROP TABLE "donate_section_intros_locales" CASCADE;
  DROP TABLE "donate" CASCADE;
  DROP TABLE "donate_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_posts_review_status";
  DROP TYPE "public"."enum_press_archive_type";
  DROP TYPE "public"."enum_press_archive_category";
  DROP TYPE "public"."enum_press_archive_source_language";
  DROP TYPE "public"."enum_press_archive_link_kind";
  DROP TYPE "public"."enum_press_archive_review_status";
  DROP TYPE "public"."enum_elsewhere_media_kind";
  DROP TYPE "public"."enum_elsewhere_media_source_language";
  DROP TYPE "public"."enum_elsewhere_media_review_status";
  DROP TYPE "public"."enum_events_review_status";
  DROP TYPE "public"."enum_faqs_page";
  DROP TYPE "public"."enum_inquiries_locale";
  DROP TYPE "public"."enum_inquiries_status";`)
}
