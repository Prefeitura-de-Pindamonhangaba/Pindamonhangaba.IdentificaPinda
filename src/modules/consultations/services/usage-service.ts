import {
  canAccess,
  type Principal,
} from "@/modules/auth/services/access-service";
import { ConsultationError } from "../models/consultation-types";
import type { ConsultationRepository } from "../models/consultation-repository";
import type { createQuotaSettingsRepository } from "../models/quota-settings-repository";
import type { QuotaSettings } from "../schemas/quota-settings-schema";
import { currentQuotaMonth } from "./quota-policy";

export async function summarizeUsage(
  principal: Principal,
  repository: Pick<ConsultationRepository, "usage">,
  limits: {
    contracted: number;
    additional: number;
    global: number | null;
    personal: number | null;
  },
  now: Date,
) {
  if (!canAccess(principal, "consultations:read"))
    throw new ConsultationError("forbidden");
  const admin = canAccess(principal, "audit:read");
  const month = currentQuotaMonth(now);
  const start = new Date(month + "-01T00:00:00Z");
  const [group, personal] = await Promise.all([
    repository.usage(undefined, start),
    admin ? null : repository.usage(principal.id, start),
  ]);
  const count = (rows: typeof group, origin: string, kind?: string) =>
    rows
      .filter((row) => row.origin === origin && (!kind || row.kind === kind))
      .reduce((total, row) => total + row.count, 0);
  return {
    admin,
    month,
    sources: ["serpro", "cache"].map((origin) => ({
      origin,
      cpf: count(personal ?? group, origin, "cpf"),
      cnpj: count(personal ?? group, origin, "cnpj"),
    })),
    globalUsed: count(group, "serpro"),
    globalLimit: Math.min(
      limits.global ?? Infinity,
      limits.contracted + limits.additional,
    ),
    personalLimit: admin ? null : limits.personal,
  };
}

export async function saveQuotaSettings(
  repository: ReturnType<typeof createQuotaSettingsRepository>,
  principal: Principal,
  settings: QuotaSettings,
) {
  if (!canAccess(principal, "consultations:quota:manage"))
    throw new ConsultationError("forbidden");
  return repository.save(principal.id, settings);
}
