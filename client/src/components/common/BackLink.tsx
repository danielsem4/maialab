import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BackLinkProps {
  to: string;
  label: string;
  /** Show only the arrow (the label stays available to screen readers). */
  iconOnly?: boolean;
  className?: string;
}

/** "Back to …" link above a page title, padded out to a comfortable touch target. */
export function BackLink({ to, label, iconOnly, className }: BackLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "-ms-2 inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      <ArrowLeft className="size-4 rtl:rotate-180" />
      <span className={cn(iconOnly && "sr-only")}>{label}</span>
    </Link>
  );
}
