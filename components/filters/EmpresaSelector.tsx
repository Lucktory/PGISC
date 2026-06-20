"use client";

import { Building2, Check, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { empresas } from "@/lib/data/empresas";
import { useFilterStore } from "@/lib/state/filter-store";
import { cn } from "@/lib/utils";

export function EmpresaSelector({
  variant = "topbar",
}: {
  variant?: "topbar" | "inline";
}) {
  const empresaId = useFilterStore((s) => s.empresaId);
  const setEmpresa = useFilterStore((s) => s.setEmpresa);
  const empresa = empresas.find((e) => e.id === empresaId) ?? empresas[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-foreground transition-colors hover:bg-muted",
          variant === "inline" && "w-full justify-between h-11 lg:h-9"
        )}
      >
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground text-xs">Empresa:</span>
        <span className="font-semibold">{empresa.nome}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Empresa cliente</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {empresas.map((e) => (
          <DropdownMenuItem
            key={e.id}
            onSelect={() => setEmpresa(e.id)}
            className="flex items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{e.nome}</span>
              <span className="text-xs text-muted-foreground">{e.cnpj}</span>
            </div>
            {e.id === empresa.id && <Check className="h-4 w-4 text-accent" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
