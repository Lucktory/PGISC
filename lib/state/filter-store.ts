"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { PeriodoMes } from "../data/types";

interface FilterState {
  empresaId: string;
  periodo: PeriodoMes;
  setores: string[];
  cargos: string[];
  setEmpresa: (id: string) => void;
  setPeriodo: (p: PeriodoMes) => void;
  setSetores: (s: string[]) => void;
  setCargos: (c: string[]) => void;
  reset: () => void;
}

const DEFAULT: Pick<FilterState, "empresaId" | "periodo" | "setores" | "cargos"> = {
  empresaId: "pereira",
  periodo: "2026-01",
  setores: [],
  cargos: [],
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...DEFAULT,
      setEmpresa: (id) => set({ empresaId: id }),
      setPeriodo: (p) => set({ periodo: p }),
      setSetores: (s) => set({ setores: s }),
      setCargos: (c) => set({ cargos: c }),
      reset: () => set(DEFAULT),
    }),
    {
      name: "pgisc-filters",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
