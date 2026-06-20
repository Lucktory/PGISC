import type { Cid } from "./types";

const C = {
  I: { num: "I", nome: "Doencas infecciosas e parasitarias" },
  II: { num: "II", nome: "Neoplasias" },
  III: { num: "III", nome: "Doencas do sangue e do sistema imunologico" },
  IV: { num: "IV", nome: "Doencas endocrinas, nutricionais e metabolicas" },
  V: { num: "V", nome: "Transtornos mentais e comportamentais" },
  VI: { num: "VI", nome: "Doencas do sistema nervoso" },
  VII: { num: "VII", nome: "Doencas do olho e anexos" },
  VIII: { num: "VIII", nome: "Doencas do ouvido e da apofise mastoide" },
  IX: { num: "IX", nome: "Doencas do aparelho circulatorio" },
  X: { num: "X", nome: "Doencas do aparelho respiratorio" },
  XI: { num: "XI", nome: "Doencas do aparelho digestivo" },
  XII: { num: "XII", nome: "Doencas da pele e do tecido subcutaneo" },
  XIII: {
    num: "XIII",
    nome: "Doencas do sistema osteomuscular e tecido conjuntivo",
  },
  XIV: { num: "XIV", nome: "Doencas do aparelho geniturinario" },
  XVIII: { num: "XVIII", nome: "Sintomas, sinais e achados anormais" },
  XIX: {
    num: "XIX",
    nome: "Lesoes, envenenamento e causas externas",
  },
  XXI: {
    num: "XXI",
    nome: "Fatores que influenciam o estado de saude",
  },
} as const;

