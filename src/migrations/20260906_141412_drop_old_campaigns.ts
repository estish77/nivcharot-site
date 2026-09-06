import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // IF EXISTS throughout: these three tables were already dropped by hand
  // ahead of this migration (they were empty, never had a post added, see
  // the Galleries collection's own doc comment), so this converges to the
  // right state whether or not that manual cleanup already ran.
  await db.execute(sql`
   CREATE TYPE "public"."enum_media_category" AS ENUM('team', 'events', 'campaigns', 'podcast', 'press', 'other');
  DROP TABLE IF EXISTS "campaigns_posts" CASCADE;
  DROP TABLE IF EXISTS "campaigns_posts_locales" CASCADE;
  DROP TABLE IF EXISTS "campaigns" CASCADE;
  ALTER TABLE "media" ADD COLUMN "category" "enum_media_category";
  ALTER TABLE "media_locales" ADD COLUMN "caption" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "campaigns_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"posted_at" timestamp(3) with time zone NOT NULL,
  	"instagram_url" varchar
  );
  
  CREATE TABLE "campaigns_posts_locales" (
  	"caption" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "campaigns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "campaigns_posts" ADD CONSTRAINT "campaigns_posts_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "campaigns_posts" ADD CONSTRAINT "campaigns_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "campaigns_posts_locales" ADD CONSTRAINT "campaigns_posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."campaigns_posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "campaigns_posts_order_idx" ON "campaigns_posts" USING btree ("_order");
  CREATE INDEX "campaigns_posts_parent_id_idx" ON "campaigns_posts" USING btree ("_parent_id");
  CREATE INDEX "campaigns_posts_image_idx" ON "campaigns_posts" USING btree ("image_id");
  CREATE UNIQUE INDEX "campaigns_posts_locales_locale_parent_id_unique" ON "campaigns_posts_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "media" DROP COLUMN "category";
  ALTER TABLE "media_locales" DROP COLUMN "caption";
  DROP TYPE "public"."enum_media_category";`)
}
