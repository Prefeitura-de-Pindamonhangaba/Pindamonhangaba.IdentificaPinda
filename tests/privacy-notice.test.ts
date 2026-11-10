import { expect, test, mock } from "bun:test";
import { createHash } from "node:crypto";
import { CURRENT_NOTICE } from "../src/modules/privacy/services/privacy-notice-content";
import {
  requireAcknowledgement,
  acknowledgeNotice,
} from "../src/modules/privacy/services/privacy-service";
import { acknowledgeNoticeSchema } from "../src/modules/privacy/schemas/acknowledge-notice-schema";
import type { PrivacyRepository } from "../src/modules/privacy/models/privacy-repository";
const principal = {
  id: crypto.randomUUID(),
  name: "Servidor fictício",
  role: "operator",
  enabled: true,
};
const input = {
  version: CURRENT_NOTICE.notice.version,
  digest: CURRENT_NOTICE.digest,
  acknowledged: true as const,
};
test("sem ciência da versão atual, acesso é negado; versões antigas não autorizam", async () => {
  const repository: PrivacyRepository = {
    hasAcknowledged: mock(async () => false),
    acknowledge: mock(async () => {}),
  };
  await expect(
    requireAcknowledgement(repository, principal),
  ).rejects.toMatchObject({ code: "required" });
  expect(repository.hasAcknowledged).toHaveBeenCalledWith(
    principal.id,
    CURRENT_NOTICE.digest,
  );
  await expect(
    acknowledgeNotice(repository, principal, {
      ...input,
      digest: "00".repeat(32),
    }),
  ).rejects.toMatchObject({ code: "changed" });
  expect(repository.acknowledge).not.toHaveBeenCalled();
  await acknowledgeNotice(repository, principal, input);
  expect(repository.acknowledge).toHaveBeenCalledWith({
    userId: principal.id,
    noticeVersion: input.version,
    noticeDigest: input.digest,
    noticeText: CURRENT_NOTICE.text,
  });
  await expect(
    acknowledgeNotice(repository, { ...principal, enabled: false }, input),
  ).rejects.toMatchObject({ code: "forbidden" });
  expect(
    acknowledgeNoticeSchema.safeParse({ ...input, acknowledged: false })
      .success,
  ).toBe(false);
  expect(
    acknowledgeNoticeSchema.safeParse({ ...input, userId: crypto.randomUUID() })
      .success,
  ).toBe(false);
});
test("snapshot do aviso e hash são estáveis e correspondem ao documento aprovado", async () => {
  expect(createHash("sha256").update(CURRENT_NOTICE.text).digest("hex")).toBe(
    CURRENT_NOTICE.digest,
  );
  expect(
    (await Bun.file("docs/aviso-privacidade.md").text()).replaceAll(
      "\r\n",
      "\n",
    ),
  ).toBe(CURRENT_NOTICE.text);
  expect(CURRENT_NOTICE.text).not.toContain("MINUTA");
});
