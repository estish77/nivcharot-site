import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "timeline_milestones_external_articles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"outlet" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "timeline_milestones_external_articles_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "timeline_milestones_external_articles" ADD CONSTRAINT "timeline_milestones_external_articles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."timeline_milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "timeline_milestones_external_articles_locales" ADD CONSTRAINT "timeline_milestones_external_articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."timeline_milestones_external_articles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "timeline_milestones_external_articles_order_idx" ON "timeline_milestones_external_articles" USING btree ("_order");
  CREATE INDEX "timeline_milestones_external_articles_parent_id_idx" ON "timeline_milestones_external_articles" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "timeline_milestones_external_articles_locales_locale_parent_" ON "timeline_milestones_external_articles_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "timeline_milestones_external_articles" CASCADE;
  DROP TABLE "timeline_milestones_external_articles_locales" CASCADE;`)
}
