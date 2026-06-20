import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PhaseBadgeProps {
  phase: 1 | 2 | 3;
  className?: string;
}

const labels: Record<1 | 2 | 3, string> = {
  1: "Disponivel agora",
  2: "Previa - Fase 2",
  3: "Previa - Fase 3",
};

const variants: Record<1 | 2 | 3, "phase1" | "phase2" | "phase3"> = {
  1: "phase1",
  2: "phase2",
  3: "phase3",
};

export function PhaseBadge({ phase, className }: PhaseBadgeProps) {
  return (
    <Badge variant={variants[phase]} className={cn("text-[11px]", className)}>
      {labels[phase]}
    </Badge>
  );
}
