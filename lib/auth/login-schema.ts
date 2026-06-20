import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Informe um email")
    .email("Email invalido"),
  senha: z
    .string()
    .min(1, "Informe uma senha")
    .min(4, "A senha deve ter ao menos 4 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const DEMO_EMAIL = "alexandre@pgisc.com";
export const DEMO_SENHA = "demo";
