"use client";

import { Calendar, Check, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PERIODOS_DISPONIVEIS } from "@/lib/constants";
import { useFilterStore } from "@/lib/state/filter-store";
import type { PeriodoMes } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export function PeriodoSelector({
  variant = "topbar",
}: {
  variant?: "topbar" | "inline";
}) {
  const periodo = useFilterStore((s) => s.periodo);
  const setPeriodo = useFilterStore((s) => s.setPeriodo);
  const atual =
    PERIODOS_DISPONIVEIS.find((p) => p.id === periodo) ??
    PERIODOS_DISPONIVEIS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-foreground transition-colors hover:bg-muted",
          variant === "inline" && "w-full justify-between h-11 lg:h-9"
        )}
      >
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="hidden text-muted-foreground text-xs xl:inline">
          Periodo:
        </span>
        <span className="truncate font-semibold max-w-[140px]">
          {atual.label}
        </span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Periodo de analise</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PERIODOS_DISPONIVEIS.map((p) => (
          <DropdownMenuItem
            key={p.id}
            onSelect={() => setPeriodo(p.id as PeriodoMes)}
            className="flex items-center justify-between"
          >
            <span className="text-sm">{p.label}</span>
            {p.id === atual.id && <Check className="h-4 w-4 text-accent" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
