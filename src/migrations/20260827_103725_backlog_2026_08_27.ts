import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_team_members_category" AS ENUM('staff', 'central-team', 'central-activity');
  CREATE TYPE "public"."enum_newsletter_subscribers_locale" AS ENUM('he', 'en');
  CREATE TYPE "public"."enum_newsletter_subscribers_status" AS ENUM('subscribed', 'unsubscribed');
  CREATE TABLE "newsletter_subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"locale" "enum_newsletter_subscribers_locale",
  	"status" "enum_newsletter_subscribers_status" DEFAULT 'subscribed',
  	"website" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "halacha" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kroizer_ruling_document_id" integer,
  	"pamphlet_document2015_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "halacha_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "mishpat" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "mishpat_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar NOT NULL,
  	"hero_body" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "elsewhere_media" ADD COLUMN "image_id" integer;
  ALTER TABLE "team_members" ADD COLUMN "category" "enum_team_members_category" DEFAULT 'staff' NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "newsletter_subscribers_id" integer;
  ALTER TABLE "halacha" ADD CONSTRAINT "halacha_kroizer_ruling_document_id_media_id_fk" FOREIGN KEY ("kroizer_ruling_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "halacha" ADD CONSTRAINT "halacha_pamphlet_document2015_id_media_id_fk" FOREIGN KEY ("pamphlet_document2015_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "halacha_locales" ADD CONSTRAINT "halacha_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."halacha"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "mishpat_locales" ADD CONSTRAINT "mishpat_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."mishpat"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "newsletter_subscribers_email_idx" ON "newsletter_subscribers" USING btree ("email");
  CREATE INDEX "newsletter_subscribers_updated_at_idx" ON "newsletter_subscribers" USING btree ("updated_at");
  CREATE INDEX "newsletter_subscribers_created_at_idx" ON "newsletter_subscribers" USING btree ("created_at");
  CREATE INDEX "halacha_kroizer_ruling_document_idx" ON "halacha" USING btree ("kroizer_ruling_document_id");
  CREATE INDEX "halacha_pamphlet_document2015_idx" ON "halacha" USING btree ("pamphlet_document2015_id");
  CREATE UNIQUE INDEX "halacha_locales_locale_parent_id_unique" ON "halacha_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "mishpat_locales_locale_parent_id_unique" ON "mishpat_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "elsewhere_media" ADD CONSTRAINT "elsewhere_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_newsletter_subscribers_fk" FOREIGN KEY ("newsletter_subscribers_id") REFERENCES "public"."newsletter_subscribers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "elsewhere_media_image_idx" ON "elsewhere_media" USING btree ("image_id");
  CREATE INDEX "payload_locked_documents_rels_newsletter_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("newsletter_subscribers_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "newsletter_subscribers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "halacha" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "halacha_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "mishpat" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "mishpat_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "newsletter_subscribers" CASCADE;
  DROP TABLE "halacha" CASCADE;
  DROP TABLE "halacha_locales" CASCADE;
  DROP TABLE "mishpat" CASCADE;
  DROP TABLE "mishpat_locales" CASCADE;
  ALTER TABLE "elsewhere_media" DROP CONSTRAINT "elsewhere_media_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_newsletter_subscribers_fk";
  
  DROP INDEX "elsewhere_media_image_idx";
  DROP INDEX "payload_locked_documents_rels_newsletter_subscribers_id_idx";
  ALTER TABLE "elsewhere_media" DROP COLUMN "image_id";
  ALTER TABLE "team_members" DROP COLUMN "category";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "newsletter_subscribers_id";
  DROP TYPE "public"."enum_team_members_category";
  DROP TYPE "public"."enum_newsletter_subscribers_locale";
  DROP TYPE "public"."enum_newsletter_subscribers_status";`)
}
