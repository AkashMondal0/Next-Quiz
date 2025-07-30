ALTER TABLE "rooms" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "rooms" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rooms" ADD COLUMN "code" text;