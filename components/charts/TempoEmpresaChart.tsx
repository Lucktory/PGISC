"use client";

import * as React from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";

import { getChartTheme, registerChartDefaults } from "./chart-defaults";

registerChartDefaults();

interface TempoEmpresaChartProps {
  data: Record<string, number>;
  orderedKeys?: string[];
}

export function TempoEmpresaChart({
  data,
  orderedKeys = ["< 1 ano", "1 a 3 anos", "3 a 5 anos", "5+ anos"],
}: TempoEmpresaChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  const labels = orderedKeys;
  const values = orderedKeys.map((k) => data[k] ?? 0);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Colaboradores",
            data: values,
            backgroundColor: theme.accent,
            borderRadius: 4,
          },
        ],
      }}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y ?? 0} colaboradores`,
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
            ticks: { color: theme.textMuted, precision: 0 },
          },
        },
      }}
    />
  );
}
