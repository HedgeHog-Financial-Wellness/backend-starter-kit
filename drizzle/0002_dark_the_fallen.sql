ALTER TABLE "ideas" ALTER COLUMN "status" SET DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "ideas" ALTER COLUMN "rating" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "ideas" ADD COLUMN "slug" text NOT NULL;