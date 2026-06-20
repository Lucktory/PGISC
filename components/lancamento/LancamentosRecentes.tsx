"use client";

import * as React from "react";
import { AlertCircle, ClipboardList, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/EmptyState";
import { formatDate } from "@/lib/format/date";
import { formatDias, formatHoras } from "@/lib/format/duration";
import type { Atendimento } from "@/lib/data/types";

interface LancamentosRecentesProps {
  entries: Atendimento[];
  onEdit?: (entry: Atendimento) => void;
  onDelete: (entry: Atendimento) => void;
  limit?: number;
}

export function LancamentosRecentes({
  entries,
  onEdit,
  onDelete,
  limit = 20,
}: LancamentosRecentesProps) {
  const shown = entries.slice(0, limit);

  if (shown.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Sem lancamentos ainda"
        description="Use o formulario acima para registrar o primeiro atendimento. Os lancamentos aparecerao aqui em ordem cronologica."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {shown.map((e) => (
        <li
          key={e.id}
          className="flex flex-col gap-1 rounded-md border border-border bg-card p-3 lg:flex-row lg:items-center lg:gap-4"
        >
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {e.nome}
              </span>
              <Badge variant="muted" className="font-mono text-[10px]">
                {e.prontuario}
              </Badge>
              <Badge variant="soft" className="font-mono text-[10px]">
                {e.cid}
              </Badge>
              {e.necessidadeAfastamento && (
                <Badge variant="warning" className="gap-1 text-[10px]">
                  <AlertCircle className="h-3 w-3" />
                  Afastamento
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <span>{formatDate(e.dataAtendimento)}</span>
              <span>
                {e.setor} - {e.cargo}
              </span>
              {e.necessidadeAfastamento && (
                <>
                  <span>{formatHoras(e.horasPerdidas)}</span>
                  <span>{formatDias(e.diasPerdidos)}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex shrink-0 gap-1">
            {onEdit && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onEdit(e)}
                aria-label="Editar lancamento"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(e)}
              aria-label="Excluir lancamento"
            >
              <Trash2 className="h-4 w-4 text-danger" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
