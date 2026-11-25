import { useTranslation } from "react-i18next";
import { CircleCheck, Pill } from "lucide-react";
import type { IMedication } from "@/common/types/Parkinson";
import { formatDoseTime } from "@/common/utils/parkinsonUtils";

interface MedicationCardProps {
  medication: IMedication;
  /** When it was reported as taken, if it was. */
  reportedAt?: Date;
  onSelect: (id: string) => void;
}

/** A medication in the list; once reported it shows a check and the time it was taken. */
export function MedicationCard({ medication, reportedAt, onSelect }: MedicationCardProps) {
  const { t } = useTranslation();

  function handleClick() {
    onSelect(medication.id);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center gap-3 rounded-xl border-2 border-border bg-card px-4 py-3 text-start shadow-sm transition active:scale-95 data-[reported=true]:border-primary"
      data-reported={Boolean(reportedAt)}
    >
      <Pill className="size-6 shrink-0 text-primary" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-lg leading-snug font-medium" dir="ltr">
          {medication.name}
        </span>
        {reportedAt && (
          <span className="block text-sm text-muted-foreground">
            {t("demos.parkinson.tasks.medication.reportedAt", formatDoseTime(reportedAt))}
          </span>
        )}
      </span>
      {reportedAt && <CircleCheck className="size-6 shrink-0 text-primary" aria-hidden />}
    </button>
  );
}
