import { Skeleton } from "@/components/ui/Skeleton";

export default function ListingsLoading() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-8 md:pt-12">
      {/* Page Title & Insight Skeleton */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 md:mb-12 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-96 rounded-lg opacity-60" />
            <Skeleton className="h-4 w-80 rounded-lg opacity-40" />
          </div>
        </div>
        <Skeleton className="h-32 w-full max-w-xs rounded-[2rem]" />
      </div>

      {/* Tabs & Sort Skeleton */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-8 border-b border-outline-variant/10 pb-4 gap-6">
        <div className="flex flex-wrap gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-lg" />
          ))}
        </div>
        <div className="flex items-center gap-4 w-full xl:w-auto">
          <Skeleton className="h-11 w-full sm:w-64 rounded-xl" />
          <Skeleton className="h-11 w-full sm:w-40 rounded-xl" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="space-y-6">
            <Skeleton className="aspect-[4/5] w-full rounded-[2.5rem]" />
            <div className="space-y-3 px-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-3 w-12 rounded-full" />
              </div>
              <Skeleton className="h-6 w-full rounded-lg" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
