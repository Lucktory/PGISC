import { RECORRENTE_THRESHOLD_DEFAULT } from "../constants";
import type { Atendimento } from "../data/types";

export interface RecorrenciaInfo {
  prontuario: string;
  nome: string;
  setor: string;
  cargo: string;
  totalAtendimentos: number;
  totalDiasPerdidos: number;
  totalHorasPerdidas: number;
}

export function calcularRecorrentes(
  atendimentos: Atendimento[],
  threshold = RECORRENTE_THRESHOLD_DEFAULT
): RecorrenciaInfo[] {
  const mapa = new Map<string, RecorrenciaInfo>();
  for (const a of atendimentos) {
    const existing = mapa.get(a.prontuario);
    if (existing) {
      existing.totalAtendimentos += 1;
      existing.totalDiasPerdidos += a.diasPerdidos;
      existing.totalHorasPerdidas += a.horasPerdidas;
    } else {
      mapa.set(a.prontuario, {
        prontuario: a.prontuario,
        nome: a.nome,
        setor: a.setor,
        cargo: a.cargo,
        totalAtendimentos: 1,
        totalDiasPerdidos: a.diasPerdidos,
        totalHorasPerdidas: a.horasPerdidas,
      });
    }
  }
  return Array.from(mapa.values())
    .filter((v) => v.totalAtendimentos >= threshold)
    .sort((a, b) => b.totalAtendimentos - a.totalAtendimentos);
}

export function contarRecorrentes(
  atendimentos: Atendimento[],
  threshold = RECORRENTE_THRESHOLD_DEFAULT
): number {
  return calcularRecorrentes(atendimentos, threshold).length;
}

export function contarColaboradoresUnicos(atendimentos: Atendimento[]): number {
  return new Set(atendimentos.map((a) => a.prontuario)).size;
}
