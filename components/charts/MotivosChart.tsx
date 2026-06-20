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
import type { MotivoItem } from "@/lib/calc/epidemiologico";

registerChartDefaults();

interface MotivosChartProps {
  data: MotivoItem[];
  top?: number;
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "..." : s;
}

export function MotivosChart({ data, top = 10 }: MotivosChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  const items = data.slice(0, top);
  const labels = items.map((d) =>
    typeof window !== "undefined" && window.innerWidth < 768
      ? truncate(d.motivo, 20)
      : d.motivo
  );
  const values = items.map((d) => d.count);

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
                theme.palette[7], // cyan-500
                theme.palette[1] // sky-500
              ),
            hoverBackgroundColor: (ctx) =>
              horizontalBarGradient(
                ctx.chart.ctx,
                ctx.chart.chartArea,
                theme.palette[0],
                theme.palette[2]
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
