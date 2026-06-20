"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import type { HeatmapCell } from "@/lib/calc/saude-mental";

interface HeatmapSetorMesProps {
  data: HeatmapCell[];
}

export function HeatmapSetorMes({ data }: HeatmapSetorMesProps) {
  const setores = Array.from(new Set(data.map((d) => d.setor)));
  const periodos = Array.from(new Set(data.map((d) => d.periodo)));
  const max = Math.max(1, ...data.map((d) => d.count));

  function intensity(count: number): string {
    if (count === 0) return "bg-muted/30 text-muted-foreground/40";
    const pct = count / max;
    if (pct < 0.25) return "bg-accent/20 text-accent";
    if (pct < 0.5) return "bg-accent/40 text-accent";
    if (pct < 0.75) return "bg-accent/60 text-accent-foreground";
    return "bg-accent text-accent-foreground";
  }

  if (setores.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        Sem dados para o periodo
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="w-[42%] text-left text-[10px] font-medium text-muted-foreground sm:w-auto sm:text-[11px]"></th>
            {periodos.map((p) => (
              <th
                key={p}
                className="px-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-2 sm:text-[11px]"
              >
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {setores.map((setor) => (
            <tr key={setor}>
              <td className="max-w-0 truncate pr-1 text-left text-[10px] font-medium text-muted-foreground sm:pr-2 sm:text-[11px]">
                {setor}
              </td>
              {periodos.map((p) => {
                const cell = data.find(
                  (d) => d.setor === setor && d.periodo === p
                );
                const count = cell?.count ?? 0;
                return (
                  <td
                    key={p}
                    className={cn(
                      "h-8 rounded-md text-center text-[10px] font-semibold sm:h-9 sm:text-[11px]",
                      intensity(count)
                    )}
                    title={`${setor} - ${p}: ${count} casos`}
                  >
                    {count > 0 ? count : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
