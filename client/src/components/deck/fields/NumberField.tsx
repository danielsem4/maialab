import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDraft } from "./useDraft";

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function NumberField({ id, label, value, onChange, min = -Infinity, max = Infinity }: NumberFieldProps) {
  const handleCommit = (raw: string) => {
    const parsed = Number(raw);
    if (raw.trim() !== "" && Number.isFinite(parsed)) onChange(Math.min(max, Math.max(min, parsed)));
  };

  const draft = useDraft(String(value), handleCommit);

  return (
    <div className="min-w-0 space-y-1">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Input id={id} type="number" dir="ltr" inputMode="decimal" className="h-8" {...draft} />
    </div>
  );
}
