"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Building2,
  CalendarMinus,
  CircleDollarSign,
  ClipboardList,
  Compass,
  FileDown,
  FileText,
  Keyboard,
  LayoutDashboard,
  LogOut,
  Microscope,
  Moon,
  Plus,
  Settings,
  Sun,
  Upload,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/command-palette/Dialog";
import { useAuthStore } from "@/lib/state/auth-store";
import { useFilterStore } from "@/lib/state/filter-store";
import { empresas } from "@/lib/data/empresas";
import { PERIODOS_DISPONIVEIS } from "@/lib/constants";
import type { PeriodoMes } from "@/lib/data/types";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onOpenShortcuts: () => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onOpenShortcuts,
}: CommandPaletteProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const setEmpresa = useFilterStore((s) => s.setEmpresa);
  const setPeriodo = useFilterStore((s) => s.setPeriodo);
  const signOut = useAuthStore((s) => s.signOut);

  const isDark = resolvedTheme === "dark";

  function go(href: string) {
    onOpenChange(false);
    setTimeout(() => router.push(href), 50);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Paleta de comandos</DialogTitle>
          <DialogDescription>
            Pesquise paginas, acoes e configuracoes.
          </DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Digite um comando ou pesquise..." />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

            <CommandGroup heading="Navegar">
              <CommandItem onSelect={() => go("/dashboards/executivo")}>
                <LayoutDashboard />
                Dashboard Executivo
              </CommandItem>
              <CommandItem onSelect={() => go("/dashboards/epidemiologico")}>
                <Microscope />
                Dashboard Epidemiologico
              </CommandItem>
              <CommandItem onSelect={() => go("/dashboards/absenteismo")}>
                <CalendarMinus />
                Dashboard Absenteismo
              </CommandItem>
              <CommandItem onSelect={() => go("/dashboards/saude-mental")}>
                <Brain />
                Dashboard Saude Mental
              </CommandItem>
              <CommandItem onSelect={() => go("/dashboards/financeiro")}>
                <CircleDollarSign />
                Dashboard Financeiro
              </CommandItem>
              <CommandItem onSelect={() => go("/operacoes/lancamento")}>
                <ClipboardList />
                Lancamento diario
              </CommandItem>
              <CommandItem onSelect={() => go("/operacoes/importar")}>
                <Upload />
                Importar planilha
              </CommandItem>
              <CommandItem onSelect={() => go("/operacoes/relatorio-pdf")}>
                <FileText />
                Relatorio executivo
              </CommandItem>
              <CommandItem onSelect={() => go("/configuracoes/template")}>
                <Settings />
                Configuracoes
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Acoes">
              <CommandItem
                onSelect={() => {
                  onOpenChange(false);
                  toast.success("Atalho disparado", {
                    description: "Use o botao Gerar PDF no Dashboard Executivo.",
                  });
                  go("/dashboards/executivo");
                }}
              >
                <FileDown />
                Gerar PDF executivo
              </CommandItem>
              <CommandItem onSelect={() => go("/operacoes/lancamento")}>
                <Plus />
                Novo lancamento
              </CommandItem>
              <CommandItem onSelect={() => go("/operacoes/importar")}>
                <Upload />
                Importar planilha em massa
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Filtrar - Empresa">
              {empresas.map((e) => (
                <CommandItem
                  key={e.id}
                  onSelect={() => {
                    setEmpresa(e.id);
                    toast.success("Empresa alterada", { description: e.nome });
                    onOpenChange(false);
                  }}
                >
                  <Building2 />
                  {e.nome}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Filtrar - Periodo">
              {PERIODOS_DISPONIVEIS.map((p) => (
                <CommandItem
                  key={p.id}
                  onSelect={() => {
                    setPeriodo(p.id as PeriodoMes);
                    toast.success("Periodo alterado", { description: p.label });
                    onOpenChange(false);
                  }}
                >
                  <CalendarMinus />
                  {p.label}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Sistema">
              <CommandItem
                onSelect={() => {
                  setTheme(isDark ? "light" : "dark");
                  onOpenChange(false);
                }}
              >
                {isDark ? <Sun /> : <Moon />}
                Tema {isDark ? "claro" : "escuro"}
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  onOpenChange(false);
                  setTimeout(onOpenShortcuts, 80);
                }}
              >
                <Keyboard />
                Ver atalhos de teclado
                <CommandShortcut>?</CommandShortcut>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  signOut();
                  onOpenChange(false);
                  router.push("/login");
                }}
              >
                <LogOut />
                Encerrar sessao
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Sobre">
              <CommandItem disabled>
                <Compass />
                <span className="text-xs text-muted-foreground">
                  Cmd+K em qualquer tela
                </span>
                <CommandShortcut>
                  <Zap className="inline h-3 w-3" />
                </CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
