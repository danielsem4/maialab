import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChoiceButton } from "./ChoiceButton";

interface OptionCardProps {
  value: string;
  label: string;
  selected: boolean;
  /** Multi-select cards show a check box, single-choice cards a radio mark. */
  multiple?: boolean;
  onSelect: (value: string) => void;
}

/** An answer card of the evaluation screens: a radio or check mark and the answer text. */
export function OptionCard({ value, label, selected, multiple, onSelect }: OptionCardProps) {
  return (
    <ChoiceButton
      value={value}
      onSelect={onSelect}
      aria-pressed={selected}
      className="flex min-h-14 w-full items-center gap-3 px-4 py-2 text-start text-lg"
    >
      <span
        className={cn("flex size-6 shrink-0 items-center justify-center border-2 border-current", multiple ? "rounded-md" : "rounded-full")}
        aria-hidden
      >
        {selected && (multiple ? <Check className="size-4" strokeWidth={3} /> : <span className="size-2.5 rounded-full bg-current" />)}
      </span>
      {label}
    </ChoiceButton>
  );
}
