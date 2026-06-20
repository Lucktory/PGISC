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

registerChartDefaults();

interface SexoChartProps {
  data: { M: number; F: number };
}

export function SexoChart({ data }: SexoChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  return (
    <Doughnut
      data={{
        labels: ["Feminino", "Masculino"],
        datasets: [
          {
            data: [data.F, data.M],
            backgroundColor: [
              theme.palette[0], // teal
              theme.palette[1], // sky
            ],
            hoverBackgroundColor: [
              theme.palette[3], // emerald
              theme.palette[2], // indigo
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
