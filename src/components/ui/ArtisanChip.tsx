import * as React from "react";
import { cn } from "@/lib/utils";

export interface ArtisanChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
}

export function ArtisanChip({ label, className, ...props }: ArtisanChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-foreground",
        className
      )}
      {...props}
    >
      {label}
    </div>
  );
}
