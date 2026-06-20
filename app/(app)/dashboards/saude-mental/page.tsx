"use client";

import * as React from "react";
import {
  BarChart3,
  Brain,
  Building,
  Gauge,
  Grid3x3,
  Plus,
  UserCog,
  Users,
} from "lucide-react";

import { ChartCard } from "@/components/dashboard/ChartCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { PhaseBadge } from "@/components/dashboard/PhaseBadge";
import { DemoBanner } from "@/components/shell/DemoBanner";
import { Topbar } from "@/components/shell/Topbar";
import { CategoriaFChart } from "@/components/charts/CategoriaFChart";
import { HeatmapSetorMes } from "@/components/charts/HeatmapSetorMes";
import { TempoEmpresaChart } from "@/components/charts/TempoEmpresaChart";
import { ExecutivoPageSkeleton } from "@/components/states/PageSkeleton";
import { calcularSaudeMental } from "@/lib/calc/saude-mental";
import { applyFilters } from "@/lib/calc/filters";
import { empresas } from "@/lib/data/empresas";
import { PERIODOS_DISPONIVEIS } from "@/lib/constants";
import { useFilterStore } from "@/lib/state/filter-store";
import { formatInteger, formatPercent } from "@/lib/format/number";

export default function DashboardSaudeMentalPage() {
  const empresaId = useFilterStore((s) => s.empresaId);
  const periodo = useFilterStore((s) => s.periodo);

  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const atendimentos = React.useMemo(
    () => applyFilters({ empresaId, periodo }),
    [empresaId, periodo]
  );

  const dashboard = React.useMemo(
    () => calcularSaudeMental(atendimentos, empresaId),
    [atendimentos, empresaId]
  );

  const empresa = empresas.find((e) => e.id === empresaId) ?? empresas[0];
  const periodoLabel =
    PERIODOS_DISPONIVEIS.find((p) => p.id === periodo)?.label ?? periodo;

  if (!hydrated) {
    return (
      <>
        <Topbar
          title="Dashboard Saude Mental"
          subtitle="Foco em CID F (transtornos mentais e comportamentais)"
        />
        <ExecutivoPageSkeleton />
      </>
    );
  }

  return (
    <>
      <Topbar
        title="Dashboard Saude Mental"
        subtitle="Foco em CID F (transtornos mentais e comportamentais)"
      />
      <div className="flex flex-col gap-4 px-4 py-4 pb-12 lg:gap-6 lg:px-8 lg:py-6 lg:pb-6">
        <div className="flex items-center gap-2">
          <PhaseBadge phase={2} />
          <span className="text-[11px] text-muted-foreground">
            Previa do escopo Fase 2 (entrega completa apos sinal verde)
          </span>
        </div>

        <DemoBanner />

        <KpiGrid cols={4}>
          <KpiCard
            label="Casos F"
            icon={Brain}
            value={formatInteger(dashboard.totalCasosF)}
            hint="Total no periodo"
            hintTone="up"
          />
          <KpiCard
            label="% do total"
            icon={Gauge}
            value={formatPercent(dashboard.percentualDoTotal)}
            hint="Sobre todos os atendimentos"
          />
          <KpiCard
            label="Colaboradores"
            icon={Users}
            value={formatInteger(dashboard.colaboradoresImpactados)}
            hint="Impactados no periodo"
          />
          <KpiCard
            label="Casos novos"
            icon={Plus}
            value={formatInteger(dashboard.novosCasos)}
            hint="No periodo selecionado"
          />
        </KpiGrid>

        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard
            title="Casos por categoria F"
            subtitle="Distribuicao F00-F99"
            icon={BarChart3}
            height="md"
          >
            <CategoriaFChart data={dashboard.categorias} />
          </ChartCard>

          <ChartCard
            title="Heatmap setor x periodo"
            subtitle="Concentracao de casos CID F nos ultimos 3 meses"
            icon={Grid3x3}
            height="md"
          >
            <HeatmapSetorMes data={dashboard.heatmap} />
          </ChartCard>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard
            title="Setores mais afetados"
            subtitle="Top 5 por volume de casos F"
            icon={Building}
            height="sm"
          >
            {dashboard.setoresAfetados.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Sem casos F no periodo
              </div>
            ) : (
              <ul className="flex h-full flex-col justify-center gap-2">
                {dashboard.setoresAfetados.map((s) => (
                  <li
                    key={s.setor}
                    className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2"
                  >
                    <span className="text-sm font-medium">{s.setor}</span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {s.count} casos
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </ChartCard>

          <ChartCard
            title="Cargos mais afetados"
            subtitle="Top 5 por volume de casos F"
            icon={UserCog}
            height="sm"
          >
            {dashboard.cargosAfetados.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Sem casos F no periodo
              </div>
            ) : (
              <ul className="flex h-full flex-col justify-center gap-2">
                {dashboard.cargosAfetados.map((s) => (
                  <li
                    key={s.setor}
                    className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2"
                  >
                    <span className="text-sm font-medium">{s.setor}</span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {s.count} casos
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </ChartCard>
        </div>

        <ChartCard
          title="Faixa etaria dos casos F"
          subtitle="Distribuicao por idade dos colaboradores afetados"
          icon={Users}
          height="sm"
        >
          <TempoEmpresaChart
            data={Object.fromEntries(
              dashboard.faixaEtaria.map((f) => [f.faixa, f.count])
            )}
            orderedKeys={["<20", "20-29", "30-39", "40-49", "50+"]}
          />
        </ChartCard>

        <div className="text-[11px] text-muted-foreground">
          Dados de {empresa.nome} - {periodoLabel}
        </div>
      </div>
    </>
  );
}
