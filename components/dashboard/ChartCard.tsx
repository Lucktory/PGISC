"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  detalhesHref?: string;
  detalhesLabel?: string;
  children: React.ReactNode;
  height?: "sm" | "md" | "lg";
  className?: string;
  footer?: React.ReactNode;
}

const heights: Record<NonNullable<ChartCardProps["height"]>, string> = {
  sm: "h-44 lg:h-48",
  md: "h-52 lg:h-60",
  lg: "h-64 lg:h-72",
};

export function ChartCard({
  title,
  subtitle,
  icon: Icon,
  detalhesHref,
  detalhesLabel = "Ver detalhes",
  children,
  height = "md",
  className,
  footer,
}: ChartCardProps) {
  return (
    <Card className={cn("flex min-w-0 flex-col p-4 lg:p-5", className)}>
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          {Icon && (
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <div className="flex min-w-0 flex-col">
            <h3 className="truncate text-sm font-semibold leading-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="truncate text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {detalhesHref && (
          <Link
            href={detalhesHref}
            className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {detalhesLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {/* min-w-0 + overflow-hidden so Chart.js canvas cannot push card wider
          than its grid cell allows */}
      <div
        className={cn(
          "relative mt-4 min-w-0 w-full overflow-hidden",
          heights[height]
        )}
      >
        {children}
      </div>
      {footer && (
        <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </Card>
  );
}
