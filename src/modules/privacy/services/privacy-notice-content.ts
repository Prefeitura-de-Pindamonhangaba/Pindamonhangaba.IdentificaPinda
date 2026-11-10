import { createHash } from "node:crypto";
import { PRIVACY_NOTICE } from "../models/privacy-notice";

export function serializePrivacyNotice() {
  return (
    [
      `# ${PRIVACY_NOTICE.title}`,
      `Versão ${PRIVACY_NOTICE.version} — ${PRIVACY_NOTICE.publishedOn}`,
      `Adaptado da [política do portal municipal](${PRIVACY_NOTICE.sourceUrl}).`,
      ...PRIVACY_NOTICE.sections.flatMap((section) => [
        `## ${section.title}`,
        ...section.paragraphs.map((parts) =>
          parts
            .map((part) =>
              part.href ? `[${part.text}](${part.href})` : part.text,
            )
            .join(""),
        ),
      ]),
    ].join("\n\n") + "\n"
  );
}
const text = serializePrivacyNotice();
export const CURRENT_NOTICE = {
  notice: PRIVACY_NOTICE,
  text,
  digest: createHash("sha256").update(text).digest("hex"),
};
