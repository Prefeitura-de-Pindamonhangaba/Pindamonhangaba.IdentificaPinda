import { z } from "zod";

const limit = z.number().int().min(0).max(1000000).nullable();
export const quotaSettingsSchema = z.discriminatedUnion("scope", [
  z.strictObject({ scope: z.literal("global"), limit }),
  z.strictObject({ scope: z.literal("user"), userId: z.uuid(), limit }),
]);
export type QuotaSettings = z.infer<typeof quotaSettingsSchema>;
