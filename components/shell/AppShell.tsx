import * as React from "react";

import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      {/* min-w-0 lets this flex-1 column shrink below its min-content size, so
          any wide child cannot push the layout past the viewport.
          NOTE: overflow-x-hidden was removed because it created a scroll
          context that broke `position: sticky` on the Topbar. The horizontal
          overflow guard now relies on min-w-0 plus per-component clipping
          (ChartCard overflow-hidden, DataTable overflow-x-auto, etc.). */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <div className="min-w-0 flex-1">{children}</div>
        <BottomNav />
      </div>
    </div>
  );
}
