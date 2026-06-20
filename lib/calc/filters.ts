import { pereiraJan2026 } from "../data/pereira-jan-2026";
import { pereiraDez2025 } from "../data/pereira-dez-2025";
import { pereiraNov2025 } from "../data/pereira-nov-2025";
import type {
  Atendimento,
  FilterState,
  PeriodoMes,
} from "../data/types";

const dataset: Record<PeriodoMes, Atendimento[]> = {
  "2026-01": pereiraJan2026,
  "2025-12": pereiraDez2025,
  "2025-11": pereiraNov2025,
};

export function getAtendimentosBase(periodo: PeriodoMes): Atendimento[] {
  return dataset[periodo] ?? [];
}

export function applyFilters(filters: FilterState): Atendimento[] {
  let rows = getAtendimentosBase(filters.periodo).filter(
    (a) => a.empresaId === filters.empresaId
  );
  if (filters.setores && filters.setores.length > 0) {
    rows = rows.filter((a) => filters.setores!.includes(a.setor));
  }
  if (filters.cargos && filters.cargos.length > 0) {
    rows = rows.filter((a) => filters.cargos!.includes(a.cargo));
  }
  return rows;
}

export const DEFAULT_FILTERS: FilterState = {
  empresaId: "pereira",
  periodo: "2026-01",
};
