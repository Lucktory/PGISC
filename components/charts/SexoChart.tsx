"use client";

import { HighchartsDonut } from "./HighchartsDonut";

interface SexoChartProps {
  data: { M: number; F: number };
}

export function SexoChart({ data }: SexoChartProps) {
  return (
    <HighchartsDonut
      data={[
        { name: "Feminino", y: data.F },
        { name: "Masculino", y: data.M },
      ]}
    />
  );
}
