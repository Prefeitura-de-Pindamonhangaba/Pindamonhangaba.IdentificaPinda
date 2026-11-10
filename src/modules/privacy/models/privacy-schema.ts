import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "@/modules/auth/models/auth-schema";

export const privacyAcknowledgement = pgTable(
  "privacy_acknowledgements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    noticeVersion: text("notice_version").notNull(),
    noticeDigest: text("notice_digest").notNull(),
    noticeText: text("notice_text").notNull(),
    acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("privacy_acknowledgements_user_digest_idx").on(
      table.userId,
      table.noticeDigest,
    ),
  ],
);
