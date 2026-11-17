import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChoiceButtonProps<T> {
  value: T;
  onSelect: (value: T) => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-pressed"?: boolean;
}

/** A large tap target that reports its value — DMT option style: a card that fills cyan when selected. */
export function ChoiceButton<T>({ value, onSelect, children, className, ...rest }: ChoiceButtonProps<T>) {
  function handleClick() {
    onSelect(value);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "rounded-xl border-2 border-border bg-card text-xl font-medium shadow-sm transition active:scale-95 disabled:opacity-40 aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
