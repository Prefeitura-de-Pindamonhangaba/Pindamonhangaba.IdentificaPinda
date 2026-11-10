import { headers } from "next/headers";
import { getPrivacyPageOptions } from "@/modules/privacy/controllers/privacy-controller";
import { PrivacyNoticeView } from "@/modules/privacy/views/privacy-notice-view";
export const dynamic = "force-dynamic";
export const metadata = { title: "Aviso de Privacidade | Identifica Pinda" };
export default async function PrivacyPage() {
  return (
    <PrivacyNoticeView {...await getPrivacyPageOptions(await headers())} />
  );
}
