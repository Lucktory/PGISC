import type { Atendimento, PeriodoMes } from "../data/types";
import { getAtendimentosBase } from "./filters";
import {
  calcularRecorrentes,
  contarColaboradoresUnicos,
  type RecorrenciaInfo,
} from "./recorrentes";

export interface RankingSetor {
  setor: string;
  diasPerdidos: number;
  horasPerdidas: number;
  atendimentos: number;
  colaboradoresImpactados: number;
}

export interface RankingCargo {
  cargo: string;
  diasPerdidos: number;
  horasPerdidas: number;
  atendimentos: number;
}

export interface PontoEvolucao {
  periodo: PeriodoMes;
  label: string;
  diasPerdidos: number;
  horasPerdidas: number;
}

export interface AbsenteismoDashboard {
  totalDias: number;
  totalHoras: number;
  mediaDiasPorColaborador: number;
  percentualComAfastamento: number;
  rankingSetores: RankingSetor[];
  rankingCargos: RankingCargo[];
  evolucao: PontoEvolucao[];
  recorrentes: RecorrenciaInfo[];
}

export function calcularAbsenteismo(
  atendimentos: Atendimento[],
  empresaId: string
): AbsenteismoDashboard {
  const totalDias = round1(atendimentos.reduce((a, r) => a + r.diasPerdidos, 0));
  const totalHoras = round1(atendimentos.reduce((a, r) => a + r.horasPerdidas, 0));
  const colabs = contarColaboradoresUnicos(atendimentos);
  const total = atendimentos.length;
  const comAfast = atendimentos.filter((a) => a.necessidadeAfastamento).length;

  // Ranking setores
  const setorMap = new Map<string, { setor: string; dias: number; horas: number; atend: number; colabs: Set<string> }>();
  for (const a of atendimentos) {
    const entry = setorMap.get(a.setor) ?? {
      setor: a.setor, dias: 0, horas: 0, atend: 0, colabs: new Set<string>(),
    };
    entry.dias += a.diasPerdidos;
    entry.horas += a.horasPerdidas;
    entry.atend += 1;
    entry.colabs.add(a.prontuario);
    setorMap.set(a.setor, entry);
  }
  const rankingSetores: RankingSetor[] = Array.from(setorMap.values())
    .map((s) => ({
      setor: s.setor,
      diasPerdidos: round1(s.dias),
      horasPerdidas: round1(s.horas),
      atendimentos: s.atend,
      colaboradoresImpactados: s.colabs.size,
    }))
    .sort((a, b) => b.diasPerdidos - a.diasPerdidos);

  // Ranking cargos
  const cargoMap = new Map<string, { cargo: string; dias: number; horas: number; atend: number }>();
  for (const a of atendimentos) {
    const entry = cargoMap.get(a.cargo) ?? {
      cargo: a.cargo, dias: 0, horas: 0, atend: 0,
    };
    entry.dias += a.diasPerdidos;
    entry.horas += a.horasPerdidas;
    entry.atend += 1;
    cargoMap.set(a.cargo, entry);
  }
  const rankingCargos: RankingCargo[] = Array.from(cargoMap.values())
    .map((c) => ({
      cargo: c.cargo,
      diasPerdidos: round1(c.dias),
      horasPerdidas: round1(c.horas),
      atendimentos: c.atend,
    }))
    .sort((a, b) => b.diasPerdidos - a.diasPerdidos);

  // Evolucao
  const periodos: Array<{ id: PeriodoMes; label: string }> = [
    { id: "2025-11", label: "Nov 2025" },
    { id: "2025-12", label: "Dez 2025" },
    { id: "2026-01", label: "Jan 2026" },
  ];
  const evolucao: PontoEvolucao[] = periodos.map(({ id, label }) => {
    const base = getAtendimentosBase(id).filter((a) => a.empresaId === empresaId);
    return {
      periodo: id,
      label,
      diasPerdidos: round1(base.reduce((a, r) => a + r.diasPerdidos, 0)),
      horasPerdidas: round1(base.reduce((a, r) => a + r.horasPerdidas, 0)),
    };
  });

  const recorrentes = calcularRecorrentes(atendimentos);

  return {
    totalDias,
    totalHoras,
    mediaDiasPorColaborador: colabs > 0 ? round1(totalDias / colabs) : 0,
    percentualComAfastamento: total > 0 ? comAfast / total : 0,
    rankingSetores,
    rankingCargos,
    evolucao,
    recorrentes,
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
