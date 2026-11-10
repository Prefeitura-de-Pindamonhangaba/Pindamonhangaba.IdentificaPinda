import type { Principal } from "@/modules/auth/services/access-service";
import { canAccess } from "@/modules/auth/services/access-service";
import type { ConsultationRepository } from "../models/consultation-repository";
import {
  ConsultationError,
  type ConsultationResult,
} from "../models/consultation-types";
import { verifyResult } from "./result-proof";
import { CACHE_RETENTION_MS } from "./consultation-service";

export async function authorizeDisclosure(
  repository: ConsultationRepository,
  key: string,
  principal: Principal,
  results: ConsultationResult[],
) {
  const now = Date.now();
  if (
    !canAccess(principal, "consultations:export") ||
    !canAccess(principal, "consultations:read") ||
    !canAccess(principal, "sources:infoconv") ||
    results.length === 0 ||
    new Set(results.map((result) => result.id)).size !== results.length ||
    results.some(
      (result) => !canAccess(principal, `consultations:${result.kind}`),
    ) ||
    !(await repository.ownsRecords(
      results.map((result) => result.id),
      principal.id,
    )) ||
    results.some(
      (result) =>
        !verifyResult(key, result) ||
        !Number.isFinite(Date.parse(result.obtainedAt)) ||
        Date.parse(result.obtainedAt) > now ||
        now - Date.parse(result.obtainedAt) >= CACHE_RETENTION_MS ||
        (result.expiresAt !== undefined &&
          (!Number.isFinite(Date.parse(result.expiresAt)) ||
            Date.parse(result.expiresAt) <= now)),
    )
  )
    throw new ConsultationError("forbidden");
}
