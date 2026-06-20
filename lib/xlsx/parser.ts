import * as XLSX from "xlsx";

export interface ParsedSheet {
  name: string;
  headers: string[];
  rows: Array<Record<string, unknown>>;
}

export interface ParsedWorkbook {
  filename: string;
  sheets: ParsedSheet[];
}

export async function parseFile(file: File): Promise<ParsedWorkbook> {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const sheets: ParsedSheet[] = wb.SheetNames.map((name) => {
    const ws = wb.Sheets[name];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
      defval: "",
      raw: false,
    });
    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
    return { name, headers, rows };
  });
  return { filename: file.name, sheets };
}
