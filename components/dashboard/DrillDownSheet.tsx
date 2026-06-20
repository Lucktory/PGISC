"use client";

import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { findCid } from "@/lib/data/cid10-reference";
import { formatDate } from "@/lib/format/date";
import { formatHoras, formatDias } from "@/lib/format/duration";
import type { Atendimento } from "@/lib/data/types";

interface DrillDownSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  registros: Atendimento[];
}

export function DrillDownSheet({
  open,
  onOpenChange,
  title,
  description,
  registros,
}: DrillDownSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] flex flex-col">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="overflow-y-auto px-5 pb-6">
          <p className="mb-3 text-xs text-muted-foreground">
            {registros.length}{" "}
            {registros.length === 1 ? "registro" : "registros"}
          </p>
          <ul className="flex flex-col gap-2">
            {registros.slice(0, 100).map((r) => {
              const cid = findCid(r.cid);
              return (
                <li
                  key={r.id}
                  className="flex flex-col gap-1 rounded-md border border-border bg-card p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {r.nome}
                    </span>
                    <Badge variant="soft" className="font-mono text-[10px]">
                      {r.cid}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {r.setor} - {r.cargo}
                  </div>
                  <div className="text-xs text-foreground">
                    {cid?.nome ?? r.motivo}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                    <span>{formatDate(r.dataAtendimento)}</span>
                    {r.necessidadeAfastamento && (
                      <>
                        <span>{formatHoras(r.horasPerdidas)}</span>
                        <span>{formatDias(r.diasPerdidos)}</span>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          {registros.length > 100 && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Mostrando os primeiros 100 de {registros.length} registros.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
