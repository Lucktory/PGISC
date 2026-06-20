import type { Atendimento, Empresa, PeriodoMes } from "../data/types";

export function calcularIIOS(
  atendimentos: Atendimento[],
  empresa: Empresa,
  periodo: PeriodoMes
): number {
  const horas = atendimentos.reduce((a, r) => a + r.horasPerdidas, 0);
  const ativos = empresa.colaboradoresAtivos[periodo] ?? 0;
  if (ativos === 0) return 0;
  return Math.round((horas / ativos) * 100) / 100;
}
