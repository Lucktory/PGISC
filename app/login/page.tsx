"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuthStore } from "@/lib/state/auth-store";
import {
  DEMO_EMAIL,
  DEMO_SENHA,
  loginSchema,
  type LoginFormValues,
} from "@/lib/auth/login-schema";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const signIn = useAuthStore((s) => s.signIn);
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => setHydrated(true), []);
  React.useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/dashboards/executivo");
    }
  }, [hydrated, isAuthenticated, router]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" },
    mode: "onSubmit",
  });

  async function onSubmit(values: LoginFormValues) {
    setSubmitting(true);
    // Simula validacao (qualquer credencial e aceita; o DEMO_* facilita).
    await new Promise((r) => setTimeout(r, 450));
    signIn(values.email);
    router.replace("/dashboards/executivo");
  }

  function handleEsqueciSenha() {
    toast.success("Email enviado", {
      description: `Verifique a caixa de entrada de ${DEMO_EMAIL}.`,
    });
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-background px-4 py-8">
      <ThemeToggle className="absolute right-4 top-4 lg:right-6 lg:top-6" />

      <div className="flex w-full max-w-sm flex-col gap-6">
        <header className="flex flex-col items-center gap-2 text-center">
          <div className="flex flex-col">
            <span className="text-3xl font-bold tracking-tight">PGISC</span>
            <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Saude Corporativa
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesse o painel de gestao em saude da operacao.
          </p>
        </header>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm lg:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          placeholder="alexandre@pgisc.com"
                          className="pl-9 h-12 text-[16px] lg:h-10 lg:text-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Senha</FormLabel>
                      <button
                        type="button"
                        onClick={handleEsqueciSenha}
                        className="text-xs font-medium text-accent hover:underline"
                      >
                        Esqueci minha senha
                      </button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="Senha"
                          className="pl-9 pr-9 h-12 text-[16px] lg:h-10 lg:text-sm"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          aria-label={
                            showPassword ? "Ocultar senha" : "Mostrar senha"
                          }
                          className={cn(
                            "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={submitting || !hydrated}
                className="h-12 w-full text-[15px] lg:h-10 lg:text-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-5 rounded-md border border-dashed border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
            <div className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground/80">
              Demonstracao
            </div>
            <div className="mt-1">
              Email: <span className="font-mono text-foreground">{DEMO_EMAIL}</span>
            </div>
            <div>
              Senha: <span className="font-mono text-foreground">{DEMO_SENHA}</span>
            </div>
          </div>
        </div>

        <footer className="text-center text-[11px] text-muted-foreground">
          PGISC Demonstracao - Dados reais PEREIRA Jan/2026{" "}
          <Link href="/dashboards/executivo" className="hidden">
            Avancar
          </Link>
        </footer>
      </div>
    </main>
  );
}
