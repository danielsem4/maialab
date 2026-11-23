import { NavLink } from "react-router-dom";
import type { PublicNavItem } from "@/hooks/common/usePublicNavItems";
import { cn } from "@/lib/utils";

interface PublicNavProps {
  items: PublicNavItem[];
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
}

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    "relative rounded-md px-3 py-2 text-[0.95rem] font-medium transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
    isActive ? "text-primary" : "text-foreground/75",
  );
}

export function PublicNav({ items, orientation = "horizontal", onNavigate }: PublicNavProps) {
  return (
    <nav className={cn("flex", orientation === "vertical" ? "flex-col gap-1 [&>a]:flex [&>a]:min-h-11 [&>a]:items-center" : "items-center gap-1")}>
      {items.map((item) => (
        <NavLink key={item.url} to={item.url} className={navLinkClass} onClick={onNavigate}>
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
}
