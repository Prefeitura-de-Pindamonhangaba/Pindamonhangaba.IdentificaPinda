import { requirePageAccess } from "@/modules/auth/controllers/access-controller";
import { PanelShell } from "@/shared/components/panel-shell";
import { AuditView } from "@/modules/consultations/views/audit-view";
import { QuotaView } from "@/modules/consultations/views/quota-view";
import { QuotaSettingsView } from "@/modules/consultations/views/quota-settings-view";
import { UsageDashboard } from "@/modules/consultations/views/usage-dashboard";
import { getUsageDashboard } from "@/shared/lib/consultations/server";

export default async function AuditPage() {
  const principal = await requirePageAccess("consultations:read");
  const { summary, global, users } = await getUsageDashboard(principal);
  return (
    <PanelShell userName={principal.name} admin={summary.admin}>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Acompanhamento</span>
          <h1>Auditoria de consultas</h1>
          <p>
            Volume mensal por origem e acompanhamento da franquia do Infoconv.
          </p>
        </div>
      </div>
      <UsageDashboard summary={summary} />
      {summary.admin && (
        <>
          <QuotaSettingsView global={global} users={users} />
          <QuotaView />
          <AuditView />
        </>
      )}
    </PanelShell>
  );
}
