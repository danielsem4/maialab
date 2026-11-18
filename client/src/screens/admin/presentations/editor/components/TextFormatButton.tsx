import type { MouseEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextFormatButtonProps {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onPress: () => void;
}

/** Keeps the text editor focused, so the selection being formatted is not lost by pressing the button. */
function keepEditorFocus(event: MouseEvent) {
  event.preventDefault();
}

export function TextFormatButton({ label, icon: Icon, isActive, onPress }: TextFormatButtonProps) {
  return (
    <Button
      type="button"
      variant={isActive ? "secondary" : "ghost"}
      size="icon"
      className="size-8"
      aria-label={label}
      aria-pressed={isActive}
      title={label}
      onMouseDown={keepEditorFocus}
      onClick={onPress}
    >
      <Icon className="size-4" />
    </Button>
  );
}
