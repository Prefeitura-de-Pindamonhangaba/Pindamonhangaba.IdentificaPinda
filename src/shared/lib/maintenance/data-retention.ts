import "server-only";
import { getDatabase } from "@/shared/lib/db/client";
import { createConsultationRepository } from "@/modules/consultations/models/consultation-repository";
import { createAuthRetentionRepository } from "@/modules/auth/models/auth-retention-repository";

export function startDataRetention() {
  if (
    process.env.NEXT_PHASE === "phase-production-build" ||
    (process.env.NODE_ENV !== "production" &&
      process.env.PLAYWRIGHT_TEST === "1")
  )
    return;
  let running = false;
  const purge = () => {
    if (running) return;
    running = true;
    void (async () => {
      await createAuthRetentionRepository(getDatabase()).purgeExpired();
      // A remoção não exige descriptografia e continua mesmo com a fonte desligada.
      await createConsultationRepository(getDatabase()).purgeExpired();
    })()
      .catch(() =>
        console.error(JSON.stringify({ event: "maintenance.purge_failed" })),
      )
      .finally(() => {
        running = false;
      });
  };
  purge();
  setInterval(purge, 60_000).unref();
}
