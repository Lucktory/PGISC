"use client";

import * as React from "react";
import { Search, UserCircle, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DataTable, type ColumnDef } from "@/components/data-table/DataTable";
import { VinculosTimeline } from "@/components/configuracoes/VinculosTimeline";
import {
  findVinculosByPessoa,
  pessoas,
} from "@/lib/data/pessoas";
import { calcularIdade } from "@/lib/derive/idade";
import type { Pessoa } from "@/lib/data/types";

export default function PessoasPage() {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState<Pessoa | null>(null);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return pessoas;
    const q = query.toLowerCase().trim();
    return pessoas.filter(
      (p) => p.prontuario.includes(q) || p.nome.toLowerCase().includes(q)
    );
  }, [query]);

  const columns: ColumnDef<Pessoa>[] = [
    {
      key: "prontuario",
      header: "Prontuario",
      accessor: (r) => (
        <Badge variant="muted" className="font-mono">
          {r.prontuario}
        </Badge>
      ),
      sortValue: (r) => r.prontuario,
      hideOnMobile: true,
      width: "7rem",
    },
    {
      key: "nome",
      header: "Nome",
      accessor: (r) => (
        <div className="flex flex-col">
          <span className="font-medium">{r.nome}</span>
          <span className="text-[11px] text-muted-foreground">
            Prontuario {r.prontuario}
          </span>
        </div>
      ),
      sortValue: (r) => r.nome,
      primary: true,
    },
    {
      key: "sexo",
      header: "Sexo",
      accessor: (r) => (r.sexo === "F" ? "Feminino" : "Masculino"),
      align: "center",
      hideOnMobile: true,
    },
    {
      key: "idade",
      header: "Idade",
      accessor: (r) => `${calcularIdade(r.dataNascimento)} anos`,
      align: "right",
      sortValue: (r) => calcularIdade(r.dataNascimento),
    },
    {
      key: "vinculos",
      header: "Vinculos",
      accessor: (r) => (
        <Badge variant="soft">
          {findVinculosByPessoa(r.prontuario).length}
        </Badge>
      ),
      align: "center",
      sortValue: (r) => findVinculosByPessoa(r.prontuario).length,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3 p-4 lg:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold">Registro de pessoas</h2>
          <p className="text-xs text-muted-foreground">
            Prontuario e identidade da pessoa, nao da empresa. Quando uma pessoa
            muda de empresa, o historico de saude e preservado e a plataforma
            reconhece o vinculo anterior automaticamente.
          </p>
        </div>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por prontuario ou nome"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            type="button"
            variant="default"
            onClick={() =>
              toast("Cadastrar pessoa", {
                description: "Formulario completo entrara na Fase 2 do escopo.",
              })
            }
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Adicionar pessoa
          </Button>
        </div>
      </Card>

      <DataTable
        columns={columns}
        data={filtered.slice(0, 60)}
        rowKey={(r) => r.prontuario}
        initialSort={{ key: "vinculos", dir: "desc" }}
        onRowClick={setActive}
        empty="Nenhuma pessoa encontrada para essa busca."
      />

      {filtered.length > 60 && (
        <p className="text-center text-xs text-muted-foreground">
          Mostrando 60 de {filtered.length} pessoas. Refine a busca.
        </p>
      )}

      <Sheet open={active !== null} onOpenChange={(v) => !v && setActive(null)}>
        <SheetContent side="right" className="w-full max-w-md overflow-y-auto p-0">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-accent" />
                  {active.nome}
                </SheetTitle>
                <SheetDescription>
                  Prontuario {active.prontuario} - {active.sexo === "F" ? "Feminino" : "Masculino"} - {calcularIdade(active.dataNascimento)} anos
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-5 px-5 pb-6">
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Vinculos historicos
                  </h3>
                  <VinculosTimeline
                    vinculos={findVinculosByPessoa(active.prontuario)}
                  />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