export const cid10: Cid[] = [
  // Capitulo XXI - Fatores que influenciam o estado de saude (Z)
  { codigo: "Z00.0", nome: "Exame medico geral", capitulo: C.XXI.num, capituloNome: C.XXI.nome, bloco: "Z00-Z13" },
  { codigo: "Z00.6", nome: "Exame para comparacao normal de desenvolvimento", capitulo: C.XXI.num, capituloNome: C.XXI.nome, bloco: "Z00-Z13" },
  { codigo: "Z01.0", nome: "Exame dos olhos e da visao", capitulo: C.XXI.num, capituloNome: C.XXI.nome, bloco: "Z00-Z13" },
  { codigo: "Z01.5", nome: "Testes diagnosticos e de sensibilizacao cutanea", capitulo: C.XXI.num, capituloNome: C.XXI.nome, bloco: "Z00-Z13" },
  { codigo: "Z02.1", nome: "Exame pre-admissional ao trabalho", capitulo: C.XXI.num, capituloNome: C.XXI.nome, bloco: "Z00-Z13" },
  { codigo: "Z02.7", nome: "Emissao de atestado medico", capitulo: C.XXI.num, capituloNome: C.XXI.nome, bloco: "Z00-Z13" },
  { codigo: "Z03.9", nome: "Observacao por suspeita nao especificada", capitulo: C.XXI.num, capituloNome: C.XXI.nome, bloco: "Z00-Z13" },
  { codigo: "Z10.0", nome: "Exame de saude ocupacional", capitulo: C.XXI.num, capituloNome: C.XXI.nome, bloco: "Z00-Z13" },
  { codigo: "Z13.6", nome: "Exame especial de rastreamento cardiovascular", capitulo: C.XXI.num, capituloNome: C.XXI.nome, bloco: "Z00-Z13" },
  { codigo: "Z71.3", nome: "Aconselhamento dietetico", capitulo: C.XXI.num, capituloNome: C.XXI.nome, bloco: "Z70-Z76" },
  { codigo: "Z73.0", nome: "Esgotamento (burnout)", capitulo: C.XXI.num, capituloNome: C.XXI.nome, bloco: "Z70-Z76" },
  { codigo: "Z76.3", nome: "Pessoa em boa saude acompanhando enfermo", capitulo: C.XXI.num, capituloNome: C.XXI.nome, bloco: "Z70-Z76" },
  { codigo: "Z76.5", nome: "Simulacao consciente (simulador)", capitulo: C.XXI.num, capituloNome: C.XXI.nome, bloco: "Z70-Z76" },

  // Capitulo V - Transtornos mentais (F)
  { codigo: "F32.0", nome: "Episodio depressivo leve", capitulo: C.V.num, capituloNome: C.V.nome, bloco: "F30-F39" },
  { codigo: "F32.1", nome: "Episodio depressivo moderado", capitulo: C.V.num, capituloNome: C.V.nome, bloco: "F30-F39" },
  { codigo: "F33.1", nome: "Transtorno depressivo recorrente, moderado", capitulo: C.V.num, capituloNome: C.V.nome, bloco: "F30-F39" },
  { codigo: "F40.1", nome: "Fobias sociais", capitulo: C.V.num, capituloNome: C.V.nome, bloco: "F40-F48" },
  { codigo: "F41", nome: "Outros transtornos ansiosos", capitulo: C.V.num, capituloNome: C.V.nome, bloco: "F40-F48" },
  { codigo: "F41.0", nome: "Transtorno de panico", capitulo: C.V.num, capituloNome: C.V.nome, bloco: "F40-F48" },
  { codigo: "F41.1", nome: "Ansiedade generalizada", capitulo: C.V.num, capituloNome: C.V.nome, bloco: "F40-F48" },
  { codigo: "F41.2", nome: "Transtorno misto ansioso e depressivo", capitulo: C.V.num, capituloNome: C.V.nome, bloco: "F40-F48" },
  { codigo: "F43.0", nome: "Reacao aguda ao estresse", capitulo: C.V.num, capituloNome: C.V.nome, bloco: "F40-F48" },
  { codigo: "F43.2", nome: "Transtorno de adaptacao", capitulo: C.V.num, capituloNome: C.V.nome, bloco: "F40-F48" },
  { codigo: "F45.0", nome: "Transtorno de somatizacao", capitulo: C.V.num, capituloNome: C.V.nome, bloco: "F40-F48" },
  { codigo: "F51.0", nome: "Insonia nao organica", capitulo: C.V.num, capituloNome: C.V.nome, bloco: "F50-F59" },

  // Capitulo XIII - Sistema osteomuscular (M)
  { codigo: "M25.5", nome: "Dor articular", capitulo: C.XIII.num, capituloNome: C.XIII.nome, bloco: "M20-M25" },
  { codigo: "M54.2", nome: "Cervicalgia", capitulo: C.XIII.num, capituloNome: C.XIII.nome, bloco: "M50-M54" },
  { codigo: "M54.4", nome: "Lumbago com ciatica", capitulo: C.XIII.num, capituloNome: C.XIII.nome, bloco: "M50-M54" },
  { codigo: "M54.5", nome: "Dor lombar baixa", capitulo: C.XIII.num, capituloNome: C.XIII.nome, bloco: "M50-M54" },
  { codigo: "M54.6", nome: "Dor na coluna toracica", capitulo: C.XIII.num, capituloNome: C.XIII.nome, bloco: "M50-M54" },
  { codigo: "M65.9", nome: "Sinovite e tenossinovite nao especificada", capitulo: C.XIII.num, capituloNome: C.XIII.nome, bloco: "M60-M79" },
  { codigo: "M70.9", nome: "Lesao tecidos moles por uso excessivo", capitulo: C.XIII.num, capituloNome: C.XIII.nome, bloco: "M60-M79" },
  { codigo: "M75.1", nome: "Sindrome do manguito rotador", capitulo: C.XIII.num, capituloNome: C.XIII.nome, bloco: "M60-M79" },
  { codigo: "M77.0", nome: "Epicondilite medial", capitulo: C.XIII.num, capituloNome: C.XIII.nome, bloco: "M60-M79" },
  { codigo: "M79.1", nome: "Mialgia", capitulo: C.XIII.num, capituloNome: C.XIII.nome, bloco: "M60-M79" },
  { codigo: "M79.6", nome: "Dor em membro", capitulo: C.XIII.num, capituloNome: C.XIII.nome, bloco: "M60-M79" },

  // Capitulo XIX - Lesoes e causas externas (S)
  { codigo: "S00.9", nome: "Traumatismo superficial da cabeca", capitulo: C.XIX.num, capituloNome: C.XIX.nome, bloco: "S00-S09" },
  { codigo: "S60.0", nome: "Contusao de dedo da mao", capitulo: C.XIX.num, capituloNome: C.XIX.nome, bloco: "S60-S69" },
  { codigo: "S61.0", nome: "Ferimento de dedo sem lesao da unha", capitulo: C.XIX.num, capituloNome: C.XIX.nome, bloco: "S60-S69" },
  { codigo: "S62.5", nome: "Fratura do polegar", capitulo: C.XIX.num, capituloNome: C.XIX.nome, bloco: "S60-S69" },
  { codigo: "S81.0", nome: "Ferimento aberto do joelho", capitulo: C.XIX.num, capituloNome: C.XIX.nome, bloco: "S80-S89" },
  { codigo: "S83.5", nome: "Entorse do joelho", capitulo: C.XIX.num, capituloNome: C.XIX.nome, bloco: "S80-S89" },
  { codigo: "S90.0", nome: "Contusao do tornozelo", capitulo: C.XIX.num, capituloNome: C.XIX.nome, bloco: "S90-S99" },
  { codigo: "S90.3", nome: "Contusao de partes do pe", capitulo: C.XIX.num, capituloNome: C.XIX.nome, bloco: "S90-S99" },
  { codigo: "S93.4", nome: "Entorse do tornozelo", capitulo: C.XIX.num, capituloNome: C.XIX.nome, bloco: "S90-S99" },
  { codigo: "T14.0", nome: "Traumatismo superficial nao especificado", capitulo: C.XIX.num, capituloNome: C.XIX.nome, bloco: "T08-T14" },

  // Capitulo X - Respiratorio (J)
  { codigo: "J00", nome: "Nasofaringite aguda (resfriado comum)", capitulo: C.X.num, capituloNome: C.X.nome, bloco: "J00-J06" },
  { codigo: "J02.9", nome: "Faringite aguda nao especificada", capitulo: C.X.num, capituloNome: C.X.nome, bloco: "J00-J06" },
  { codigo: "J03.9", nome: "Amigdalite aguda nao especificada", capitulo: C.X.num, capituloNome: C.X.nome, bloco: "J00-J06" },
  { codigo: "J06.9", nome: "Infeccao aguda das vias aereas superiores", capitulo: C.X.num, capituloNome: C.X.nome, bloco: "J00-J06" },
  { codigo: "J11.1", nome: "Influenza com outras manifestacoes respiratorias", capitulo: C.X.num, capituloNome: C.X.nome, bloco: "J09-J18" },
  { codigo: "J20.9", nome: "Bronquite aguda nao especificada", capitulo: C.X.num, capituloNome: C.X.nome, bloco: "J20-J22" },
  { codigo: "J30.4", nome: "Rinite alergica nao especificada", capitulo: C.X.num, capituloNome: C.X.nome, bloco: "J30-J39" },
  { codigo: "J45.9", nome: "Asma nao especificada", capitulo: C.X.num, capituloNome: C.X.nome, bloco: "J40-J47" },

  // Capitulo XVIII - Sintomas e sinais (R)
  { codigo: "R05", nome: "Tosse", capitulo: C.XVIII.num, capituloNome: C.XVIII.nome, bloco: "R00-R09" },
  { codigo: "R10.4", nome: "Dor abdominal nao especificada", capitulo: C.XVIII.num, capituloNome: C.XVIII.nome, bloco: "R10-R19" },
  { codigo: "R11", nome: "Nausea e vomitos", capitulo: C.XVIII.num, capituloNome: C.XVIII.nome, bloco: "R10-R19" },
  { codigo: "R42", nome: "Tontura e instabilidade", capitulo: C.XVIII.num, capituloNome: C.XVIII.nome, bloco: "R40-R46" },
  { codigo: "R50.9", nome: "Febre nao especificada", capitulo: C.XVIII.num, capituloNome: C.XVIII.nome, bloco: "R50-R69" },
  { codigo: "R51", nome: "Cefaleia", capitulo: C.XVIII.num, capituloNome: C.XVIII.nome, bloco: "R50-R69" },
  { codigo: "R53", nome: "Mal estar e fadiga", capitulo: C.XVIII.num, capituloNome: C.XVIII.nome, bloco: "R50-R69" },

  // Capitulo XI - Digestivo (K)
  { codigo: "K02.9", nome: "Carie dentaria nao especificada", capitulo: C.XI.num, capituloNome: C.XI.nome, bloco: "K00-K14" },
  { codigo: "K08.1", nome: "Perda de dentes por extracao", capitulo: C.XI.num, capituloNome: C.XI.nome, bloco: "K00-K14" },
  { codigo: "K29.7", nome: "Gastrite nao especificada", capitulo: C.XI.num, capituloNome: C.XI.nome, bloco: "K20-K31" },
  { codigo: "K30", nome: "Dispepsia", capitulo: C.XI.num, capituloNome: C.XI.nome, bloco: "K20-K31" },
  { codigo: "K59.0", nome: "Constipacao", capitulo: C.XI.num, capituloNome: C.XI.nome, bloco: "K55-K64" },

  // Capitulo IX - Circulatorio (I)
  { codigo: "I10", nome: "Hipertensao essencial primaria", capitulo: C.IX.num, capituloNome: C.IX.nome, bloco: "I10-I15" },
  { codigo: "I20.9", nome: "Angina pectoris nao especificada", capitulo: C.IX.num, capituloNome: C.IX.nome, bloco: "I20-I25" },
  { codigo: "I83.9", nome: "Varizes dos membros inferiores", capitulo: C.IX.num, capituloNome: C.IX.nome, bloco: "I80-I89" },

  // Capitulo IV - Endocrinas (E)
  { codigo: "E11.9", nome: "Diabetes mellitus tipo 2 nao especificada", capitulo: C.IV.num, capituloNome: C.IV.nome, bloco: "E10-E14" },
  { codigo: "E66.0", nome: "Obesidade por excesso de calorias", capitulo: C.IV.num, capituloNome: C.IV.nome, bloco: "E65-E68" },
  { codigo: "E78.5", nome: "Hiperlipidemia nao especificada", capitulo: C.IV.num, capituloNome: C.IV.nome, bloco: "E70-E90" },

  // Capitulo VI - Sistema nervoso (G)
  { codigo: "G43.9", nome: "Enxaqueca nao especificada", capitulo: C.VI.num, capituloNome: C.VI.nome, bloco: "G40-G47" },
  { codigo: "G47.0", nome: "Disturbios do inicio e da manutencao do sono", capitulo: C.VI.num, capituloNome: C.VI.nome, bloco: "G40-G47" },
  { codigo: "G56.0", nome: "Sindrome do tunel do carpo", capitulo: C.VI.num, capituloNome: C.VI.nome, bloco: "G50-G59" },

  // Capitulo VII - Olho (H)
  { codigo: "H10.9", nome: "Conjuntivite nao especificada", capitulo: C.VII.num, capituloNome: C.VII.nome, bloco: "H10-H13" },
  { codigo: "H52.1", nome: "Miopia", capitulo: C.VII.num, capituloNome: C.VII.nome, bloco: "H49-H52" },

  // Capitulo VIII - Ouvido (H)
  { codigo: "H66.9", nome: "Otite media nao especificada", capitulo: C.VIII.num, capituloNome: C.VIII.nome, bloco: "H65-H75" },
  { codigo: "H81.1", nome: "Vertigem postural paroxistica benigna", capitulo: C.VIII.num, capituloNome: C.VIII.nome, bloco: "H80-H83" },

  // Capitulo XII - Pele (L)
  { codigo: "L20.9", nome: "Dermatite atopica nao especificada", capitulo: C.XII.num, capituloNome: C.XII.nome, bloco: "L20-L30" },
  { codigo: "L23.9", nome: "Dermatite alergica de contato", capitulo: C.XII.num, capituloNome: C.XII.nome, bloco: "L20-L30" },

  // Capitulo I - Infecciosas (A/B)
  { codigo: "A09", nome: "Diarreia e gastroenterite presumivel origem infecciosa", capitulo: C.I.num, capituloNome: C.I.nome, bloco: "A00-A09" },
  { codigo: "B34.9", nome: "Infeccao viral nao especificada", capitulo: C.I.num, capituloNome: C.I.nome, bloco: "B25-B34" },

  // Capitulo XIV - Geniturinario (N)
  { codigo: "N30.0", nome: "Cistite aguda", capitulo: C.XIV.num, capituloNome: C.XIV.nome, bloco: "N30-N39" },
  { codigo: "N39.0", nome: "Infeccao do trato urinario", capitulo: C.XIV.num, capituloNome: C.XIV.nome, bloco: "N30-N39" },
];

export function findCid(codigo: string): Cid | undefined {
  return cid10.find((c) => c.codigo === codigo);
}

export function searchCid(query: string, limit = 8): Cid[] {
  if (!query.trim()) return cid10.slice(0, limit);
  const q = query.toLowerCase().trim();
  return cid10
    .filter(
      (c) =>
        c.codigo.toLowerCase().includes(q) ||
        c.nome.toLowerCase().includes(q) ||
        c.bloco.toLowerCase().includes(q)
    )
    .slice(0, limit);
}
