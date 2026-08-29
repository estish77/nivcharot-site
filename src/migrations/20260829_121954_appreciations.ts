import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "team_appreciations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL,
  	"voter_hash" varchar NOT NULL,
  	"ip_hash" varchar NOT NULL,
  	"location" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "team_members" ADD COLUMN "appreciations" numeric DEFAULT 0;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "team_appreciations_id" integer;
  ALTER TABLE "team_appreciations" ADD CONSTRAINT "team_appreciations_member_id_team_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "team_appreciations_member_idx" ON "team_appreciations" USING btree ("member_id");
  CREATE INDEX "team_appreciations_voter_hash_idx" ON "team_appreciations" USING btree ("voter_hash");
  CREATE INDEX "team_appreciations_ip_hash_idx" ON "team_appreciations" USING btree ("ip_hash");
  CREATE INDEX "team_appreciations_updated_at_idx" ON "team_appreciations" USING btree ("updated_at");
  CREATE INDEX "team_appreciations_created_at_idx" ON "team_appreciations" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_appreciations_fk" FOREIGN KEY ("team_appreciations_id") REFERENCES "public"."team_appreciations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_team_appreciations_id_idx" ON "payload_locked_documents_rels" USING btree ("team_appreciations_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "team_appreciations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "team_appreciations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_team_appreciations_fk";
  
  DROP INDEX "payload_locked_documents_rels_team_appreciations_id_idx";
  ALTER TABLE "team_members" DROP COLUMN "appreciations";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "team_appreciations_id";`)
}
