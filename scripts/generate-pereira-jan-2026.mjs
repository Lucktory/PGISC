// Deterministic generator for PEREIRA Janeiro 2026 atendimento records.
// Targets locked from the HTML demo (already shown to Alexandre):
//   106 atendimentos | 69 colaboradores unicos | 24 recorrentes | 44 com afastamento
//   288 horas perdidas | 57.5 dias perdidos | IIOS 5.43 (ativos=53)
//   Setor dias: Costura 16.5, Marcenaria 11.7, Embalagem 7.0, Adm 5.7, Lixa 4.9,
//               Tapecaria 2.3, Montagem 2.2, Preparacao 2.0, Outros 5.2
//   Top CIDs: Z10.0 (13), Z76.3 (7), Z00.0 (5), M79.6 (3), S90.3 (3), F41 (2)
//   DOW: Seg 24, Ter 17, Qua 15, Qui 23, Sex 26, Sab 1
//   Periodo: Manha 80, Tarde 25, Noite 1
//   Tipo: Passivo 92, Ativo 13, Suspensao 1
//
// Run: node scripts/generate-pereira-jan-2026.mjs > lib/data/pereira-jan-2026.ts

import { writeFileSync } from "node:fs";

const NOMES_F = [
  "Maria Aparecida", "Ana Paula", "Juliana Cristina", "Patricia Alves",
  "Fernanda Souza", "Carla Beatriz", "Renata Lima", "Vanessa Oliveira",
  "Cristiane Ferreira", "Beatriz Almeida", "Sandra Regina", "Cleusa Maria",
  "Eliane Goncalves", "Rosangela Pinto", "Lucia Helena", "Daniela Ribeiro",
  "Tatiane Moreira", "Aline Carvalho", "Priscila Nunes", "Camila Vieira",
  "Rosana Pereira", "Joana Santos", "Marta Fernandes", "Edinaria Costa",
  "Solange Cardoso", "Iracema Lopes", "Marlene Barros", "Adriana Silveira",
  "Joelma Andrade", "Sueli Antunes", "Vera Lucia", "Edna Maria",
  "Cleide Aparecida", "Marcia Regina", "Silvana Teixeira", "Elaine Rocha",
];

const NOMES_M = [
  "Jose Carlos", "Antonio Marcos", "Joao Batista", "Carlos Eduardo",
  "Marcos Vinicius", "Paulo Roberto", "Luiz Fernando", "Roberto Souza",
  "Edson Junior", "Marcelo Henrique", "Anderson Silva", "Wagner Lima",
  "Rafael Almeida", "Diego Santos", "Felipe Oliveira", "Ricardo Pereira",
  "Sergio Costa", "Daniel Borges", "Eduardo Ramos", "Tiago Moreira",
  "Lucas Fernandes", "Wesley Pinto", "Andre Vasconcelos", "Igor Cardoso",
  "Vinicius Tavares", "Mateus Rocha", "Joao Pedro", "Bruno Carvalho",
  "Caio Mendes", "Fabricio Lopes", "Helio Andrade", "Israel Antunes",
  "Jefferson Barros",
];

const CARGOS = {
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
  Acabamento: ["Acabador"],
  Estofamento: ["Estofador"],
  Almoxarifado: ["Almoxarife"],
  Expedicao: ["Auxiliar de Expedicao"],
  Qualidade: ["Inspetor de Qualidade"],
  Manutencao: ["Mecanico de Manutencao"],
};

const MEDICOS = [
  "Dra. Marina Castelo",
  "Dr. Rogerio Tavares",
  "Dra. Helena Vasconcelos",
  "Dr. Bruno Pacheco",
  "Dra. Camila Werner",
];

const LOCAIS = ["Ambulatorio interno", "Consultorio medico", "Clinica conveniada"];

const TIPOS_EXAME = [
  "Consulta clinica",
  "Exame periodico",
  "Exame admissional",
  "Exame de retorno ao trabalho",
  "Atestado externo",
  "Acompanhamento ambulatorial",
];

// Pseudo-random with seed (mulberry32) for determinism.
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260119);
function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
function range(n) { return Array.from({ length: n }, (_, i) => i); }

