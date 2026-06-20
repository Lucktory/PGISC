import type { PeriodoDia } from "../data/types";

export function periodoDoHorario(hora: number): PeriodoDia {
  if (hora < 12) return "Manha";
  if (hora < 18) return "Tarde";
  return "Noite";
}
