import { parseISO, differenceInDays, differenceInMonths, differenceInYears } from "date-fns";

export interface TempoEmpresa {
  anos: number;
  meses: number;
  dias: number;
  diasTotais: number;
}

export function calcularTempoEmpresa(
  dataAdmissaoISO: string,
  referenciaISO?: string
): TempoEmpresa {
  const admissao = parseISO(dataAdmissaoISO);
  const ref = referenciaISO ? parseISO(referenciaISO) : new Date();
  const diasTotais = Math.max(0, differenceInDays(ref, admissao));
  const anos = differenceInYears(ref, admissao);
  const aposAnos = new Date(admissao);
  aposAnos.setFullYear(aposAnos.getFullYear() + anos);
  const meses = differenceInMonths(ref, aposAnos);
  const aposMeses = new Date(aposAnos);
  aposMeses.setMonth(aposMeses.getMonth() + meses);
  const dias = differenceInDays(ref, aposMeses);
  return { anos, meses, dias, diasTotais };
}

export function formatTempoEmpresa(t: TempoEmpresa): string {
  const parts: string[] = [];
  if (t.anos > 0) parts.push(`${t.anos} ano${t.anos === 1 ? "" : "s"}`);
  if (t.meses > 0) parts.push(`${t.meses} mes${t.meses === 1 ? "" : "es"}`);
  if (parts.length === 0) parts.push(`${t.dias} dia${t.dias === 1 ? "" : "s"}`);
  return parts.join(", ");
}

export type FaixaTempo =
  | "< 1 ano"
  | "1 a 3 anos"
  | "3 a 5 anos"
  | "5+ anos";

export function faixaTempoEmpresa(diasTotais: number): FaixaTempo {
  const anos = diasTotais / 365.25;
  if (anos < 1) return "< 1 ano";
  if (anos < 3) return "1 a 3 anos";
  if (anos < 5) return "3 a 5 anos";
  return "5+ anos";
}
