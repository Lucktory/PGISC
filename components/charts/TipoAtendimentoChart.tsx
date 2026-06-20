"use client";

import * as React from "react";
import { Doughnut } from "react-chartjs-2";
import { useTheme } from "next-themes";

import { getChartTheme, registerChartDefaults } from "./chart-defaults";
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
            backgroundColor: [theme.primary, theme.accent, theme.muted],
            borderWidth: 0,
          },
        ],
      }}
      options={{
        maintainAspectRatio: false,
        responsive: true,
        cutout: "62%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: theme.textMuted,
              boxWidth: 10,
              boxHeight: 10,
              padding: 12,
              font: { size: 11 },
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.parsed} atendimentos`,
            },
          },
        },
      }}
    />
  );
}