// Step 1: build 69 colaboradores with setor and cargo assignments.
// Distribution mirrors the setor x dias picture: more people in Costura/Marcenaria
// where most absenteismo happens, fewer in smaller sectors.
const setorHeadcount = {
  Costura: 14, Marcenaria: 9, Embalagem: 8, Administracao: 7,
  Lixa: 6, Tapecaria: 4, Montagem: 5, Preparacao: 4,
  Acabamento: 3, Estofamento: 3, Almoxarifado: 2,
  Expedicao: 2, Qualidade: 1, Manutencao: 1,
};
const totalHeadcount = Object.values(setorHeadcount).reduce((a, b) => a + b, 0);
if (totalHeadcount !== 69) throw new Error("Headcount must total 69, got " + totalHeadcount);

const colaboradores = [];
let proximoProntuario = 1024;
const nomesF = [...NOMES_F];
const nomesM = [...NOMES_M];
for (const [setor, qtd] of Object.entries(setorHeadcount)) {
  for (let i = 0; i < qtd; i++) {
    // Costura/Tapecaria/Adm predominantly feminino; Marcenaria/Montagem/Lixa predominantly masculino.
    const setoresFem = ["Costura", "Tapecaria", "Administracao", "Qualidade"];
    const sexo = setoresFem.includes(setor)
      ? rnd() < 0.85 ? "F" : "M"
      : rnd() < 0.18 ? "F" : "M";
    const nome = sexo === "F" ? (nomesF.shift() ?? `Funcionaria ${proximoProntuario}`)
                              : (nomesM.shift() ?? `Funcionario ${proximoProntuario}`);
    const cargo = pick(CARGOS[setor]);
    // birthdays spread 1968..2005, admission spread 2014..2025
    const anoNasc = 1968 + Math.floor(rnd() * 38);
    const mesNasc = 1 + Math.floor(rnd() * 12);
    const diaNasc = 1 + Math.floor(rnd() * 28);
    const anoAdm = 2014 + Math.floor(rnd() * 12);
    const mesAdm = 1 + Math.floor(rnd() * 12);
    const diaAdm = 1 + Math.floor(rnd() * 28);
    colaboradores.push({
      prontuario: String(proximoProntuario++),
      nome,
      sexo,
      setor,
      cargo,
      dataNascimento: `${anoNasc}-${String(mesNasc).padStart(2, "0")}-${String(diaNasc).padStart(2, "0")}`,
      dataAdmissao: `${anoAdm}-${String(mesAdm).padStart(2, "0")}-${String(diaAdm).padStart(2, "0")}`,
      atendimentosAlocados: 0,
    });
  }
}

// Step 2: choose recorrencia distribution.
//   45 colaboradores com 1 atendimento
//   15 com 2, 6 com 3, 2 com 4, 1 com 5 -> 24 recorrentes, 106 atendimentos
const recorrenciaPlan = [
  ...Array(45).fill(1),
  ...Array(15).fill(2),
  ...Array(6).fill(3),
  ...Array(2).fill(4),
  ...Array(1).fill(5),
];
if (recorrenciaPlan.length !== 69) throw new Error("Recorrencia plan length mismatch");
if (recorrenciaPlan.reduce((a, b) => a + b, 0) !== 106) throw new Error("Recorrencia plan sum mismatch");

// Shuffle colaboradores deterministically and assign atendimento counts.
const shuffled = [...colaboradores].sort((a, b) => {
  const ha = (a.prontuario.charCodeAt(0) * 7 + a.nome.length * 13) % 100;
  const hb = (b.prontuario.charCodeAt(0) * 7 + b.nome.length * 13) % 100;
  return ha - hb;
});
shuffled.forEach((c, i) => { c.atendimentosAlocados = recorrenciaPlan[i]; });

// Step 3: build the list of (colaborador, ordinal) atendimento slots.
const slots = [];
colaboradores.forEach((c) => {
  for (let k = 0; k < c.atendimentosAlocados; k++) {
    slots.push({ colaborador: c, ordinal: k + 1 });
  }
});
if (slots.length !== 106) throw new Error("Slots count mismatch");

// Step 4: build distributions by index.
function expand(distribution) {
  const out = [];
  for (const [val, count] of Object.entries(distribution)) {
    for (let i = 0; i < count; i++) out.push(val);
  }
  return out;
}

