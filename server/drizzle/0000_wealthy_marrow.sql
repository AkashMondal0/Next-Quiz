CREATE TYPE "public"."quiz_status" AS ENUM('waiting', 'active', 'ended');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'user', 'member');--> statement-breakpoint
CREATE TYPE "public"."user_theme" AS ENUM('light', 'dark', 'system');--> statement-breakpoint
CREATE TABLE "account" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"roles" "role"[] DEFAULT ARRAY['user']::role[] NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"city" varchar(100),
	"country" varchar(100),
	"locale" varchar(20),
	"time_zone" integer DEFAULT 12,
	"phone" integer,
	"private_key" text NOT NULL,
	"locked" boolean DEFAULT false NOT NULL,
	"access_token_expires" timestamp,
	"access_token" varchar[],
	"refresh_token" varchar[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" text,
	"host_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"status" "quiz_status" DEFAULT 'waiting'
);
--> statement-breakpoint
CREATE TABLE "session" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"session_token" varchar,
	"expires" timestamp NOT NULL,
	CONSTRAINT "session_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "user_password" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"password" varchar NOT NULL,
	"hash" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"profile_picture" varchar,
	"bio" text,
	"file_url" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"website" text[] DEFAULT '{}'::text[] NOT NULL,
	"public_key" text NOT NULL,
	"last_status_update" timestamp,
	"is_private" boolean DEFAULT false NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"theme" "user_theme" DEFAULT 'system' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_password" ADD CONSTRAINT "user_password_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "user_account_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_session_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_password_idx" ON "user_password" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "email_username_idx" ON "users" USING btree ("email","username");--> statement-breakpoint
CREATE INDEX "user_settings_idx" ON "user_settings" USING btree ("user_id");