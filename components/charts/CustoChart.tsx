"use client";

import * as React from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";

import { formatBRLCompact } from "@/lib/format/currency";
import {
  getChartTheme,
  horizontalBarGradient,
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

  // Custo: amber-led gradient (money / value). Variant toggles between two combos.
  const gradientStart = variant === "accent" ? theme.palette[4] : theme.palette[2]; // amber or indigo
  const gradientEnd = variant === "accent" ? theme.palette[5] : theme.palette[4]; // rose or amber
  const hoverStart = variant === "accent" ? theme.palette[2] : theme.palette[5];
  const hoverEnd = variant === "accent" ? theme.palette[5] : theme.palette[4];

  return (
    <Bar
      data={{
        labels: shortLabels,
        datasets: [
          {
            label: "Custo",
            data: values,
            backgroundColor: (ctx) =>
              horizontalBarGradient(
                ctx.chart.ctx,
                ctx.chart.chartArea,
                gradientStart,
                gradientEnd
              ),
            hoverBackgroundColor: (ctx) =>
              horizontalBarGradient(
                ctx.chart.ctx,
                ctx.chart.chartArea,
                hoverStart,
                hoverEnd
              ),
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 18,
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
