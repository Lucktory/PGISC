"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building,
  CircleDollarSign,
  Download,
  LineChart as LineChartIcon,
  ListOrdered,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { PhaseBadge } from "@/components/dashboard/PhaseBadge";
import { DemoBanner } from "@/components/shell/DemoBanner";
import { Topbar } from "@/components/shell/Topbar";
import { CustoChart } from "@/components/charts/CustoChart";
import { EvolucaoLineChart } from "@/components/charts/EvolucaoLineChart";
import { DataTable, type ColumnDef } from "@/components/data-table/DataTable";
import { ExecutivoPageSkeleton } from "@/components/states/PageSkeleton";
import { calcularFinanceiro, type CasoCustoso } from "@/lib/calc/financeiro";
import { applyFilters } from "@/lib/calc/filters";
import { empresas } from "@/lib/data/empresas";
import { PERIODOS_DISPONIVEIS } from "@/lib/constants";
import { useFilterStore } from "@/lib/state/filter-store";
import { useSettingsStore } from "@/lib/state/settings-store";
import { formatBRL, formatBRLCompact } from "@/lib/format/currency";
import { formatNumber1 } from "@/lib/format/number";

function downloadCsv(filename: string, rows: Record<string, string | number>[]) {
  if (rows.length === 0) {
    const blob = new Blob(["sem dados"], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, filename);
    return blob.size;
  }
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(
      headers
        .map((h) => {
          const v = r[h];
          const s = typeof v === "string" ? v : String(v);
          if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
            return `"${s.replace(/"/g, "\"\"")}"`;
          }
          return s;
        })
        .join(",")
    );
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename);
  return blob.size;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function DashboardFinanceiroPage() {
  const empresaId = useFilterStore((s) => s.empresaId);
  const periodo = useFilterStore((s) => s.periodo);
  const custos = useSettingsStore((s) => s.custoHoraPorCargo);

  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const atendimentos = React.useMemo(
    () => applyFilters({ empresaId, periodo }),
    [empresaId, periodo]
  );
  const dashboard = React.useMemo(
    () => calcularFinanceiro(atendimentos, empresaId, custos),
    [atendimentos, empresaId, custos]
  );

  const empresa = empresas.find((e) => e.id === empresaId) ?? empresas[0];
  const periodoLabel =
    PERIODOS_DISPONIVEIS.find((p) => p.id === periodo)?.label ?? periodo;

  function handleExportPowerBi() {
    const rows = atendimentos.map((a) => ({
      atendimento_id: a.id,
      empresa: a.empresaId,
      prontuario: a.prontuario,
      nome: a.nome,
      cargo: a.cargo,
      setor: a.setor,
      data_atendimento: a.dataAtendimento,
      tipo_atendimento: a.tipoAtendimento,
      cid: a.cid,
      horas_perdidas: a.horasPerdidas,
      dias_perdidos: a.diasPerdidos,
      necessidade_afastamento: a.necessidadeAfastamento ? "S" : "N",
      custo_estimado: (
        (custos[a.cargo] ?? empresa.custoHoraPadrao) * a.horasPerdidas
      ).toFixed(2),
    }));
    const filename = `powerbi-${empresa.nome.toLowerCase()}-${periodo}.csv`;
    const size = downloadCsv(filename, rows);
    toast.success("Arquivo Power BI exportado", {
      description: `${filename} (${(size / 1024).toFixed(1)} KB) - importavel direto no Power BI Desktop.`,
    });
  }

  const casoColumns: ColumnDef<CasoCustoso>[] = [
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
      key: "dias",
      header: "Dias",
      accessor: (r) => formatNumber1(r.diasPerdidos),
      align: "right",
      sortValue: (r) => r.diasPerdidos,
    },
    {
      key: "custo",
      header: "Custo estimado",
      accessor: (r) => formatBRL(r.custo),
      align: "right",
      sortValue: (r) => r.custo,
    },
  ];

  if (!hydrated) {
    return (
      <>
        <Topbar
          title="Dashboard Financeiro"
          subtitle="Custo do absenteismo por setor e por cargo"
        />
        <ExecutivoPageSkeleton />
      </>
    );
  }

  return (
    <>
      <Topbar
        title="Dashboard Financeiro"
        subtitle="Custo do absenteismo por setor e por cargo"
        actions={
          <Button variant="outline" onClick={handleExportPowerBi} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Power BI
          </Button>
        }
      />
      <div className="flex flex-col gap-4 px-4 py-4 pb-24 lg:gap-6 lg:px-8 lg:py-6 lg:pb-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <PhaseBadge phase={3} />
          <span className="text-[11px] text-muted-foreground">
            Previa do escopo Fase 3 (entrega completa apos sinal verde)
          </span>
        </div>

        <DemoBanner />

        <div className="rounded-lg border border-border bg-card p-5 lg:p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <CircleDollarSign className="h-4 w-4" />
            Custo total do absenteismo
          </div>
          <div className="mt-2 break-all text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {formatBRL(dashboard.custoTotal)}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {empresa.nome} - {periodoLabel}
          </div>
        </div>

        <KpiGrid cols={4}>
          <KpiCard
            label="Custo por colaborador"
            icon={CircleDollarSign}
            value={formatBRLCompact(dashboard.custoPorColaborador)}
            hint="Media no periodo"
          />
          <KpiCard
            label="Setor mais custoso"
            icon={Building}
            value={dashboard.setorMaisCustoso}
            hint={
              dashboard.custoPorSetor[0]
                ? formatBRLCompact(dashboard.custoPorSetor[0].custo)
                : "-"
            }
          />
          <KpiCard
            label="Cargo mais custoso"
            icon={UserCog}
            value={dashboard.cargoMaisCustoso}
            hint={
              dashboard.custoPorCargo[0]
                ? formatBRLCompact(dashboard.custoPorCargo[0].custo)
                : "-"
            }
          />
          <KpiCard
            label="Atendimentos no recorte"
            icon={ListOrdered}
            value={String(atendimentos.length)}
            hint={`${atendimentos.filter((a) => a.necessidadeAfastamento).length} com afastamento`}
          />
        </KpiGrid>

        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard
            title="Custo por setor"
            subtitle="Top 8 setores mais custosos"
            icon={Building}
            height="md"
          >
            <CustoChart
              labels={dashboard.custoPorSetor.slice(0, 8).map((s) => s.setor)}
              values={dashboard.custoPorSetor.slice(0, 8).map((s) => s.custo)}
              variant="primary"
            />
          </ChartCard>

          <ChartCard
            title="Custo por cargo"
            subtitle="Top 8 cargos mais custosos"
            icon={UserCog}
            height="md"
          >
            <CustoChart
              labels={dashboard.custoPorCargo.slice(0, 8).map((s) => s.cargo)}
              values={dashboard.custoPorCargo.slice(0, 8).map((s) => s.custo)}
              variant="accent"
            />
          </ChartCard>
        </div>

        <ChartCard
          title="Evolucao mensal de custo"
          subtitle="Custo estimado nos ultimos 3 meses"
          icon={LineChartIcon}
          height="md"
        >
          <EvolucaoLineChart
            labels={dashboard.evolucao.map((p) => p.label)}
            series={[
              {
                label: "Custo (R$)",
                values: dashboard.evolucao.map((p) => p.custo),
                color: "accent",
              },
            ]}
            unit=""
          />
        </ChartCard>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-semibold">
              Top 10 casos individuais mais custosos
            </h2>
            <Badge variant="muted" className="text-[10px]">
              Custo / colaborador
            </Badge>
          </div>
          <DataTable
            columns={casoColumns}
            data={dashboard.topCasos}
            rowKey={(r) => r.prontuario}
            initialSort={{ key: "custo", dir: "desc" }}
            empty="Sem casos com custo registrado no periodo."
          />
        </div>

        <div className="rounded-md border border-dashed border-border bg-muted/30 px-3 py-3 text-xs text-muted-foreground">
          Custos calculados com base na tabela de custo/hora por cargo em{" "}
          <Link
            href="/configuracoes/custos"
            className="font-medium text-accent hover:underline"
          >
            Configuracoes &gt; Custos
          </Link>
          . Cargos sem valor configurado usam o custo padrao da empresa
          ({formatBRL(empresa.custoHoraPadrao)}/h).
        </div>
      </div>

      {/* Mobile FAB - Power BI export */}
      <Button
        type="button"
        variant="default"
        onClick={handleExportPowerBi}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] right-4 z-20 h-12 w-12 rounded-full p-0 shadow-md lg:hidden"
        aria-label="Exportar para Power BI"
      >
        <Download className="h-5 w-5" />
      </Button>
    </>
  );
}
