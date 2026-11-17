import {
  authorizeRequest,
  privateJson,
  readJson,
  RequestError,
  safeRequestError,
} from "@/shared/lib/security/request";
import { updateQuotaSettings } from "@/shared/lib/consultations/server";
import { quotaSettingsSchema } from "../schemas/quota-settings-schema";

export async function putQuotaSettings(request: Request) {
  try {
    const principal = await authorizeRequest(
      request,
      "consultations:quota:manage",
    );
    const parsed = quotaSettingsSchema.safeParse(await readJson(request));
    if (!parsed.success)
      throw new RequestError(
        400,
        "Informe um limite inteiro entre 0 e 1.000.000 ou deixe em branco.",
      );
    if (!(await updateQuotaSettings(principal, parsed.data)))
      throw new RequestError(404, "Usuário não encontrado.");
    return privateJson({ success: true });
  } catch (error) {
    return safeRequestError(error);
  }
}
