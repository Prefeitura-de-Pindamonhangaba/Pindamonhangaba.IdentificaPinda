import { afterAll, beforeAll, expect, test } from "bun:test";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { eq, inArray } from "drizzle-orm";
import {
  user,
  session,
  verification,
  rateLimit,
} from "../src/modules/auth/models/auth-schema";
import { createAuthRetentionRepository } from "../src/modules/auth/models/auth-retention-repository";

const databaseUrl = process.env.KEYCLOAK_TEST_DATABASE_URL;
if (
  databaseUrl &&
  (!new URL(databaseUrl).pathname.endsWith("_test") ||
    !["localhost", "127.0.0.1"].includes(new URL(databaseUrl).hostname))
)
  throw Error("Retenção exige banco local isolado com sufixo _test.");
const client = databaseUrl
  ? postgres(databaseUrl, { max: 2, onnotice: () => {} })
  : undefined;
const db = client ? drizzle(client) : undefined;
const userId = crypto.randomUUID();
const ids = [crypto.randomUUID(), crypto.randomUUID()];
beforeAll(async () => {
  if (!db) return;
  await migrate(db, { migrationsFolder: "drizzle" });
  await db.insert(user).values({
    id: userId,
    name: "Retenção fictícia",
    email: `retention-${userId}@example.test`,
  });
});
afterAll(async () => {
  if (!db || !client) return;
  await db.delete(session).where(eq(session.userId, userId));
  await db.delete(verification).where(inArray(verification.id, ids));
  await db.delete(rateLimit).where(inArray(rateLimit.id, ids));
  await db.delete(user).where(eq(user.id, userId));
  await client.end();
});
test.skipIf(!databaseUrl)(
  "limpeza remove somente estado de autenticação vencido, preservando sessões e contadores ativos",
  async () => {
    const now = new Date();
    for (const [index, id] of ids.entries()) {
      const expiresAt = new Date(
        now.getTime() + (index === 0 ? -1000 : 600_000),
      );
      await db!.insert(session).values({
        id,
        userId,
        token: `fictitious-${id}`,
        expiresAt,
        ipAddress: "192.0.2.1",
        userAgent: "fictitious-agent",
      });
      await db!.insert(verification).values({
        id,
        identifier: `fictitious-${id}`,
        value: "fictitious-state",
        expiresAt,
      });
      await db!.insert(rateLimit).values({
        id,
        key: `fictitious-${id}`,
        count: 1,
        lastRequest: now.getTime() - (index === 0 ? 61_000 : 10_000),
      });
    }
    await createAuthRetentionRepository(db!).purgeExpired(now);
    expect(
      (await db!.select().from(session).where(inArray(session.id, ids))).map(
        (r) => r.id,
      ),
    ).toEqual([ids[1]]);
    expect(
      (
        await db!
          .select()
          .from(verification)
          .where(inArray(verification.id, ids))
      ).map((r) => r.id),
    ).toEqual([ids[1]]);
    expect(
      (
        await db!.select().from(rateLimit).where(inArray(rateLimit.id, ids))
      ).map((r) => r.id),
    ).toEqual([ids[1]]);
  },
);
