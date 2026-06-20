"use client";

import * as React from "react";
import { Doughnut } from "react-chartjs-2";
import { useTheme } from "next-themes";

import { getChartTheme, registerChartDefaults } from "./chart-defaults";

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
            backgroundColor: [theme.accent, theme.primary],
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
