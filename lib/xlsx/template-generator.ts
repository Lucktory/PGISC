import * as XLSX from "xlsx";

import { CANONICAL_FIELDS } from "./header-mapping";

export function downloadTemplate(): { size: number } {
  const headers = CANONICAL_FIELDS.map((f) => f.key);
  const sampleRow: Record<string, string> = {};
  headers.forEach((h) => (sampleRow[h] = ""));
  // Add one example row with reasonable defaults
  const exemplo: Record<string, string> = {
    EMPRESA: "PEREIRA",
    "DATA DO ATENDIMENTO": "2026-01-15",
    "PERIODO DO ATENDIMENTO": "Manha",
    "NOME DO COLABORADOR": "Exemplo Colaborador",
    PRONTUARIO: "1000",
    SEXO: "F",
    "DATA DE ADMISSAO": "2022-05-10",
    "DATA DE NASCIMENTO": "1990-03-22",
    CARGO: "Costureira",
    SETOR: "Costura",
    "TIPO DE ATENDIMENTO": "Passivo",
    "LOCAL DE ATENDIMENTO": "Ambulatorio interno",
    "MOTIVO/JUSTIFICATIVA": "Exame periodico",
    "TIPO DE EXAME OU CONSULTA": "Exame periodico",
    CID: "Z10.0",
    "NOME CID": "Exame de saude ocupacional",
    "CONDUTA MEDICA": "Liberado",
    "NECESSIDADE DE AFASTAMENTO": "Nao",
    "HORAS PERDIDAS": "0",
    "DIAS PERDIDOS": "0",
    "MEDICO RESPONSAVEL": "Dr. Exemplo",
    OBSERVACOES: "",
  };

  const ws = XLSX.utils.json_to_sheet([sampleRow, exemplo], { header: headers });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Acompanhamento");

  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([out], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "template-pgisc-v1.2.0.xlsx";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return { size: blob.size };
}