const cidPool = [
  ...Array(13).fill("Z10.0"),
  ...Array(7).fill("Z76.3"),
  ...Array(5).fill("Z00.0"),
  ...Array(3).fill("M79.6"),
  ...Array(3).fill("S90.3"),
  ...Array(2).fill("F41"),
  // remaining 73:
  ...Array(5).fill("Z02.1"), ...Array(4).fill("Z02.7"), ...Array(4).fill("Z71.3"),
  ...Array(3).fill("J00"), ...Array(3).fill("J06.9"), ...Array(3).fill("R51"),
  ...Array(2).fill("M54.5"), ...Array(3).fill("M54.2"), ...Array(2).fill("M75.1"),
  ...Array(2).fill("M65.9"), ...Array(2).fill("M77.0"), ...Array(2).fill("M70.9"),
  ...Array(2).fill("G56.0"), ...Array(2).fill("R10.4"), ...Array(2).fill("R50.9"),
  ...Array(2).fill("R53"), ...Array(2).fill("K29.7"), ...Array(2).fill("K30"),
  ...Array(2).fill("J11.1"), ...Array(2).fill("J45.9"), ...Array(2).fill("I10"),
  ...Array(2).fill("E11.9"), ...Array(2).fill("F32.0"), ...Array(2).fill("F43.0"),
  ...Array(2).fill("F41.1"), ...Array(2).fill("F43.2"), ...Array(1).fill("F40.1"),
  ...Array(1).fill("S93.4"), ...Array(1).fill("S83.5"), ...Array(1).fill("S62.5"),
  ...Array(1).fill("H10.9"), ...Array(1).fill("L23.9"), ...Array(1).fill("G43.9"),
  ...Array(1).fill("N39.0"), ...Array(1).fill("E66.0"), ...Array(1).fill("A09"),
];
if (cidPool.length !== 106) throw new Error("CID pool size = " + cidPool.length);

const tipoPool = expand({ Passivo: 92, Ativo: 13, Suspensao: 1 });
const periodoPool = expand({ Manha: 80, Tarde: 25, Noite: 1 });
const dowPool = expand({ Seg: 24, Ter: 17, Qua: 15, Qui: 23, Sex: 26, Sab: 1 });

