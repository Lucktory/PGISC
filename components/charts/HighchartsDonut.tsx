"use client";

import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "next-themes";

import { getChartTheme } from "./chart-defaults";

// ---------------------------------------------------------------------------
// Patch H.seriesTypes.pie.prototype.animate at MODULE LOAD (matching the
// original Highcharts example which uses an IIFE).
//
// Why not useEffect? The chart constructor runs synchronously during render
// and calls animate(true) then animate(false) on the series. A useEffect
// hook would only fire AFTER that render is committed, so the patch would
// be installed too late and the first chart would use the default Highcharts
// animation instead of the fan-in.
//
// Running the patch at module load guarantees the prototype is patched
// before HighchartsReact ever instantiates a chart.
//
// SSR safety: skipped on the server via typeof window check. The component
// itself also renders a placeholder until `mounted` to avoid hydration
// mismatch from Highcharts' SVG output.
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyHighcharts = typeof Highcharts & { seriesTypes?: any };

let patched = false;
function installFanAnimationPatch(): void {
  if (patched) return;
  if (typeof window === "undefined") return;
  const types = (Highcharts as AnyHighcharts).seriesTypes;
  if (!types?.pie?.prototype) return;
  patched = true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  types.pie.prototype.animate = function (this: any, init?: boolean) {
    const series = this;
    const chart = series.chart;
    const points = series.points;
    const animation = series.options.animation;
    const startAngleRad = series.startAngleRad;

    // The post-animation chart.update fires series.render which may call
    // animate again. This guard makes sure the fan animation only plays
    // once per chart instance. Reset on a fresh chart (new series object).
    if (series._fanCompleted) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function fanAnimate(point: any, startAngle: number) {
      const graphic = point.graphic;
      const args = point.shapeArgs;
      if (!graphic || !args) return;

      graphic
        .attr({ start: startAngle, end: startAngle, opacity: 1 })
        .animate(
          { start: args.start, end: args.end },
          { duration: animation.duration / points.length },
          function () {
            if (points[point.index + 1]) {
              fanAnimate(points[point.index + 1], args.end);
              return;
            }
            // Last point finished: fade in labels, then morph pie -> donut.
            series._fanCompleted = true;
            const finish = () => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              points.forEach((p: any) => {
                p.opacity = 1;
              });
              series.update({ enableMouseTracking: true }, false);
              chart.update({
                plotOptions: {
                  pie: { innerSize: "55%", borderRadius: 8 },
                },
              });
            };
            if (series.dataLabelsGroup) {
              series.dataLabelsGroup.animate({ opacity: 1 }, undefined, finish);
            } else {
              finish();
            }
          }
        );
    }

    if (init) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      points.forEach((p: any) => {
        p.opacity = 0;
      });
    } else if (points.length > 0) {
      fanAnimate(points[0], startAngleRad);
    }
  };
}

// Run synchronously at module load. The "use client" directive ensures this
// module is only loaded in the browser bundle.
installFanAnimationPatch();

// ---------------------------------------------------------------------------

export interface HighchartsDonutProps {
  data: Array<{ name: string; y: number }>;
  /** Override the default sober palette (teal / sky / slate). */
  colors?: string[];
  /** Hide labels for very tight cards. */
  showDataLabels?: boolean;
  /** Animation duration in ms (default 1100). */
  durationMs?: number;
}

export function HighchartsDonut({
  data,
  colors,
  showDataLabels = true,
  durationMs = 1100,
}: HighchartsDonutProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Idempotent - the no-op branch trips if it ran at module load.
    installFanAnimationPatch();
    setMounted(true);
  }, []);

  const theme = React.useMemo(
    () => (mounted ? getChartTheme() : null),
    [mounted, resolvedTheme]
  );

  const options = React.useMemo<Highcharts.Options | null>(() => {
    if (!theme) return null;
    const defaultColors = [
      theme.palette[0],
      theme.palette[1],
      theme.palette[6],
      theme.palette[3],
      theme.palette[5],
      theme.palette[4],
    ];
    return {
      chart: {
        type: "pie",
        backgroundColor: "transparent",
        // Default Highcharts spacing [10, 10, 15, 10] reserves room for the
        // outside dataLabels. The previous override [4, 4, 4, 4] was too
        // tight - Highcharts oversized the pie because it thought it had
        // more vertical room than it really did, so the bottom slice + label
        // fell below the chart container and were clipped.
        style: {
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
      },
      title: { text: undefined },
      credits: { enabled: false },
      accessibility: { point: { valueSuffix: "%" } },
      colors: colors ?? defaultColors,
      tooltip: {
        headerFormat: "",
        pointFormat:
          '<span style="color:{point.color}">●</span> ' +
          "{point.name}: <b>{point.percentage:.1f}%</b>",
        backgroundColor: theme.cardBg,
        borderColor: theme.grid,
        borderRadius: 6,
        style: { color: theme.text, fontSize: "12px" },
      },
      plotOptions: {
        pie: {
          // Cap the pie diameter so labels always have room. Without this
          // Highcharts can size the pie at the smallest dimension of the
          // plot area and labels overflow.
          size: "82%",
          allowPointSelect: true,
          borderWidth: 2,
          borderColor: theme.cardBg,
          cursor: "pointer",
          dataLabels: {
            enabled: showDataLabels,
            format: "<b>{point.name}</b><br>{point.percentage:.1f}%",
            distance: 8,
            // Render labels even if their bounding box extends slightly
            // outside the plot area. Without this the label is silently
            // dropped (or the whole pie shrunk further to compensate).
            crop: false,
            overflow: "allow",
            connectorWidth: 1,
            connectorColor: theme.grid,
            style: {
              color: theme.text,
              fontSize: "11px",
              fontWeight: "500",
              textOutline: "none",
            },
          },
        },
      },
      series: [
        {
          type: "pie",
          name: "Categoria",
          enableMouseTracking: false,
          animation: { duration: durationMs },
          colorByPoint: true,
          data: data,
        },
      ],
      responsive: {
        rules: [
          {
            condition: { maxWidth: 420 },
            chartOptions: {
              plotOptions: {
                pie: {
                  size: "78%",
                  dataLabels: {
                    distance: 4,
                    format: "{point.percentage:.1f}%",
                    style: { fontSize: "10px" },
                  },
                },
              },
            },
          },
        ],
      },
    };
  }, [theme, colors, data, durationMs, showDataLabels]);

  // SSR + pre-hydration: render an empty same-sized box so layout doesn't
  // jump when the chart mounts client-side. Avoids hydration mismatch from
  // Highcharts' SVG output and any direct DOM measurement Highcharts does.
  if (!mounted || !options) {
    return <div className="h-full w-full" aria-hidden />;
  }

  return (
    <HighchartsReact
      // Forces a fresh chart instance on theme change so the fan-in animation
      // replays with the new palette. The series object is new too, so the
      // _fanCompleted flag resets.
      key={resolvedTheme}
      highcharts={Highcharts}
      options={options}
      containerProps={{ style: { width: "100%", height: "100%" } }}
    />
  );
}
