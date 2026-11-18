import { cn } from "@/lib/utils";

/** A round avatar with the contact's initial. */
export function ContactAvatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("flex shrink-0 items-center justify-center rounded-full bg-emerald-500 font-bold text-white", className)}
    >
      {name.charAt(0)}
    </span>
  );
}
