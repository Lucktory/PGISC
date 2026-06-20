"use client";

import * as React from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";

import { getChartTheme, registerChartDefaults } from "./chart-defaults";
import type { DiaSemana } from "@/lib/data/types";

registerChartDefaults();

interface DowChartProps {
  data: Record<DiaSemana, number>;
}

const ORDER: DiaSemana[] = ["Seg", "Ter", "Qua", "Qui", "Sex"];

export function DowChart({ data }: DowChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  const values = ORDER.map((d) => data[d] ?? 0);
  const max = Math.max(...values);
  const bg = values.map((v) => (v === max ? theme.primary : theme.accent));

  return (
    <Bar
      data={{
        labels: ORDER,
        datasets: [
          {
            label: "Atendimentos",
            data: values,
            backgroundColor: bg,
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
              label: (ctx) => ` ${ctx.parsed.y} atendimentos`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: theme.textMuted, font: { size: 11 } },
          },
          y: {
            grid: { color: theme.grid },
            border: { display: false },
            beginAtZero: true,
            ticks: { color: theme.textMuted, font: { size: 11 }, precision: 0 },
          },
        },
      }}
    />
  );
}
