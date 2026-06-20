"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthUser {
  email: string;
  nome: string;
  iniciais: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (email: string) => void;
  signOut: () => void;
}

function inferNome(email: string): string {
  const local = email.split("@")[0];
  return local
    .split(/[._-]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function inferIniciais(nome: string): string {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      signIn: (email: string) => {
        const nome = inferNome(email);
        set({
          user: { email, nome, iniciais: inferIniciais(nome) },
          isAuthenticated: true,
        });
      },
      signOut: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "pgisc-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
