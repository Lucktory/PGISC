import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

interface DemoBannerProps {
  className?: string;
  message?: string;
}

const DEFAULT_MESSAGE =
  "Demonstracao construida com os dados reais do PEREIRA - Janeiro/2026 que voce compartilhou. 106 atendimentos processados automaticamente.";

export function DemoBanner({ className, message = DEFAULT_MESSAGE }: DemoBannerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2.5 text-xs text-warning lg:items-center lg:text-sm",
        className
      )}
      role="note"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 lg:mt-0" />
      <span className="line-clamp-3 leading-relaxed sm:line-clamp-2 lg:line-clamp-none">
        {message}
      </span>
    </div>
  );
}
