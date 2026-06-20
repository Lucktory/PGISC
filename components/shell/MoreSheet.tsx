"use client";

import * as React from "react";
import Link from "next/link";
import { LogOut, Moon, Sun, MoreHorizontal } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/state/auth-store";
import { cn } from "@/lib/utils";

import { configuracoesNavItems, operacoesNavItems } from "./nav-items";

export function MoreSheetTrigger({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={open}
      className={cn(
        "flex h-full min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium leading-tight transition-colors",
        open ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <MoreHorizontal className="h-5 w-5 shrink-0" />
      <span className="w-full truncate text-center">Mais</span>
    </button>
  );
}

export function MoreSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const signOut = useAuthStore((s) => s.signOut);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh]">
        <SheetHeader>
          <SheetTitle>Mais opcoes</SheetTitle>
          <SheetDescription>
            Operacoes, configuracoes e sessao
          </SheetDescription>
        </SheetHeader>
        <div className="px-5 pb-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Operacoes
          </div>
          <ul className="mt-2 flex flex-col gap-1">
            {operacoesNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Separator className="my-4" />

          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Sistema
          </div>
          <ul className="mt-2 flex flex-col gap-1">
            {configuracoesNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-foreground hover:bg-muted"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                Tema {isDark ? "claro" : "escuro"}
              </button>
            </li>
          </ul>

          <Separator className="my-4" />

          <button
            type="button"
            onClick={() => {
              signOut();
              onOpenChange(false);
              router.push("/login");
            }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-danger hover:bg-danger/10"
          >
            <LogOut className="h-4 w-4" />
            Encerrar sessao
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
