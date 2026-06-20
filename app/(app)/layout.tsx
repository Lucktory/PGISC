import { AppShell } from "@/components/shell/AppShell";
import { AuthGuard } from "@/components/shell/AuthGuard";
import { CommandPaletteProvider } from "@/components/command-palette/CommandPaletteProvider";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
      <CommandPaletteProvider />
    </AuthGuard>
  );
}
