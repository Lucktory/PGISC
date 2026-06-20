"use client";

import { HighchartsDonut } from "./HighchartsDonut";
import type { PeriodoDia } from "@/lib/data/types";

interface PeriodoChartProps {
  data: Record<PeriodoDia, number>;
}

export function PeriodoChart({ data }: PeriodoChartProps) {
  return (
    <HighchartsDonut
      data={[
        { name: "Manha", y: data.Manha },
        { name: "Tarde", y: data.Tarde },
        { name: "Noite", y: data.Noite },
      ]}
    />
  );
}
