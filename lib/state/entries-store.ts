"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { Atendimento } from "@/lib/data/types";

interface EntriesState {
  entries: Atendimento[];
  addEntry: (entry: Atendimento) => void;
  updateEntry: (id: string, patch: Partial<Atendimento>) => void;
  removeEntry: (id: string) => void;
  clear: () => void;
}

export const useEntriesStore = create<EntriesState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((s) => ({ entries: [entry, ...s.entries] })),
      updateEntry: (id, patch) =>
        set((s) => ({
          entries: s.entries.map((e) =>
            e.id === id ? { ...e, ...patch } : e
          ),
        })),
      removeEntry: (id) =>
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
      clear: () => set({ entries: [] }),
    }),
    {
      name: "pgisc-entries",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
