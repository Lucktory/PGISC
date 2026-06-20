"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  hint?: React.ReactNode;
  hintTone?: "neutral" | "up" | "down";
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export function KpiCard({
  label,
  value,
  unit,
  hint,
  hintTone = "neutral",
  icon: Icon,
  onClick,
  className,
}: KpiCardProps) {
  const interactive = !!onClick;
  const hintColor =
    hintTone === "up"
      ? "text-warning"
      : hintTone === "down"
      ? "text-success"
      : "text-muted-foreground";

  const inner = (
    <Card
      className={cn(
        "flex h-full flex-col gap-1.5 p-4 lg:p-5",
        interactive && "cursor-pointer transition-colors hover:bg-muted/40",
        className
      )}
      role={interactive ? "button" : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground lg:text-[11px]">
          {label}
        </span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground/70" />}
      </div>
      <div className="text-[24px] font-bold tracking-tight leading-none lg:text-[28px]">
        {value}
        {unit && (
          <span className="ml-0.5 text-base font-semibold text-muted-foreground lg:text-lg">
            {unit}
          </span>
        )}
      </div>
      {hint && (
        <div className={cn("text-[11px] lg:text-xs", hintColor)}>{hint}</div>
      )}
    </Card>
  );

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
      >
        {inner}
      </button>
    );
  }
  return inner;
}
