"use client";

import { FileDown, FileSpreadsheet, History, Table } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TEMPLATE_VERSION, TEMPLATE_VERSIONS } from "@/lib/constants";
import { CANONICAL_FIELDS } from "@/lib/xlsx/header-mapping";
import { downloadTemplate } from "@/lib/xlsx/template-generator";

export default function TemplatePage() {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <Card className="flex flex-col gap-3 p-4 lg:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft text-accent">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div className="flex flex-1 flex-col">
            <h2 className="text-base font-semibold">
              Template oficial PGISC {TEMPLATE_VERSION}
            </h2>
            <p className="text-xs text-muted-foreground">
              Modelo unico compartilhado entre todas as empresas clientes.
              Alteracoes no template propagam globalmente como campos opcionais
              para clientes antigos e obrigatorios para novos.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="default"
          onClick={() => {
            const r = downloadTemplate();
            toast.success("Template baixado", {
              description: `template-pgisc-${TEMPLATE_VERSION}.xlsx (${(
                r.size / 1024
              ).toFixed(1)} KB)`,
            });
          }}
          className="self-start gap-2"
        >
          <FileDown className="h-4 w-4" />
          Baixar template
        </Button>
      </Card>

      <Card className="p-4 lg:p-6">
        <div className="mb-3 flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Historico de versoes</h2>
        </div>
        <Accordion type="single" collapsible>
          {TEMPLATE_VERSIONS.map((v) => (
            <AccordionItem key={v.versao} value={v.versao}>
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Badge variant="soft">{v.versao}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {v.data}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">{v.mudancas}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      <Card className="p-4 lg:p-6">
        <div className="mb-3 flex items-center gap-2">
          <Table className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">Schema atual</h2>
        </div>
        <ul className="grid gap-2 md:grid-cols-2">
          {CANONICAL_FIELDS.map((f) => (
            <li
              key={f.key}
              className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2"
            >
              <span className="flex flex-col">
                <span className="text-sm font-medium">{f.label}</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {f.key}
                </span>
              </span>
              {f.required ? (
                <Badge variant="warning" className="text-[10px]">
                  Obrigatorio
                </Badge>
              ) : (
                <Badge variant="muted" className="text-[10px]">
                  Opcional
                </Badge>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
