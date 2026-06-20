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
      <table className="w-full min-w-[420px] border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="text-left text-[11px] font-medium text-muted-foreground"></th>
            {periodos.map((p) => (
              <th
                key={p}
                className="px-2 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {setores.map((setor) => (
            <tr key={setor}>
              <td className="pr-2 text-left text-[11px] font-medium text-muted-foreground">
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
                      "h-9 rounded-md text-center text-[11px] font-semibold",
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
