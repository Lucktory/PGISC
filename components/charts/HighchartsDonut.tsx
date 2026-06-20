"use client";

import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useTheme } from "next-themes";

import { getChartTheme } from "./chart-defaults";

// The fan-in animation patches the global pie.prototype.animate. We only
// install it once per page load, guarded by `patched`.
let patched = false;
function patchFanAnimation() {
  if (patched || typeof window === "undefined") return;
  patched = true;

  // Highcharts exposes seriesTypes at runtime but the TS types do not include it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seriesTypes = (Highcharts as any).seriesTypes;
  if (!seriesTypes?.pie?.prototype) return;
  seriesTypes.pie.prototype.animate = function (init?: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const series = this as any;
    const chart = series.chart;
    const points = series.points;
    const { animation } = series.options;
    const { startAngleRad } = series;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function fanAnimate(point: any, startAngle: number) {
      const graphic = point.graphic;
      const args = point.shapeArgs;
      if (!graphic || !args) return;

      graphic
        .attr({
          start: startAngle,
          end: startAngle,
          opacity: 1,
        })
        .animate(
          { start: args.start, end: args.end },
          { duration: animation.duration / points.length },
          function () {
            if (points[point.index + 1]) {
              fanAnimate(points[point.index + 1], args.end);
            }
            if (point.index === points.length - 1) {
              series.dataLabelsGroup.animate(
                { opacity: 1 },
                undefined,
                function () {
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
                }
              );
            }
          }
        );
    }

    if (init) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      points.forEach((p: any) => {
        p.opacity = 0;
      });
    } else {
      fanAnimate(points[0], startAngleRad);
    }
  };
}

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
  const theme = React.useMemo(() => getChartTheme(), [resolvedTheme]);

  React.useEffect(() => {
    patchFanAnimation();
  }, []);

  // Cohesive default: teal/sky/slate ramp from the locked palette. Override
  // by passing `colors` if a specific category needs different hues.
  const defaultColors = React.useMemo(
    () => [
      theme.palette[0], // teal
      theme.palette[1], // sky
      theme.palette[6], // slate-300
      theme.palette[3], // teal-300
      theme.palette[5], // sky-300
      theme.palette[4], // slate-500 (fallback)
    ],
    [theme.palette]
  );

  const options: Highcharts.Options = React.useMemo(
    () => ({
      chart: {
        type: "pie",
        backgroundColor: "transparent",
        spacing: [4, 4, 4, 4],
        style: {
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
      },
      title: { text: undefined },
      credits: { enabled: false },
      accessibility: {
        point: { valueSuffix: "%" },
      },
      colors: colors ?? defaultColors,
      tooltip: {
        headerFormat: "",
        pointFormat:
          '<span style="color:{point.color}">●</span> ' +
          "{point.name}: <b>{point.percentage:.1f}%</b>",
        backgroundColor: theme.cardBg,
        borderColor: theme.grid,
        borderRadius: 6,
        style: {
          color: theme.text,
          fontSize: "12px",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          borderWidth: 2,
          borderColor: theme.cardBg,
          cursor: "pointer",
          dataLabels: {
            enabled: showDataLabels,
            format: "<b>{point.name}</b><br>{point.percentage:.1f}%",
            distance: 15,
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
                  dataLabels: {
                    distance: 6,
                    format: "{point.percentage:.1f}%",
                    style: { fontSize: "10px" },
                  },
                },
              },
            },
          },
        ],
      },
    }),
    [
      colors,
      defaultColors,
      data,
      durationMs,
      showDataLabels,
      theme.cardBg,
      theme.grid,
      theme.text,
    ]
  );

  return (
    <HighchartsReact
      key={resolvedTheme}
      highcharts={Highcharts}
      options={options}
      containerProps={{ style: { width: "100%", height: "100%" } }}
    />
  );
}
