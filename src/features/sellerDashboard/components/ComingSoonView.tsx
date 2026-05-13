
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComingSoonViewProps {
  title: string;
  icon: LucideIcon;
  description?: string;
}

export function ComingSoonView({ title, icon: Icon, description }: ComingSoonViewProps) {
  return (
    <div className="px-4 md:px-margin-page py-8 md:py-16 min-h-[80vh] flex items-center justify-center max-w-container-max mx-auto">
      <div className="relative w-full max-w-3xl aspect-[16/9] md:aspect-[21/9] bg-surface-container-low rounded-[32px] md:rounded-[48px] border border-outline-variant/10 overflow-hidden shadow-sm flex flex-col items-center justify-center p-8 md:p-12 text-center group">
        {/* Background Decorative Icon */}
        <div className="absolute -right-8 -bottom-8 opacity-[0.03] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12">
          <Icon size={320} strokeWidth={1} />
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="w-8 h-8 md:w-10 md:h-10 stroke-[1.5px]" />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-headline-md text-3xl md:text-4xl text-on-surface tracking-tight">
              {title}
            </h1>
            <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
              {description || `We're currently crafting the ${title.toLowerCase()} experience. Stay tuned for something beautiful.`}
            </p>
          </div>

          <div className="pt-4 flex items-center justify-center gap-2">
            <div className="h-1 w-12 rounded-full bg-primary/20" />
            <span className="font-label-caps text-[10px] md:text-xs text-primary tracking-[0.2em] uppercase">
              Coming Soon
            </span>
            <div className="h-1 w-12 rounded-full bg-primary/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
