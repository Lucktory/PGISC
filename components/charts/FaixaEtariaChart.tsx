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

registerChartDefaults();

interface FaixaEtariaChartProps {
  data: Array<{ faixa: string; M: number; F: number }>;
}

export function FaixaEtariaChart({ data }: FaixaEtariaChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  const labels = data.map((d) => d.faixa);
  // Pyramid: M as negative values, F as positive
  const mValues = data.map((d) => -d.M);
  const fValues = data.map((d) => d.F);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Masculino",
            data: mValues,
            backgroundColor: theme.palette[1], // sky-600
            hoverBackgroundColor: theme.palette[7],
            borderRadius: 4,
            borderSkipped: false,
            barThickness: 14,
          },
          {
            label: "Feminino",
            data: fValues,
            backgroundColor: theme.palette[0], // teal-600
            hoverBackgroundColor: theme.palette[7],
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
                const raw = Number(ctx.raw ?? 0);
                return ` ${ctx.dataset.label}: ${Math.abs(raw)} colaboradores`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: theme.grid },
            border: { display: false },
            ticks: {
              color: theme.textMuted,
              callback: (v) => Math.abs(Number(v)),
            },
          },
          y: {
            stacked: true,
            grid: { display: false },
            border: { display: false },
            ticks: { color: theme.textMuted },
          },
        },
      }}
    />
  );
}
