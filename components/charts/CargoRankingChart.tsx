"use client";

import * as React from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";

import {
  getChartTheme,
  premiumAnimation,
  premiumTransitions,
  registerChartDefaults,
} from "./chart-defaults";
import type { RankingCargo } from "@/lib/calc/absenteismo";

registerChartDefaults();

interface CargoRankingChartProps {
  data: RankingCargo[];
  top?: number;
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "..." : s;
}

export function CargoRankingChart({ data, top = 8 }: CargoRankingChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  const topItems = data.slice(0, top);
  const labels = topItems.map((d) =>
    typeof window !== "undefined" && window.innerWidth < 768
      ? truncate(d.cargo, 14)
      : d.cargo
  );
  const values = topItems.map((d) => d.diasPerdidos);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Dias perdidos",
            data: values,
            backgroundColor: theme.palette[1], // sky-600 (distinct from setor's teal)
            hoverBackgroundColor: theme.palette[7], // emphasis on hover
            borderRadius: 4,
            borderSkipped: false,
            barThickness: 14,
          },
        ],
      }}
      options={{
        indexAxis: "y",
        maintainAspectRatio: false,
        responsive: true,
        animation: premiumAnimation<"bar">(),
        transitions: premiumTransitions<"bar">(),
        plugins: {
          legend: { display: false },
          tooltip: {
            padding: 10,
            cornerRadius: 6,
            displayColors: false,
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
