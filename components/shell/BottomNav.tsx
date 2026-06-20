"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { bottomNavItems } from "./nav-items";
import { MoreSheet, MoreSheetTrigger } from "./MoreSheet";

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = React.useState(false);

  // primary 4 dashboards + Mais (the 5th item, opens MoreSheet)
  // We use the first 4 dashboards in the bottom nav. The 5th (Financeiro) sits inside the More sheet.
  const primaryItems = bottomNavItems.slice(0, 4);

  return (
    <>
      <nav
        aria-label="Navegacao principal"
        className="sticky bottom-0 z-30 flex border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {primaryItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium leading-tight transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="w-full truncate text-center">
                {item.shortLabel ?? item.label}
              </span>
            </Link>
          );
        })}
        <MoreSheetTrigger open={moreOpen} onClick={() => setMoreOpen(true)} />
      </nav>
      <MoreSheet open={moreOpen} onOpenChange={setMoreOpen} />
    </>
  );
}
