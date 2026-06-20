"use client";

import * as React from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "next-themes";

import { formatBRLCompact } from "@/lib/format/currency";
import { getChartTheme, registerChartDefaults } from "./chart-defaults";

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

  return (
    <Bar
      data={{
        labels: shortLabels,
        datasets: [
          {
            label: "Custo",
            data: values,
            backgroundColor: variant === "accent" ? theme.accent : theme.primary,
            borderRadius: 4,
            barThickness: 16,
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
