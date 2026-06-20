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
  type ChartType,
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

  // Legacy semantic colors (kept for non-series usage like grid, max-highlight, etc.)
  primary: string;
  accent: string;
  accentSoft: string;
  warning: string;
  success: string;
  danger: string;
  muted: string;

  // Premium clinical palette (teal-led). Use `palette[i]` for series.
  palette: string[];
  paletteSoft: string[]; // lower-opacity variants for areas, hovers, soft fills

  // Card surface color for doughnut borders / separators
  cardBg: string;
};

function readVar(name: string): string {
  if (typeof window === "undefined") return "0 0% 50%";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function hsl(name: string, alpha = 1): string {
  const raw = readVar(name);
  if (!raw) return `hsla(0, 0%, 50%, ${alpha})`;
  // CSS variables are stored space-separated ("222 47% 11%"), but we need
  // legacy comma-separated form for the hsla() function so Highcharts and
  // SVG parsers accept it. "hsla(222 47% 11%, 1)" mixes space and comma
  // syntax and is invalid CSS - browsers fall back to a default color,
  // which is why chart text was rendering nearly invisible.
  const parts = raw.split(/\s+/).filter(Boolean);
  return `hsla(${parts.join(", ")}, ${alpha})`;
}

// Monochromatic-leaning premium palette (Linear / Vercel / Stripe aesthetic).
// One brand accent (teal), one cool complement (sky), and a slate neutral ramp.
// Warm colors only enter via the semantic tokens (--warning, --danger), never here.
const PALETTE_LIGHT = [
  "#0d9488", // teal-600   - brand primary
  "#0284c7", // sky-600    - cool secondary
  "#334155", // slate-700  - neutral deep
  "#5eead4", // teal-300   - light brand
  "#64748b", // slate-500  - neutral mid
  "#7dd3fc", // sky-300    - light secondary
  "#cbd5e1", // slate-300  - neutral light
  "#1e293b", // slate-800  - emphasis / max highlight
];

const PALETTE_DARK = [
  "#14b8a6", // teal-500
  "#38bdf8", // sky-400
  "#cbd5e1", // slate-300
  "#5eead4", // teal-300
  "#94a3b8", // slate-400
  "#7dd3fc", // sky-300
  "#64748b", // slate-500
  "#f1f5f9", // slate-100 (emphasis)
];

function softVariants(palette: string[]): string[] {
  return palette.map((c) => hexToRgba(c, 0.18));
}

export function getChartTheme(): ChartTheme {
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const palette = isDark ? PALETTE_DARK : PALETTE_LIGHT;
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
    palette,
    paletteSoft: softVariants(palette),
    cardBg: hsl("--card"),
  };
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Build a vertical gradient (top -> bottom) on the chart canvas.
// Used for bar charts to add subtle premium depth.
export function verticalBarGradient(
  ctx: CanvasRenderingContext2D | null | undefined,
  area: { top: number; bottom: number } | null | undefined,
  topColor: string,
  bottomColor: string
): string | CanvasGradient {
  if (!ctx || !area) return topColor;
  const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(1, bottomColor);
  return gradient;
}

// Build a horizontal gradient (left -> right) - used for horizontal bar charts.
export function horizontalBarGradient(
  ctx: CanvasRenderingContext2D | null | undefined,
  area: { left: number; right: number } | null | undefined,
  leftColor: string,
  rightColor: string
): string | CanvasGradient {
  if (!ctx || !area) return rightColor;
  const gradient = ctx.createLinearGradient(area.left, 0, area.right, 0);
  gradient.addColorStop(0, leftColor);
  gradient.addColorStop(1, rightColor);
  return gradient;
}

// Soft area gradient under a line chart.
export function areaFillGradient(
  ctx: CanvasRenderingContext2D | null | undefined,
  area: { top: number; bottom: number } | null | undefined,
  color: string
): string | CanvasGradient {
  if (!ctx || !area) return hexToRgba(color, 0.12);
  const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);
  gradient.addColorStop(0, hexToRgba(color, 0.28));
  gradient.addColorStop(1, hexToRgba(color, 0));
  return gradient;
}

// Premium animation defaults - staggered entrance + smooth state transitions.
// Each chart spreads its `palette[i]` across datasets/segments and the
// dataIndex-based delay gives the "wave" effect on load.
// Premium animation defaults - shorter, snappier than the previous attempt.
// Staggered entrance + smooth state transitions, but with measured timing
// that reads as "intentional" rather than "playful".
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function premiumAnimation<T extends ChartType = ChartType>(): any {
  return {
    duration: 620,
    easing: "easeOutCubic",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delay: (context: any) => {
      if (context?.type !== "data") return 0;
      // 25ms per element max 320ms total - tighter than before
      return Math.min(25 * (context.dataIndex ?? 0), 320);
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function premiumTransitions<T extends ChartType = ChartType>(): any {
  return {
    active: { animation: { duration: 220, easing: "easeOutCubic" } },
    resize: { animation: { duration: 200 } },
  };
}
