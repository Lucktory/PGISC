"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  sortValue?: (row: T) => number | string;
  primary?: boolean;
  hideOnMobile?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  empty?: string;
  initialSort?: { key: string; dir: "asc" | "desc" };
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  caption?: string;
}

export function DataTable<T>({
  columns,
  data,
  empty = "Sem registros para o filtro atual.",
  initialSort,
  rowKey,
  onRowClick,
  caption,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(
    initialSort?.key ?? null
  );
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">(
    initialSort?.dir ?? "desc"
  );

  const sorted = React.useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return data;
    const cmp = (a: T, b: T) => {
      const va = col.sortValue!(a);
      const vb = col.sortValue!(b);
      if (typeof va === "number" && typeof vb === "number") return va - vb;
      return String(va).localeCompare(String(vb), "pt-BR");
    };
    const out = [...data].sort(cmp);
    if (sortDir === "desc") out.reverse();
    return out;
  }, [data, sortKey, sortDir, columns]);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
        {empty}
      </div>
    );
  }

  const primaryCol = columns.find((c) => c.primary) ?? columns[0];
  const mobileExtraCols = columns.filter(
    (c) => c !== primaryCol && !c.hideOnMobile
  );

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-md border border-border bg-card lg:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {caption && (
              <caption className="bg-muted/40 px-4 py-2 text-left text-xs text-muted-foreground">
                {caption}
              </caption>
            )}
            <thead className="bg-muted/40">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    style={c.width ? { width: c.width } : undefined}
                    className={cn(
                      "px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                      !c.align && "text-left"
                    )}
                  >
                    {c.sortValue ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(c.key)}
                        className={cn(
                          "inline-flex items-center gap-1 hover:text-foreground",
                          c.align === "right" && "flex-row-reverse"
                        )}
                      >
                        {c.header}
                        {sortKey === c.key ? (
                          sortDir === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                        )}
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-t border-border",
                    onRowClick && "cursor-pointer hover:bg-muted/40",
                    i % 2 === 0 ? "bg-card" : "bg-muted/15"
                  )}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "px-3 py-2.5 text-sm",
                        c.align === "right" && "text-right",
                        c.align === "center" && "text-center"
                      )}
                    >
                      {c.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <ul className="flex flex-col gap-2 lg:hidden">
        {sorted.map((row) => (
          <li key={rowKey(row)}>
            <button
              type="button"
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "flex w-full flex-col gap-1 rounded-md border border-border bg-card p-3 text-left transition-colors",
                onRowClick && "hover:bg-muted/40"
              )}
            >
              <div className="text-sm font-semibold text-foreground">
                {primaryCol.accessor(row)}
              </div>
              {mobileExtraCols.length > 0 && (
                <dl className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                  {mobileExtraCols.map((c) => (
                    <React.Fragment key={c.key}>
                      <dt className="text-muted-foreground">{c.header}</dt>
                      <dd className="text-foreground text-right">
                        {c.accessor(row)}
                      </dd>
                    </React.Fragment>
                  ))}
                </dl>
              )}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
