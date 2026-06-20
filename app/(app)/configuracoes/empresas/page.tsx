"use client";

import { Building2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnDef } from "@/components/data-table/DataTable";
import { empresas } from "@/lib/data/empresas";
import { formatBRL } from "@/lib/format/currency";
import { formatInteger } from "@/lib/format/number";
import type { Empresa } from "@/lib/data/types";

export default function EmpresasPage() {
  const columns: ColumnDef<Empresa>[] = [
    {
      key: "nome",
      header: "Nome",
      accessor: (r) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{r.nome}</span>
        </div>
      ),
      sortValue: (r) => r.nome,
      primary: true,
    },
    {
      key: "cnpj",
      header: "CNPJ",
      accessor: (r) => <span className="font-mono text-xs">{r.cnpj}</span>,
      hideOnMobile: true,
    },
    {
      key: "ativos",
      header: "Ativos Jan/2026",
      accessor: (r) => formatInteger(r.colaboradoresAtivos["2026-01"]),
      align: "right",
      sortValue: (r) => r.colaboradoresAtivos["2026-01"],
    },
    {
      key: "custo",
      header: "Custo padrao / hora",
      accessor: (r) => formatBRL(r.custoHoraPadrao),
      align: "right",
      sortValue: (r) => r.custoHoraPadrao,
    },
    {
      key: "status",
      header: "Status",
      accessor: () => <Badge variant="success">Ativa</Badge>,
      align: "center",
    },
  ];

  function handleAdd() {
    toast("Adicionar empresa", {
      description: "Formulario completo entrara na Fase 2 do escopo.",
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {empresas.length} empresas cadastradas
        </p>
        <Button
          type="button"
          variant="default"
          onClick={handleAdd}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar empresa
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={empresas}
        rowKey={(r) => r.id}
        initialSort={{ key: "nome", dir: "asc" }}
      />
    </div>
  );
}
