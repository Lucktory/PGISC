"use client";

import * as React from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";

import { getChartTheme, registerChartDefaults } from "./chart-defaults";
import type { SetorDias } from "@/lib/calc/executivo";

registerChartDefaults();

interface SetorRankingChartProps {
  data: SetorDias[];
  top?: number;
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "..." : s;
}

export function SetorRankingChart({ data, top = 8 }: SetorRankingChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  const top8 = data.slice(0, top);
  const labels = top8.map((d) =>
    typeof window !== "undefined" && window.innerWidth < 768
      ? truncate(d.setor, 10)
      : d.setor
  );
  const values = top8.map((d) => d.diasPerdidos);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Dias perdidos",
            data: values,
            backgroundColor: theme.primary,
            borderRadius: 4,
            barThickness: 16,
          },
        ],
      }}
      options={{
        indexAxis: "y",
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: theme.text,
            titleColor: theme.text,
            bodyColor: theme.text,
            callbacks: {
              label: (ctx) => {
              const v = ctx.parsed.x ?? 0;
              return ` ${v.toFixed(1).replace(".", ",")} dias`;
            },
            },
          },
        },
        scales: {
          x: {
            grid: { color: theme.grid },
            border: { display: false },
            ticks: { color: theme.textMuted },
          },
          y: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: theme.textMuted, font: { size: 11 } },
          },
        },
      }}
    />
  );
}
