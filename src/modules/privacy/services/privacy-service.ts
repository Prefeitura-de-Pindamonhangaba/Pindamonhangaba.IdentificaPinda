import {
  canAccess,
  type Principal,
} from "@/modules/auth/services/access-service";
import type { PrivacyRepository } from "../models/privacy-repository";
import type { AcknowledgeNoticeInput } from "../schemas/acknowledge-notice-schema";
import { CURRENT_NOTICE } from "./privacy-notice-content";

export class PrivacyNoticeError extends Error {
  constructor(public readonly code: "required" | "changed" | "forbidden") {
    super(code);
  }
}
export async function hasCurrentAcknowledgement(
  repository: PrivacyRepository,
  principal: Principal,
) {
  if (!canAccess(principal, "panel:read"))
    throw new PrivacyNoticeError("forbidden");
  return repository.hasAcknowledged(principal.id, CURRENT_NOTICE.digest);
}
export async function requireAcknowledgement(
  repository: PrivacyRepository,
  principal: Principal,
) {
  if (!(await hasCurrentAcknowledgement(repository, principal)))
    throw new PrivacyNoticeError("required");
}
export async function acknowledgeNotice(
  repository: PrivacyRepository,
  principal: Principal,
  input: AcknowledgeNoticeInput,
) {
  if (!canAccess(principal, "panel:read"))
    throw new PrivacyNoticeError("forbidden");
  if (
    input.version !== CURRENT_NOTICE.notice.version ||
    input.digest !== CURRENT_NOTICE.digest
  )
    throw new PrivacyNoticeError("changed");
  await repository.acknowledge({
    userId: principal.id,
    noticeVersion: CURRENT_NOTICE.notice.version,
    noticeDigest: CURRENT_NOTICE.digest,
    noticeText: CURRENT_NOTICE.text,
  });
}
