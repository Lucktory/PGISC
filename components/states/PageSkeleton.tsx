import { Skeleton } from "@/components/ui/skeleton";

import { ChartSkeleton } from "./ChartSkeleton";
import { KpiSkeletonGrid } from "./KpiSkeleton";

export function ExecutivoPageSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 lg:gap-6 lg:px-8 lg:py-6">
      <Skeleton className="h-10 w-full max-w-md" />
      <KpiSkeletonGrid count={6} />
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <ChartSkeleton height="md" />
        <ChartSkeleton height="sm" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ChartSkeleton height="sm" />
        <ChartSkeleton height="sm" />
        <ChartSkeleton height="sm" />
      </div>
    </div>
  );
}
