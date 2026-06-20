"use client";

import * as React from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";

import { formatBRLCompact } from "@/lib/format/currency";
import {
  getChartTheme,
  premiumAnimation,
  premiumTransitions,
  registerChartDefaults,
} from "./chart-defaults";

registerChartDefaults();

interface CustoChartProps {
  labels: string[];
  values: number[];
  variant?: "primary" | "accent";
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "..." : s;
}

export function CustoChart({
  labels,
  values,
  variant = "primary",
}: CustoChartProps) {
  const { resolvedTheme } = useTheme();
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  const shortLabels = labels.map((l) => (mobile ? truncate(l, 12) : l));

  // Setor view = teal (brand). Cargo view = sky (differentiates while staying cool).
  const color = variant === "accent" ? theme.palette[1] : theme.palette[0];

  return (
    <Bar
      data={{
        labels: shortLabels,
        datasets: [
          {
            label: "Custo",
            data: values,
            backgroundColor: color,
            hoverBackgroundColor: theme.palette[7],
            borderRadius: 4,
            borderSkipped: false,
            barThickness: 14,
          },
        ],
      }}
      options={{
        indexAxis: "y",
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
              label: (ctx) => ` ${formatBRLCompact(Number(ctx.parsed.x ?? 0))}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: theme.grid },
            border: { display: false },
            ticks: {
              color: theme.textMuted,
              callback: (v) => formatBRLCompact(Number(v)),
            },
          },
          y: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: theme.textMuted, font: { size: 11 } },
          },
        },
      }}
    />
  );
}
