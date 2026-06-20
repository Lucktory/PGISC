// Phase B GATE verification: confirms that calcularExecutivo produces the
// locked KPI bundle when fed PEREIRA Janeiro 2026 records.
//
// Run: npx tsx scripts/verify-executivo-kpis.mts

import { pereiraJan2026 } from "../lib/data/pereira-jan-2026.js";
import { calcularExecutivo } from "../lib/calc/executivo.js";

const out = calcularExecutivo(pereiraJan2026, "pereira", "2026-01");

const expected = {
  totalAtendimentos: 106,
  colaboradoresUnicos: 69,
  horasPerdidas: 288,
  diasPerdidos: 57.5,
  comAfastamento: 44,
  recorrentes: 24,
  iios: 5.43,
};

const actual = {
  totalAtendimentos: out.kpis.totalAtendimentos,
  colaboradoresUnicos: out.kpis.colaboradoresUnicos,
  horasPerdidas: out.kpis.horasPerdidas,
  diasPerdidos: out.kpis.diasPerdidos,
  comAfastamento: out.kpis.comAfastamento,
  recorrentes: out.kpis.recorrentes,
  iios: out.kpis.iios,
};

console.log("Expected:", expected);
console.log("Actual:  ", actual);

const checks: Array<[string, boolean]> = [
  ["totalAtendimentos", actual.totalAtendimentos === expected.totalAtendimentos],
  ["colaboradoresUnicos", actual.colaboradoresUnicos === expected.colaboradoresUnicos],
  ["horasPerdidas", actual.horasPerdidas === expected.horasPerdidas],
  ["diasPerdidos", actual.diasPerdidos === expected.diasPerdidos],
  ["comAfastamento", actual.comAfastamento === expected.comAfastamento],
  ["recorrentes", actual.recorrentes === expected.recorrentes],
  ["iios", actual.iios === expected.iios],
];

let allGood = true;
for (const [k, ok] of checks) {
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${k}`);
  if (!ok) allGood = false;
}

console.log("");
console.log("Setor ranking (top 5):");
out.setoresRanking.slice(0, 5).forEach((s) => {
  console.log(`  ${s.setor.padEnd(14)} ${s.diasPerdidos.toFixed(2).padStart(6)}d  ${s.atendimentos} atend`);
});

console.log("");
console.log("Top CIDs (first 6):");
out.topCids.slice(0, 6).forEach((c) => {
  console.log(`  ${c.codigo.padEnd(8)} ${c.count.toString().padStart(2)}  ${c.nome}`);
});

console.log("");
console.log("DOW:", out.diaSemana);
console.log("Tipo:", out.tipoAtendimento);
console.log("Periodo:", out.periodo);

if (!allGood) {
  console.error("\nGATE FAILED");
  process.exit(1);
}
console.log("\nGATE PASSED");
