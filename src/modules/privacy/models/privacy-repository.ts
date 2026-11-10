import { and, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { auditEvent } from "@/modules/audit/models/audit-schema";
import { privacyAcknowledgement } from "./privacy-schema";

export function createPrivacyRepository(database: PostgresJsDatabase) {
  return {
    async hasAcknowledged(userId: string, digest: string) {
      const [row] = await database
        .select({ id: privacyAcknowledgement.id })
        .from(privacyAcknowledgement)
        .where(
          and(
            eq(privacyAcknowledgement.userId, userId),
            eq(privacyAcknowledgement.noticeDigest, digest),
          ),
        )
        .limit(1);
      return !!row;
    },
    async acknowledge(
      value: Pick<
        typeof privacyAcknowledgement.$inferInsert,
        "userId" | "noticeVersion" | "noticeDigest" | "noticeText"
      >,
    ) {
      await database.transaction(async (tx) => {
        const [row] = await tx
          .insert(privacyAcknowledgement)
          .values(value)
          .onConflictDoNothing({
            target: [
              privacyAcknowledgement.userId,
              privacyAcknowledgement.noticeDigest,
            ],
          })
          .returning({ id: privacyAcknowledgement.id });
        if (row)
          await tx.insert(auditEvent).values({
            userId: value.userId,
            actorId: value.userId,
            action: "privacy_notice.acknowledged",
            correlationId: row.id,
          });
      });
    },
  };
}
export type PrivacyRepository = ReturnType<typeof createPrivacyRepository>;
