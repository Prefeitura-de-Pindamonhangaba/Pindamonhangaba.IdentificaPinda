import "server-only";
import { getDatabase } from "@/shared/lib/db/client";
import type { Principal } from "@/modules/auth/services/access-service";
import { createPrivacyRepository } from "@/modules/privacy/models/privacy-repository";
import {
  acknowledgeNotice,
  hasCurrentAcknowledgement,
  requireAcknowledgement,
} from "@/modules/privacy/services/privacy-service";
import type { AcknowledgeNoticeInput } from "@/modules/privacy/schemas/acknowledge-notice-schema";
export const hasPrivacyAcknowledgement = (principal: Principal) =>
  hasCurrentAcknowledgement(createPrivacyRepository(getDatabase()), principal);
export const requirePrivacyAcknowledgement = (principal: Principal) =>
  requireAcknowledgement(createPrivacyRepository(getDatabase()), principal);
export const recordPrivacyAcknowledgement = (
  principal: Principal,
  input: AcknowledgeNoticeInput,
) =>
  acknowledgeNotice(createPrivacyRepository(getDatabase()), principal, input);
