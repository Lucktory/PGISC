import { formatNumber, formatNumber1 } from "./number";

export function formatHoras(horas: number): string {
  if (Number.isInteger(horas)) return `${horas}h`;
  return `${formatNumber1(horas)}h`;
}

export function formatDias(dias: number): string {
  if (Number.isInteger(dias)) return `${dias} dias`;
  return `${formatNumber1(dias)} dias`;
}

export function formatHorasMinutos(horas: number): string {
  const inteiras = Math.floor(horas);
  const minutos = Math.round((horas - inteiras) * 60);
  if (minutos === 0) return `${inteiras}h`;
  return `${inteiras}h ${minutos}min`;
}

export function jornadasEquivalentes(horas: number, horasPorJornada = 8): string {
  const j = horas / horasPorJornada;
  return `${formatNumber(j)} jornadas`;
}
