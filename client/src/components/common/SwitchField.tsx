import { Switch } from "@/components/ui/switch";

interface SwitchFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function SwitchField({ id, label, checked, onCheckedChange }: SwitchFieldProps) {
  return (
    <div className="flex items-center gap-3">
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} aria-labelledby={`${id}-label`} />
      <span id={`${id}-label`} className="text-sm font-medium">
        {label}
      </span>
    </div>
  );
}
