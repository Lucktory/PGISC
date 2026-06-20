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

  return (
    <Doughnut
      data={{
        labels: ["Passivo", "Ativo", "Suspensao"],
        datasets: [
          {
            data: [data.Passivo, data.Ativo, data.Suspensao],
            backgroundColor: [
              theme.palette[0], // teal-500
              theme.palette[1], // sky-500
              theme.muted, // slate muted for Suspensao
            ],
            hoverBackgroundColor: [
              theme.palette[2], // indigo-500
              theme.palette[3], // emerald-500
              theme.textMuted,
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
