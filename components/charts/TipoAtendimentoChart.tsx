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
import type { TipoAtendimento } from "@/lib/data/types";

registerChartDefaults();

interface TipoAtendimentoChartProps {
  data: Record<TipoAtendimento, number>;
}

export function TipoAtendimentoChart({ data }: TipoAtendimentoChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  // Monochromatic teal scale - premium, brand-aligned, no chromatic noise.
  return (
    <Doughnut
      data={{
        labels: ["Passivo", "Ativo", "Suspensao"],
        datasets: [
          {
            data: [data.Passivo, data.Ativo, data.Suspensao],
            backgroundColor: [
              theme.palette[0], // teal-600 - dominant
              theme.palette[3], // teal-300 - lighter shade
              theme.palette[6], // slate-300 - muted
            ],
            hoverBackgroundColor: [
              theme.palette[7], // slate-800 emphasis
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
