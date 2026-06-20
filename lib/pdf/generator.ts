import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { calcularExecutivo } from "@/lib/calc/executivo";
import { getEmpresa } from "@/lib/data/empresas";
import { formatNumber1 } from "@/lib/format/number";
import type { Atendimento, PeriodoMes } from "@/lib/data/types";
import { PERIODOS_DISPONIVEIS } from "@/lib/constants";

import { pdfMargins, pdfTheme } from "./theme";

interface RelatorioInput {
  atendimentos: Atendimento[];
  empresaId: string;
  periodo: PeriodoMes;
}

interface RelatorioOutput {
  filename: string;
  blob: Blob;
  sizeBytes: number;
}

export function gerarRelatorioExecutivo({
  atendimentos,
  empresaId,
  periodo,
}: RelatorioInput): RelatorioOutput {
  const empresa = getEmpresa(empresaId);
  if (!empresa) throw new Error(`Empresa ${empresaId} nao encontrada`);
  const periodoLabel =
    PERIODOS_DISPONIVEIS.find((p) => p.id === periodo)?.label ?? periodo;

  const dashboard = calcularExecutivo(atendimentos, empresaId, periodo);
  const k = dashboard.kpis;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- Cover page ---
  doc.setFillColor(...pdfTheme.background);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setTextColor(...pdfTheme.primary);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.text("PGISC", pdfMargins.left, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...pdfTheme.muted);
  doc.text("Saude Corporativa", pdfMargins.left, 56);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...pdfTheme.primary);
  doc.text("Relatorio Executivo de Saude Corporativa", pdfMargins.left, 90, {
    maxWidth: pageWidth - pdfMargins.left - pdfMargins.right,
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...pdfTheme.text);
  doc.text(`Empresa: ${empresa.nome}`, pdfMargins.left, 110);
  doc.text(`Periodo: ${periodoLabel}`, pdfMargins.left, 118);

  const dataGeracao = new Date().toLocaleString("pt-BR");
  doc.setFontSize(10);
  doc.setTextColor(...pdfTheme.muted);
  doc.text(`Gerado em ${dataGeracao}`, pdfMargins.left, 126);

  doc.setDrawColor(...pdfTheme.border);
  doc.setLineWidth(0.3);
  doc.line(pdfMargins.left, 134, pageWidth - pdfMargins.right, 134);

  doc.setFontSize(9);
  doc.setTextColor(...pdfTheme.muted);
  doc.text(
    [
      "Este relatorio consolida os indicadores executivos de saude corporativa",
      "para o periodo informado. Os dados sao gerados automaticamente pela",
      "plataforma a partir dos lancamentos ambulatoriais e atestados recebidos.",
    ].join("\n"),
    pdfMargins.left,
    144,
    { maxWidth: pageWidth - pdfMargins.left - pdfMargins.right }
  );

  doc.setFontSize(8);
  doc.text(
    "PGISC Demonstracao",
    pdfMargins.left,
    pageHeight - pdfMargins.bottom
  );

  // --- KPIs page ---
  doc.addPage();
  drawSectionTitle(doc, "Indicadores executivos", pdfMargins.top);

  autoTable(doc, {
    startY: pdfMargins.top + 12,
    head: [["Indicador", "Valor"]],
    body: [
      ["Total de atendimentos", String(k.totalAtendimentos)],
      ["Colaboradores unicos", String(k.colaboradoresUnicos)],
      ["Horas perdidas", `${formatNumber1(k.horasPerdidas)}h`],
      ["Dias perdidos", formatNumber1(k.diasPerdidos)],
      [
        "Atendimentos com afastamento",
        `${k.comAfastamento} (${Math.round(k.percentualAfastamento * 100)}%)`,
      ],
      [
        "Colaboradores recorrentes",
        `${k.recorrentes} (${Math.round(k.percentualRecorrentes * 100)}%)`,
      ],
      ["Indice IIOS", `${formatNumber1(k.iios)} h/colaborador`],
    ],
    theme: "grid",
    headStyles: {
      fillColor: pdfTheme.primary,
      textColor: 255,
      fontStyle: "bold",
    },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: pdfMargins.left, right: pdfMargins.right },
  });

  // Top setores
  const finalY1 =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      ?.finalY ?? pdfMargins.top + 12;
  drawSectionTitle(doc, "Ranking de setores por dias perdidos", finalY1 + 14);
  autoTable(doc, {
    startY: finalY1 + 22,
    head: [["#", "Setor", "Dias", "Horas", "Atendimentos"]],
    body: dashboard.setoresRanking.slice(0, 8).map((s, i) => [
      String(i + 1),
      s.setor,
      formatNumber1(s.diasPerdidos),
      formatNumber1(s.horasPerdidas),
      String(s.atendimentos),
    ]),
    theme: "grid",
    headStyles: {
      fillColor: pdfTheme.accent,
      textColor: 255,
      fontStyle: "bold",
    },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: pdfMargins.left, right: pdfMargins.right },
  });

  // Top CIDs
  const finalY2 =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      ?.finalY ?? finalY1 + 22;
  drawSectionTitle(doc, "Top CIDs do periodo", finalY2 + 14);
  autoTable(doc, {
    startY: finalY2 + 22,
    head: [["CID", "Descricao", "Atendimentos"]],
    body: dashboard.topCids.slice(0, 8).map((c) => [
      c.codigo,
      c.nome,
      String(c.count),
    ]),
    theme: "grid",
    headStyles: {
      fillColor: pdfTheme.accent,
      textColor: 255,
      fontStyle: "bold",
    },
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 22 } },
    margin: { left: pdfMargins.left, right: pdfMargins.right },
  });

  // Recommendations page
  doc.addPage();
  drawSectionTitle(doc, "Recomendacoes operacionais", pdfMargins.top);
  const setorLider = dashboard.setoresRanking[0];
  const cidLider = dashboard.topCids[0];
  const recomendacoes = [
    setorLider
      ? `Acompanhar o setor ${setorLider.setor}, que concentra ${formatNumber1(
          setorLider.diasPerdidos
        )} dias perdidos no periodo. Considerar acao ergonomica e revisao de carga de trabalho.`
      : "Sem destaque setorial no periodo.",
    cidLider
      ? `O CID mais frequente foi ${cidLider.codigo} (${cidLider.nome}), com ${cidLider.count} atendimentos. Verificar protocolo de prevencao e periodicidade dos exames.`
      : "Sem CID predominante no periodo.",
    k.recorrentes > 0
      ? `${k.recorrentes} colaboradores aparecem como recorrentes (${Math.round(
          k.percentualRecorrentes * 100
        )}% da base). Sugere-se acompanhamento individual e analise de causa raiz.`
      : "Sem casos recorrentes registrados no periodo.",
  ];
  doc.setFontSize(10);
  doc.setTextColor(...pdfTheme.text);
  let y = pdfMargins.top + 14;
  recomendacoes.forEach((r, i) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}.`, pdfMargins.left, y);
    doc.setFont("helvetica", "normal");
    doc.text(r, pdfMargins.left + 6, y, {
      maxWidth: pageWidth - pdfMargins.left - pdfMargins.right - 6,
    });
    y += 22;
  });

  // Footer on every page
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(...pdfTheme.muted);
    doc.text(
      `Pagina ${p} de ${pages}`,
      pageWidth - pdfMargins.right,
      pageHeight - pdfMargins.bottom + 8,
      { align: "right" }
    );
    if (p > 1) {
      doc.text(
        "PGISC Demonstracao",
        pdfMargins.left,
        pageHeight - pdfMargins.bottom + 8
      );
    }
  }

  const blob = doc.output("blob");
  const filename = `relatorio-pgisc-${empresa.nome.toLowerCase()}-${periodo}.pdf`;
  return { filename, blob, sizeBytes: blob.size };
}

function drawSectionTitle(doc: jsPDF, text: string, y: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...pdfTheme.primary);
  doc.text(text, pdfMargins.left, y);
  doc.setDrawColor(...pdfTheme.accent);
  doc.setLineWidth(0.8);
  doc.line(
    pdfMargins.left,
    y + 2,
    pdfMargins.left + 36,
    y + 2
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
