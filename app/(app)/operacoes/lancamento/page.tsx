"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  AlertTriangle,
  AlignLeft,
  Calendar,
  CalendarMinus,
  ClipboardList,
  Clock,
  Keyboard,
  MapPin,
  MessageSquareText,
  Save,
  Stethoscope,
  Tag,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CidAutocomplete } from "@/components/lancamento/CidAutocomplete";
import { PersonCard } from "@/components/lancamento/PersonCard";
import { ProntuarioLookup } from "@/components/lancamento/ProntuarioLookup";
import { LancamentosRecentes } from "@/components/lancamento/LancamentosRecentes";
import { DemoBanner } from "@/components/shell/DemoBanner";
import { Topbar } from "@/components/shell/Topbar";
import {
  lancamentoSchema,
  TIPOS_ATENDIMENTO,
  type LancamentoFormValues,
} from "@/lib/auth/lancamento-schema";
import { useEntriesStore } from "@/lib/state/entries-store";
import { useFilterStore } from "@/lib/state/filter-store";
import { empresas } from "@/lib/data/empresas";
import { locaisAtendimento, tiposExame } from "@/lib/data/locais";
import { medicos } from "@/lib/data/medicos";
import { findPessoa, findVinculosByPessoa } from "@/lib/data/pessoas";
import { diaSemana } from "@/lib/derive/dia-semana";
import { todayISO } from "@/lib/format/date";
import type { Atendimento } from "@/lib/data/types";
import { cn } from "@/lib/utils";

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, "0")}`;
}

export default function LancamentoPage() {
  const router = useRouter();
  const empresaId = useFilterStore((s) => s.empresaId);
  const entries = useEntriesStore((s) => s.entries);
  const addEntry = useEntriesStore((s) => s.addEntry);
  const removeEntry = useEntriesStore((s) => s.removeEntry);

  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);

  const empresa = empresas.find((e) => e.id === empresaId) ?? empresas[0];

  const form = useForm<LancamentoFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(lancamentoSchema as any),
    defaultValues: {
      prontuario: "",
      dataAtendimento: todayISO(),
      tipoAtendimento: "Passivo",
      localAtendimento: "Ambulatorio interno",
      motivo: "",
      tipoExame: "Consulta clinica",
      cid: "",
      conduta: "",
      necessidadeAfastamento: false,
      horasPerdidas: 0,
      diasPerdidos: 0,
      medicoResponsavel: medicos[0].nome,
      observacoes: "",
    },
    mode: "onSubmit",
  });

  const prontuario = form.watch("prontuario");
  const dataAtendimento = form.watch("dataAtendimento");
  const afastamento = form.watch("necessidadeAfastamento");

  // Derived fields preview
  const derivedDow = React.useMemo(
    () => (dataAtendimento ? diaSemana(dataAtendimento) : "-"),
    [dataAtendimento]
  );

  const onSubmit = React.useCallback(
    (values: LancamentoFormValues) => {
      const pessoa = findPessoa(values.prontuario);
      const vinculo = findVinculosByPessoa(values.prontuario).slice(-1)[0];
      if (!pessoa || !vinculo) {
        toast.error("Pessoa nao encontrada", {
          description: "Verifique o numero do prontuario informado.",
        });
        return;
      }
      const entry: Atendimento = {
        id: newId("LCT"),
        empresaId,
        prontuario: pessoa.prontuario,
        nome: pessoa.nome,
        sexo: pessoa.sexo,
        cargo: vinculo.cargo,
        setor: vinculo.setor,
        dataAdmissao: vinculo.dataAdmissao,
        dataNascimento: pessoa.dataNascimento,
        dataAtendimento: values.dataAtendimento,
        tipoAtendimento: values.tipoAtendimento,
        localAtendimento: values.localAtendimento,
        motivo: values.motivo,
        tipoExame: values.tipoExame,
        cid: values.cid,
        conduta: values.conduta,
        necessidadeAfastamento: values.necessidadeAfastamento,
        horasPerdidas: values.necessidadeAfastamento
          ? Number(values.horasPerdidas)
          : 0,
        diasPerdidos: values.necessidadeAfastamento
          ? Number(values.diasPerdidos)
          : 0,
        medicoResponsavel: values.medicoResponsavel,
        observacoes: values.observacoes ?? "",
        marker: "validado",
      };
      addEntry(entry);
      toast.success("Lancamento salvo", {
        description: `Prontuario ${entry.prontuario} - ${values.dataAtendimento}`,
      });
      form.reset({
        prontuario: "",
        dataAtendimento: todayISO(),
        tipoAtendimento: "Passivo",
        localAtendimento: "Ambulatorio interno",
        motivo: "",
        tipoExame: "Consulta clinica",
        cid: "",
        conduta: "",
        necessidadeAfastamento: false,
        horasPerdidas: 0,
        diasPerdidos: 0,
        medicoResponsavel: medicos[0].nome,
        observacoes: "",
      });
    },
    [addEntry, empresaId, form]
  );

  // Keyboard shortcuts (desktop only)
  React.useEffect(() => {
    function handler(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        form.handleSubmit(onSubmit)();
      }
      if (mod && e.key.toLowerCase() === "n") {
        e.preventDefault();
        form.reset();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [form, onSubmit]);

  function handleDelete(entry: Atendimento) {
    removeEntry(entry.id);
    toast("Lancamento removido", {
      description: `${entry.nome} - ${entry.dataAtendimento}`,
      action: {
        label: "Desfazer",
        onClick: () => addEntry(entry),
      },
    });
  }

  return (
    <>
      <Topbar
        title="Lancamento diario"
        subtitle="Registro de atendimentos ambulatoriais e atestados"
        showFilters={false}
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/operacoes/importar")}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Carga em massa
          </Button>
        }
      />
      <div className="flex flex-col gap-4 px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+9.5rem)] lg:gap-6 lg:px-8 lg:py-6 lg:pb-6">
        <DemoBanner message="Os lancamentos ficam salvos no seu navegador (localStorage) durante a demo. Em producao, gravam no banco PostgreSQL com sincronizacao em tempo real para os dashboards." />

        <Card className="p-4 lg:p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              {/* Identificacao */}
              <section className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Identificacao
                </h2>

                <FormField
                  control={form.control}
                  name="prontuario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prontuario do colaborador</FormLabel>
                      <FormControl>
                        <ProntuarioLookup
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {prontuario && (
                  <PersonCard
                    prontuario={prontuario}
                    referenciaISO={dataAtendimento}
                  />
                )}

                <div className="rounded-md border border-dashed border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                  Empresa cliente:{" "}
                  <span className="font-semibold text-foreground">
                    {empresa.nome}
                  </span>{" "}
                  - alterar via topbar
                </div>
              </section>

              {/* Atendimento */}
              <section className="flex flex-col gap-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Dados do atendimento
                </h2>

                <div className="grid gap-3 lg:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="dataAtendimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Data do atendimento
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Dia da semana derivado: {derivedDow}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipoAtendimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <Tag className="h-3.5 w-3.5" />
                          Tipo de atendimento
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TIPOS_ATENDIMENTO.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="localAtendimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          Local de atendimento
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locaisAtendimento.map((l) => (
                              <SelectItem key={l} value={l}>
                                {l}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipoExame"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de exame ou consulta</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposExame.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="motivo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <AlignLeft className="h-3.5 w-3.5" />
                        Motivo / justificativa
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex. dor lombar apos jornada longa, reposicionamento postural recomendado"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CID</FormLabel>
                      <FormControl>
                        <CidAutocomplete
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="conduta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <ClipboardList className="h-3.5 w-3.5" />
                        Conduta medica
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          placeholder="Conduta adotada no atendimento"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {/* Afastamento */}
              <section className="flex flex-col gap-3 rounded-md border border-border bg-muted/20 p-3 lg:p-4">
                <FormField
                  control={form.control}
                  name="necessidadeAfastamento"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between gap-3">
                      <div className="flex flex-col">
                        <FormLabel className="flex items-center gap-2 text-sm">
                          {field.value && (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          )}
                          Necessidade de afastamento
                        </FormLabel>
                        <FormDescription>
                          Se ON, registra horas e dias perdidos no atendimento
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {afastamento && (
                  <div className="grid gap-3 lg:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="horasPerdidas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Horas perdidas
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.5"
                              min={0}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="diasPerdidos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <CalendarMinus className="h-3.5 w-3.5" />
                            Dias perdidos
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.5"
                              min={0}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </section>

              {/* Medico + observacoes */}
              <section className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="medicoResponsavel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Stethoscope className="h-3.5 w-3.5" />
                        Medico responsavel
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {medicos.map((m) => (
                            <SelectItem key={m.nome} value={m.nome}>
                              {m.nome} - {m.crm}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <MessageSquareText className="h-3.5 w-3.5" />
                        Observacoes
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={2}
                          placeholder="Opcional"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {/* Keyboard hint + desktop submit */}
              <div className="hidden items-center justify-between border-t border-border pt-4 lg:flex">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Keyboard className="h-4 w-4" />
                  <span>
                    Atalhos: <kbd className="rounded border border-border bg-muted/40 px-1.5 py-0.5 font-mono">Ctrl+S</kbd>{" "}
                    salvar -{" "}
                    <kbd className="rounded border border-border bg-muted/40 px-1.5 py-0.5 font-mono">Ctrl+N</kbd>{" "}
                    novo
                  </span>
                </div>
                <Button
                  type="submit"
                  variant="default"
                  className="gap-2"
                  disabled={!hydrated}
                >
                  <Save className="h-4 w-4" />
                  Salvar lancamento
                </Button>
              </div>
            </form>
          </Form>
        </Card>

        {/* Recent entries */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Lancamentos recentes
            </h2>
            <span className="text-xs text-muted-foreground">
              {entries.length}{" "}
              {entries.length === 1 ? "lancamento" : "lancamentos"}
            </span>
          </div>
          <LancamentosRecentes entries={entries} onDelete={handleDelete} />
        </section>

        <Card className="border-dashed bg-muted/20 p-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Em breve:</span>{" "}
          upload de foto ou PDF do atestado com leitura automatica (CID, nome,
          dias). Em vez de digitar 100 atestados, o time validaria os 100. Fase
          2 ou 3 do roadmap.
        </Card>
      </div>

      {/* Mobile sticky submit bar */}
      <div
        className={cn(
          "fixed left-0 right-0 z-30 border-t border-border bg-card px-4 py-3 lg:hidden",
          "bottom-[calc(env(safe-area-inset-bottom)+56px)]"
        )}
      >
        <Button
          type="button"
          variant="default"
          className="h-12 w-full gap-2"
          onClick={form.handleSubmit(onSubmit)}
          disabled={!hydrated}
        >
          <Save className="h-4 w-4" />
          Salvar lancamento
        </Button>
      </div>

      <Link
        href="/operacoes/importar"
        className="hidden text-xs text-accent hover:underline"
      >
        Importar dados em massa
      </Link>
    </>
  );
}
