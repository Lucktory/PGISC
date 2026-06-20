"use client";

import * as React from "react";
import {
  AlignLeft,
  Briefcase,
  Layers,
  ListOrdered,
  Microscope,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { PhaseBadge } from "@/components/dashboard/PhaseBadge";
import { DemoBanner } from "@/components/shell/DemoBanner";
import { Topbar } from "@/components/shell/Topbar";
import { FaixaEtariaChart } from "@/components/charts/FaixaEtariaChart";
import { GrupoCidChart } from "@/components/charts/GrupoCidChart";
import { MotivosChart } from "@/components/charts/MotivosChart";
import { SexoChart } from "@/components/charts/SexoChart";
import { TempoEmpresaChart } from "@/components/charts/TempoEmpresaChart";
import { DataTable, type ColumnDef } from "@/components/data-table/DataTable";
import { ExecutivoPageSkeleton } from "@/components/states/PageSkeleton";
import { calcularEpidemiologico, type CidItem } from "@/lib/calc/epidemiologico";
import { applyFilters } from "@/lib/calc/filters";
import { empresas } from "@/lib/data/empresas";
import { PERIODOS_DISPONIVEIS } from "@/lib/constants";
import { useFilterStore } from "@/lib/state/filter-store";
import { formatInteger, formatPercent } from "@/lib/format/number";

export default function DashboardEpidemiologicoPage() {
  const empresaId = useFilterStore((s) => s.empresaId);
  const periodo = useFilterStore((s) => s.periodo);

  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const atendimentos = React.useMemo(
    () => applyFilters({ empresaId, periodo }),
    [empresaId, periodo]
  );
  const dashboard = React.useMemo(
    () => calcularEpidemiologico(atendimentos),
    [atendimentos]
  );

  const empresa = empresas.find((e) => e.id === empresaId) ?? empresas[0];
  const periodoLabel =
    PERIODOS_DISPONIVEIS.find((p) => p.id === periodo)?.label ?? periodo;

  const cidColumns: ColumnDef<CidItem>[] = [
    {
      key: "codigo",
      header: "CID",
      accessor: (r) => (
        <Badge variant="soft" className="font-mono">
          {r.codigo}
        </Badge>
      ),
      sortValue: (r) => r.codigo,
      primary: true,
      width: "5.5rem",
    },
    {
      key: "nome",
      header: "Descricao",
      accessor: (r) => r.nome,
      sortValue: (r) => r.nome,
    },
    {
      key: "count",
      header: "Atendimentos",
      accessor: (r) => formatInteger(r.count),
      align: "right",
      sortValue: (r) => r.count,
    },
    {
      key: "pct",
      header: "% do total",
      accessor: (r) => formatPercent(r.percentual),
      align: "right",
      sortValue: (r) => r.percentual,
    },
  ];

  if (!hydrated) {
    return (
      <>
        <Topbar
          title="Dashboard Epidemiologico"
          subtitle="Top CIDs, motivos, grupo CID, faixa etaria e sexo"
        />
        <ExecutivoPageSkeleton />
      </>
    );
  }

  return (
    <>
      <Topbar
        title="Dashboard Epidemiologico"
        subtitle="Top CIDs, motivos, grupo CID, faixa etaria e sexo"
      />
      <div className="flex flex-col gap-4 px-4 py-4 pb-12 lg:gap-6 lg:px-8 lg:py-6 lg:pb-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <PhaseBadge phase={2} />
          <span className="text-[11px] text-muted-foreground">
            Previa do escopo Fase 2 (entrega completa apos sinal verde)
          </span>
        </div>

        <DemoBanner />

        <KpiGrid cols={4}>
          <KpiCard
            label="Atendimentos"
            icon={Microscope}
            value={formatInteger(dashboard.totalAtendimentos)}
            hint="Total no periodo"
          />
          <KpiCard
            label="CIDs distintos"
            icon={ListOrdered}
            value={formatInteger(dashboard.cidsDistintos)}
            hint="Codigos diferentes registrados"
          />
          <KpiCard
            label="CID mais frequente"
            icon={Layers}
            value={dashboard.cidMaisFrequente}
            hint={
              dashboard.topCids[0]
                ? `${dashboard.topCids[0].count} atendimentos`
                : "-"
            }
          />
          <KpiCard
            label="Grupos CID"
            icon={Layers}
            value={formatInteger(dashboard.gruposCid.length)}
            hint="Capitulos do CID-10 acionados"
          />
        </KpiGrid>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <ListOrdered className="h-4 w-4 shrink-0 text-muted-foreground" />
            <h2 className="min-w-0 text-base font-semibold">
              Top 10 CIDs do periodo
            </h2>
          </div>
          <DataTable
            columns={cidColumns}
            data={dashboard.topCids}
            rowKey={(r) => r.codigo}
            initialSort={{ key: "count", dir: "desc" }}
            empty="Nenhum CID registrado no periodo."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard
            title="Top 10 motivos / justificativas"
            subtitle="Razoes mais frequentes de atendimento"
            icon={AlignLeft}
            height="md"
          >
            <MotivosChart data={dashboard.topMotivos} top={10} />
          </ChartCard>

          <ChartCard
            title="Distribuicao por grupo CID"
            subtitle="Por capitulo do CID-10"
            icon={Layers}
            height="md"
          >
            <GrupoCidChart data={dashboard.gruposCid} />
          </ChartCard>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ChartCard
            title="Faixa etaria por sexo"
            subtitle="Distribuicao piramide M vs F"
            icon={Users}
            height="md"
            className="md:col-span-2"
          >
            <FaixaEtariaChart data={dashboard.faixaEtaria} />
          </ChartCard>

          <ChartCard
            title="Sexo dos atendimentos"
            subtitle="Distribuicao geral"
            icon={Users}
            height="md"
          >
            <SexoChart data={dashboard.sexo} />
          </ChartCard>
        </div>

        <ChartCard
          title="Tempo de empresa dos atendidos"
          subtitle="Distribuicao por faixa de antiguidade"
          icon={Briefcase}
          height="sm"
        >
          <TempoEmpresaChart data={dashboard.tempoEmpresa} />
        </ChartCard>

        <div className="text-[11px] text-muted-foreground">
          Dados de {empresa.nome} - {periodoLabel}
        </div>
      </div>
    </>
  );
}
