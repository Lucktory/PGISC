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
  // Peak day gets emphasis (slate-800), others stay muted-teal.
  const colors = values.map((v) => (v === max ? theme.palette[7] : theme.palette[0]));
  const hoverColors = values.map(() => theme.palette[7]);

  return (
    <Bar
      data={{
        labels: ORDER,
        datasets: [
          {
            label: "Atendimentos",
            data: values,
            backgroundColor: colors,
            hoverBackgroundColor: hoverColors,
            borderRadius: 4,
            borderSkipped: false,
            barPercentage: 0.55,
            categoryPercentage: 0.85,
          },
        ],
      }}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        animation: premiumAnimation<"bar">(),
        transitions: premiumTransitions<"bar">(),
        plugins: {
          legend: { display: false },
          tooltip: {
            padding: 10,
            cornerRadius: 6,
            displayColors: false,
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
