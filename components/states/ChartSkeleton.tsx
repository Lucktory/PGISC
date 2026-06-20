import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartSkeletonProps {
  height?: "sm" | "md" | "lg";
  className?: string;
}

const heights = {
  sm: "h-44 lg:h-48",
  md: "h-52 lg:h-60",
  lg: "h-64 lg:h-72",
};

export function ChartSkeleton({ height = "md", className }: ChartSkeletonProps) {
  return (
    <Card className={cn("flex flex-col gap-3 p-4 lg:p-5", className)}>
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className={cn("mt-3 w-full rounded-md", heights[height])} />
    </Card>
  );
}
