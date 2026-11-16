import type { summarizeUsage } from "../services/usage-service";

type Summary = Awaited<ReturnType<typeof summarizeUsage>>;
const number = new Intl.NumberFormat("pt-BR");

function LimitMeter({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  return (
    <div className="usage-meter">
      <h3>{label}</h3>
      <p>
        <strong>{number.format(used)}</strong> de {number.format(limit)}{" "}
        consultas
      </p>
      <meter
        aria-label={label}
        min={0}
        max={Math.max(1, limit)}
        value={limit === 0 ? 1 : Math.min(used, limit)}
      />
      <small>
        {number.format(Math.max(0, limit - used))} disponíveis no mês
      </small>
    </div>
  );
}

export function UsageDashboard({ summary }: { summary: Summary }) {
  const max = Math.max(
    1,
    ...summary.sources.map((source) => source.cpf + source.cnpj),
  );
  return (
    <section className="usage-summary" aria-labelledby="usage-title">
      <h2 id="usage-title">
        {summary.admin ? "Consultas da equipe" : "Minhas consultas"} ·{" "}
        {summary.month} UTC
      </h2>
      <div className="usage-grid">
        {summary.sources.map(({ origin, cpf, cnpj }) => (
          <div className="usage-meter" key={origin}>
            <h3>{origin === "serpro" ? "Infoconv" : "Base local"}</h3>
            <strong className="usage-total">{number.format(cpf + cnpj)}</strong>
            <div className="usage-track" aria-hidden="true">
              <span
                className="usage-cpf"
                style={{ width: (cpf / max) * 100 + "%" }}
              />
              <span
                className="usage-cnpj"
                style={{ width: (cnpj / max) * 100 + "%" }}
              />
            </div>
            <div className="usage-legend">
              <span>CPF {number.format(cpf)}</span>
              <span>CNPJ {number.format(cnpj)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="usage-grid">
        <LimitMeter
          label="Consumo global do Infoconv"
          used={summary.globalUsed}
          limit={summary.globalLimit}
        />
        {summary.personalLimit !== null && (
          <LimitMeter
            label="Meu limite no Infoconv"
            used={summary.sources[0].cpf + summary.sources[0].cnpj}
            limit={summary.personalLimit}
          />
        )}
      </div>
      <p>
        A contagem do Infoconv inclui tentativas reservadas pelo sistema.
        Consultas à base local não consomem a franquia.
      </p>
    </section>
  );
}
