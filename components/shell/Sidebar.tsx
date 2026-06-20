import Link from "next/link";

import { SidebarNav } from "./SidebarNav";

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-card lg:sticky lg:top-0 lg:flex">
      <div className="border-b border-border px-5 py-5">
        <Link href="/dashboards/executivo" className="flex flex-col">
          <span className="text-lg font-bold tracking-tight">PGISC</span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Saude Corporativa
          </span>
        </Link>
      </div>
      <SidebarNav />
      <div className="mt-auto border-t border-border px-5 py-3 text-[11px] text-muted-foreground">
        Demonstracao MVP - dados PEREIRA
      </div>
    </aside>
  );
}
