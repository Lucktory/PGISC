"use client";

import * as React from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";

import {
  getChartTheme,
  premiumAnimation,
  premiumTransitions,
  registerChartDefaults,
  verticalBarGradient,
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

  return (
    <Bar
      data={{
        labels: ORDER,
        datasets: [
          {
            label: "Atendimentos",
            data: values,
            backgroundColor: (ctx) => {
              const top = values[ctx.dataIndex ?? 0] === max
                ? theme.palette[2] // indigo for the peak day
                : theme.palette[0]; // teal for the rest
              const bottom = values[ctx.dataIndex ?? 0] === max
                ? theme.palette[0]
                : theme.palette[1]; // sky bottom
              return verticalBarGradient(
                ctx.chart.ctx,
                ctx.chart.chartArea,
                top,
                bottom
              );
            },
            hoverBackgroundColor: (ctx) =>
              verticalBarGradient(
                ctx.chart.ctx,
                ctx.chart.chartArea,
                theme.palette[3], // emerald top on hover
                theme.palette[1]
              ),
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.65,
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
