"use client";

import { Filter, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChipsProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

export function SetorCargoChips({
  label,
  options,
  selected,
  onChange,
}: ChipsProps) {
  function toggle(opt: string) {
    if (selected.includes(opt)) onChange(selected.filter((s) => s !== opt));
    else onChange([...selected, opt]);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        </div>
        {selected.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange([])}
            className="h-auto gap-1 px-2 py-1 text-[11px]"
          >
            <X className="h-3 w-3" />
            Limpar ({selected.length})
          </Button>
        )}
      </div>
      <div className="-mx-1 flex snap-x snap-mandatory gap-1.5 overflow-x-auto px-1 pb-1">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={cn(
                "shrink-0 snap-start rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                active
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ActiveFilterBadges({
  setores,
  cargos,
  onClearSetor,
  onClearCargo,
}: {
  setores: string[];
  cargos: string[];
  onClearSetor: (s: string) => void;
  onClearCargo: (c: string) => void;
}) {
  if (setores.length === 0 && cargos.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {setores.map((s) => (
        <Badge
          key={`setor-${s}`}
          variant="soft"
          className="cursor-pointer"
        >
          {s}
          <button
            type="button"
            onClick={() => onClearSetor(s)}
            aria-label={`Remover filtro ${s}`}
            className="ml-1"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {cargos.map((c) => (
        <Badge
          key={`cargo-${c}`}
          variant="muted"
          className="cursor-pointer"
        >
          {c}
          <button
            type="button"
            onClick={() => onClearCargo(c)}
            aria-label={`Remover filtro ${c}`}
            className="ml-1"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
