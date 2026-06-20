"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { RelatorioGerado } from "@/lib/data/types";

interface ReportsState {
  reports: RelatorioGerado[];
  addReport: (r: RelatorioGerado) => void;
  removeReport: (id: string) => void;
  clear: () => void;
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set) => ({
      reports: [],
      addReport: (r) => set((s) => ({ reports: [r, ...s.reports] })),
      removeReport: (id) =>
        set((s) => ({ reports: s.reports.filter((x) => x.id !== id) })),
      clear: () => set({ reports: [] }),
    }),
    {
      name: "pgisc-reports",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
