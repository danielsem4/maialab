import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDraft } from "./useDraft";

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export function TextField({ id, label, value, onChange, maxLength }: TextFieldProps) {
  const draft = useDraft(value, onChange);

  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Input id={id} dir="auto" className="h-8" maxLength={maxLength} {...draft} />
    </div>
  );
}
