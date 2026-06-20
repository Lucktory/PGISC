import { cn } from "@/lib/utils";

interface CidRowProps {
  codigo: string;
  nome: string;
  count: number;
  className?: string;
}

export function CidRow({ codigo, nome, count, className }: CidRowProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-3 border-b border-border py-2 last:border-b-0",
        "grid-cols-[72px_1fr_auto]",
        className
      )}
    >
      <span className="rounded-md bg-accent-soft px-2 py-0.5 text-center font-mono text-[11px] font-semibold text-accent">
        {codigo}
      </span>
      <span className="truncate text-sm text-foreground">{nome}</span>
      <span className="text-xs font-semibold text-muted-foreground">{count}</span>
    </div>
  );
}
