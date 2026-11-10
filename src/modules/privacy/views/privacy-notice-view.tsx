"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  InstitutionalHeader,
  InstitutionalFooter,
} from "@/shared/components/institutional-header";
import type { PrivacyNotice } from "../models/privacy-notice";

export function PrivacyNoticeView({
  notice,
  digest,
  authenticated,
  acknowledged,
  unavailable,
  canConsult,
}: {
  notice: PrivacyNotice;
  digest: string;
  authenticated: boolean;
  acknowledged: boolean;
  unavailable: boolean;
  canConsult: boolean;
}) {
  const [checked, setChecked] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!checked || pending) return;
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/privacy/acknowledgements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: notice.version,
          digest,
          acknowledged: true,
        }),
      });
      const body: { message?: string; redirectTo?: string } =
        await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          window.location.replace("/login");
          return;
        }
        if (response.status === 409) setChecked(false);
        setMessage(body.message ?? "Não foi possível registrar a ciência.");
        setPending(false);
        return;
      }
      window.location.replace(
        body.redirectTo === "/consultations" ? "/consultations" : "/",
      );
    } catch {
      setMessage("Não foi possível registrar a ciência. Tente novamente.");
      setPending(false);
    }
  }
  return (
    <>
      <InstitutionalHeader />
      <main
        id="main"
        className="container panel-main privacy-notice"
        tabIndex={-1}
      >
        <div className="page-heading">
          <div>
            <span className="eyebrow">Proteção de dados</span>
            <h1>{notice.title}</h1>
            <p>
              Versão {notice.version} ·{" "}
              {new Date(notice.publishedOn + "T00:00:00Z").toLocaleDateString(
                "pt-BR",
                { timeZone: "UTC" },
              )}
            </p>
          </div>
        </div>
        <p>
          Adaptado da{" "}
          <a
            href={notice.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
          >
            política de privacidade do portal municipal ↗
          </a>
          .
        </p>
        {notice.sections.map((section) => (
          <section key={section.title} className="privacy-notice-section">
            <h2>{section.title}</h2>
            {section.paragraphs.map((parts, index) => (
              <p key={index}>
                {parts.map((part, partIndex) =>
                  part.href ? (
                    <a
                      key={partIndex}
                      href={part.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      referrerPolicy="no-referrer"
                    >
                      {part.text}
                    </a>
                  ) : (
                    part.text
                  ),
                )}
              </p>
            ))}
          </section>
        ))}
        {unavailable ? (
          <p role="alert">
            Não foi possível verificar o acesso institucional. O aviso permanece
            disponível para leitura.
          </p>
        ) : authenticated ? (
          acknowledged ? (
            <div className="privacy">
              <p role="status">
                Ciência registrada para a versão {notice.version}.
              </p>
              <Link
                className="button"
                href={canConsult ? "/consultations" : "/"}
              >
                Continuar
              </Link>
            </div>
          ) : (
            <form
              className="consultation-form"
              onSubmit={submit}
              autoComplete="off"
            >
              <p>
                Para realizar consultas, confirme a leitura deste aviso. Esta
                ciência não é consentimento do cidadão consultado nem amplia
                suas permissões de acesso.
              </p>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={pending}
                  onChange={(event) => setChecked(event.target.checked)}
                  required
                />
                Li o aviso de privacidade e estou ciente das responsabilidades
                de uso.
              </label>
              <p role="alert" className="form-error">
                {message}
              </p>
              <button
                className="button"
                type="submit"
                disabled={!checked || pending}
              >
                {pending ? "Registrando…" : "Confirmar ciência e continuar"}
              </button>
            </form>
          )
        ) : (
          <p>
            Para confirmar a ciência,{" "}
            <Link href="/login">entre com sua conta institucional</Link>.
          </p>
        )}
      </main>
      <InstitutionalFooter />
    </>
  );
}
