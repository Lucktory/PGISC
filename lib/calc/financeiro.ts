import { getEmpresa } from "../data/empresas";
import type { Atendimento, PeriodoMes } from "../data/types";
import { getAtendimentosBase } from "./filters";

export interface CustoSetor {
  setor: string;
  custo: number;
  horas: number;
}

export interface CustoCargo {
  cargo: string;
  custo: number;
  horas: number;
}

export interface CustoEvolucao {
  periodo: PeriodoMes;
  label: string;
  custo: number;
}

export interface CasoCustoso {
  prontuario: string;
  nome: string;
  setor: string;
  cargo: string;
  diasPerdidos: number;
  horasPerdidas: number;
  custo: number;
}

export interface FinanceiroDashboard {
  custoTotal: number;
  custoPorColaborador: number;
  setorMaisCustoso: string;
  cargoMaisCustoso: string;
  custoPorSetor: CustoSetor[];
  custoPorCargo: CustoCargo[];
  evolucao: CustoEvolucao[];
  topCasos: CasoCustoso[];
}

export function calcularFinanceiro(
  atendimentos: Atendimento[],
  empresaId: string,
  custoHoraCargo: Record<string, number> = {}
): FinanceiroDashboard {
  const empresa = getEmpresa(empresaId);
  if (!empresa) throw new Error(`Empresa ${empresaId} nao encontrada`);
  const custoHoraPadrao = empresa.custoHoraPadrao;

  function custoDe(a: Atendimento): number {
    const taxa = custoHoraCargo[a.cargo] ?? custoHoraPadrao;
    return round2(a.horasPerdidas * taxa);
  }

  const custos = atendimentos.map(custoDe);
  const custoTotal = round2(custos.reduce((a, b) => a + b, 0));
  const colabsUnicos = new Set(atendimentos.map((a) => a.prontuario)).size;

  // Por setor
  const setorMap = new Map<string, { custo: number; horas: number }>();
  atendimentos.forEach((a, i) => {
    const entry = setorMap.get(a.setor) ?? { custo: 0, horas: 0 };
    entry.custo += custos[i];
    entry.horas += a.horasPerdidas;
    setorMap.set(a.setor, entry);
  });
  const custoPorSetor: CustoSetor[] = Array.from(setorMap.entries())
    .map(([setor, v]) => ({ setor, custo: round2(v.custo), horas: round1(v.horas) }))
    .sort((a, b) => b.custo - a.custo);

  // Por cargo
  const cargoMap = new Map<string, { custo: number; horas: number }>();
  atendimentos.forEach((a, i) => {
    const entry = cargoMap.get(a.cargo) ?? { custo: 0, horas: 0 };
    entry.custo += custos[i];
    entry.horas += a.horasPerdidas;
    cargoMap.set(a.cargo, entry);
  });
  const custoPorCargo: CustoCargo[] = Array.from(cargoMap.entries())
    .map(([cargo, v]) => ({ cargo, custo: round2(v.custo), horas: round1(v.horas) }))
    .sort((a, b) => b.custo - a.custo);

  // Evolucao
  const periodos: Array<{ id: PeriodoMes; label: string }> = [
    { id: "2025-11", label: "Nov 2025" },
    { id: "2025-12", label: "Dez 2025" },
    { id: "2026-01", label: "Jan 2026" },
  ];
  const evolucao: CustoEvolucao[] = periodos.map(({ id, label }) => {
    const base = getAtendimentosBase(id).filter((a) => a.empresaId === empresaId);
    const custo = round2(base.reduce((acc, a) => acc + custoDe(a), 0));
    return { periodo: id, label, custo };
  });

  // Top casos (por colaborador)
  const casoMap = new Map<string, CasoCustoso>();
  atendimentos.forEach((a, i) => {
    const existing = casoMap.get(a.prontuario);
    if (existing) {
      existing.diasPerdidos = round1(existing.diasPerdidos + a.diasPerdidos);
      existing.horasPerdidas = round1(existing.horasPerdidas + a.horasPerdidas);
      existing.custo = round2(existing.custo + custos[i]);
    } else {
      casoMap.set(a.prontuario, {
        prontuario: a.prontuario,
        nome: a.nome,
        setor: a.setor,
        cargo: a.cargo,
        diasPerdidos: a.diasPerdidos,
        horasPerdidas: a.horasPerdidas,
        custo: custos[i],
      });
    }
  });
  const topCasos = Array.from(casoMap.values())
    .sort((a, b) => b.custo - a.custo)
    .slice(0, 10);

  return {
    custoTotal,
    custoPorColaborador: colabsUnicos > 0 ? round2(custoTotal / colabsUnicos) : 0,
    setorMaisCustoso: custoPorSetor[0]?.setor ?? "-",
    cargoMaisCustoso: custoPorCargo[0]?.cargo ?? "-",
    custoPorSetor,
    custoPorCargo,
    evolucao,
    topCasos,
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
