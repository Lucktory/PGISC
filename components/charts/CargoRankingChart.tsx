"use client";

import * as React from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";

import {
  getChartTheme,
  horizontalBarGradient,
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
            backgroundColor: (ctx) =>
              horizontalBarGradient(
                ctx.chart.ctx,
                ctx.chart.chartArea,
                theme.palette[3], // emerald-500
                theme.palette[2] // indigo-500
              ),
            hoverBackgroundColor: (ctx) =>
              horizontalBarGradient(
                ctx.chart.ctx,
                ctx.chart.chartArea,
                theme.palette[7], // cyan-500
                theme.palette[2]
              ),
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 16,
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
