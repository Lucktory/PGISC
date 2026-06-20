"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

let registered = false;

export function registerChartDefaults() {
  if (registered) return;
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Filler,
    Tooltip,
    Legend
  );
  ChartJS.defaults.font.family =
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif";
  ChartJS.defaults.font.size = 11.5;
  registered = true;
}

export type ChartTheme = {
  text: string;
  textMuted: string;
  grid: string;
  primary: string;
  accent: string;
  accentSoft: string;
  warning: string;
  success: string;
  danger: string;
  muted: string;
};

function readVar(name: string): string {
  if (typeof window === "undefined") return "0 0% 50%";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function hsl(name: string, alpha = 1): string {
  const raw = readVar(name);
  if (!raw) return `hsla(0,0%,50%,${alpha})`;
  return `hsla(${raw}, ${alpha})`;
}

export function getChartTheme(): ChartTheme {
  return {
    text: hsl("--foreground"),
    textMuted: hsl("--muted-foreground"),
    grid: hsl("--border", 0.5),
    primary: hsl("--primary"),
    accent: hsl("--accent"),
    accentSoft: hsl("--accent-soft"),
    warning: hsl("--warning"),
    success: hsl("--success"),
    danger: hsl("--danger"),
    muted: hsl("--muted-foreground", 0.45),
  };
}
