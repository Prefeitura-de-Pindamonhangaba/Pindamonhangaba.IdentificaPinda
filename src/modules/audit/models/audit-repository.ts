import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { auditEvent } from "./audit-schema";

export function createAuditRepository(database: PostgresJsDatabase) {
  return {
    async record(
      userId: string,
      action:
        | "session.created"
        | "session.revoked"
        | "user.credentials_updated"
        | "consultations.audit_viewed",
    ) {
      await database
        .insert(auditEvent)
        .values({ userId, actorId: userId, action });
    },
    async recordDisclosure(
      userId: string,
      action: "consultations.exported" | "consultations.printed",
      consultationIds: string[],
    ) {
      await database.insert(auditEvent).values(
        [...new Set(consultationIds)].map((correlationId) => ({
          userId,
          actorId: userId,
          action,
          correlationId,
        })),
      );
    },
  };
}
