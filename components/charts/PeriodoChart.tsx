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

  // Monochromatic cool scale, no warm colors. Manha as dominant, others as steps.
  return (
    <Doughnut
      data={{
        labels: ["Manha", "Tarde", "Noite"],
        datasets: [
          {
            data: [data.Manha, data.Tarde, data.Noite],
            backgroundColor: [
              theme.palette[0], // teal-600 - dominant
              theme.palette[1], // sky-600 - cool complement
              theme.palette[6], // slate-300 - muted residual
            ],
            hoverBackgroundColor: [
              theme.palette[7],
              theme.palette[0],
              theme.palette[4],
            ],
            borderWidth: 2,
            borderColor: theme.cardBg,
            spacing: 1,
          },
        ],
      }}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        cutout: "70%",
        animation: premiumAnimation<"doughnut">(),
        transitions: premiumTransitions<"doughnut">(),
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
            displayColors: false,
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed} atendimentos`,
            },
          },
        },
      }}
    />
  );
}
