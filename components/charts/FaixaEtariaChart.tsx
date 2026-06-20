"use client";

import * as React from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";

import { getChartTheme, registerChartDefaults } from "./chart-defaults";

registerChartDefaults();

interface FaixaEtariaChartProps {
  data: Array<{ faixa: string; M: number; F: number }>;
}

export function FaixaEtariaChart({ data }: FaixaEtariaChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  const labels = data.map((d) => d.faixa);
  // Pyramid effect: M as negative values, F as positive
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
            backgroundColor: theme.primary,
            borderRadius: 4,
            barThickness: 16,
          },
          {
            label: "Feminino",
            data: fValues,
            backgroundColor: theme.accent,
            borderRadius: 4,
            barThickness: 16,
          },
        ],
      }}
      options={{
        indexAxis: "y",
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
