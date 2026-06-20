export const cargosPorSetor: Record<string, string[]> = {
  Costura: ["Costureira", "Costureira Pleno", "Encarregada de Costura"],
  Marcenaria: ["Marceneiro", "Marceneiro Senior", "Auxiliar de Marcenaria"],
  Embalagem: ["Embalador", "Operador de Embalagem"],
  Administracao: [
    "Auxiliar Administrativo",
    "Analista Administrativo",
    "Assistente Financeiro",
  ],
  Lixa: ["Lixador", "Operador de Lixa"],
  Tapecaria: ["Tapeceiro", "Auxiliar de Tapecaria"],
  Montagem: ["Montador", "Montador Pleno"],
  Preparacao: ["Preparador", "Auxiliar de Preparacao"],
  Acabamento: ["Acabador", "Auxiliar de Acabamento"],
  Estofamento: ["Estofador", "Auxiliar de Estofamento"],
  Almoxarifado: ["Almoxarife", "Conferente"],
  Expedicao: ["Auxiliar de Expedicao", "Conferente de Expedicao"],
  Qualidade: ["Inspetor de Qualidade", "Analista de Qualidade"],
  Manutencao: ["Mecanico de Manutencao", "Eletricista"],
};

export const todosCargos: string[] = Array.from(
  new Set(Object.values(cargosPorSetor).flat())
).sort();
