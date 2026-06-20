import { parseISO, differenceInYears } from "date-fns";

export function calcularIdade(dataNascimentoISO: string, referenciaISO?: string): number {
  const nasc = parseISO(dataNascimentoISO);
  const ref = referenciaISO ? parseISO(referenciaISO) : new Date();
  return Math.max(0, differenceInYears(ref, nasc));
}

export type FaixaEtaria =
  | "<20"
  | "20-29"
  | "30-39"
  | "40-49"
  | "50+";

export function faixaEtaria(idade: number): FaixaEtaria {
  if (idade < 20) return "<20";
  if (idade < 30) return "20-29";
  if (idade < 40) return "30-39";
  if (idade < 50) return "40-49";
  return "50+";
}
