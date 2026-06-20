"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { cid10, findCid } from "@/lib/data/cid10-reference";
import type { Cid } from "@/lib/data/types";

interface CidAutocompleteProps {
  value: string;
  onChange: (codigo: string) => void;
  placeholder?: string;
}

export function CidAutocomplete({
  value,
  onChange,
  placeholder = "Buscar CID...",
}: CidAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const selected = value ? findCid(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-11 w-full justify-between text-left lg:h-10",
            !selected && "text-muted-foreground"
          )}
        >
          <span className="flex items-center gap-2 truncate">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            {selected ? (
              <>
                <Badge variant="soft" className="font-mono text-[10px]">
                  {selected.codigo}
                </Badge>
                <span className="truncate text-sm">{selected.nome}</span>
              </>
            ) : (
              <span className="text-sm">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] max-w-md p-0">
        <Command
          filter={(value, search) => {
            const cid = cid10.find((c) => c.codigo === value);
            if (!cid) return 0;
            const haystack = `${cid.codigo} ${cid.nome} ${cid.bloco} ${cid.capituloNome}`.toLowerCase();
            return haystack.includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder="Codigo ou nome da CID..." />
          <CommandList>
            <CommandEmpty>Nenhuma CID encontrada.</CommandEmpty>
            <CommandGroup heading="CIDs disponiveis">
              {cid10.map((cid) => (
                <CidOption
                  key={cid.codigo}
                  cid={cid}
                  selected={cid.codigo === value}
                  onSelect={() => {
                    onChange(cid.codigo);
                    setOpen(false);
                  }}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CidOption({
  cid,
  selected,
  onSelect,
}: {
  cid: Cid;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <CommandItem value={cid.codigo} onSelect={onSelect}>
      <Badge variant="soft" className="w-16 justify-center font-mono text-[10px]">
        {cid.codigo}
      </Badge>
      <span className="flex flex-col">
        <span className="text-sm">{cid.nome}</span>
        <span className="text-[11px] text-muted-foreground">
          {cid.capituloNome}
        </span>
      </span>
      {selected && <Check className="ml-auto h-4 w-4 text-accent" />}
    </CommandItem>
  );
}