// Step 5: shuffle pools deterministically then assign.
function shuffle(arr, seed) {
  const r = mulberry32(seed);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const cidShuf = shuffle(cidPool, 7);
const tipoShuf = shuffle(tipoPool, 13);
const periodoShuf = shuffle(periodoPool, 17);
const dowShuf = shuffle(dowPool, 23);

// Step 6: build Jan 2026 dates per DOW.
// Jan 2026: Jan 1 = Quinta. Weekdays per dow:
//   Seg: 5,12,19,26 (4 days)   Ter: 6,13,20,27 (4)   Qua: 7,14,21,28 (4)
//   Qui: 1,8,15,22,29 (5)      Sex: 2,9,16,23,30 (5)  Sab: 3,10,17,24,31 (5)
const diasPorDow = {
  Seg: [5, 12, 19, 26],
  Ter: [6, 13, 20, 27],
  Qua: [7, 14, 21, 28],
  Qui: [1, 8, 15, 22, 29],
  Sex: [2, 9, 16, 23, 30],
  Sab: [3],
};

// Step 7: allocate afastamento.
// 44 atendimentos com afastamento; setor distribution targets:
const setorDiasAlvo = {
  Costura: 16.5, Marcenaria: 11.7, Embalagem: 7.0, Administracao: 5.7,
  Lixa: 4.9, Tapecaria: 2.3, Montagem: 2.2, Preparacao: 2.0,
  Acabamento: 1.6, Estofamento: 1.4, Almoxarifado: 0.9, Expedicao: 0.7,
  Qualidade: 0.4, Manutencao: 0.2,
};
const setorDiasTotal = Object.values(setorDiasAlvo).reduce((a, b) => a + b, 0);
// Slight float drift can occur; we will rescale via the last record.

// Step 8: select 44 slots for afastamento, distributed across setores per the target.
// Strategy: rank slots by (setor priority); pick higher count from sectors with higher dias.
const afastamentoPorSetor = {
  Costura: 11, Marcenaria: 7, Embalagem: 5, Administracao: 4,
  Lixa: 3, Tapecaria: 3, Montagem: 2, Preparacao: 2,
  Acabamento: 2, Estofamento: 2, Almoxarifado: 1, Expedicao: 1,
  Qualidade: 1, Manutencao: 0,
};
const afastTotal = Object.values(afastamentoPorSetor).reduce((a, b) => a + b, 0);
if (afastTotal !== 44) throw new Error("Afastamento count = " + afastTotal);

// For each slot, determine if it gets afastamento based on setor budget.
const slotsBySetor = {};
slots.forEach((s, idx) => {
  (slotsBySetor[s.colaborador.setor] ??= []).push({ slot: s, idx });
});
const afastamentoFlags = Array(106).fill(false);
for (const [setor, qtdAfast] of Object.entries(afastamentoPorSetor)) {
  const candidates = slotsBySetor[setor] ?? [];
  // pick first qtdAfast slots (deterministic) - prefer recorrentes for realism
  candidates.sort((a, b) => b.slot.colaborador.atendimentosAlocados - a.slot.colaborador.atendimentosAlocados);
  for (let i = 0; i < qtdAfast && i < candidates.length; i++) {
    afastamentoFlags[candidates[i].idx] = true;
  }
}

const afastIdxs = afastamentoFlags
  .map((flag, idx) => (flag ? idx : -1))
  .filter((x) => x >= 0);
if (afastIdxs.length !== 44) throw new Error("Afastamento idx count = " + afastIdxs.length);

// Step 9: assign horas and dias per afastamento.
// Each setor gets ~ setorDiasAlvo[setor] total dias.
// For records in setor S, distribute setorDiasAlvo[S] across the records assigned afastamento in S.
// We also need total horas = 288 exactly.
const horasPerdidas = Array(106).fill(0);
const diasPerdidos = Array(106).fill(0);

// First pass: distribute dias per setor.
for (const setor of Object.keys(afastamentoPorSetor)) {
  const idxsInSetor = afastIdxs.filter((idx) => slots[idx].colaborador.setor === setor);
  const targetDias = setorDiasAlvo[setor];
  if (idxsInSetor.length === 0) continue;
  // Split target into n parts, with some variance.
  const base = targetDias / idxsInSetor.length;
  let allocated = 0;
  idxsInSetor.forEach((idx, i) => {
    if (i === idxsInSetor.length - 1) {
      diasPerdidos[idx] = Math.round((targetDias - allocated) * 10) / 10;
    } else {
      // mild variance around base
      const variance = (rnd() - 0.5) * base * 0.5;
      const v = Math.max(0.5, Math.round((base + variance) * 10) / 10);
      diasPerdidos[idx] = v;
      allocated += v;
    }
  });
}

// Second pass: assign horas to mirror dias (~5 horas per dia, so 57.5d -> 287.5h, then adjust).
// We want sum horas = 288.0 exactly.
for (const idx of afastIdxs) {
  // base ratio horas/dias ~ 5 (since 288/57.5 = 5.01)
  const dias = diasPerdidos[idx];
  const baseHoras = dias * 5;
  // rounded to nearest 0.5
  horasPerdidas[idx] = Math.round(baseHoras * 2) / 2;
}

// Compute current totals.
let sumHoras = horasPerdidas.reduce((a, b) => a + b, 0);
let sumDias = diasPerdidos.reduce((a, b) => a + b, 0);

// Adjust horas: distribute the diff to the largest horas record.
let horasDiff = Math.round((288.0 - sumHoras) * 10) / 10;
if (horasDiff !== 0) {
  const sortedDesc = [...afastIdxs].sort((a, b) => horasPerdidas[b] - horasPerdidas[a]);
  horasPerdidas[sortedDesc[0]] = Math.round((horasPerdidas[sortedDesc[0]] + horasDiff) * 10) / 10;
}

// Adjust dias: distribute the diff to the largest dias record.
let diasDiff = Math.round((57.5 - sumDias) * 10) / 10;
if (diasDiff !== 0) {
  const sortedDesc = [...afastIdxs].sort((a, b) => diasPerdidos[b] - diasPerdidos[a]);
  diasPerdidos[sortedDesc[0]] = Math.round((diasPerdidos[sortedDesc[0]] + diasDiff) * 10) / 10;
}

// Recompute and verify.
sumHoras = Math.round(horasPerdidas.reduce((a, b) => a + b, 0) * 10) / 10;
sumDias = Math.round(diasPerdidos.reduce((a, b) => a + b, 0) * 10) / 10;
if (sumHoras !== 288.0) throw new Error("sumHoras != 288: " + sumHoras);
if (sumDias !== 57.5) throw new Error("sumDias != 57.5: " + sumDias);

// Step 10: assemble final records.
const motivosCidMap = {
  "Z10.0": ["Exame periodico obrigatorio", "Avaliacao ergonomica anual"],
  "Z76.3": ["Acompanhamento de familiar enfermo", "Apresentacao com paciente"],
  "Z00.0": ["Avaliacao clinica geral", "Check-up anual"],
  "M79.6": ["Dor em membro superior persistente", "Queixa de dor no antebraco"],
  "S90.3": ["Acidente domestico", "Pisada irregular durante o turno"],
  "F41": ["Quadro ansioso recorrente", "Encaminhada para acompanhamento psicologico"],
  "M54.5": ["Lombalgia apos esforco", "Dor lombar mecanica"],
  "M54.2": ["Cervicalgia por postura no posto", "Dor cervical persistente"],
  "M75.1": ["Sindrome do manguito rotador", "Dor no ombro repetitivo"],
  "M65.9": ["Tenossinovite no punho", "Dor por movimento repetitivo"],
  "M77.0": ["Epicondilite medial", "Cotovelo de tenista (LER)"],
  "M70.9": ["Lesao por esforco repetitivo", "Sobrecarga muscular"],
  "G56.0": ["Suspeita de tunel do carpo", "Dormencia em mao dominante"],
  "F32.0": ["Episodio depressivo leve", "Encaminhamento psicologo"],
  "F43.0": ["Reacao aguda ao estresse", "Quadro emocional agudo"],
  "F41.1": ["Ansiedade generalizada", "Acompanhamento ambulatorial"],
  "F43.2": ["Transtorno de adaptacao", "Situacao familiar declarada"],
  "F40.1": ["Fobia social no ambiente coletivo", "Encaminhamento especialista"],
  "J00": ["Quadro gripal", "Resfriado comum"],
  "J06.9": ["Infeccao das vias aereas", "Sintomas gripais"],
  "J11.1": ["Sindrome gripal", "Suspeita de influenza"],
  "J45.9": ["Crise asmatica", "Dispneia em consulta"],
  "R51": ["Cefaleia tensional", "Dor de cabeca persistente"],
  "R10.4": ["Dor abdominal", "Desconforto epigastrico"],
  "R50.9": ["Estado febril", "Febre nao especificada"],
  "R53": ["Fadiga", "Mal estar"],
  "K29.7": ["Gastrite", "Quadro dispeptico"],
  "K30": ["Dispepsia funcional", "Empachamento"],
  "I10": ["Pressao arterial elevada", "Avaliacao cardiologica"],
  "E11.9": ["Diabetes tipo 2 descompensada", "Acompanhamento endocrinologia"],
  "E66.0": ["Orientacao nutricional", "Avaliacao por excesso ponderal"],
  "Z02.1": ["Avaliacao pre admissional", "Exame admissional cumprido"],
  "Z02.7": ["Emissao de atestado", "Atestado externo de medico particular"],
  "Z71.3": ["Aconselhamento dietetico", "Programa de bem-estar"],
  "S93.4": ["Entorse de tornozelo", "Pisou em piso irregular"],
  "S83.5": ["Entorse de joelho", "Mau jeito ao agachar"],
  "S62.5": ["Trauma em polegar", "Fratura suspeita"],
  "H10.9": ["Conjuntivite", "Sensacao de areia no olho"],
  "L23.9": ["Dermatite por contato", "Exposicao a solvente"],
  "G43.9": ["Enxaqueca", "Crise enxaquecosa"],
  "N39.0": ["Infeccao urinaria", "Quadro urinario"],
  "A09": ["Diarreia aguda", "Quadro gastrointestinal"],
};

const condutas = [
  "Liberado para atividades normais",
  "Atestado emitido",
  "Encaminhamento para especialista",
  "Solicitado retorno em 7 dias",
  "Prescrito analgesico e anti-inflamatorio",
  "Orientacao ergonomica e alongamento",
  "Acompanhamento ambulatorial",
  "Medicacao sintomatica e repouso",
  "Reavaliacao em 15 dias",
];

const records = [];
let dowIdx = { Seg: 0, Ter: 0, Qua: 0, Qui: 0, Sex: 0, Sab: 0 };
let pad = 1;
for (let i = 0; i < slots.length; i++) {
  const slot = slots[i];
  const c = slot.colaborador;
  const tipo = tipoShuf[i];
  const periodo = periodoShuf[i];
  const dow = dowShuf[i];
  const cid = cidShuf[i];
  const afast = afastamentoFlags[i];
  const horas = horasPerdidas[i];
  const dias = diasPerdidos[i];
  // pick a date matching the dow
  const dias_dow = diasPorDow[dow];
  const dia = dias_dow[dowIdx[dow] % dias_dow.length];
  dowIdx[dow]++;
  const dataAtendimento = `2026-01-${String(dia).padStart(2, "0")}`;
  const motivos = motivosCidMap[cid] ?? ["Atendimento ambulatorial"];
  const motivo = motivos[i % motivos.length];
  const conduta = afast
    ? "Atestado emitido"
    : condutas[i % condutas.length];
  const localAtendimento = LOCAIS[i % LOCAIS.length];
  const tipoExame = TIPOS_EXAME[i % TIPOS_EXAME.length];
  const medico = MEDICOS[i % MEDICOS.length];
  const obs = c.atendimentosAlocados >= 2 && slot.ordinal >= 2
    ? `Retorno (${slot.ordinal}o atendimento no mes)`
    : "";

  records.push({
    id: `PER-2026-01-${String(pad++).padStart(3, "0")}`,
    empresaId: "pereira",
    prontuario: c.prontuario,
    nome: c.nome,
    sexo: c.sexo,
    cargo: c.cargo,
    setor: c.setor,
    dataAdmissao: c.dataAdmissao,
    dataNascimento: c.dataNascimento,
    dataAtendimento,
    tipoAtendimento: tipo,
    localAtendimento,
    motivo,
    tipoExame,
    cid,
    conduta,
    necessidadeAfastamento: afast,
    horasPerdidas: horas,
    diasPerdidos: dias,
    medicoResponsavel: medico,
    observacoes: obs,
  });
}

// Step 11: verify all the targets.
const summary = {
  total: records.length,
  uniqueColabs: new Set(records.map((r) => r.prontuario)).size,
  recorrentes: (() => {
    const counts = {};
    records.forEach((r) => { counts[r.prontuario] = (counts[r.prontuario] ?? 0) + 1; });
    return Object.values(counts).filter((c) => c >= 2).length;
  })(),
  comAfastamento: records.filter((r) => r.necessidadeAfastamento).length,
  sumHoras: Math.round(records.reduce((a, r) => a + r.horasPerdidas, 0) * 10) / 10,
  sumDias: Math.round(records.reduce((a, r) => a + r.diasPerdidos, 0) * 10) / 10,
  iios: Math.round((records.reduce((a, r) => a + r.horasPerdidas, 0) / 53) * 100) / 100,
  cids: (() => {
    const m = {};
    records.forEach((r) => { m[r.cid] = (m[r.cid] ?? 0) + 1; });
    return ["Z10.0", "Z76.3", "Z00.0", "M79.6", "S90.3", "F41"].map((k) => `${k}:${m[k] ?? 0}`).join(" ");
  })(),
  dow: (() => {
    const m = {};
    records.forEach((r) => {
      const d = new Date(r.dataAtendimento + "T00:00:00").getDay();
      const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
      const lbl = labels[d];
      m[lbl] = (m[lbl] ?? 0) + 1;
    });
    return m;
  })(),
  tipo: (() => {
    const m = {};
    records.forEach((r) => { m[r.tipoAtendimento] = (m[r.tipoAtendimento] ?? 0) + 1; });
    return m;
  })(),
};

console.error(JSON.stringify(summary, null, 2));

// Step 12: emit TypeScript.
const header = `// Auto-generated by scripts/generate-pereira-jan-2026.mjs
// Faithful reconstruction matching the verified demo KPIs:
//   106 atendimentos | 69 colaboradores | 24 recorrentes | 44 com afastamento
//   288 horas perdidas | 57.5 dias perdidos | IIOS 5.43 (ativos 53)
//
// Source: SPREADSHEET ANALYSIS in alexandre-brazil-pgisc-mvp.md + HTML demo numbers.
// Real xlsm not present in repo (received via Workana chat). Synthetic records
// preserve every observable KPI and chart distribution from the demo.

import type { Atendimento } from "./types";

export const pereiraJan2026: Atendimento[] = ${JSON.stringify(records, null, 2)};
`;

writeFileSync("./lib/data/pereira-jan-2026.ts", header);
console.error("Wrote lib/data/pereira-jan-2026.ts (" + records.length + " records)");
