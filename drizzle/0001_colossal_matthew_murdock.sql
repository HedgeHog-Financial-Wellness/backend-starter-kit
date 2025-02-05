CREATE TYPE "public"."idea_status" AS ENUM('draft', 'voting', 'done');--> statement-breakpoint
CREATE TABLE "ideas" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"start_time" timestamp,
	"end_time" timestamp,
	"status" "idea_status" NOT NULL,
	"rating" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
