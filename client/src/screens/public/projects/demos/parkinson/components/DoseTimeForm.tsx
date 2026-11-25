import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDoseTimeForm } from "../hooks/useDoseTimeForm";

interface DoseTimeFormProps {
  initial: Date;
  onSave: (time: Date) => void;
  onCancel: () => void;
}

/** Date and time fields for when the medication was taken. */
export function DoseTimeForm({ initial, onSave, onCancel }: DoseTimeFormProps) {
  const { t } = useTranslation();
  const form = useDoseTimeForm(initial, onSave);

  return (
    <div className="flex w-full flex-col gap-4 text-start">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dose-date">{t("demos.parkinson.tasks.medication.date")}</Label>
        <Input
          id="dose-date"
          type="date"
          value={form.date}
          max={form.maxDate}
          onChange={form.handleDateChange}
          aria-invalid={form.invalid}
          className="h-12 text-lg md:text-lg"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dose-time">{t("demos.parkinson.tasks.medication.time")}</Label>
        <Input
          id="dose-time"
          type="time"
          value={form.time}
          onChange={form.handleTimeChange}
          aria-invalid={form.invalid}
          className="h-12 text-lg md:text-lg"
        />
      </div>
      {form.invalid && (
        <p className="text-sm text-destructive" role="alert">
          {t("demos.parkinson.tasks.medication.futureError")}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Button size="lg" variant="outline" className="h-14 text-lg" onClick={onCancel}>
          {t("demos.parkinson.tasks.medication.cancel")}
        </Button>
        <Button size="lg" className="h-14 text-lg" onClick={form.handleSave}>
          {t("demos.parkinson.tasks.medication.save")}
        </Button>
      </div>
    </div>
  );
}
