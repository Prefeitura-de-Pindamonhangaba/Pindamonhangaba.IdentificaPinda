import { z } from "zod";
export const acknowledgeNoticeSchema = z.strictObject({
  version: z.string().min(1).max(32),
  digest: z.string().regex(/^[a-f\d]{64}$/),
  acknowledged: z.literal(true),
});
export type AcknowledgeNoticeInput = z.infer<typeof acknowledgeNoticeSchema>;
