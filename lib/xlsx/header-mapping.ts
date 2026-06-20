export interface CanonicalField {
  key: string;
  label: string;
  required: boolean;
  aliases: string[];
}

export const CANONICAL_FIELDS: CanonicalField[] = [
  { key: "EMPRESA", label: "Empresa", required: true, aliases: ["empresa", "EMPRESA"] },
  { key: "DATA DO ATENDIMENTO", label: "Data do atendimento", required: true, aliases: ["data do atendimento", "data atendimento", "data"] },
  { key: "PERIODO DO ATENDIMENTO", label: "Periodo do atendimento", required: false, aliases: ["periodo do atendimento", "periodo atendimento", "periodo"] },
  { key: "NOME DO COLABORADOR", label: "Nome do colaborador", required: true, aliases: ["nome do colaborador", "nome", "colaborador"] },
  { key: "PRONTUARIO", label: "Prontuario medico", required: false, aliases: ["prontuario", "prontuario medico", "matricula"] },
  { key: "SEXO", label: "Sexo", required: false, aliases: ["sexo"] },
  { key: "DATA DE ADMISSAO", label: "Data de admissao", required: false, aliases: ["data de admissao", "admissao"] },
  { key: "DATA DE NASCIMENTO", label: "Data de nascimento", required: false, aliases: ["data de nascimento", "nascimento"] },
  { key: "CARGO", label: "Cargo", required: true, aliases: ["cargo"] },
  { key: "SETOR", label: "Setor", required: true, aliases: ["setor", "departamento"] },
  // KNOWN TYPOS in legacy template:
  { key: "TIPO DE ATENDIMENTO", label: "Tipo de atendimento", required: true, aliases: ["tipo de atendimento", "tipo de atendiemnto", "tipo atendimento", "atendiemnto"] },
  { key: "LOCAL DE ATENDIMENTO", label: "Local de atendimento", required: false, aliases: ["local de atendimento", "local"] },
  { key: "MOTIVO/JUSTIFICATIVA", label: "Motivo / justificativa", required: false, aliases: ["motivo", "justificativa", "motivo/justificativa"] },
  { key: "TIPO DE EXAME OU CONSULTA", label: "Tipo de exame ou consulta", required: false, aliases: ["tipo de exame", "tipo de consulta", "exame"] },
  { key: "CID", label: "CID", required: true, aliases: ["cid"] },
  { key: "NOME CID", label: "Nome CID", required: false, aliases: ["nome cid", "cid nome"] },
  { key: "CONDUTA MEDICA", label: "Conduta medica", required: false, aliases: ["conduta", "conduta medica"] },
  // KNOWN TYPO:
  { key: "NECESSIDADE DE AFASTAMENTO", label: "Necessidade de afastamento", required: true, aliases: ["necessidade de afastamento", "necessidade de afastametno", "afastametno", "afastamento", "necessidade afastamento"] },
  { key: "HORAS PERDIDAS", label: "Horas perdidas", required: false, aliases: ["horas perdidas", "horas"] },
  { key: "DIAS PERDIDOS", label: "Dias perdidos", required: false, aliases: ["dias perdidos", "dias"] },
  { key: "MEDICO RESPONSAVEL", label: "Medico responsavel", required: false, aliases: ["medico responsavel", "medico"] },
  { key: "OBSERVACOES", label: "Observacoes", required: false, aliases: ["observacoes", "observacao", "obs"] },
];

export interface HeaderMapping {
  detected: string;
  mapped: CanonicalField | null;
  autoCorrected: boolean;
  correctionNote?: string;
}

const KNOWN_TYPOS: Record<string, string> = {
  "TIPO DE ATENDIEMNTO": "TIPO DE ATENDIMENTO",
  ATENDIEMNTO: "TIPO DE ATENDIMENTO",
  "NECESSIDADE DE AFASTAMETNO": "NECESSIDADE DE AFASTAMENTO",
  AFASTAMETNO: "NECESSIDADE DE AFASTAMENTO",
};

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

export function mapHeaders(detectedHeaders: string[]): HeaderMapping[] {
  return detectedHeaders.map((h) => {
    // Known typo exact match
    const trimmedUpper = h.trim().toUpperCase();
    if (KNOWN_TYPOS[trimmedUpper]) {
      const fixedKey = KNOWN_TYPOS[trimmedUpper];
      const field = CANONICAL_FIELDS.find((f) => f.key === fixedKey);
      if (field) {
        return {
          detected: h,
          mapped: field,
          autoCorrected: true,
          correctionNote: `Cabecalho corrigido de "${h}" para "${field.label}"`,
        };
      }
    }
    // Exact alias match
    const norm = normalize(h);
    for (const f of CANONICAL_FIELDS) {
      if (f.aliases.some((a) => normalize(a) === norm)) {
        return { detected: h, mapped: f, autoCorrected: false };
      }
    }
    // Fuzzy match using Levenshtein distance against aliases
    let bestField: CanonicalField | null = null;
    let bestDist = Infinity;
    for (const f of CANONICAL_FIELDS) {
      for (const a of f.aliases) {
        const d = levenshtein(norm, normalize(a));
        if (d < bestDist) {
          bestDist = d;
          bestField = f;
        }
      }
    }
    if (bestField && bestDist <= 2) {
      return {
        detected: h,
        mapped: bestField,
        autoCorrected: true,
        correctionNote: `Correspondencia aproximada para "${bestField.label}" (distancia ${bestDist})`,
      };
    }
    return { detected: h, mapped: null, autoCorrected: false };
  });
}
