import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-24 space-y-12">
      {/* Back Button Skeleton */}
      <Skeleton className="h-4 w-24 rounded-full" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">
        {/* Images Skeleton */}
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="aspect-[4/3] w-full rounded-[2.5rem]" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="aspect-square rounded-2xl" />
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>

          <div className="space-y-6 pt-10 border-t border-outline-variant/10">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>

          <div className="pt-10">
            <Skeleton className="h-14 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
