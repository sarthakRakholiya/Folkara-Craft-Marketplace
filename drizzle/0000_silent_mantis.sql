CREATE TYPE "public"."user_role" AS ENUM('BUYER', 'SELLER');--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" "user_role" DEFAULT 'BUYER' NOT NULL,
	"is_onboarding_complete" boolean DEFAULT false NOT NULL,
	"current_step" integer DEFAULT 1 NOT NULL,
	"onboarding_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"bio" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
