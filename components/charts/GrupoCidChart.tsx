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
import type { GrupoCidItem } from "@/lib/calc/epidemiologico";

registerChartDefaults();

interface GrupoCidChartProps {
  data: GrupoCidItem[];
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "..." : s;
}

export function GrupoCidChart({ data }: GrupoCidChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  const labels = data.map((d) =>
    typeof window !== "undefined" && window.innerWidth < 768
      ? truncate(d.capituloNome, 22)
      : d.capituloNome
  );
  const values = data.map((d) => d.count);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Atendimentos",
            data: values,
            backgroundColor: (ctx) =>
              horizontalBarGradient(
                ctx.chart.ctx,
                ctx.chart.chartArea,
                theme.palette[2], // indigo-500
                theme.palette[0] // teal-500
              ),
            hoverBackgroundColor: (ctx) =>
              horizontalBarGradient(
                ctx.chart.ctx,
                ctx.chart.chartArea,
                theme.palette[6], // purple-500 on hover
                theme.palette[1]
              ),
            borderRadius: 5,
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
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.x ?? 0} atendimentos`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: theme.grid },
            border: { display: false },
            ticks: { color: theme.textMuted, precision: 0 },
          },
          y: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: theme.textMuted, font: { size: 10 } },
          },
        },
      }}
    />
  );
}
