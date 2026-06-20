import { findCid } from "../data/cid10-reference";
import { calcularIdade, faixaEtaria, type FaixaEtaria } from "../derive/idade";
import {
  calcularTempoEmpresa,
  faixaTempoEmpresa,
  type FaixaTempo,
} from "../derive/tempo-empresa";
import type { Atendimento, Sexo } from "../data/types";

export interface CidItem {
  codigo: string;
  nome: string;
  count: number;
  percentual: number;
}

export interface MotivoItem {
  motivo: string;
  count: number;
}

export interface GrupoCidItem {
  capitulo: string;
  capituloNome: string;
  count: number;
}

export interface EpidemiologicoDashboard {
  totalAtendimentos: number;
  cidsDistintos: number;
  cidMaisFrequente: string;
  topCids: CidItem[];
  topMotivos: MotivoItem[];
  gruposCid: GrupoCidItem[];
  faixaEtaria: Array<{ faixa: FaixaEtaria; M: number; F: number }>;
  sexo: Record<Sexo, number>;
  tempoEmpresa: Record<FaixaTempo, number>;
}

export function calcularEpidemiologico(
  atendimentos: Atendimento[]
): EpidemiologicoDashboard {
  const total = atendimentos.length;

  // Top CIDs
  const cidMap = new Map<string, number>();
  for (const a of atendimentos) {
    cidMap.set(a.cid, (cidMap.get(a.cid) ?? 0) + 1);
  }
  const topCids: CidItem[] = Array.from(cidMap.entries())
    .map(([codigo, count]) => ({
      codigo,
      nome: findCid(codigo)?.nome ?? codigo,
      count,
      percentual: total > 0 ? count / total : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top motivos
  const motivosMap = new Map<string, number>();
  for (const a of atendimentos) {
    motivosMap.set(a.motivo, (motivosMap.get(a.motivo) ?? 0) + 1);
  }
  const topMotivos: MotivoItem[] = Array.from(motivosMap.entries())
    .map(([motivo, count]) => ({ motivo, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Grupos CID (capitulos)
  const grupoMap = new Map<string, { nome: string; count: number }>();
  for (const a of atendimentos) {
    const cid = findCid(a.cid);
    if (!cid) continue;
    const entry = grupoMap.get(cid.capitulo) ?? {
      nome: cid.capituloNome,
      count: 0,
    };
    entry.count += 1;
    grupoMap.set(cid.capitulo, entry);
  }
  const gruposCid: GrupoCidItem[] = Array.from(grupoMap.entries())
    .map(([capitulo, info]) => ({
      capitulo,
      capituloNome: info.nome,
      count: info.count,
    }))
    .sort((a, b) => b.count - a.count);

  // Faixa etaria (per person, by sexo)
  const faixas: FaixaEtaria[] = ["<20", "20-29", "30-39", "40-49", "50+"];
  const faixaMap: Record<FaixaEtaria, { M: number; F: number }> = {
    "<20": { M: 0, F: 0 },
    "20-29": { M: 0, F: 0 },
    "30-39": { M: 0, F: 0 },
    "40-49": { M: 0, F: 0 },
    "50+": { M: 0, F: 0 },
  };
  const pessoasVistas = new Set<string>();
  for (const a of atendimentos) {
    if (pessoasVistas.has(a.prontuario)) continue;
    pessoasVistas.add(a.prontuario);
    const idade = calcularIdade(a.dataNascimento, a.dataAtendimento);
    const f = faixaEtaria(idade);
    faixaMap[f][a.sexo] += 1;
  }

  // Sexo (per atendimento)
  const sexoMap: Record<Sexo, number> = { M: 0, F: 0 };
  for (const a of atendimentos) sexoMap[a.sexo] += 1;

  // Tempo de empresa (per pessoa unica, base atendimento)
  const tempoMap: Record<FaixaTempo, number> = {
    "< 1 ano": 0,
    "1 a 3 anos": 0,
    "3 a 5 anos": 0,
    "5+ anos": 0,
  };
  pessoasVistas.clear();
  for (const a of atendimentos) {
    if (pessoasVistas.has(a.prontuario)) continue;
    pessoasVistas.add(a.prontuario);
    const t = calcularTempoEmpresa(a.dataAdmissao, a.dataAtendimento);
    tempoMap[faixaTempoEmpresa(t.diasTotais)] += 1;
  }

  return {
    totalAtendimentos: total,
    cidsDistintos: cidMap.size,
    cidMaisFrequente: topCids[0]?.codigo ?? "-",
    topCids,
    topMotivos,
    gruposCid,
    faixaEtaria: faixas.map((f) => ({ faixa: f, ...faixaMap[f] })),
    sexo: sexoMap,
    tempoEmpresa: tempoMap,
  };
}
