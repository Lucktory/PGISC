"use client";

import * as React from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";

import { getChartTheme, registerChartDefaults } from "./chart-defaults";

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
            backgroundColor: theme.accent,
            borderRadius: 4,
            barThickness: 14,
          },
        ],
      }}
      options={{
        indexAxis: "y",
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
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
