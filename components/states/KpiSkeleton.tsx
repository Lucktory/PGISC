import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function KpiSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-1.5 p-4 lg:p-5">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-2 h-7 w-16 lg:h-8" />
      <Skeleton className="mt-1 h-3 w-24" />
    </Card>
  );
}

export function KpiSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
      {Array.from({ length: count }, (_, i) => (
        <KpiSkeleton key={i} />
      ))}
    </div>
  );
}
