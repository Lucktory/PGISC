"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { todosCargos } from "@/lib/data/cargos";
import { useSettingsStore } from "@/lib/state/settings-store";
import { formatBRL } from "@/lib/format/currency";

export default function CustosPage() {
  const custos = useSettingsStore((s) => s.custoHoraPorCargo);
  const setCustoCargo = useSettingsStore((s) => s.setCustoCargo);
  const removeCustoCargo = useSettingsStore((s) => s.removeCustoCargo);

  const [novoCargo, setNovoCargo] = React.useState<string>("");
  const [novoValor, setNovoValor] = React.useState<string>("");

  const entries = Object.entries(custos).sort((a, b) => a[0].localeCompare(b[0]));
  const media =
    entries.length > 0
      ? entries.reduce((a, [, v]) => a + v, 0) / entries.length
      : 0;

  function handleAdd() {
    if (!novoCargo || !novoValor) return;
    const valor = Number(novoValor);
    if (!Number.isFinite(valor) || valor < 0) {
      toast.error("Informe um valor valido");
      return;
    }
    setCustoCargo(novoCargo, valor);
    toast.success("Custo cadastrado", {
      description: `${novoCargo}: ${formatBRL(valor)}/h`,
    });
    setNovoCargo("");
    setNovoValor("");
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3 p-4 lg:p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold">
            Custo por hora trabalhada por cargo
          </h2>
          <p className="text-xs text-muted-foreground">
            Estes valores alimentam o calculo de custo do absenteismo no
            Dashboard Financeiro. Cargos sem valor definido usam o custo
            padrao da empresa.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-md border border-dashed border-border bg-muted/20 p-3 lg:flex-row lg:items-end">
          <div className="flex flex-1 flex-col gap-1">
            <Label className="text-xs">Cargo</Label>
            <Select value={novoCargo} onValueChange={setNovoCargo}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                {todosCargos.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs">Custo / hora (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min={0}
              value={novoValor}
              onChange={(e) => setNovoValor(e.target.value)}
              placeholder="0,00"
              className="lg:w-36"
            />
          </div>
          <Button type="button" variant="default" onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar / atualizar
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border bg-muted/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Tabela de custos
        </div>
        <ul className="flex flex-col">
          {entries.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">
              Nenhum custo cadastrado.
            </li>
          )}
          {entries.map(([cargo, valor]) => (
            <li
              key={cargo}
              className="flex items-center gap-3 border-b border-border px-4 py-2 last:border-b-0"
            >
              <span className="flex-1 text-sm">{cargo}</span>
              <Input
                type="number"
                step="0.01"
                min={0}
                value={valor}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (Number.isFinite(v) && v >= 0) {
                    setCustoCargo(cargo, v);
                  }
                }}
                className="w-28 text-right"
              />
              <span className="w-24 text-right text-xs text-muted-foreground">
                {formatBRL(valor)}/h
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeCustoCargo(cargo)}
                aria-label={`Remover ${cargo}`}
              >
                <Trash2 className="h-4 w-4 text-danger" />
              </Button>
            </li>
          ))}
        </ul>
        {entries.length > 0 && (
          <div className="border-t border-border bg-muted/20 px-4 py-2 text-right text-xs text-muted-foreground">
            Media:{" "}
            <span className="font-semibold text-foreground">
              {formatBRL(media)}
            </span>{" "}
            / hora ({entries.length} cargos cadastrados)
          </div>
        )}
      </Card>
    </div>
  );
}
