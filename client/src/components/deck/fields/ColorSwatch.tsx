import { cn } from "@/lib/utils";

interface ColorSwatchProps {
  /** Value stored when chosen, e.g. `var(--deck-accent)` or `transparent`. */
  value: string;
  /** CSS colour painted on the swatch. */
  color: string;
  label: string;
  isActive: boolean;
  onSelect: (value: string) => void;
}

export function ColorSwatch({ value, color, label, isActive, onSelect }: ColorSwatchProps) {
  const handleClick = () => {
    onSelect(value);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={isActive}
      title={label}
      className={cn(
        "size-6 shrink-0 rounded-full border outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive && "ring-2 ring-primary ring-offset-1",
      )}
      style={{ background: color }}
    />
  );
}
