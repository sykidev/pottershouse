ALTER TABLE "sermons" ADD COLUMN IF NOT EXISTS "tag" text DEFAULT 'General' NOT NULL;
--> statement-breakpoint
ALTER TABLE "sermons" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'approved' NOT NULL;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sermons_status_idx" ON "sermons" ("status");
