import { Building2, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { empresas } from "@/lib/data/empresas";
import { formatDate } from "@/lib/format/date";
import type { VinculoEmpresa } from "@/lib/data/types";

interface VinculosTimelineProps {
  vinculos: VinculoEmpresa[];
}

export function VinculosTimeline({ vinculos }: VinculosTimelineProps) {
  if (vinculos.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Sem vinculos registrados.
      </p>
    );
  }
  const sorted = [...vinculos].sort((a, b) =>
    b.dataAdmissao.localeCompare(a.dataAdmissao)
  );
  return (
    <ol className="flex flex-col gap-3 border-l border-border pl-4">
      {sorted.map((v, i) => {
        const empresa = empresas.find((e) => e.id === v.empresaId);
        return (
          <li key={`${v.empresaId}-${v.dataAdmissao}-${i}`} className="relative">
            <span className="absolute -left-[21px] top-1 inline-block h-3 w-3 rounded-full border-2 border-accent bg-card" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold">
                  {empresa?.nome ?? v.empresaId}
                </span>
                {!v.dataSaida && <Badge variant="success" className="text-[10px]">Ativo</Badge>}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Admissao {formatDate(v.dataAdmissao)}
                </span>
                {v.dataSaida && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Saida {formatDate(v.dataSaida)}
                  </span>
                )}
                <span>{v.cargo}</span>
                <span>{v.setor}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
