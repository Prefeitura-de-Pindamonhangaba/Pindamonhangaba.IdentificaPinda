import { eq, sql } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { user } from "@/modules/auth/models/auth-schema";
import { auditEvent } from "@/modules/audit/models/audit-schema";
import { globalQuota, userQuota } from "./quota-schema";
import type { QuotaSettings } from "../schemas/quota-settings-schema";

type Reader = Pick<PostgresJsDatabase, "select">;

export async function readGlobalQuota(database: Reader) {
  const [row] = await database
    .select()
    .from(globalQuota)
    .where(eq(globalQuota.id, 1));
  return row?.limit ?? null;
}

export async function readUserQuota(database: Reader, userId: string) {
  const [row] = await database
    .select()
    .from(userQuota)
    .where(eq(userQuota.userId, userId));
  return row?.limit ?? null;
}

export function createQuotaSettingsRepository(database: PostgresJsDatabase) {
  return {
    listUsers() {
      return database
        .select({
          id: user.id,
          name: user.name,
          role: user.role,
          limit: userQuota.limit,
        })
        .from(user)
        .leftJoin(userQuota, eq(user.id, userQuota.userId))
        .orderBy(user.name, user.id);
    },
    async save(actorId: string, settings: QuotaSettings) {
      return database.transaction(async (tx) => {
        await tx.execute(
          sql`select pg_advisory_xact_lock(hashtext('infoconv:quota'))`,
        );
        if (settings.scope === "global") {
          if (settings.limit === null)
            await tx.delete(globalQuota).where(eq(globalQuota.id, 1));
          else
            await tx
              .insert(globalQuota)
              .values({ limit: settings.limit })
              .onConflictDoUpdate({
                target: globalQuota.id,
                set: { limit: settings.limit },
              });
        } else {
          const [target] = await tx
            .select({ id: user.id })
            .from(user)
            .where(eq(user.id, settings.userId));
          if (!target) return false;
          if (settings.limit === null)
            await tx
              .delete(userQuota)
              .where(eq(userQuota.userId, settings.userId));
          else
            await tx
              .insert(userQuota)
              .values({ userId: settings.userId, limit: settings.limit })
              .onConflictDoUpdate({
                target: userQuota.userId,
                set: { limit: settings.limit },
              });
        }
        await tx.insert(auditEvent).values({
          userId: settings.scope === "user" ? settings.userId : actorId,
          actorId,
          action:
            settings.scope === "user"
              ? "infoconv.user_limit_changed"
              : "infoconv.global_limit_changed",
        });
        return true;
      });
    },
  };
}
