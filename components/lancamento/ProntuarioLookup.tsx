"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, UserCircle } from "lucide-react";

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
import { findPessoa, searchPessoas } from "@/lib/data/pessoas";
import { cn } from "@/lib/utils";

interface ProntuarioLookupProps {
  value: string;
  onChange: (prontuario: string) => void;
}

export function ProntuarioLookup({ value, onChange }: ProntuarioLookupProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const selected = value ? findPessoa(value) : undefined;
  const results = React.useMemo(() => searchPessoas(query, 12), [query]);

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
            {selected ? (
              <>
                <UserCircle className="h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  {selected.prontuario}
                </span>
                <span className="truncate text-sm text-muted-foreground">
                  {selected.nome}
                </span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm">Numero do prontuario ou nome</span>
              </>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] max-w-md p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Digite numero do prontuario ou nome"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>
              Sem resultados. Use o botao &quot;Cadastrar nova pessoa&quot;.
            </CommandEmpty>
            <CommandGroup heading={`${results.length} pessoas`}>
              {results.map((p) => (
                <CommandItem
                  key={p.prontuario}
                  value={p.prontuario}
                  onSelect={() => {
                    onChange(p.prontuario);
                    setOpen(false);
                  }}
                >
                  <UserCircle className="h-4 w-4" />
                  <span className="flex flex-col">
                    <span className="text-sm font-medium">{p.nome}</span>
                    <span className="text-[11px] text-muted-foreground">
                      Prontuario {p.prontuario}
                    </span>
                  </span>
                  {p.prontuario === value && (
                    <Check className="ml-auto h-4 w-4 text-accent" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
