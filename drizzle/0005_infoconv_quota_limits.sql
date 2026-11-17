CREATE TABLE "infoconv_global_quota" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"monthly_limit" integer NOT NULL,
	CONSTRAINT "infoconv_global_quota_singleton" CHECK ("infoconv_global_quota"."id" = 1),
	CONSTRAINT "infoconv_global_quota_nonnegative" CHECK ("infoconv_global_quota"."monthly_limit" >= 0)
);
--> statement-breakpoint
CREATE TABLE "infoconv_user_quota" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"monthly_limit" integer NOT NULL,
	CONSTRAINT "infoconv_user_quota_nonnegative" CHECK ("infoconv_user_quota"."monthly_limit" >= 0)
);
--> statement-breakpoint
ALTER TABLE "infoconv_user_quota" ADD CONSTRAINT "infoconv_user_quota_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;