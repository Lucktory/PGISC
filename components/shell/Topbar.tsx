"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmpresaSelector } from "@/components/filters/EmpresaSelector";
import { PeriodoSelector } from "@/components/filters/PeriodoSelector";
import {
  FiltrosSheet,
  FiltrosSheetTrigger,
} from "@/components/filters/FiltrosSheet";
import { UserMenu } from "./UserMenu";
import { cn } from "@/lib/utils";

function openCmdK() {
  window.dispatchEvent(new CustomEvent("pgisc:open-cmdk"));
}

export interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showFilters?: boolean;
  className?: string;
}

export function Topbar({
  title,
  subtitle,
  actions,
  showFilters = true,
  className,
}: TopbarProps) {
  const [filtrosOpen, setFiltrosOpen] = React.useState(false);

  return (
    <div className={cn("border-b border-border bg-background", className)}>
      {/* Mobile bar (compact) */}
      <div className="flex h-14 items-center justify-between gap-2 px-4 lg:hidden">
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight leading-tight">
            {title}
          </span>
          {subtitle && (
            <span className="text-[11px] text-muted-foreground leading-tight">
              {subtitle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={openCmdK}
            aria-label="Abrir paleta de comandos"
          >
            <Search className="h-4 w-4" />
          </Button>
          <UserMenu />
        </div>
      </div>

      {/* Mobile filters row (below the bar) */}
      {showFilters && (
        <div className="flex items-center gap-2 px-4 pb-3 lg:hidden">
          <FiltrosSheetTrigger onClick={() => setFiltrosOpen(true)} />
        </div>
      )}

      {/* Desktop bar */}
      <div className="hidden h-auto items-center justify-between gap-4 px-8 py-5 lg:flex">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showFilters && (
            <>
              <EmpresaSelector />
              <PeriodoSelector />
            </>
          )}
          {actions}
          <Button
            type="button"
            variant="outline"
            onClick={openCmdK}
            aria-label="Abrir paleta de comandos"
            className="gap-2 px-3 text-xs text-muted-foreground"
          >
            <Search className="h-4 w-4" />
            <span>Buscar</span>
            <kbd className="ml-2 rounded border border-border bg-muted/40 px-1.5 py-0.5 font-mono text-[10px]">
              Ctrl K
            </kbd>
          </Button>
          <UserMenu />
        </div>
      </div>

      <FiltrosSheet open={filtrosOpen} onOpenChange={setFiltrosOpen} />
    </div>
  );
}
