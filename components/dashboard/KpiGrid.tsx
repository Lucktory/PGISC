import { cn } from "@/lib/utils";

interface KpiGridProps {
  children: React.ReactNode;
  cols?: 4 | 6;
  className?: string;
}

export function KpiGrid({ children, cols = 6, className }: KpiGridProps) {
  const colsClass =
    cols === 6
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
      : "grid-cols-2 lg:grid-cols-4";
  return (
    <div className={cn("grid gap-3 lg:gap-4", colsClass, className)}>
      {children}
    </div>
  );
}
