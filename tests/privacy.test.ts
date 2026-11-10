import { expect, test, mock } from "bun:test";
import { consultationSchema } from "../src/modules/consultations/schemas/consultation-schema";
import { authorizeDisclosure } from "../src/modules/consultations/services/disclosure-service";
import { signResult } from "../src/modules/consultations/services/result-proof";
import type { ConsultationRepository } from "../src/modules/consultations/models/consultation-repository";
import type { ConsultationResult } from "../src/modules/consultations/models/consultation-types";

const key = "ab".repeat(32);
const principal = {
  id: crypto.randomUUID(),
  name: "Pessoa fictícia",
  role: "operator",
  enabled: true,
};
const input = {
  kind: "cpf",
  document: "11144477735",
  purpose: "Processo administrativo 123/2026",
  batchId: crypto.randomUUID(),
};

test("finalidade rejeita outros documentos válidos sem confundir referência administrativa", () => {
  expect(consultationSchema.safeParse(input).success).toBe(true);
  for (const value of [
    "52998224725",
    "529.982.247-25",
    "04.252.011/0001-10",
    "12ABC34501DE35",
  ]) {
    expect(
      consultationSchema.safeParse({
        ...input,
        purpose: "Fiscalização referente a " + value,
      }).success,
    ).toBe(false);
  }
  expect(
    consultationSchema.safeParse({
      ...input,
      purpose: "Processo 2026/123456, expediente 4321",
    }).success,
  ).toBe(true);
});

function result(overrides: Partial<ConsultationResult> = {}) {
  const value: ConsultationResult = {
    id: crypto.randomUUID(),
    batchId: crypto.randomUUID(),
    kind: "cpf",
    document: "11144477735",
    status: "success",
    origin: "mock",
    obtainedAt: new Date(Date.now() - 1000).toISOString(),
    data: { Nome: "Pessoa fictícia" },
    ...overrides,
  };
  return { ...value, proof: signResult(key, value) };
}

test("exportação exige proprietário e recusa resultados vencidos, futuros, repetidos e adulterados", async () => {
  const ownsRecords = mock(async () => true);
  const repository = { ownsRecords } as unknown as ConsultationRepository;
  const valid = result();
  await expect(
    authorizeDisclosure(repository, key, principal, [valid]),
  ).resolves.toBeUndefined();
  for (const rows of [
    [],
    [valid, valid],
    [result({ obtainedAt: "inválida" })],
    [result({ obtainedAt: new Date(Date.now() + 60_000).toISOString() })],
    [result({ obtainedAt: new Date(Date.now() - 8 * 86400000).toISOString() })],
    [result({ expiresAt: new Date(Date.now() - 100).toISOString() })],
    [{ ...valid, data: { Nome: "Adulterado" } }],
  ]) {
    await expect(
      authorizeDisclosure(repository, key, principal, rows),
    ).rejects.toMatchObject({ code: "forbidden" });
  }
  ownsRecords.mockImplementation(async () => false);
  await expect(
    authorizeDisclosure(repository, key, principal, [valid]),
  ).rejects.toMatchObject({ code: "forbidden" });
  await expect(
    authorizeDisclosure(repository, key, { ...principal, role: "viewer" }, [
      valid,
    ]),
  ).rejects.toMatchObject({ code: "forbidden" });
});

test("sessão pública não devolve token, metadados ou atributos internos", async () => {
  const { projectPublicSession } =
    await import("../src/modules/auth/services/public-session");
  const value = projectPublicSession({
    session: {
      id: "session-id",
      expiresAt: "2026-11-10T12:00:00Z",
      token: "fictitious-secret",
      ipAddress: "192.0.2.1",
      userAgent: "fingerprint",
    },
    user: {
      id: "user-id",
      name: "Servidor fictício",
      email: "internal@identity.invalid",
      role: "admin",
    },
  });
  expect(value).toEqual({
    session: { id: "session-id", expiresAt: "2026-11-10T12:00:00Z" },
    user: { id: "user-id", name: "Servidor fictício" },
  });
  expect(projectPublicSession(null)).toBeNull();
  expect(() =>
    projectPublicSession({ session: { token: "fictitious-secret" } }),
  ).toThrow("Resposta de sessão inválida.");
});
