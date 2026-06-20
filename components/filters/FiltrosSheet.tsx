"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useFilterStore } from "@/lib/state/filter-store";
import { empresas } from "@/lib/data/empresas";
import { PERIODOS_DISPONIVEIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function FiltrosSheetTrigger({
  onClick,
}: {
  onClick: () => void;
}) {
  const empresaId = useFilterStore((s) => s.empresaId);
  const periodo = useFilterStore((s) => s.periodo);
  const empresa = empresas.find((e) => e.id === empresaId) ?? empresas[0];
  const periodoLabel =
    PERIODOS_DISPONIVEIS.find((p) => p.id === periodo)?.label ?? periodo;
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="lg:hidden flex w-full items-center gap-2 justify-between"
    >
      <span className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        Filtros
      </span>
      <span className="text-xs text-muted-foreground truncate">
        {empresa.nome} - {periodoLabel}
      </span>
    </Button>
  );
}

export function FiltrosSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const empresaId = useFilterStore((s) => s.empresaId);
  const periodo = useFilterStore((s) => s.periodo);
  const setEmpresa = useFilterStore((s) => s.setEmpresa);
  const setPeriodo = useFilterStore((s) => s.setPeriodo);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh]">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>
            Aplica empresa e periodo a todos os dashboards
          </SheetDescription>
        </SheetHeader>
        <div className="px-5 pb-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Empresa cliente
          </div>
          <ul className="mt-2 flex flex-col gap-1">
            {empresas.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => setEmpresa(e.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm transition-colors",
                    e.id === empresaId
                      ? "bg-accent-soft text-accent"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <span className="flex flex-col">
                    <span className="font-medium">{e.nome}</span>
                    <span className="text-xs text-muted-foreground">{e.cnpj}</span>
                  </span>
                  {e.id === empresaId && (
                    <span className="text-xs font-semibold">Selecionada</span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <Separator className="my-4" />

          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Periodo de analise
          </div>
          <ul className="mt-2 flex flex-col gap-1">
            {PERIODOS_DISPONIVEIS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setPeriodo(p.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm transition-colors",
                    p.id === periodo
                      ? "bg-accent-soft text-accent"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <span className="font-medium">{p.label}</span>
                  {p.id === periodo && (
                    <span className="text-xs font-semibold">Selecionado</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <SheetFooter>
          <Button variant="default" onClick={() => onOpenChange(false)}>
            Aplicar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
