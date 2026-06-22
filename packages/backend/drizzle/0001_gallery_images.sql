CREATE TABLE IF NOT EXISTS "gallery_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"source" text DEFAULT 'instagram' NOT NULL,
	"source_id" text,
	"image_url" text NOT NULL,
	"permalink" text,
	"caption" text DEFAULT '' NOT NULL,
	"tag" text DEFAULT 'General' NOT NULL,
	"media_type" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"posted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_images_source_id_unique" UNIQUE("source_id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "gallery_images_status_idx" ON "gallery_images" ("status");
