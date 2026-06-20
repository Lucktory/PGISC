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

registerChartDefaults();

interface CategoriaFChartProps {
  data: Array<{ faixa: string; rotulo: string; count: number }>;
}

export function CategoriaFChart({ data }: CategoriaFChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  const labels = data.map((d) => `${d.faixa}\n${d.rotulo}`);
  const values = data.map((d) => d.count);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Casos",
            data: values,
            backgroundColor: (ctx) =>
              horizontalBarGradient(
                ctx.chart.ctx,
                ctx.chart.chartArea,
                theme.palette[6], // purple-500
                theme.palette[2] // indigo-500
              ),
            hoverBackgroundColor: (ctx) =>
              horizontalBarGradient(
                ctx.chart.ctx,
                ctx.chart.chartArea,
                theme.palette[5], // rose
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
              label: (ctx) => ` ${ctx.parsed.x ?? 0} casos`,
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
