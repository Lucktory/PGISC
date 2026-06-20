import { parseISO, getDay } from "date-fns";
import type { DiaSemana } from "../data/types";

const LABELS: DiaSemana[] = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

export function diaSemana(dataISO: string): DiaSemana {
  return LABELS[getDay(parseISO(dataISO))];
}

export const DIAS_SEMANA_UTEIS: DiaSemana[] = ["Seg", "Ter", "Qua", "Qui", "Sex"];
export const DIAS_SEMANA_TODOS: DiaSemana[] = LABELS;
