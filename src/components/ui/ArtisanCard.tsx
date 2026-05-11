import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArtisanChip } from "./ArtisanChip";

export interface ArtisanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  artisan: string;
  category: string;
  image: string;
  description: string;
}

export function ArtisanCard({
  title,
  artisan,
  category,
  image,
  description,
  className,
  ...props
}: ArtisanCardProps) {
  return (
    <div
      className={cn(
        "group flex flex-col space-y-4 rounded-lg bg-muted p-6 transition-all hover:shadow-lg",
        className
      )}
      {...props}
    >
      <div className="relative aspect-square overflow-hidden rounded-md">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="space-y-2">
        <ArtisanChip label={category} />
        <h3 className="font-serif text-2xl text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground italic">By {artisan}</p>
        <p className="text-sm leading-relaxed text-foreground/80">{description}</p>
      </div>
    </div>
  );
}
