"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Building2,
  CircleDollarSign,
  Contact,
  FileSpreadsheet,
  SlidersHorizontal,
  Users,
} from "lucide-react";

import { Topbar } from "@/components/shell/Topbar";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/configuracoes/template", label: "Template", icon: FileSpreadsheet },
  { href: "/configuracoes/empresas", label: "Empresas", icon: Building2 },
  { href: "/configuracoes/usuarios", label: "Usuarios", icon: Users },
  { href: "/configuracoes/regras-de-negocio", label: "Regras de negocio", icon: SlidersHorizontal },
  { href: "/configuracoes/custos", label: "Custos", icon: CircleDollarSign },
  { href: "/configuracoes/cid-10", label: "CID-10", icon: BookOpen },
  { href: "/configuracoes/pessoas", label: "Pessoas", icon: Contact },
] as const;

export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <>
      <Topbar
        title="Configuracoes"
        subtitle="Template, empresas, usuarios, regras de negocio e mais"
        showFilters={false}
      />
      <nav className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="-mx-1 flex snap-x snap-mandatory gap-1 overflow-x-auto px-4 py-2 lg:px-8">
          {TABS.map((t) => {
            const active = pathname === t.href;
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={cn(
                  "flex shrink-0 snap-start items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="px-4 py-4 lg:px-8 lg:py-6">{children}</div>
    </>
  );
}
