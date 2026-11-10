import "server-only";
import { redirect } from "next/navigation";
import type { Principal } from "@/modules/auth/services/access-service";
import { canAccess } from "@/modules/auth/services/access-service";
import { getPrincipal } from "@/modules/auth/controllers/access-controller";
import {
  hasPrivacyAcknowledgement,
  recordPrivacyAcknowledgement,
  requirePrivacyAcknowledgement,
} from "@/shared/lib/privacy/server";
import {
  authorizeRequest,
  privateJson,
  readJson,
  RequestError,
  safeRequestError,
} from "@/shared/lib/security/request";
import { acknowledgeNoticeSchema } from "../schemas/acknowledge-notice-schema";
import { CURRENT_NOTICE } from "../services/privacy-notice-content";
import { PrivacyNoticeError } from "../services/privacy-service";

export function privacyNoticeFailure(error: unknown) {
  if (!(error instanceof PrivacyNoticeError)) return null;
  return privateJson(
    {
      code:
        error.code === "required"
          ? "privacy_notice_required"
          : error.code === "changed"
            ? "privacy_notice_changed"
            : "forbidden",
      message:
        error.code === "required"
          ? "Confirme a leitura do aviso de privacidade antes de continuar."
          : error.code === "changed"
            ? "O aviso foi atualizado. Recarregue a página e confirme a versão atual."
            : "Acesso não autorizado.",
      noticeUrl: "/privacy",
    },
    error.code === "required" ? 428 : error.code === "changed" ? 409 : 403,
  );
}
export async function requireConsultationNotice(principal: Principal) {
  try {
    await requirePrivacyAcknowledgement(principal);
  } catch (error) {
    if (error instanceof PrivacyNoticeError && error.code === "required")
      redirect("/privacy");
    throw error;
  }
}
export async function getPrivacyPageOptions(headers: Headers) {
  let principal: Principal | null = null;
  let unavailable = false;
  let acknowledged = false;
  try {
    principal = await getPrincipal(headers);
    acknowledged = principal
      ? await hasPrivacyAcknowledgement(principal)
      : false;
  } catch {
    principal = null;
    unavailable = true;
    console.error(JSON.stringify({ event: "privacy.session_unavailable" }));
  }
  return {
    notice: CURRENT_NOTICE.notice,
    digest: CURRENT_NOTICE.digest,
    authenticated: !!principal,
    acknowledged,
    unavailable,
    canConsult: canAccess(principal, "consultations:read"),
  };
}
export function getPublicNotice() {
  return privateJson({
    version: CURRENT_NOTICE.notice.version,
    digest: CURRENT_NOTICE.digest,
    publishedOn: CURRENT_NOTICE.notice.publishedOn,
  });
}
export async function postAcknowledgement(request: Request) {
  try {
    const principal = await authorizeRequest(request, "panel:read");
    const parsed = acknowledgeNoticeSchema.safeParse(await readJson(request));
    if (!parsed.success)
      throw new RequestError(
        400,
        "Confirme a leitura da versão atual do aviso de privacidade.",
      );
    await recordPrivacyAcknowledgement(principal, parsed.data);
    return privateJson({
      success: true,
      redirectTo: canAccess(principal, "consultations:read")
        ? "/consultations"
        : "/",
    });
  } catch (error) {
    return privacyNoticeFailure(error) ?? safeRequestError(error);
  }
}
