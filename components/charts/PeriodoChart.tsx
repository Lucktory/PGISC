"use client";

import * as React from "react";
import { Doughnut } from "react-chartjs-2";
import { useTheme } from "next-themes";

import {
  getChartTheme,
  premiumAnimation,
  premiumTransitions,
  registerChartDefaults,
} from "./chart-defaults";
import type { PeriodoDia } from "@/lib/data/types";

registerChartDefaults();

interface PeriodoChartProps {
  data: Record<PeriodoDia, number>;
}

export function PeriodoChart({ data }: PeriodoChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  return (
    <Doughnut
      data={{
        labels: ["Manha", "Tarde", "Noite"],
        datasets: [
          {
            data: [data.Manha, data.Tarde, data.Noite],
            backgroundColor: [
              theme.palette[4], // amber-500 (sunrise / manha)
              theme.palette[1], // sky-500 (afternoon)
              theme.palette[2], // indigo-500 (evening)
            ],
            hoverBackgroundColor: [
              theme.palette[5], // rose-500
              theme.palette[0], // teal-500
              theme.palette[6], // purple-500
            ],
            borderWidth: 3,
            borderColor: theme.cardBg,
            spacing: 2,
          },
        ],
      }}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        cutout: "66%",
        animation: premiumAnimation<"doughnut">(),
        transitions: premiumTransitions<"doughnut">(),
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
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed} atendimentos`,
            },
          },
        },
      }}
    />
  );
}
