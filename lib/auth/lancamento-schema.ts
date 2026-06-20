import { z } from "zod";

import type { TipoAtendimento } from "@/lib/data/types";

export const lancamentoSchema = z
  .object({
    prontuario: z.string().min(1, "Selecione um colaborador"),
    dataAtendimento: z
      .string()
      .min(1, "Informe a data do atendimento")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato YYYY-MM-DD"),
    tipoAtendimento: z.enum(["Passivo", "Ativo", "Suspensao"]),
    localAtendimento: z.string().min(1, "Informe o local"),
    motivo: z.string().min(3, "Descreva brevemente o motivo"),
    tipoExame: z.string().min(1, "Informe o tipo de exame"),
    cid: z.string().min(1, "Selecione o CID"),
    conduta: z.string().min(1, "Descreva a conduta"),
    necessidadeAfastamento: z.boolean(),
    horasPerdidas: z.coerce.number().min(0).default(0),
    diasPerdidos: z.coerce.number().min(0).default(0),
    medicoResponsavel: z.string().min(1, "Selecione o medico"),
    observacoes: z.string().optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.necessidadeAfastamento) {
      if (!data.horasPerdidas || data.horasPerdidas <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Informe as horas perdidas",
          path: ["horasPerdidas"],
        });
      }
      if (!data.diasPerdidos || data.diasPerdidos <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Informe os dias perdidos",
          path: ["diasPerdidos"],
        });
      }
    }
  });

export type LancamentoFormValues = z.infer<typeof lancamentoSchema>;

export const TIPOS_ATENDIMENTO: TipoAtendimento[] = [
  "Passivo",
  "Ativo",
  "Suspensao",
];
