"use client";

import * as React from "react";
import {
  BarChart3,
  Building,
  CalendarMinus,
  Clock,
  FileSpreadsheet,
  Gauge,
  LineChart as LineChartIcon,
  Repeat,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { PhaseBadge } from "@/components/dashboard/PhaseBadge";
import { DemoBanner } from "@/components/shell/DemoBanner";
import { Topbar } from "@/components/shell/Topbar";
import { CargoRankingChart } from "@/components/charts/CargoRankingChart";
import { EvolucaoLineChart } from "@/components/charts/EvolucaoLineChart";
import { SetorRankingChart } from "@/components/charts/SetorRankingChart";
import {
  ActiveFilterBadges,
  SetorCargoChips,
} from "@/components/filters/SetorCargoChips";
import { DataTable, type ColumnDef } from "@/components/data-table/DataTable";
import { ExecutivoPageSkeleton } from "@/components/states/PageSkeleton";
import { calcularAbsenteismo } from "@/lib/calc/absenteismo";
import { applyFilters } from "@/lib/calc/filters";
import { empresas } from "@/lib/data/empresas";
import { PERIODOS_DISPONIVEIS } from "@/lib/constants";
import { useFilterStore } from "@/lib/state/filter-store";
import { formatInteger, formatNumber1, formatPercent } from "@/lib/format/number";
import { downloadWorkbook } from "@/lib/xlsx/export";
import type { RankingCargo, RankingSetor } from "@/lib/calc/absenteismo";
import type { RecorrenciaInfo } from "@/lib/calc/recorrentes";

export default function DashboardAbsenteismoPage() {
  const empresaId = useFilterStore((s) => s.empresaId);
  const periodo = useFilterStore((s) => s.periodo);
  const setores = useFilterStore((s) => s.setores);
  const cargos = useFilterStore((s) => s.cargos);
  const setSetores = useFilterStore((s) => s.setSetores);
  const setCargos = useFilterStore((s) => s.setCargos);

  const [hydrated, setHydrated] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  // Atendimentos base (sem filtros de setor/cargo) - usado para listar opcoes nos chips
  const atendimentosBase = React.useMemo(
    () => applyFilters({ empresaId, periodo }),
    [empresaId, periodo]
  );
  const atendimentos = React.useMemo(
    () => applyFilters({ empresaId, periodo, setores, cargos }),
    [empresaId, periodo, setores, cargos]
  );

  const dashboard = React.useMemo(
    () => calcularAbsenteismo(atendimentos, empresaId),
    [atendimentos, empresaId]
  );

  const setoresDisponiveis = React.useMemo(
    () =>
      Array.from(new Set(atendimentosBase.map((a) => a.setor))).sort((a, b) =>
        a.localeCompare(b, "pt-BR")
      ),
    [atendimentosBase]
  );
  const cargosDisponiveis = React.useMemo(
    () =>
      Array.from(new Set(atendimentosBase.map((a) => a.cargo))).sort((a, b) =>
        a.localeCompare(b, "pt-BR")
      ),
    [atendimentosBase]
  );

  const empresa = empresas.find((e) => e.id === empresaId) ?? empresas[0];
  const periodoLabel =
    PERIODOS_DISPONIVEIS.find((p) => p.id === periodo)?.label ?? periodo;

  const setorColumns: ColumnDef<RankingSetor>[] = [
    {
      key: "rank",
      header: "#",
      accessor: (_r) => "",
      align: "center",
      width: "3rem",
      hideOnMobile: true,
    },
    {
      key: "setor",
      header: "Setor",
      accessor: (r) => r.setor,
      sortValue: (r) => r.setor,
      primary: true,
    },
    {
      key: "dias",
      header: "Dias perdidos",
      accessor: (r) => formatNumber1(r.diasPerdidos),
      align: "right",
      sortValue: (r) => r.diasPerdidos,
    },
    {
      key: "horas",
      header: "Horas perdidas",
      accessor: (r) => `${formatNumber1(r.horasPerdidas)}h`,
      align: "right",
      sortValue: (r) => r.horasPerdidas,
    },
    {
      key: "atend",
      header: "Atendimentos",
      accessor: (r) => formatInteger(r.atendimentos),
      align: "right",
      sortValue: (r) => r.atendimentos,
    },
    {
      key: "colabs",
      header: "Colaboradores",
      accessor: (r) => formatInteger(r.colaboradoresImpactados),
      align: "right",
      sortValue: (r) => r.colaboradoresImpactados,
    },
  ];

  // Ranking includes index in column accessor:
  const setoresRows = dashboard.rankingSetores.map((s, i) => ({ ...s, rank: i + 1 }));
  setorColumns[0].accessor = (r) => String((r as RankingSetor & { rank: number }).rank);

  const cargoColumns: ColumnDef<RankingCargo>[] = [
    {
      key: "cargo",
      header: "Cargo",
      accessor: (r) => r.cargo,
      sortValue: (r) => r.cargo,
      primary: true,
    },
    {
      key: "dias",
      header: "Dias perdidos",
      accessor: (r) => formatNumber1(r.diasPerdidos),
      align: "right",
      sortValue: (r) => r.diasPerdidos,
    },
    {
      key: "horas",
      header: "Horas",
      accessor: (r) => `${formatNumber1(r.horasPerdidas)}h`,
      align: "right",
      sortValue: (r) => r.horasPerdidas,
    },
    {
      key: "atend",
      header: "Atendimentos",
      accessor: (r) => formatInteger(r.atendimentos),
      align: "right",
      sortValue: (r) => r.atendimentos,
    },
  ];

  const recorrentesColumns: ColumnDef<RecorrenciaInfo>[] = [
    {
      key: "prontuario",
      header: "Prontuario",
      accessor: (r) => r.prontuario,
      sortValue: (r) => r.prontuario,
      hideOnMobile: true,
      width: "7rem",
    },
    {
      key: "nome",
      header: "Colaborador",
      accessor: (r) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{r.nome}</span>
          <span className="text-[11px] text-muted-foreground">
            Prontuario {r.prontuario}
          </span>
        </div>
      ),
      sortValue: (r) => r.nome,
      primary: true,
    },
    {
      key: "setor",
      header: "Setor",
      accessor: (r) => r.setor,
      sortValue: (r) => r.setor,
    },
    {
      key: "cargo",
      header: "Cargo",
      accessor: (r) => r.cargo,
      sortValue: (r) => r.cargo,
      hideOnMobile: true,
    },
    {
      key: "atend",
      header: "Atendimentos",
      accessor: (r) => formatInteger(r.totalAtendimentos),
      align: "right",
      sortValue: (r) => r.totalAtendimentos,
    },
    {
      key: "dias",
      header: "Dias totais",
      accessor: (r) => formatNumber1(r.totalDiasPerdidos),
      align: "right",
      sortValue: (r) => r.totalDiasPerdidos,
    },
  ];

  async function handleExport() {
    try {
      setExporting(true);
      await new Promise((r) => setTimeout(r, 200));
      const { sizeBytes } = downloadWorkbook(
        `absenteismo-${empresa.nome.toLowerCase()}-${periodo}.xlsx`,
        [
          {
            name: "Setores",
            rows: dashboard.rankingSetores.map((r, i) => ({
              "#": i + 1,
              Setor: r.setor,
              "Dias perdidos": r.diasPerdidos,
              "Horas perdidas": r.horasPerdidas,
              Atendimentos: r.atendimentos,
              "Colaboradores impactados": r.colaboradoresImpactados,
            })),
          },
          {
            name: "Cargos",
            rows: dashboard.rankingCargos.map((r) => ({
              Cargo: r.cargo,
              "Dias perdidos": r.diasPerdidos,
              "Horas perdidas": r.horasPerdidas,
              Atendimentos: r.atendimentos,
            })),
          },
          {
            name: "Recorrentes",
            rows: dashboard.recorrentes.map((r) => ({
              Prontuario: r.prontuario,
              Nome: r.nome,
              Setor: r.setor,
              Cargo: r.cargo,
              "Total de atendimentos": r.totalAtendimentos,
              "Dias perdidos totais": r.totalDiasPerdidos,
              "Horas perdidas totais": r.totalHorasPerdidas,
            })),
          },
        ]
      );
      toast.success("Planilha exportada", {
        description: `absenteismo-${empresa.nome.toLowerCase()}-${periodo}.xlsx (${(
          sizeBytes / 1024
        ).toFixed(1)} KB)`,
      });
    } catch (err) {
      toast.error("Erro ao exportar", {
        description: err instanceof Error ? err.message : "Falha desconhecida",
      });
    } finally {
      setExporting(false);
    }
  }

  if (!hydrated) {
    return (
      <>
        <Topbar
          title="Dashboard Absenteismo"
          subtitle="Dias e horas perdidas, ranking de setores e cargos"
        />
        <ExecutivoPageSkeleton />
      </>
    );
  }

  return (
    <>
      <Topbar
        title="Dashboard Absenteismo"
        subtitle="Dias e horas perdidas, ranking de setores e cargos"
        actions={
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exporting}
            className="gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {exporting ? "Exportando..." : "Exportar Excel"}
          </Button>
        }
      />

      <div className="flex flex-col gap-4 px-4 py-4 pb-24 lg:gap-6 lg:px-8 lg:py-6 lg:pb-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <PhaseBadge phase={1} />
          <span className="text-[11px] text-muted-foreground">
            Entrega da Fase 1 do escopo PGISC
          </span>
        </div>

        <DemoBanner />

        <KpiGrid cols={4}>
          <KpiCard
            label="Dias perdidos"
            icon={CalendarMinus}
            value={formatNumber1(dashboard.totalDias)}
            hint="Total no periodo filtrado"
            hintTone="up"
          />
          <KpiCard
            label="Horas perdidas"
            icon={Clock}
            value={formatInteger(dashboard.totalHoras)}
            unit="h"
            hint="Total no periodo filtrado"
            hintTone="up"
          />
          <KpiCard
            label="Media por colaborador"
            icon={BarChart3}
            value={formatNumber1(dashboard.mediaDiasPorColaborador)}
            unit="d"
            hint="Dias / colaborador unico"
          />
          <KpiCard
            label="Atendimentos com afastamento"
            icon={Gauge}
            value={formatPercent(dashboard.percentualComAfastamento)}
            hint="Sobre o total no periodo"
          />
        </KpiGrid>

        {/* Filter chips */}
        <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-3 lg:p-4">
          <SetorCargoChips
            label="Filtrar por setor"
            options={setoresDisponiveis}
            selected={setores}
            onChange={setSetores}
          />
          <SetorCargoChips
            label="Filtrar por cargo"
            options={cargosDisponiveis}
            selected={cargos}
            onChange={setCargos}
          />
          <ActiveFilterBadges
            setores={setores}
            cargos={cargos}
            onClearSetor={(s) => setSetores(setores.filter((x) => x !== s))}
            onClearCargo={(c) => setCargos(cargos.filter((x) => x !== c))}
          />
        </div>

        {/* Setores chart + table */}
        <ChartCard
          title="Ranking de setores por dias perdidos"
          subtitle="Ordenado do maior impacto para o menor"
          icon={Building}
          height="md"
        >
          <SetorRankingChart data={dashboard.rankingSetores} top={8} />
        </ChartCard>

        <DataTable
          columns={setorColumns}
          data={setoresRows}
          rowKey={(r) => r.setor}
          initialSort={{ key: "dias", dir: "desc" }}
          empty="Nenhum atendimento no periodo filtrado."
        />

        {/* Cargos chart + table */}
        <ChartCard
          title="Ranking de cargos por dias perdidos"
          subtitle="Top 8 cargos mais impactados"
          icon={UserCog}
          height="md"
        >
          <CargoRankingChart data={dashboard.rankingCargos} top={8} />
        </ChartCard>

        <DataTable
          columns={cargoColumns}
          data={dashboard.rankingCargos}
          rowKey={(r) => r.cargo}
          initialSort={{ key: "dias", dir: "desc" }}
          empty="Nenhum atendimento no periodo filtrado."
        />

        {/* Evolucao */}
        <ChartCard
          title="Evolucao mensal de dias perdidos"
          subtitle="Comparativo dos ultimos tres meses para a empresa selecionada"
          icon={LineChartIcon}
          height="md"
        >
          <EvolucaoLineChart
            labels={dashboard.evolucao.map((p) => p.label)}
            series={[
              {
                label: "Dias perdidos",
                values: dashboard.evolucao.map((p) => p.diasPerdidos),
                color: "primary",
              },
              {
                label: "Horas perdidas",
                values: dashboard.evolucao.map((p) => p.horasPerdidas),
                color: "accent",
              },
            ]}
          />
        </ChartCard>

        {/* Recorrentes */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Repeat className="h-4 w-4 shrink-0 text-muted-foreground" />
            <h2 className="min-w-0 text-base font-semibold">
              Colaboradores recorrentes
            </h2>
            <span className="text-xs text-muted-foreground">
              {dashboard.recorrentes.length} pessoas com 2 ou mais atendimentos
            </span>
          </div>
          <DataTable
            columns={recorrentesColumns}
            data={dashboard.recorrentes}
            rowKey={(r) => r.prontuario}
            initialSort={{ key: "atend", dir: "desc" }}
            empty="Nenhum colaborador recorrente no periodo."
          />
        </div>

        <div className="text-[11px] text-muted-foreground">
          Dados de {empresa.nome} - {periodoLabel} -{" "}
          {formatInteger(atendimentos.length)} atendimentos no recorte
        </div>
      </div>

      {/* Mobile FAB - export to Excel */}
      <Button
        type="button"
        variant="default"
        onClick={handleExport}
        disabled={exporting}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] right-4 z-20 h-12 w-12 rounded-full p-0 shadow-md lg:hidden"
        aria-label="Exportar Excel"
      >
        <FileSpreadsheet className="h-5 w-5" />
      </Button>
    </>
  );
}
