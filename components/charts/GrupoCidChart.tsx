"use client";

import * as React from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";

import { getChartTheme, registerChartDefaults } from "./chart-defaults";
import type { GrupoCidItem } from "@/lib/calc/epidemiologico";

registerChartDefaults();

interface GrupoCidChartProps {
  data: GrupoCidItem[];
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "..." : s;
}

export function GrupoCidChart({ data }: GrupoCidChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  const labels = data.map((d) =>
    typeof window !== "undefined" && window.innerWidth < 768
      ? truncate(d.capituloNome, 22)
      : d.capituloNome
  );
  const values = data.map((d) => d.count);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: "Atendimentos",
            data: values,
            backgroundColor: theme.primary,
            borderRadius: 4,
            barThickness: 14,
          },
        ],
      }}
      options={{
        indexAxis: "y",
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.x ?? 0} atendimentos`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: theme.grid },
            border: { display: false },
            ticks: { color: theme.textMuted, precision: 0 },
          },
          y: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: theme.textMuted, font: { size: 10 } },
          },
        },
      }}
    />
  );
}
