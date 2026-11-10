import { lt, lte } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { rateLimit, session, verification } from "./auth-schema";

// Os contadores não precisam sobreviver à maior janela de limitação do SDK.
export const AUTH_RATE_LIMIT_WINDOW_SECONDS = 60;

export function createAuthRetentionRepository(database: PostgresJsDatabase) {
  return {
    async purgeExpired(now = new Date()) {
      await database.transaction(async (tx) => {
        await tx.delete(session).where(lte(session.expiresAt, now));
        await tx.delete(verification).where(lte(verification.expiresAt, now));
        await tx
          .delete(rateLimit)
          .where(
            lt(
              rateLimit.lastRequest,
              now.getTime() - AUTH_RATE_LIMIT_WINDOW_SECONDS * 1000,
            ),
          );
      });
    },
  };
}
