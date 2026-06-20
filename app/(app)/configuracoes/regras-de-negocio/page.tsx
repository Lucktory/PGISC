"use client";

import { Calculator, Layers, Repeat, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSettingsStore } from "@/lib/state/settings-store";

export default function RegrasPage() {
  const recorrenteThreshold = useSettingsStore((s) => s.recorrenteThreshold);
  const setRecorrenteThreshold = useSettingsStore(
    (s) => s.setRecorrenteThreshold
  );
  const cidGrouping = useSettingsStore((s) => s.cidGrouping);
  const setCidGrouping = useSettingsStore((s) => s.setCidGrouping);
  const iiosFormulaLabel = useSettingsStore((s) => s.iiosFormulaLabel);

  function handleSave() {
    toast.success("Regras salvas", {
      description:
        "As alteracoes ja afetam o calculo dos dashboards no recarregamento.",
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3 p-4 lg:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-soft text-accent">
            <Calculator className="h-4 w-4" />
          </div>
          <div className="flex flex-1 flex-col">
            <h2 className="text-sm font-semibold">Formula do IIOS</h2>
            <p className="text-xs text-muted-foreground">
              Indice de Impacto Operacional da Saude. Editavel mediante
              alinhamento com seu time SST.
            </p>
          </div>
        </div>
        <Input value={iiosFormulaLabel} readOnly className="bg-muted/30" />
      </Card>

      <Card className="flex flex-col gap-3 p-4 lg:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-soft text-accent">
            <Repeat className="h-4 w-4" />
          </div>
          <div className="flex flex-1 flex-col">
            <h2 className="text-sm font-semibold">
              Definicao de colaborador recorrente
            </h2>
            <p className="text-xs text-muted-foreground">
              Quantos atendimentos no periodo classificam um colaborador como
              recorrente?
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min={1}
            value={recorrenteThreshold}
            onChange={(e) => setRecorrenteThreshold(Number(e.target.value) || 1)}
            className="w-28"
          />
          <span className="text-xs text-muted-foreground">
            atendimentos ou mais
          </span>
        </div>
      </Card>

      <Card className="flex flex-col gap-3 p-4 lg:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent-soft text-accent">
            <Layers className="h-4 w-4" />
          </div>
          <div className="flex flex-1 flex-col">
            <h2 className="text-sm font-semibold">Agrupamento CID</h2>
            <p className="text-xs text-muted-foreground">
              Nivel de detalhe usado nos charts epidemiologicos.
            </p>
          </div>
        </div>
        <RadioGroup
          value={cidGrouping}
          onValueChange={(v) => setCidGrouping(v as "capitulo" | "bloco")}
          className="gap-2"
        >
          <Label
            htmlFor="g-cap"
            className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card p-3"
          >
            <RadioGroupItem id="g-cap" value="capitulo" />
            <span className="text-sm">
              Capitulo (A00-B99, C00-D49, ...){" "}
              <span className="text-xs text-muted-foreground">
                - menos granular
              </span>
            </span>
          </Label>
          <Label
            htmlFor="g-blo"
            className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card p-3"
          >
            <RadioGroupItem id="g-blo" value="bloco" />
            <span className="text-sm">
              Bloco (M50-M54, F40-F48, ...){" "}
              <span className="text-xs text-muted-foreground">
                - mais granular
              </span>
            </span>
          </Label>
        </RadioGroup>
      </Card>

      <Button
        type="button"
        variant="default"
        onClick={handleSave}
        className="gap-2 self-start"
      >
        <Save className="h-4 w-4" />
        Salvar regras
      </Button>
    </div>
  );
}
