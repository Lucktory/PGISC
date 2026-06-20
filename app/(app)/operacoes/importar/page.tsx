"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  FileDown,
  FileSpreadsheet,
  History,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DemoBanner } from "@/components/shell/DemoBanner";
import { Topbar } from "@/components/shell/Topbar";
import { parseFile, type ParsedWorkbook } from "@/lib/xlsx/parser";
import {
  mapHeaders,
  type HeaderMapping,
} from "@/lib/xlsx/header-mapping";
import { validateRows, type ValidationReport } from "@/lib/xlsx/validator";
import { downloadTemplate } from "@/lib/xlsx/template-generator";
import { TEMPLATE_VERSION } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4 | 5 | "done";
type Marker = "validado" | "legado-revisar";

const STEP_LABELS: Record<Exclude<Step, "done">, string> = {
  1: "Upload do arquivo",
  2: "Verificacao de cabecalhos",
  3: "Validacao de dados",
  4: "Classificacao dos dados",
  5: "Confirmacao",
};

export default function ImportarPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>(1);
  const [parsed, setParsed] = React.useState<ParsedWorkbook | null>(null);
  const [mappings, setMappings] = React.useState<HeaderMapping[]>([]);
  const [report, setReport] = React.useState<ValidationReport | null>(null);
  const [marker, setMarker] = React.useState<Marker>("validado");
  const [progress, setProgress] = React.useState(0);
  const [busy, setBusy] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function reset() {
    setStep(1);
    setParsed(null);
    setMappings([]);
    setReport(null);
    setMarker("validado");
    setProgress(0);
  }

  async function handleFile(file: File) {
    try {
      setBusy(true);
      const wb = await parseFile(file);
      setParsed(wb);
      // pick the first sheet with rows (skip Cadastros/Dinamica metadata sheets)
      const sheet =
        wb.sheets.find((s) =>
          /acompanhamento|atendimento|lancamento/i.test(s.name)
        ) ?? wb.sheets[0];
      if (sheet && sheet.headers.length > 0) {
        const m = mapHeaders(sheet.headers);
        setMappings(m);
        const r = validateRows({ mappings: m, rows: sheet.rows });
        setReport(r);
        toast.success("Arquivo processado", {
          description: `${sheet.rows.length} linhas detectadas em "${sheet.name}".`,
        });
      } else {
        toast.error("Nenhuma planilha valida encontrada", {
          description: "Use o template oficial baixavel acima.",
        });
      }
    } catch (err) {
      toast.error("Erro ao ler arquivo", {
        description: err instanceof Error ? err.message : "Falha desconhecida",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleConfirm() {
    setBusy(true);
    setProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 70));
      setProgress(i);
    }
    setBusy(false);
    setStep("done");
    toast.success("Importacao concluida", {
      description: `${report?.validRows ?? 0} atendimentos importados.`,
    });
  }

  function StepIndicator() {
    if (step === "done") return null;
    const total = 5;
    return (
      <div className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3 lg:px-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Etapa {step} de {total}
          </span>
          <span className="text-sm font-semibold">
            {STEP_LABELS[step as Exclude<Step, "done">]}
          </span>
        </div>
        <div className="hidden gap-1 lg:flex">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={cn(
                "h-1.5 w-8 rounded-full transition-colors",
                step === s
                  ? "bg-primary"
                  : (step as number) > s
                  ? "bg-accent"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Topbar
        title="Importar planilha"
        subtitle="Carregue um lote de atendimentos do template oficial PGISC"
        showFilters={false}
      />
      <div className="flex flex-col gap-4 px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+9.5rem)] lg:gap-6 lg:px-8 lg:py-6 lg:pb-6">
        <DemoBanner message="A importacao opera somente em memoria nesta demo. Em producao, o lote sera persistido no banco PostgreSQL com auditoria de origem." />

        <StepIndicator />

        {step === 1 && (
          <Card className="flex flex-col gap-4 p-4 lg:p-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">
                Selecione a planilha
              </h2>
              <p className="text-xs text-muted-foreground">
                Aceita .xlsx ou .xlsm. O sistema tenta encontrar
                automaticamente a aba de atendimentos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors hover:bg-muted/60"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-semibold">
                Toque para selecionar o arquivo
              </span>
              <span className="text-xs text-muted-foreground">
                ou arraste e solte aqui (desktop)
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xlsm"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </button>

            {parsed && (
              <Card className="flex items-start gap-3 bg-muted/30 p-3">
                <FileSpreadsheet className="h-5 w-5 shrink-0 text-accent" />
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-semibold">
                    {parsed.filename}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {parsed.sheets.length} aba(s) -{" "}
                    {parsed.sheets.reduce((a, s) => a + s.rows.length, 0)}{" "}
                    linhas no total
                  </span>
                </div>
                <Badge variant="success" className="text-[10px]">
                  Pronto
                </Badge>
              </Card>
            )}

            <div className="flex flex-col gap-2 border-t border-border pt-3 text-xs text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
              <span>
                Template oficial: <strong>{TEMPLATE_VERSION}</strong>
              </span>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const r = downloadTemplate();
                  toast.success("Template baixado", {
                    description: `template-pgisc-${TEMPLATE_VERSION}.xlsx (${(
                      r.size / 1024
                    ).toFixed(1)} KB)`,
                  });
                }}
                className="gap-2"
              >
                <FileDown className="h-4 w-4" />
                Baixar template
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="flex flex-col gap-3 p-4 lg:p-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">
                Verificacao de cabecalhos
              </h2>
              <p className="text-xs text-muted-foreground">
                O sistema corrige automaticamente os erros comuns (ATENDIEMNTO -&gt; TIPO DE ATENDIMENTO, AFASTAMETNO -&gt; NECESSIDADE DE AFASTAMENTO) e tenta associar os demais cabecalhos.
              </p>
            </div>
            <ul className="flex flex-col gap-2">
              {mappings.map((m) => (
                <li
                  key={m.detected}
                  className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-card px-3 py-2 lg:gap-3"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {m.detected}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  {m.mapped ? (
                    <span className="text-sm font-medium text-foreground">
                      {m.mapped.label}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-danger">
                      Sem correspondencia
                    </span>
                  )}
                  {m.autoCorrected && (
                    <Badge variant="success" className="gap-1 text-[10px]">
                      <BadgeCheck className="h-3 w-3" />
                      Corrigido automaticamente
                    </Badge>
                  )}
                  {m.mapped?.required && (
                    <Badge variant="muted" className="text-[10px]">
                      Obrigatorio
                    </Badge>
                  )}
                  {!m.mapped && (
                    <Badge variant="warning" className="gap-1 text-[10px]">
                      <AlertTriangle className="h-3 w-3" />
                      Ignorar
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {step === 3 && report && (
          <Card className="flex flex-col gap-3 p-4 lg:p-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">Validacao de dados</h2>
              <p className="text-xs text-muted-foreground">
                Pre-visualizacao do que sera importado e possiveis problemas a revisar.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Card className="p-3">
                <div className="text-xs text-muted-foreground">Linhas</div>
                <div className="text-xl font-bold">{report.totalRows}</div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center gap-1 text-xs text-success">
                  <CheckCircle2 className="h-3 w-3" />
                  Validas
                </div>
                <div className="text-xl font-bold text-success">
                  {report.validRows}
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center gap-1 text-xs text-warning">
                  <AlertTriangle className="h-3 w-3" />
                  Alertas
                </div>
                <div className="text-xl font-bold text-warning">
                  {report.warningRows}
                </div>
              </Card>
              <Card className="p-3">
                <div className="flex items-center gap-1 text-xs text-danger">
                  <XCircle className="h-3 w-3" />
                  Erros
                </div>
                <div className="text-xl font-bold text-danger">
                  {report.errorRows}
                </div>
              </Card>
            </div>

            {report.errors.length > 0 && (
              <Accordion type="single" collapsible>
                <AccordionItem value="errors">
                  <AccordionTrigger>
                    Ver {report.errors.length} ocorrencia(s)
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="flex max-h-72 flex-col gap-1 overflow-y-auto pr-2 text-xs">
                      {report.errors.slice(0, 50).map((e, i) => (
                        <li
                          key={`${e.rowIndex}-${i}`}
                          className="flex items-start gap-2 rounded border border-border bg-muted/30 px-2 py-1"
                        >
                          {e.severity === "error" ? (
                            <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" />
                          ) : (
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                          )}
                          <span>
                            Linha {e.rowIndex + 2}: {e.message}
                          </span>
                        </li>
                      ))}
                      {report.errors.length > 50 && (
                        <li className="px-2 py-1 text-[11px] text-muted-foreground">
                          Mostrando os primeiros 50 de {report.errors.length}.
                        </li>
                      )}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </Card>
        )}

        {step === 4 && (
          <Card className="flex flex-col gap-3 p-4 lg:p-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">
                Classificacao dos dados
              </h2>
              <p className="text-xs text-muted-foreground">
                Voce mesmo comentou que nao tem garantia da qualidade dos
                lancamentos historicos. Marcar como &quot;legado&quot; preserva
                o dado mas sinaliza para revisao gradual nos dashboards.
              </p>
            </div>
            <RadioGroup
              value={marker}
              onValueChange={(v) => setMarker(v as Marker)}
              className="gap-3"
            >
              <Label
                htmlFor="r-validado"
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-md border border-border bg-card p-3 transition-colors",
                  marker === "validado" && "border-accent bg-accent-soft"
                )}
              >
                <RadioGroupItem
                  id="r-validado"
                  value="validado"
                  className="mt-1"
                />
                <div className="flex flex-col">
                  <span className="flex items-center gap-1 text-sm font-semibold">
                    <ShieldCheck className="h-4 w-4 text-success" />
                    Dados validados
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Estes dados ja foram revisados e estao corretos.
                  </span>
                </div>
              </Label>
              <Label
                htmlFor="r-legado"
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-md border border-border bg-card p-3 transition-colors",
                  marker === "legado-revisar" && "border-accent bg-accent-soft"
                )}
              >
                <RadioGroupItem
                  id="r-legado"
                  value="legado-revisar"
                  className="mt-1"
                />
                <div className="flex flex-col">
                  <span className="flex items-center gap-1 text-sm font-semibold">
                    <History className="h-4 w-4 text-warning" />
                    Marcar como legado (a revisar)
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Sera importado mas marcado para revisao posterior nos
                    dashboards.
                  </span>
                </div>
              </Label>
            </RadioGroup>
          </Card>
        )}

        {step === 5 && report && parsed && (
          <Card className="flex flex-col gap-3 p-4 lg:p-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">Confirmacao</h2>
              <p className="text-xs text-muted-foreground">
                Revise as escolhas antes de importar.
              </p>
            </div>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between border-b border-border py-1">
                <dt className="text-muted-foreground">Arquivo</dt>
                <dd className="font-medium">{parsed.filename}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-1">
                <dt className="text-muted-foreground">Linhas a importar</dt>
                <dd className="font-medium">
                  {report.validRows + report.warningRows} de {report.totalRows}
                </dd>
              </div>
              <div className="flex justify-between border-b border-border py-1">
                <dt className="text-muted-foreground">Classificacao</dt>
                <dd className="font-medium">
                  {marker === "validado" ? "Dados validados" : "Legado (a revisar)"}
                </dd>
              </div>
            </dl>
            {busy && (
              <div className="flex flex-col gap-2">
                <Progress value={progress} />
                <span className="text-xs text-muted-foreground">
                  Processando...
                </span>
              </div>
            )}
            <Button
              type="button"
              variant="default"
              onClick={handleConfirm}
              disabled={busy}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Confirmar importacao
            </Button>
          </Card>
        )}

        {step === "done" && report && (
          <Card className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">
                Importacao concluida com sucesso
              </h2>
              <p className="max-w-md text-sm text-muted-foreground">
                {report.validRows + report.warningRows} atendimentos importados.{" "}
                {marker === "legado-revisar" &&
                  `Todos marcados como "legado a revisar".`}
              </p>
            </div>
            <div className="flex flex-col gap-2 lg:flex-row">
              <Button
                type="button"
                variant="default"
                onClick={() => router.push("/dashboards/executivo")}
              >
                Ver no dashboard executivo
              </Button>
              <Button type="button" variant="outline" onClick={reset}>
                Importar outro arquivo
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Step navigation - sticky bottom on mobile */}
      {step !== "done" && (
        <div className="fixed left-0 right-0 z-30 flex items-center justify-between gap-2 border-t border-border bg-card px-4 py-3 bottom-[calc(env(safe-area-inset-bottom)+56px)] lg:static lg:border-0 lg:bg-transparent lg:px-8 lg:py-0 lg:bottom-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (step === 1) router.back();
              else setStep(((step as number) - 1) as Step);
            }}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          {step !== 5 && (
            <Button
              type="button"
              variant="default"
              onClick={() => {
                if (step === 1 && !parsed) {
                  toast.error("Selecione um arquivo");
                  return;
                }
                if (step === 3 && report && report.errorRows > 0) {
                  toast.error("Resolva os erros antes de prosseguir");
                  return;
                }
                setStep(((step as number) + 1) as Step);
              }}
              className="gap-2"
              disabled={step === 1 && !parsed}
            >
              Avancar
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </>
  );
}
