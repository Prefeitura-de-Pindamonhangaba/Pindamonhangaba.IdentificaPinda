import { CURRENT_NOTICE } from "../src/modules/privacy/services/privacy-notice-content";
await Bun.write(
  new URL("../docs/aviso-privacidade.md", import.meta.url),
  CURRENT_NOTICE.text,
);
console.log(
  "Aviso exportado a partir da versão canônica: " +
    CURRENT_NOTICE.notice.version,
);
