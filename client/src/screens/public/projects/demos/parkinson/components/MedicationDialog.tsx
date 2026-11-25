import { useTranslation } from "react-i18next";
import { Pill, X } from "lucide-react";
import type { IMedication } from "@/common/types/Parkinson";
import { formatDoseTime } from "@/common/utils/parkinsonUtils";
import { Button } from "@/components/ui/button";
import { DoseTimeForm } from "./DoseTimeForm";

interface MedicationDialogProps {
  medication: IMedication;
  doseTime: Date;
  editing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveTime: (time: Date) => void;
  onReport: () => void;
  onClose: () => void;
}

/** The "I took medication" pop-up: report it now, or change the date and time first. Stays inside the device frame. */
export function MedicationDialog(props: MedicationDialogProps) {
  const { medication, doseTime, editing, onEdit, onCancelEdit, onSaveTime, onReport, onClose } = props;
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 px-6" role="dialog" aria-modal="true" aria-label={medication.name}>
      <div className="relative flex w-full flex-col items-center gap-3 rounded-2xl border-2 bg-background p-5 text-center shadow-xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute end-2 top-2"
          onClick={onClose}
          aria-label={t("demos.parkinson.tasks.medication.close")}
        >
          <X className="size-5" />
        </Button>
        <Pill className="size-12 text-primary" aria-hidden />
        <h3 className="font-display text-xl font-bold" dir="ltr">
          {medication.name}
        </h3>
        {editing ? (
          <DoseTimeForm initial={doseTime} onSave={onSaveTime} onCancel={onCancelEdit} />
        ) : (
          <>
            <p className="text-lg text-muted-foreground">{t("demos.parkinson.tasks.medication.tookAt", formatDoseTime(doseTime))}</p>
            <div className="grid w-full grid-cols-2 gap-3">
              <Button size="lg" variant="outline" className="h-14 text-lg" onClick={onEdit}>
                {t("demos.parkinson.tasks.medication.dateTime")}
              </Button>
              <Button size="lg" className="h-14 text-lg" onClick={onReport}>
                {t("demos.parkinson.tasks.medication.report")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
