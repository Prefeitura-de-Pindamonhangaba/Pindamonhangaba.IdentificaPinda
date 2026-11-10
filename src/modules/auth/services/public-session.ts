import { z } from "zod";

const publicSessionSchema = z.object({
  session: z.object({ id: z.string(), expiresAt: z.iso.datetime() }),
  user: z.object({ id: z.string(), name: z.string() }),
});

// A API interna do SDK continua completa; somente o transporte ao navegador
// recebe esta projeção. Nunca entregar o token HttpOnly novamente em JSON.
export function projectPublicSession(value: unknown) {
  if (value === null) return null;
  const parsed = publicSessionSchema.safeParse(value);
  if (!parsed.success) throw new Error("Resposta de sessão inválida.");
  return parsed.data;
}
