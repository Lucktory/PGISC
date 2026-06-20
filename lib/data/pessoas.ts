import { pereiraJan2026 } from "./pereira-jan-2026";
import { pereiraDez2025 } from "./pereira-dez-2025";
import { pereiraNov2025 } from "./pereira-nov-2025";
import type { Pessoa, VinculoEmpresa } from "./types";

const todosAtendimentos = [
  ...pereiraNov2025,
  ...pereiraDez2025,
  ...pereiraJan2026,
];

const mapaPessoas = new Map<string, Pessoa>();
const mapaVinculos = new Map<string, VinculoEmpresa>();

for (const a of todosAtendimentos) {
  if (!mapaPessoas.has(a.prontuario)) {
    mapaPessoas.set(a.prontuario, {
      prontuario: a.prontuario,
      nome: a.nome,
      sexo: a.sexo,
      dataNascimento: a.dataNascimento,
    });
  }
  const vinculoKey = `${a.prontuario}-${a.empresaId}`;
  if (!mapaVinculos.has(vinculoKey)) {
    mapaVinculos.set(vinculoKey, {
      prontuario: a.prontuario,
      empresaId: a.empresaId,
      cargo: a.cargo,
      setor: a.setor,
      dataAdmissao: a.dataAdmissao,
    });
  }
}

export const pessoas: Pessoa[] = Array.from(mapaPessoas.values()).sort((a, b) =>
  Number(a.prontuario) - Number(b.prontuario)
);

export const vinculos: VinculoEmpresa[] = Array.from(mapaVinculos.values());

export function findPessoa(prontuario: string): Pessoa | undefined {
  return mapaPessoas.get(prontuario);
}

export function findVinculosByPessoa(prontuario: string): VinculoEmpresa[] {
  return vinculos.filter((v) => v.prontuario === prontuario);
}

export function searchPessoas(query: string, limit = 8): Pessoa[] {
  if (!query.trim()) return pessoas.slice(0, limit);
  const q = query.toLowerCase().trim();
  return pessoas
    .filter(
      (p) =>
        p.prontuario.includes(q) ||
        p.nome.toLowerCase().includes(q)
    )
    .slice(0, limit);
}
