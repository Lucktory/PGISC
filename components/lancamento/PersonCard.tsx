"use client";

import * as React from "react";
import { Briefcase, MapPin, UserCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calcularIdade } from "@/lib/derive/idade";
import {
  calcularTempoEmpresa,
  formatTempoEmpresa,
} from "@/lib/derive/tempo-empresa";
import { formatDate } from "@/lib/format/date";
import { findPessoa, findVinculosByPessoa } from "@/lib/data/pessoas";

interface PersonCardProps {
  prontuario: string;
  referenciaISO?: string;
}

export function PersonCard({ prontuario, referenciaISO }: PersonCardProps) {
  const pessoa = findPessoa(prontuario);
  const vinculos = findVinculosByPessoa(prontuario);
  const vinculoAtual = vinculos[vinculos.length - 1];

  if (!pessoa || !vinculoAtual) {
    return (
      <Card className="border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
        Selecione um prontuario acima para ver os dados da pessoa.
      </Card>
    );
  }

  const idade = calcularIdade(pessoa.dataNascimento, referenciaISO);
  const tempo = formatTempoEmpresa(
    calcularTempoEmpresa(vinculoAtual.dataAdmissao, referenciaISO)
  );

  return (
    <Card className="flex items-start gap-3 p-3 lg:p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
        <UserCircle className="h-5 w-5" />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {pessoa.nome}
          </span>
          <Badge variant="muted" className="font-mono">
            {pessoa.prontuario}
          </Badge>
          <Badge variant="outline">{pessoa.sexo === "F" ? "Feminino" : "Masculino"}</Badge>
          <Badge variant="outline">{idade} anos</Badge>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {vinculoAtual.cargo}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {vinculoAtual.setor}
          </span>
          <span>Admissao {formatDate(vinculoAtual.dataAdmissao)}</span>
          <span>Tempo: {tempo}</span>
        </div>
      </div>
    </Card>
  );
}
