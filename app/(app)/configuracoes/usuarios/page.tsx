"use client";

import * as React from "react";
import { Shield, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DataTable, type ColumnDef } from "@/components/data-table/DataTable";
import { useSettingsStore } from "@/lib/state/settings-store";
import { formatDateTime } from "@/lib/format/date";
import type { RoleUsuario, Usuario } from "@/lib/data/types";

const ROLES: RoleUsuario[] = ["Admin", "Operador", "Visualizador"];

function RoleBadge({ role }: { role: RoleUsuario }) {
  const v: Record<RoleUsuario, "warning" | "soft" | "muted"> = {
    Admin: "warning",
    Operador: "soft",
    Visualizador: "muted",
  };
  return (
    <Badge variant={v[role]} className="gap-1">
      <Shield className="h-3 w-3" />
      {role}
    </Badge>
  );
}

export default function UsuariosPage() {
  const usuarios = useSettingsStore((s) => s.usuarios);
  const updateUsuario = useSettingsStore((s) => s.updateUsuario);

  const [editing, setEditing] = React.useState<Usuario | null>(null);

  const columns: ColumnDef<Usuario>[] = [
    {
      key: "nome",
      header: "Nome",
      accessor: (r) => (
        <div className="flex flex-col">
          <span className="font-medium">{r.nome}</span>
          <span className="text-[11px] text-muted-foreground">{r.email}</span>
        </div>
      ),
      sortValue: (r) => r.nome,
      primary: true,
    },
    // Inline Select column - desktop only. Mobile uses the Sheet via onRowClick.
    {
      key: "role",
      header: "Permissao",
      accessor: (r) => (
        <Select
          value={r.role}
          onValueChange={(v) => {
            updateUsuario(r.id, { role: v as RoleUsuario });
            toast.success("Permissao atualizada", {
              description: `${r.nome} -> ${v}`,
            });
          }}
        >
          <SelectTrigger
            className="h-8 w-36 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
      hideOnMobile: true,
    },
    // Badge column - shown on both, gives mobile users the at-a-glance role.
    {
      key: "role-badge",
      header: "Permissao",
      accessor: (r) => <RoleBadge role={r.role} />,
    },
    {
      key: "ultimo",
      header: "Ultimo acesso",
      accessor: (r) => (
        <span className="text-xs text-muted-foreground">
          {formatDateTime(r.ultimoAcesso)}
        </span>
      ),
      sortValue: (r) => r.ultimoAcesso,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {usuarios.length} usuarios cadastrados
        </p>
        <Button
          type="button"
          variant="default"
          onClick={() =>
            toast("Adicionar usuario", {
              description: "Formulario completo entrara na Fase 2 do escopo.",
            })
          }
          className="gap-2 sm:w-auto"
        >
          <UserPlus className="h-4 w-4" />
          Adicionar usuario
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={usuarios}
        rowKey={(r) => r.id}
        initialSort={{ key: "ultimo", dir: "desc" }}
        onRowClick={setEditing}
      />

      <Sheet
        open={editing !== null}
        onOpenChange={(v) => !v && setEditing(null)}
      >
        <SheetContent side="bottom" className="max-h-[85vh]">
          <SheetHeader>
            <SheetTitle>Editar permissao</SheetTitle>
            {editing && (
              <SheetDescription>
                {editing.nome} - {editing.email}
              </SheetDescription>
            )}
          </SheetHeader>
          <div className="flex flex-col gap-3 px-5 pb-5">
            <Label className="text-xs">Permissao</Label>
            {editing && (
              <Select
                value={editing.role}
                onValueChange={(v) => {
                  const role = v as RoleUsuario;
                  updateUsuario(editing.id, { role });
                  toast.success("Permissao atualizada", {
                    description: `${editing.nome} -> ${role}`,
                  });
                  setEditing({ ...editing, role });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <p className="text-[11px] text-muted-foreground">
              Admin tem acesso total. Operador pode lancar atendimentos.
              Visualizador apenas le os dashboards.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
