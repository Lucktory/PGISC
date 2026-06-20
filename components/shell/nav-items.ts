import {
  Brain,
  CalendarMinus,
  CircleDollarSign,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Microscope,
  Settings,
  Upload,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  /** Compact label used in the mobile BottomNav (max ~10 chars). */
  shortLabel?: string;
  icon: LucideIcon;
  group: "dashboards" | "operacoes" | "configuracoes";
}

export const dashboardNavItems: NavItem[] = [
  { href: "/dashboards/executivo", label: "Executivo", shortLabel: "Executivo", icon: LayoutDashboard, group: "dashboards" },
  { href: "/dashboards/epidemiologico", label: "Epidemiologico", shortLabel: "Epidemio", icon: Microscope, group: "dashboards" },
  { href: "/dashboards/absenteismo", label: "Absenteismo", shortLabel: "Absent.", icon: CalendarMinus, group: "dashboards" },
  { href: "/dashboards/saude-mental", label: "Saude Mental", shortLabel: "Mental", icon: Brain, group: "dashboards" },
  { href: "/dashboards/financeiro", label: "Financeiro", shortLabel: "Financ.", icon: CircleDollarSign, group: "dashboards" },
];

export const operacoesNavItems: NavItem[] = [
  { href: "/operacoes/lancamento", label: "Lancamento diario", icon: ClipboardList, group: "operacoes" },
  { href: "/operacoes/importar", label: "Importar planilha", icon: Upload, group: "operacoes" },
  { href: "/operacoes/relatorio-pdf", label: "Relatorio executivo", icon: FileText, group: "operacoes" },
];

export const configuracoesNavItems: NavItem[] = [
  { href: "/configuracoes", label: "Configuracoes", icon: Settings, group: "configuracoes" },
];

export const allNavItems: NavItem[] = [
  ...dashboardNavItems,
  ...operacoesNavItems,
  ...configuracoesNavItems,
];

// 5 bottom-nav primary items shown on mobile - Mais tab handles the rest.
export const bottomNavItems = dashboardNavItems;
