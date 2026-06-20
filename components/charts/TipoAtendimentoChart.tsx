"use client";

import { HighchartsDonut } from "./HighchartsDonut";
import type { TipoAtendimento } from "@/lib/data/types";

interface TipoAtendimentoChartProps {
  data: Record<TipoAtendimento, number>;
}

export function TipoAtendimentoChart({ data }: TipoAtendimentoChartProps) {
  return (
    <HighchartsDonut
      data={[
        { name: "Passivo", y: data.Passivo },
        { name: "Ativo", y: data.Ativo },
        { name: "Suspensao", y: data.Suspensao },
      ]}
    />
  );
}
