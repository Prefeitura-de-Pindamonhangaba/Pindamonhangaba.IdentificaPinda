"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { QuotaSettings } from "../schemas/quota-settings-schema";

type User = { id: string; name: string; role: string; limit: number | null };
type Target =
  | Omit<Extract<QuotaSettings, { scope: "user" }>, "limit">
  | { scope: "global" };

function LimitForm({
  target,
  limit,
}: {
  target: Target;
  limit: number | null;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const id =
    target.scope === "global" ? "global-limit" : "limit-" + target.userId;

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = String(new FormData(event.currentTarget).get("limit")).trim();
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/consultations/quota/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...target,
          limit: raw === "" ? null : Number(raw),
        }),
      });
      if (!response.ok) {
        const result = await response.json();
        setMessage(result.message ?? "Não foi possível salvar o limite.");
        return;
      }
      setMessage("Limite salvo.");
      router.refresh();
    } catch {
      setMessage("Não foi possível salvar o limite.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="limit-form" onSubmit={save} aria-busy={pending}>
      <label htmlFor={id}>Limite mensal</label>
      <input
        id={id}
        name="limit"
        type="number"
        min="0"
        max="1000000"
        step="1"
        defaultValue={limit ?? ""}
        disabled={pending}
      />
      <button className="button" disabled={pending}>
        Salvar limite
      </button>
      <span role="status">{message}</span>
    </form>
  );
}

export function QuotaSettingsView({
  global,
  users,
}: {
  global: number | null;
  users: User[];
}) {
  const [search, setSearch] = useState("");
  const filtered = users.filter((user) =>
    user.name
      .toLocaleLowerCase("pt-BR")
      .includes(search.trim().toLocaleLowerCase("pt-BR")),
  );
  return (
    <section className="usage-summary" aria-labelledby="limits-title">
      <h2 id="limits-title">Limites do Infoconv</h2>
      <p>
        O teto global se aplica a toda a equipe e respeita a franquia contratada
        e o excedente aprovado. Em branco, vale o teto da franquia. Zero
        bloqueia novas chamadas ao Infoconv.
      </p>
      <LimitForm target={{ scope: "global" }} limit={global} />
      <details>
        <summary>Limites por usuário</summary>
        <p>
          Em branco, o usuário fica sujeito aos limites globais. Os valores se
          repetem a cada mês.
        </p>
        <label htmlFor="quota-user-filter">Buscar por nome</label>
        <input
          id="quota-user-filter"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="quota-users">
          {filtered.map((user) => (
            <details key={user.id}>
              <summary>
                {user.name} ·{" "}
                {user.role === "admin"
                  ? "Administrador"
                  : user.role === "operator"
                    ? "Operador"
                    : "Visualizador"}{" "}
                ·{" "}
                {user.limit === null
                  ? "Sem teto individual"
                  : user.limit.toLocaleString("pt-BR")}
              </summary>
              <LimitForm
                target={{ scope: "user", userId: user.id }}
                limit={user.limit}
              />
            </details>
          ))}
          {filtered.length === 0 && <p>Nenhum usuário encontrado.</p>}
        </div>
      </details>
    </section>
  );
}
