import type { Empresa } from "./types";

export const empresas: Empresa[] = [
  {
    id: "pereira",
    nome: "PEREIRA",
    cnpj: "12.345.678/0001-90",
    custoHoraPadrao: 38.5,
    colaboradoresAtivos: {
      "2025-11": 52,
      "2025-12": 52,
      "2026-01": 53,
    },
  },
  {
    id: "altavila",
    nome: "Altavila Industria",
    cnpj: "44.812.001/0001-22",
    custoHoraPadrao: 42.0,
    colaboradoresAtivos: {
      "2025-11": 38,
      "2025-12": 38,
      "2026-01": 39,
    },
  },
  {
    id: "fontana",
    nome: "Fontana Embalagens",
    cnpj: "21.504.730/0001-08",
    custoHoraPadrao: 33.75,
    colaboradoresAtivos: {
      "2025-11": 27,
      "2025-12": 28,
      "2026-01": 29,
    },
  },
];

export const empresaPadrao = empresas[0];

export function getEmpresa(id: string): Empresa | undefined {
  return empresas.find((e) => e.id === id);
}
