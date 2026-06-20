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
            backgroundColor: (ctx) =>
              horizontalBarGradient(
                ctx.chart.ctx,
                ctx.chart.chartArea,
                theme.palette[1], // sky-500 (lighter end)
                theme.palette[0] // teal-500 (saturated end)
              ),
            hoverBackgroundColor: (ctx) =>
              horizontalBarGradient(
                ctx.chart.ctx,
                ctx.chart.chartArea,
                theme.palette[2], // indigo-500 on hover for delight
                theme.palette[0]
              ),
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 18,
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
            backgroundColor: theme.text,
            titleColor: theme.text,
            bodyColor: theme.text,
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
