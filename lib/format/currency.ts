const ptBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const ptBRLCompact = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatBRL(n: number): string {
  return ptBRL.format(n);
}

export function formatBRLCompact(n: number): string {
  return ptBRLCompact.format(n);
}
