export const IIOS_FORMULA_LABEL =
  "Total de horas perdidas / Colaboradores ativos no periodo";

export const RECORRENTE_THRESHOLD_DEFAULT = 2;

export const CID_GROUPING_DEFAULT: "capitulo" | "bloco" = "capitulo";

export const TEMPLATE_VERSION = "v1.2.0";

export const TEMPLATE_VERSIONS: ReadonlyArray<{
  versao: string;
  data: string;
  mudancas: string;
}> = [
  {
    versao: "v1.2.0",
    data: "2026-03-12",
    mudancas:
      "Corrigidos os cabecalhos 'ATENDIEMNTO' -> 'TIPO DE ATENDIMENTO' e 'AFASTAMETNO' -> 'NECESSIDADE DE AFASTAMENTO'. Removidas as colunas derivadas (Tempo de empresa, Idade, Dia/Mes/Ano). Substituido o identificador 'Nome' por 'Prontuario medico'.",
  },
  {
    versao: "v1.1.0",
    data: "2026-02-04",
    mudancas:
      "Adicionada a coluna 'Local de atendimento' como obrigatoria. Padronizada a coluna 'Periodo' para Manha/Tarde/Noite.",
  },
  {
    versao: "v1.0.0",
    data: "2026-01-08",
    mudancas: "Versao inicial do template oficial PGISC.",
  },
];

export const PERIODOS_DISPONIVEIS = [
  { id: "2026-01", label: "Janeiro 2026" },
  { id: "2025-12", label: "Dezembro 2025" },
  { id: "2025-11", label: "Novembro 2025" },
] as const;
