import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_program_applications_locale" AS ENUM('he', 'en');
  CREATE TYPE "public"."enum_program_applications_status" AS ENUM('new', 'reviewed', 'invited', 'archived');
  CREATE TABLE "program_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"motivation" varchar NOT NULL,
  	"locale" "enum_program_applications_locale",
  	"status" "enum_program_applications_status" DEFAULT 'new',
  	"website" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "program_applications_id" integer;
  CREATE INDEX "program_applications_updated_at_idx" ON "program_applications" USING btree ("updated_at");
  CREATE INDEX "program_applications_created_at_idx" ON "program_applications" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_program_applications_fk" FOREIGN KEY ("program_applications_id") REFERENCES "public"."program_applications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_program_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("program_applications_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "program_applications" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "program_applications" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_program_applications_fk";
  
  DROP INDEX "payload_locked_documents_rels_program_applications_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "program_applications_id";
  DROP TYPE "public"."enum_program_applications_locale";
  DROP TYPE "public"."enum_program_applications_status";`)
}
