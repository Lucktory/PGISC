"use client";

import * as React from "react";
import {
  BarChart3,
  Building,
  ClipboardList,
  Download,
  Eye,
  FileDown,
  FileText,
  ListOrdered,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/states/EmptyState";
import { DemoBanner } from "@/components/shell/DemoBanner";
import { Topbar } from "@/components/shell/Topbar";
import { applyFilters } from "@/lib/calc/filters";
import { downloadBlob, gerarRelatorioExecutivo } from "@/lib/pdf/generator";
import { PERIODOS_DISPONIVEIS } from "@/lib/constants";
import { empresas } from "@/lib/data/empresas";
import { useFilterStore } from "@/lib/state/filter-store";
import { useReportsStore } from "@/lib/state/reports-store";
import { formatDateTime } from "@/lib/format/date";

interface SectionToggle {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
}

export default function RelatorioPdfPage() {
  const empresaId = useFilterStore((s) => s.empresaId);
  const periodo = useFilterStore((s) => s.periodo);
  const reports = useReportsStore((s) => s.reports);
  const addReport = useReportsStore((s) => s.addReport);
  const removeReport = useReportsStore((s) => s.removeReport);

  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const [busy, setBusy] = React.useState(false);
  const [sections, setSections] = React.useState<SectionToggle[]>([
    { key: "capa", label: "Capa", icon: FileText, enabled: true },
    { key: "kpis", label: "Resumo de KPIs", icon: BarChart3, enabled: true },
    { key: "setores", label: "Top setores", icon: Building, enabled: true },
    { key: "cids", label: "Top CIDs", icon: ListOrdered, enabled: true },
    {
      key: "conclusao",
      label: "Recomendacoes",
      icon: ClipboardList,
      enabled: true,
    },
  ]);

  const empresa = empresas.find((e) => e.id === empresaId) ?? empresas[0];
  const periodoLabel =
    PERIODOS_DISPONIVEIS.find((p) => p.id === periodo)?.label ?? periodo;

  function toggle(key: string) {
    setSections((s) =>
      s.map((x) => (x.key === key ? { ...x, enabled: !x.enabled } : x))
    );
  }

  async function handleGerar() {
    try {
      setBusy(true);
      await new Promise((r) => setTimeout(r, 300));
      const atendimentos = applyFilters({ empresaId, periodo });
      const { blob, filename, sizeBytes } = gerarRelatorioExecutivo({
        atendimentos,
        empresaId,
        periodo,
      });
      downloadBlob(blob, filename);
      addReport({
        id: `R-${Date.now()}`,
        empresaId,
        periodo,
        geradoEm: new Date().toISOString(),
        tamanhoBytes: sizeBytes,
      });
      toast.success("Relatorio gerado", {
        description: `${filename} (${(sizeBytes / 1024).toFixed(1)} KB)`,
      });
    } catch (err) {
      toast.error("Erro ao gerar PDF", {
        description: err instanceof Error ? err.message : "Falha desconhecida",
      });
    } finally {
      setBusy(false);
    }
  }

  async function redownload(id: string) {
    const rep = reports.find((r) => r.id === id);
    if (!rep) return;
    const atendimentos = applyFilters({
      empresaId: rep.empresaId,
      periodo: rep.periodo,
    });
    const { blob, filename } = gerarRelatorioExecutivo({
      atendimentos,
      empresaId: rep.empresaId,
      periodo: rep.periodo,
    });
    downloadBlob(blob, filename);
    toast.success("Download iniciado", { description: filename });
  }

  return (
    <>
      <Topbar
        title="Relatorio executivo PDF"
        subtitle="Geracao automatica do relatorio para diretoria"
      />
      <div className="flex flex-col gap-4 px-4 py-4 pb-24 lg:gap-6 lg:px-8 lg:py-6 lg:pb-6">
        <DemoBanner message="O PDF e gerado em tempo real no navegador via jsPDF, usando exatamente os dados reais do PEREIRA Jan/2026 ja carregados." />

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <Card className="flex flex-col gap-4 p-4 lg:p-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">Configuracao do relatorio</h2>
              <p className="text-xs text-muted-foreground">
                Selecione as secoes que devem entrar no PDF
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {sections.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => toggle(s.key)}
                    className={`flex items-center justify-between rounded-md border px-3 py-3 text-left text-sm transition-colors ${
                      s.enabled
                        ? "border-accent bg-accent-soft text-foreground"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {s.label}
                    </span>
                    {s.enabled && (
                      <Badge variant="success" className="text-[10px]">
                        Ativa
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-2 rounded-md bg-muted/30 p-3 text-xs">
              <span className="font-semibold text-foreground">
                Configuracao atual:
              </span>
              <span>Empresa: {empresa.nome}</span>
              <span>Periodo: {periodoLabel}</span>
              <span>Secoes incluidas: {sections.filter((s) => s.enabled).length} de {sections.length}</span>
            </div>

            <Button
              type="button"
              variant="default"
              onClick={handleGerar}
              disabled={busy || !hydrated}
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              {busy ? "Gerando PDF..." : "Gerar PDF"}
            </Button>
          </Card>

          <Card className="flex flex-col gap-3 p-4 lg:p-6">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Pre-visualizacao</h2>
            </div>
            <div className="flex aspect-[210/297] w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-8 w-8" />
                <span>Relatorio Executivo</span>
                <span className="font-semibold text-foreground">
                  {empresa.nome}
                </span>
                <span>{periodoLabel}</span>
                <Badge variant="muted" className="text-[10px]">
                  3 paginas
                </Badge>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              O PDF e baixado direto no navegador apos clicar em &quot;Gerar PDF&quot;.
            </p>
          </Card>
        </div>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Historico de relatorios</h2>
            <span className="text-xs text-muted-foreground">
              {reports.length} {reports.length === 1 ? "relatorio" : "relatorios"}
            </span>
          </div>
          {reports.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Nenhum relatorio gerado ainda"
              description="Configure as secoes acima e clique em 'Gerar PDF' para criar o primeiro relatorio."
            />
          ) : (
            <ul className="flex flex-col gap-2">
              {reports.map((r) => {
                const emp =
                  empresas.find((e) => e.id === r.empresaId) ?? empresas[0];
                const periodoR =
                  PERIODOS_DISPONIVEIS.find((p) => p.id === r.periodo)?.label ??
                  r.periodo;
                return (
                  <li
                    key={r.id}
                    className="flex items-center gap-3 rounded-md border border-border bg-card p-3"
                  >
                    <FileText className="h-5 w-5 shrink-0 text-accent" />
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-semibold">
                        {emp.nome} - {periodoR}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatDateTime(r.geradoEm)} -{" "}
                        {(r.tamanhoBytes / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => redownload(r.id)}
                      aria-label="Baixar novamente"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeReport(r.id)}
                      aria-label="Remover do historico"
                    >
                      <Trash2 className="h-4 w-4 text-danger" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Mobile FAB - Generate */}
      <Button
        type="button"
        variant="default"
        onClick={handleGerar}
        disabled={busy}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] right-4 z-20 h-12 w-12 rounded-full p-0 shadow-md lg:hidden"
        aria-label="Gerar PDF"
      >
        <FileDown className="h-5 w-5" />
      </Button>
    </>
  );
}
