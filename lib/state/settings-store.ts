"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { Usuario } from "@/lib/data/types";

interface SettingsState {
  custoHoraPorCargo: Record<string, number>;
  setCustoCargo: (cargo: string, valor: number) => void;
  removeCustoCargo: (cargo: string) => void;

  recorrenteThreshold: number;
  cidGrouping: "capitulo" | "bloco";
  iiosFormulaLabel: string;
  setRecorrenteThreshold: (v: number) => void;
  setCidGrouping: (v: "capitulo" | "bloco") => void;

  usuarios: Usuario[];
  addUsuario: (u: Usuario) => void;
  updateUsuario: (id: string, patch: Partial<Usuario>) => void;
  removeUsuario: (id: string) => void;
}

const USUARIOS_INICIAIS: Usuario[] = [
  {
    id: "u-1",
    nome: "Alexandre D. Q.",
    email: "alexandre@pgisc.com",
    role: "Admin",
    ultimoAcesso: "2026-06-19T14:32:00",
  },
  {
    id: "u-2",
    nome: "Camila Souza",
    email: "camila@pgisc.com",
    role: "Operador",
    ultimoAcesso: "2026-06-19T09:11:00",
  },
  {
    id: "u-3",
    nome: "Bruno Lima",
    email: "bruno@pgisc.com",
    role: "Operador",
    ultimoAcesso: "2026-06-18T17:45:00",
  },
  {
    id: "u-4",
    nome: "Diretoria PEREIRA",
    email: "diretoria@pereira.com.br",
    role: "Visualizador",
    ultimoAcesso: "2026-06-17T11:02:00",
  },
];

const CUSTOS_INICIAIS: Record<string, number> = {
  Costureira: 32.5,
  "Costureira Pleno": 38.0,
  Marceneiro: 42.0,
  "Marceneiro Senior": 48.5,
  "Auxiliar Administrativo": 28.0,
  "Analista Administrativo": 45.0,
  Embalador: 26.5,
  Lixador: 27.0,
  Tapeceiro: 34.0,
  Montador: 33.0,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      custoHoraPorCargo: CUSTOS_INICIAIS,
      setCustoCargo: (cargo, valor) =>
        set((s) => ({
          custoHoraPorCargo: { ...s.custoHoraPorCargo, [cargo]: valor },
        })),
      removeCustoCargo: (cargo) =>
        set((s) => {
          const next = { ...s.custoHoraPorCargo };
          delete next[cargo];
          return { custoHoraPorCargo: next };
        }),

      recorrenteThreshold: 2,
      cidGrouping: "capitulo",
      iiosFormulaLabel:
        "Total de horas perdidas / Colaboradores ativos no periodo",
      setRecorrenteThreshold: (v) => set({ recorrenteThreshold: v }),
      setCidGrouping: (v) => set({ cidGrouping: v }),

      usuarios: USUARIOS_INICIAIS,
      addUsuario: (u) => set((s) => ({ usuarios: [...s.usuarios, u] })),
      updateUsuario: (id, patch) =>
        set((s) => ({
          usuarios: s.usuarios.map((u) =>
            u.id === id ? { ...u, ...patch } : u
          ),
        })),
      removeUsuario: (id) =>
        set((s) => ({ usuarios: s.usuarios.filter((u) => u.id !== id) })),
    }),
    {
      name: "pgisc-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
