"use client";

import * as React from "react";
import { Line } from "react-chartjs-2";
import { useTheme } from "next-themes";

import {
  areaFillGradient,
  getChartTheme,
  premiumAnimation,
  premiumTransitions,
  registerChartDefaults,
} from "./chart-defaults";

registerChartDefaults();

export interface EvolucaoSerie {
  label: string;
  values: number[];
  color: "primary" | "accent" | "warning" | "success" | "danger";
}

interface EvolucaoLineChartProps {
  labels: string[];
  series: EvolucaoSerie[];
  unit?: string;
}

const COLOR_INDEX: Record<EvolucaoSerie["color"], number> = {
  primary: 0, // teal-600
  accent: 1, // sky-600
  success: 2, // slate-700 (neutral - reserved warm is semantic)
  warning: 2,
  danger: 2,
};

export function EvolucaoLineChart({
  labels,
  series,
  unit = "",
}: EvolucaoLineChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  return (
    <Line
      data={{
        labels,
        datasets: series.map((s) => {
          const c = theme.palette[COLOR_INDEX[s.color] ?? 0];
          return {
            label: s.label,
            data: s.values,
            borderColor: c,
            backgroundColor: (ctx) =>
              areaFillGradient(ctx.chart.ctx, ctx.chart.chartArea, c),
            tension: 0.25,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: c,
            pointBorderColor: theme.cardBg,
            pointBorderWidth: 2,
            borderWidth: 2,
          };
        }),
      }}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        animation: premiumAnimation<"line">(),
        transitions: premiumTransitions<"line">(),
        interaction: { intersect: false, mode: "index" },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: theme.textMuted,
              boxWidth: 8,
              boxHeight: 8,
              padding: 14,
              font: { size: 11 },
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (ctx) => {
                const v = ctx.parsed.y ?? 0;
                return ` ${ctx.dataset.label}: ${v
                  .toFixed(1)
                  .replace(".", ",")}${unit}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: theme.textMuted },
          },
          y: {
            grid: { color: theme.grid },
            border: { display: false },
            beginAtZero: true,
            ticks: { color: theme.textMuted },
          },
        },
      }}
    />
  );
}
