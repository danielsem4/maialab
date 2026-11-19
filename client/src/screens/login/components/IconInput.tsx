import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface IconInputProps extends ComponentProps<"input"> {
  icon: LucideIcon;
  endAdornment?: ReactNode;
}

export function IconInput({ icon: Icon, endAdornment, className, ...props }: IconInputProps) {
  return (
    <div className="relative">
      <Icon
        aria-hidden
        className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-primary"
      />
      <Input
        className={cn(
          "h-11 border-foreground/15 bg-background/70 ps-11 shadow-sm focus-visible:border-primary",
          endAdornment ? "pe-12" : "pe-3",
          className
        )}
        {...props}
      />
      {endAdornment && <div className="absolute end-1.5 top-1/2 -translate-y-1/2">{endAdornment}</div>}
    </div>
  );
}
