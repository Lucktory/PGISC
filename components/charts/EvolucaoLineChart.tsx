"use client";

import * as React from "react";
import { Line } from "react-chartjs-2";
import { useTheme } from "next-themes";

import { getChartTheme, registerChartDefaults } from "./chart-defaults";

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

export function EvolucaoLineChart({
  labels,
  series,
  unit = "",
}: EvolucaoLineChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  const colorMap = {
    primary: theme.primary,
    accent: theme.accent,
    warning: theme.warning,
    success: theme.success,
    danger: theme.danger,
  };

  return (
    <Line
      data={{
        labels,
        datasets: series.map((s) => ({
          label: s.label,
          data: s.values,
          borderColor: colorMap[s.color],
          backgroundColor: colorMap[s.color],
          tension: 0.35,
          fill: false,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
        })),
      }}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: theme.textMuted,
              boxWidth: 10,
              boxHeight: 10,
              padding: 12,
              font: { size: 11 },
            },
          },
          tooltip: {
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
