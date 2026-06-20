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
  primary: 0, // teal
  accent: 1, // sky
  success: 3, // emerald
  warning: 4, // amber
  danger: 5, // rose
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
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: c,
            pointBorderColor: theme.cardBg,
            pointBorderWidth: 2,
            borderWidth: 2.5,
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
              boxWidth: 10,
              boxHeight: 10,
              padding: 12,
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
