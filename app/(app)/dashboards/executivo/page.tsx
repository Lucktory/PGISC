"use client";

import * as React from "react";
import {
  Activity,
  BarChart3,
  CalendarDays,
  CalendarMinus,
  Clock,
  FileDown,
  Gauge,
  ListOrdered,
  PieChart as PieChartIcon,
  Repeat,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { CidRow } from "@/components/dashboard/CidRow";
import { DrillDownSheet } from "@/components/dashboard/DrillDownSheet";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { DemoBanner } from "@/components/shell/DemoBanner";
import { Topbar } from "@/components/shell/Topbar";
import { DowChart } from "@/components/charts/DowChart";
import { PeriodoChart } from "@/components/charts/PeriodoChart";
import { SetorRankingChart } from "@/components/charts/SetorRankingChart";
import { TipoAtendimentoChart } from "@/components/charts/TipoAtendimentoChart";
import { ExecutivoPageSkeleton } from "@/components/states/PageSkeleton";
import { calcularExecutivo } from "@/lib/calc/executivo";
import { applyFilters } from "@/lib/calc/filters";
import { PERIODOS_DISPONIVEIS } from "@/lib/constants";
import { empresas } from "@/lib/data/empresas";
import { downloadBlob, gerarRelatorioExecutivo } from "@/lib/pdf/generator";
import { useFilterStore } from "@/lib/state/filter-store";
import { formatInteger, formatNumber1, formatPercent } from "@/lib/format/number";
import { jornadasEquivalentes } from "@/lib/format/duration";
import type { Atendimento } from "@/lib/data/types";

type DrillKind =
  | "atendimentos"
  | "horas"
  | "dias"
  | "afastamento"
  | "recorrentes"
  | null;

export default function DashboardExecutivoPage() {
  const empresaId = useFilterStore((s) => s.empresaId);
  const periodo = useFilterStore((s) => s.periodo);

  const [hydrated, setHydrated] = React.useState(false);
  const [drill, setDrill] = React.useState<DrillKind>(null);
  const [generatingPdf, setGeneratingPdf] = React.useState(false);

  React.useEffect(() => setHydrated(true), []);

  const atendimentos = React.useMemo<Atendimento[]>(
    () => applyFilters({ empresaId, periodo }),
    [empresaId, periodo]
  );

  const dashboard = React.useMemo(
    () => calcularExecutivo(atendimentos, empresaId, periodo),
    [atendimentos, empresaId, periodo]
  );

  const empresa = empresas.find((e) => e.id === empresaId) ?? empresas[0];
  const periodoLabel =
    PERIODOS_DISPONIVEIS.find((p) => p.id === periodo)?.label ?? periodo;

  const drillRegistros = React.useMemo<Atendimento[]>(() => {
    switch (drill) {
      case "atendimentos":
        return atendimentos;
      case "horas":
      case "dias":
      case "afastamento":
        return atendimentos.filter((a) => a.necessidadeAfastamento);
      case "recorrentes": {
        const counts = new Map<string, number>();
        atendimentos.forEach((a) =>
          counts.set(a.prontuario, (counts.get(a.prontuario) ?? 0) + 1)
        );
        const recorrPronts = new Set(
          Array.from(counts.entries())
            .filter(([, c]) => c >= 2)
            .map(([k]) => k)
        );
        return atendimentos.filter((a) => recorrPronts.has(a.prontuario));
      }
      default:
        return [];
    }
  }, [drill, atendimentos]);

  const drillTitle: Record<Exclude<DrillKind, null>, string> = {
    atendimentos: "Todos os atendimentos do periodo",
    horas: "Atendimentos com horas perdidas",
    dias: "Atendimentos com dias perdidos",
    afastamento: "Atendimentos com afastamento",
    recorrentes: "Atendimentos de colaboradores recorrentes",
  };

  async function handleGerarPdf() {
    try {
      setGeneratingPdf(true);
      await new Promise((r) => setTimeout(r, 250));
      const { blob, filename, sizeBytes } = gerarRelatorioExecutivo({
        atendimentos,
        empresaId,
        periodo,
      });
      downloadBlob(blob, filename);
      toast.success("Relatorio gerado", {
        description: `${filename} (${(sizeBytes / 1024).toFixed(1)} KB)`,
      });
    } catch (err) {
      toast.error("Erro ao gerar PDF", {
        description: err instanceof Error ? err.message : "Falha desconhecida",
      });
    } finally {
      setGeneratingPdf(false);
    }
  }

  if (!hydrated) {
    return (
      <>
        <Topbar
          title="Dashboard Executivo"
          subtitle="Visao consolidada dos indicadores de saude da operacao"
        />
        <ExecutivoPageSkeleton />
      </>
    );
  }

  const k = dashboard.kpis;

  return (
    <>
      <Topbar
        title="Dashboard Executivo"
        subtitle="Visao consolidada dos indicadores de saude da operacao"
        actions={
          <Button
            variant="default"
            onClick={handleGerarPdf}
            disabled={generatingPdf}
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            {generatingPdf ? "Gerando..." : "Gerar PDF Executivo"}
          </Button>
        }
      />

      <div className="flex flex-col gap-4 px-4 py-4 lg:gap-6 lg:px-8 lg:py-6">
        <DemoBanner />

        <KpiGrid cols={6}>
          <KpiCard
            label="Atendimentos"
            icon={Activity}
            value={formatInteger(k.totalAtendimentos)}
            hint={`${k.colaboradoresUnicos} colaboradores unicos`}
            onClick={() => setDrill("atendimentos")}
          />
          <KpiCard
            label="Horas perdidas"
            icon={Clock}
            value={formatInteger(k.horasPerdidas)}
            unit="h"
            hint={`Equivalente a ${jornadasEquivalentes(k.horasPerdidas)}`}
            hintTone="up"
            onClick={() => setDrill("horas")}
          />
          <KpiCard
            label="Dias perdidos"
            icon={CalendarMinus}
            value={formatNumber1(k.diasPerdidos)}
            hint="Afastamento total no mes"
            hintTone="up"
            onClick={() => setDrill("dias")}
          />
          <KpiCard
            label="Com afastamento"
            icon={UserX}
            value={formatInteger(k.comAfastamento)}
            hint={`${formatPercent(k.percentualAfastamento)} dos atendimentos`}
            onClick={() => setDrill("afastamento")}
          />
          <KpiCard
            label="Recorrentes"
            icon={Repeat}
            value={formatInteger(k.recorrentes)}
            hint={`${formatPercent(k.percentualRecorrentes)} dos colaboradores`}
            hintTone="up"
            onClick={() => setDrill("recorrentes")}
          />
          <KpiCard
            label="Indice IIOS"
            icon={Gauge}
            value={formatNumber1(k.iios)}
            hint="Horas perdidas / colaborador"
          />
        </KpiGrid>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr] lg:gap-4">
          <ChartCard
            title="Ranking de setores por dias perdidos"
            subtitle="Top 8 setores com maior impacto no mes"
            icon={BarChart3}
            height="md"
            detalhesHref="/dashboards/absenteismo"
          >
            <SetorRankingChart data={dashboard.setoresRanking} top={8} />
          </ChartCard>

          <ChartCard
            title="Tipo de atendimento"
            subtitle="Passivo vs Ativo"
            icon={PieChartIcon}
            height="md"
          >
            <TipoAtendimentoChart data={dashboard.tipoAtendimento} />
          </ChartCard>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ChartCard
            title="Atendimentos por dia da semana"
            subtitle="Quando o ambulatorio mais e procurado"
            icon={CalendarDays}
            height="sm"
          >
            <DowChart data={dashboard.diaSemana} />
          </ChartCard>

          <ChartCard
            title="Periodo do atendimento"
            subtitle="Distribuicao manha / tarde"
            icon={Clock}
            height="sm"
          >
            <PeriodoChart data={dashboard.periodo} />
          </ChartCard>

          <Card className="flex flex-col p-4 lg:p-5">
            <div className="flex items-start gap-2">
              <ListOrdered className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold leading-tight">
                  Top 6 CID do mes
                </h3>
                <p className="text-xs text-muted-foreground">
                  Codigos com maior incidencia
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-col">
              {dashboard.topCids.slice(0, 6).map((c) => (
                <CidRow
                  key={c.codigo}
                  codigo={c.codigo}
                  nome={c.nome}
                  count={c.count}
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="text-[11px] text-muted-foreground">
          Dados de {empresa.nome} - {periodoLabel}
        </div>
      </div>

      {/* Mobile FAB for PDF generation - sits above BottomNav */}
      <Button
        type="button"
        variant="default"
        onClick={handleGerarPdf}
        disabled={generatingPdf}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] right-4 z-20 h-12 w-12 rounded-full p-0 shadow-md lg:hidden"
        aria-label="Gerar PDF Executivo"
      >
        <FileDown className="h-5 w-5" />
      </Button>

      <DrillDownSheet
        open={drill !== null}
        onOpenChange={(v) => !v && setDrill(null)}
        title={drill ? drillTitle[drill] : ""}
        description={`${empresa.nome} - ${periodoLabel}`}
        registros={drillRegistros}
      />
    </>
  );
}
