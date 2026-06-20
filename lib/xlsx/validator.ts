import { findCid } from "@/lib/data/cid10-reference";

import type { HeaderMapping } from "./header-mapping";

export interface RowError {
  rowIndex: number;
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationReport {
  totalRows: number;
  validRows: number;
  errorRows: number;
  warningRows: number;
  errors: RowError[];
}

interface ValidateInput {
  mappings: HeaderMapping[];
  rows: Array<Record<string, unknown>>;
}

export function validateRows({
  mappings,
  rows,
}: ValidateInput): ValidationReport {
  const errors: RowError[] = [];
  let validCount = 0;
  let errorCount = 0;
  let warningCount = 0;

  const requiredHeaders = mappings
    .filter((m) => m.mapped?.required)
    .map((m) => m.detected);

  rows.forEach((r, i) => {
    let rowHasError = false;
    let rowHasWarning = false;

    for (const h of requiredHeaders) {
      const v = r[h];
      if (v === undefined || v === null || String(v).trim() === "") {
        errors.push({
          rowIndex: i,
          field: h,
          message: `Campo obrigatorio vazio: ${h}`,
          severity: "error",
        });
        rowHasError = true;
      }
    }

    // CID validation
    const cidHeader = mappings.find((m) => m.mapped?.key === "CID");
    if (cidHeader) {
      const cidVal = String(r[cidHeader.detected] ?? "").trim();
      if (cidVal && !findCid(cidVal)) {
        errors.push({
          rowIndex: i,
          field: cidHeader.detected,
          message: `CID nao encontrado na referencia: ${cidVal}`,
          severity: "warning",
        });
        rowHasWarning = true;
      }
    }

    // Date validation
    const dateHeader = mappings.find(
      (m) => m.mapped?.key === "DATA DO ATENDIMENTO"
    );
    if (dateHeader) {
      const v = String(r[dateHeader.detected] ?? "").trim();
      if (v && !/\d{1,4}[\/\-]\d{1,2}[\/\-]\d{1,4}/.test(v)) {
        errors.push({
          rowIndex: i,
          field: dateHeader.detected,
          message: `Data nao reconhecida: ${v}`,
          severity: "error",
        });
        rowHasError = true;
      }
    }

    if (rowHasError) errorCount++;
    else if (rowHasWarning) warningCount++;
    else validCount++;
  });

  return {
    totalRows: rows.length,
    validRows: validCount,
    errorRows: errorCount,
    warningRows: warningCount,
    errors,
  };
}
