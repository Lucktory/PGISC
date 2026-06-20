"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/command-palette/Dialog";

const SHORTCUTS = [
  { keys: ["Ctrl", "K"], description: "Abrir paleta de comandos" },
  { keys: ["Ctrl", "S"], description: "Salvar lancamento (na pagina de lancamento)" },
  { keys: ["Ctrl", "N"], description: "Novo lancamento (na pagina de lancamento)" },
  { keys: ["Esc"], description: "Fechar dialogos e sheets abertos" },
];

interface ShortcutsHelpProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function ShortcutsHelp({ open, onOpenChange }: ShortcutsHelpProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>Atalhos de teclado</DialogTitle>
          <DialogDescription>
            Atalhos rapidos para navegar e operar mais rapido.
          </DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-2 px-5 pb-5 pt-2">
          {SHORTCUTS.map((s, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-3 py-2"
            >
              <span className="text-sm">{s.description}</span>
              <span className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
