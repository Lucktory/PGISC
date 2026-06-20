const ptBR = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const ptBR1 = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const ptBR2 = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const ptBRPct = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

export function formatNumber(n: number): string {
  return ptBR.format(n);
}

export function formatNumber1(n: number): string {
  return ptBR1.format(n);
}

export function formatNumber2(n: number): string {
  return ptBR2.format(n);
}

export function formatInteger(n: number): string {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(
    Math.round(n)
  );
}

export function formatPercent(fraction: number): string {
  return ptBRPct.format(fraction);
}
