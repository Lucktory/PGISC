import { calcularIdade, faixaEtaria, type FaixaEtaria } from "../derive/idade";
import type { Atendimento, PeriodoMes } from "../data/types";
import { getAtendimentosBase } from "./filters";

export interface CategoriaF {
  faixa: string; // "F00-F09" ... "F90-F99"
  rotulo: string;
  count: number;
}

export interface SetorAfetado {
  setor: string;
  count: number;
}

export interface HeatmapCell {
  setor: string;
  periodo: string;
  count: number;
}

export interface SaudeMentalDashboard {
  totalCasosF: number;
  percentualDoTotal: number;
  colaboradoresImpactados: number;
  novosCasos: number;
  categorias: CategoriaF[];
  setoresAfetados: SetorAfetado[];
  cargosAfetados: SetorAfetado[];
  faixaEtaria: Array<{ faixa: FaixaEtaria; count: number }>;
  heatmap: HeatmapCell[];
}

const CATEGORIAS_F: Array<{ faixa: string; rotulo: string; range: [string, string] }> = [
  { faixa: "F00-F09", rotulo: "Organicos (demencias)", range: ["F00", "F09"] },
  { faixa: "F10-F19", rotulo: "Substancias psicoativas", range: ["F10", "F19"] },
  { faixa: "F20-F29", rotulo: "Esquizofrenia", range: ["F20", "F29"] },
  { faixa: "F30-F39", rotulo: "Humor (depressao)", range: ["F30", "F39"] },
  { faixa: "F40-F48", rotulo: "Ansiedade", range: ["F40", "F48"] },
  { faixa: "F50-F59", rotulo: "Comportamentais", range: ["F50", "F59"] },
  { faixa: "F60-F69", rotulo: "Personalidade", range: ["F60", "F69"] },
  { faixa: "F90-F99", rotulo: "Infancia", range: ["F90", "F99"] },
];

function categoriaDeCid(cid: string): string | null {
  if (!cid.startsWith("F")) return null;
  const num = parseInt(cid.slice(1).split(".")[0], 10);
  if (Number.isNaN(num)) return null;
  for (const c of CATEGORIAS_F) {
    const min = parseInt(c.range[0].slice(1), 10);
    const max = parseInt(c.range[1].slice(1), 10);
    if (num >= min && num <= max) return c.faixa;
  }
  return null;
}

export function calcularSaudeMental(
  todosAtendimentos: Atendimento[],
  empresaId: string
): SaudeMentalDashboard {
  const total = todosAtendimentos.length;
  const casosF = todosAtendimentos.filter((a) => a.cid.startsWith("F"));
  const colabsF = new Set(casosF.map((a) => a.prontuario));

  const categorias = CATEGORIAS_F.map((c) => ({
    faixa: c.faixa,
    rotulo: c.rotulo,
    count: casosF.filter((a) => categoriaDeCid(a.cid) === c.faixa).length,
  }));

  // Setores e cargos afetados
  const setorMap = new Map<string, number>();
  const cargoMap = new Map<string, number>();
  for (const a of casosF) {
    setorMap.set(a.setor, (setorMap.get(a.setor) ?? 0) + 1);
    cargoMap.set(a.cargo, (cargoMap.get(a.cargo) ?? 0) + 1);
  }
  const setoresAfetados = Array.from(setorMap.entries())
    .map(([setor, count]) => ({ setor, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const cargosAfetados = Array.from(cargoMap.entries())
    .map(([setor, count]) => ({ setor, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Faixa etaria
  const faixas: FaixaEtaria[] = ["<20", "20-29", "30-39", "40-49", "50+"];
  const faixaCount: Record<FaixaEtaria, number> = {
    "<20": 0, "20-29": 0, "30-39": 0, "40-49": 0, "50+": 0,
  };
  for (const a of casosF) {
    const idade = calcularIdade(a.dataNascimento, a.dataAtendimento);
    faixaCount[faixaEtaria(idade)] += 1;
  }

  // Heatmap setor x periodo (last 3 months we have data for)
  const periodos: Array<{ id: PeriodoMes; label: string }> = [
    { id: "2025-11", label: "Nov" },
    { id: "2025-12", label: "Dez" },
    { id: "2026-01", label: "Jan" },
  ];
  const heatmap: HeatmapCell[] = [];
  for (const setor of Array.from(setorMap.keys())) {
    for (const p of periodos) {
      const count = getAtendimentosBase(p.id)
        .filter((a) => a.empresaId === empresaId && a.setor === setor && a.cid.startsWith("F"))
        .length;
      heatmap.push({ setor, periodo: p.label, count });
    }
  }

  return {
    totalCasosF: casosF.length,
    percentualDoTotal: total > 0 ? casosF.length / total : 0,
    colaboradoresImpactados: colabsF.size,
    novosCasos: casosF.length, // proxy: in MVP all casos are "novos" since no historic baseline
    categorias,
    setoresAfetados,
    cargosAfetados,
    faixaEtaria: faixas.map((f) => ({ faixa: f, count: faixaCount[f] })),
    heatmap,
  };
}
