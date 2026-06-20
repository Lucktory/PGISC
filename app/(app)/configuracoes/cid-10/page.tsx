"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable, type ColumnDef } from "@/components/data-table/DataTable";
import { cid10 } from "@/lib/data/cid10-reference";
import type { Cid } from "@/lib/data/types";

export default function Cid10Page() {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(0);
  const pageSize = 25;

  const filtered = React.useMemo(() => {
    if (!query.trim()) return cid10;
    const q = query.toLowerCase().trim();
    return cid10.filter(
      (c) =>
        c.codigo.toLowerCase().includes(q) ||
        c.nome.toLowerCase().includes(q) ||
        c.bloco.toLowerCase().includes(q) ||
        c.capituloNome.toLowerCase().includes(q)
    );
  }, [query]);

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  React.useEffect(() => setPage(0), [query]);

  const columns: ColumnDef<Cid>[] = [
    {
      key: "codigo",
      header: "CID",
      accessor: (r) => (
        <Badge variant="soft" className="font-mono">
          {r.codigo}
        </Badge>
      ),
      sortValue: (r) => r.codigo,
      width: "5rem",
    },
    {
      key: "nome",
      header: "Descricao",
      accessor: (r) => r.nome,
      sortValue: (r) => r.nome,
      primary: true,
    },
    {
      key: "bloco",
      header: "Bloco",
      accessor: (r) => r.bloco,
      sortValue: (r) => r.bloco,
      hideOnMobile: true,
    },
    {
      key: "cap",
      header: "Capitulo",
      accessor: (r) => `${r.capitulo} - ${r.capituloNome}`,
      sortValue: (r) => r.capitulo,
      hideOnMobile: true,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-3 lg:p-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold">Referencia CID-10</h2>
          <p className="text-xs text-muted-foreground">
            Base curada com {cid10.length} codigos mais relevantes para saude
            ocupacional. A versao completa (~12 mil) e disponibilizada via
            integracao na producao.
          </p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por codigo, nome ou capitulo"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paged}
        rowKey={(r) => r.codigo}
        initialSort={{ key: "codigo", dir: "asc" }}
        empty="Nenhum CID encontrado para essa busca."
      />

      {filtered.length > pageSize && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Pagina {page + 1} de {totalPages} - {filtered.length} resultados
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-md border border-border bg-card px-3 py-1 disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-md border border-border bg-card px-3 py-1 disabled:opacity-40"
            >
              Proxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
